-- ユーザープロフィールテーブルとその関連機能

-- 一時テーブルに既存のデータをバックアップ
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_profiles') THEN
        CREATE TEMP TABLE user_profiles_backup AS SELECT * FROM user_profiles;
    END IF;
END
$$;

-- 既存の関数とトリガーを削除
DROP FUNCTION IF EXISTS create_user_profile CASCADE;
DROP FUNCTION IF EXISTS update_profile_updated_at CASCADE;

-- 既存のテーブルを削除
DROP TABLE IF EXISTS user_profiles CASCADE;

-- プロフィールテーブルの作成
CREATE TABLE user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) UNIQUE,
    display_name TEXT,
    handle TEXT UNIQUE,
    handle_updated_at TIMESTAMP WITH TIME ZONE,
    custom_image_url TEXT,
    preferred_mbti VARCHAR(4),
    bio TEXT,
    bookmarked_types VARCHAR(4)[],
    social_links JSONB DEFAULT '{"twitter": "", "instagram": "", "website": ""}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    CONSTRAINT valid_mbti_type CHECK (
        preferred_mbti IS NULL OR preferred_mbti ~ '^[EI][NS][TF][JP]$'
    ),
    CONSTRAINT valid_bookmarked_types CHECK (
        bookmarked_types IS NULL OR 
        array_length(bookmarked_types, 1) <= 5
    ),
    CONSTRAINT valid_handle CHECK (
        handle IS NULL OR handle ~ '^[a-z0-9_]{1,15}$'
    )
);

-- インデックスの作成
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_display_name ON user_profiles USING GIN (display_name gin_trgm_ops);
CREATE INDEX idx_user_profiles_handle ON user_profiles(handle);

-- バックアップからデータを復元
DO $$
BEGIN
    -- バックアップとusersテーブルからのデータを結合して復元
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'pg_temp' AND tablename = 'user_profiles_backup') THEN
        INSERT INTO user_profiles (
            id, user_id, display_name, custom_image_url, preferred_mbti,
            bio, bookmarked_types, social_links, created_at, updated_at,
            handle, handle_updated_at
        )
        SELECT 
            p.id, p.user_id, 
            COALESCE(p.display_name, u.display_name), 
            p.custom_image_url, p.preferred_mbti,
            p.bio, p.bookmarked_types, 
            COALESCE(p.social_links, '{"twitter": "", "instagram": "", "website": ""}'::jsonb),
            p.created_at, p.updated_at,
            u.handle, u.handle_updated_at
        FROM user_profiles_backup p
        JOIN users_backup u ON p.user_id = u.id;
        
        DROP TABLE user_profiles_backup;
    END IF;
END
$$;

-- RLSポリシー設定
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- ポリシーの設定
CREATE POLICY "Anyone can view public profile data" ON user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (
        user_id IN (
            SELECT id FROM users WHERE clerk_id = auth.jwt()->>'clerk_id'
        )
    );

CREATE POLICY "Service role can manage profiles" ON user_profiles
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- 更新日時自動更新用トリガー
CREATE OR REPLACE FUNCTION update_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_profile_updated_at();

-- ユーザー作成時に自動的にプロフィールを作成するトリガー
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (
        user_id
    )
    VALUES (
        NEW.id
    )
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ユーザー作成時にプロフィール作成トリガーを設定
CREATE TRIGGER on_user_created
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_profile();

-- ハンドル更新が許可されているかチェックする関数
CREATE OR REPLACE FUNCTION check_handle_update_allowed(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_last_update TIMESTAMP WITH TIME ZONE;
    v_cooldown_days INTEGER := 14; -- 何日間の制限を設けるか
BEGIN
    -- 最終更新日を取得
    SELECT handle_updated_at INTO v_last_update
    FROM user_profiles
    WHERE user_id = p_user_id;
    
    -- まだ一度も更新されていない場合は許可
    IF v_last_update IS NULL THEN
        RETURN TRUE;
    END IF;
    
    -- 更新から指定日数が経過しているかチェック
    RETURN TIMEZONE('utc'::text, NOW()) - v_last_update > INTERVAL '1 day' * v_cooldown_days;
END;
$$;

-- ハンドルを更新する関数
CREATE OR REPLACE FUNCTION update_user_handle(
    p_user_id UUID,
    p_new_handle TEXT
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_is_allowed BOOLEAN;
    v_result json;
BEGIN
    -- ハンドル更新が許可されているか確認
    SELECT check_handle_update_allowed(p_user_id) INTO v_is_allowed;
    
    IF NOT v_is_allowed THEN
        RAISE EXCEPTION 'Handle update not allowed';
    END IF;
    
    -- ハンドル形式を検証
    IF p_new_handle !~ '^[a-z0-9_]{1,15}$' THEN
        RAISE EXCEPTION 'Invalid handle format';
    END IF;
    
    -- ハンドルの一意性を確認
    IF EXISTS (SELECT 1 FROM user_profiles WHERE handle = p_new_handle AND user_id <> p_user_id) THEN
        RAISE EXCEPTION 'Handle already taken';
    END IF;
    
    -- ハンドルを更新
    UPDATE user_profiles
    SET 
        handle = p_new_handle,
        handle_updated_at = TIMEZONE('utc'::text, NOW()),
        updated_at = TIMEZONE('utc'::text, NOW())
    WHERE user_id = p_user_id
    RETURNING json_build_object(
        'user_id', user_id,
        'handle', handle,
        'handle_updated_at', handle_updated_at
    ) INTO v_result;
    
    RETURN v_result;
END;
$$; 
-- 拡張機能の有効化（あいまい検索用）
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 一時テーブルに既存のデータをバックアップ
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_profiles') THEN
        CREATE TEMP TABLE user_profiles_backup AS SELECT * FROM user_profiles;
    END IF;
END
$$;

-- 既存のトリガーを削除
DROP TRIGGER IF EXISTS user_profiles_updated_at ON user_profiles;

-- 既存の関数を削除
DROP FUNCTION IF EXISTS update_user_profiles_updated_at CASCADE;

-- 既存のテーブルを削除
DROP TABLE IF EXISTS user_profiles CASCADE;

-- プロフィールテーブルの作成
CREATE TABLE user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) UNIQUE,
    display_name TEXT,
    custom_image_url TEXT,
    preferred_mbti VARCHAR(4),
    bio TEXT,
    bookmarked_types VARCHAR(4)[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    CONSTRAINT valid_mbti_type CHECK (
        preferred_mbti IS NULL OR preferred_mbti ~ '^[EI][NS][TF][JP]$'
    ),
    CONSTRAINT valid_bookmarked_types CHECK (
        bookmarked_types IS NULL OR 
        array_length(bookmarked_types, 1) <= 5
    )
);

-- バックアップからデータを復元
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'pg_temp' AND tablename = 'user_profiles_backup') THEN
        INSERT INTO user_profiles (
            id, user_id, display_name, custom_image_url, preferred_mbti,
            bio, bookmarked_types, created_at, updated_at
        )
        SELECT 
            id, user_id, display_name, custom_image_url, preferred_mbti,
            bio, bookmarked_types, created_at, updated_at
        FROM user_profiles_backup;
        
        DROP TABLE user_profiles_backup;
    END IF;
END
$$;

-- インデックスの作成
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_display_name ON user_profiles USING GIN (display_name gin_trgm_ops);

-- RLSポリシーの設定
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Service role can manage profiles" ON user_profiles;
DROP POLICY IF EXISTS "Anyone can view public profile data" ON user_profiles;

-- 公開プロフィールデータの参照を許可
CREATE POLICY "Anyone can view public profile data" ON user_profiles
    FOR SELECT USING (true);

-- ユーザー自身のプロフィールのみ更新可能
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (
        user_id IN (
            SELECT id FROM users WHERE clerk_id = auth.jwt()->>'clerk_id'
        )
    );

-- サービスロールに全ての権限を付与
CREATE POLICY "Service role can manage profiles" ON user_profiles
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- 更新トリガーの作成
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_user_profiles_updated_at();

-- ユーザー作成時に自動的にプロフィールを作成するトリガー
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_user_created
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_profile(); 
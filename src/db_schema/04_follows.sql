-- フォロー関係のテーブルとその基本機能

-- 一時テーブルに既存のデータをバックアップ
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'follows') THEN
        CREATE TEMP TABLE follows_backup AS SELECT * FROM follows;
    END IF;
END
$$;

-- 既存のテーブルを削除
DROP TABLE IF EXISTS follows CASCADE;

-- フォローテーブルの作成
CREATE TABLE follows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- 同じフォロー関係の重複を防止
    CONSTRAINT unique_follow UNIQUE (follower_id, following_id),
    -- 自分自身をフォローすることを防止
    CONSTRAINT prevent_self_follow CHECK (follower_id <> following_id)
);

-- バックアップからデータを復元
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'pg_temp' AND tablename = 'follows_backup') THEN
        INSERT INTO follows (
            id, follower_id, following_id, created_at
        )
        SELECT 
            id, follower_id, following_id, created_at
        FROM follows_backup;
        
        DROP TABLE follows_backup;
    END IF;
END
$$;

-- インデックスの作成
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);
CREATE INDEX idx_follows_created_at ON follows(created_at);

-- RLSポリシーの設定
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- 誰でもフォロー関係を閲覧可能
CREATE POLICY "Anyone can view follows" ON follows
    FOR SELECT USING (true);

-- 認証済みユーザーは自分のフォロー関係を操作可能
CREATE POLICY "Authenticated users can manage own follows" ON follows
    FOR ALL USING (
        follower_id IN (
            SELECT id FROM users WHERE clerk_id = auth.jwt()->>'clerk_id'
        )
    )
    WITH CHECK (
        follower_id IN (
            SELECT id FROM users WHERE clerk_id = auth.jwt()->>'clerk_id'
        )
    );

-- サービスロールに全ての権限を付与
CREATE POLICY "Service role can manage follows" ON follows
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- フォローステータスを確認する関数
CREATE OR REPLACE FUNCTION check_follow_status(
    p_follower_id UUID,
    p_following_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_is_following BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM follows
        WHERE follower_id = p_follower_id AND following_id = p_following_id
    ) INTO v_is_following;
    
    RETURN v_is_following;
END;
$$;

-- フォロー一覧取得関数を修正
CREATE OR REPLACE FUNCTION get_user_follows(
    p_user_id UUID,
    p_type TEXT, -- 'following' または 'followers'
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result json;
    v_count INTEGER;
    v_target_id TEXT;
    v_source_id TEXT;
BEGIN
    -- フォロー関係の方向を決定
    IF p_type = 'following' THEN
        v_source_id := 'follower_id';
        v_target_id := 'following_id';
    ELSE
        v_source_id := 'following_id';
        v_target_id := 'follower_id';
    END IF;
    
    -- 総件数を取得
    EXECUTE 'SELECT COUNT(*) FROM follows WHERE ' || v_source_id || ' = $1'
    INTO v_count
    USING p_user_id;
    
    -- フォロー/フォロワーリストを取得
    EXECUTE '
        SELECT json_agg(u)
        FROM (
            SELECT 
                u.id,
                p.handle,
                p.display_name,
                p.custom_image_url,
                p.preferred_mbti,
                p.bio,
                f.created_at as followed_at,
                EXISTS(
                    SELECT 1 FROM follows
                    WHERE follower_id = $1 AND following_id = u.id
                ) as is_following
            FROM follows f
            JOIN users u ON f.' || v_target_id || ' = u.id
            JOIN user_profiles p ON u.id = p.user_id
            WHERE f.' || v_source_id || ' = $1
            ORDER BY f.created_at DESC
            LIMIT $2
            OFFSET $3
        ) u'
    INTO v_result
    USING p_user_id, p_limit, p_offset;
    
    RETURN json_build_object(
        'users', COALESCE(v_result, '[]'::json),
        'total_count', v_count
    );
END;
$$; 
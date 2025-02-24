-- 拡張機能の有効化（あいまい検索用）
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 一時テーブルに既存のデータをバックアップ
DO $$
BEGIN
    -- 既存のテーブルが存在する場合のみバックアップを作成
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
        CREATE TEMP TABLE users_backup AS SELECT * FROM users;
    END IF;
END
$$;

-- 既存のトリガーを削除
DROP TRIGGER IF EXISTS users_updated_at ON users;
DROP TRIGGER IF EXISTS on_user_created ON users;

-- 既存の関数を削除
DROP FUNCTION IF EXISTS update_updated_at CASCADE;
DROP FUNCTION IF EXISTS create_user_profile CASCADE;

-- 既存のテーブルを削除
DROP TABLE IF EXISTS users CASCADE;

-- ユーザーテーブルの作成
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_id TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    handle TEXT UNIQUE,
    handle_updated_at TIMESTAMP WITH TIME ZONE,
    display_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    CONSTRAINT valid_handle CHECK (
        handle ~ '^[a-z0_9]{1,15}$'
    )
);

-- バックアップからデータを復元
DO $$
BEGIN
    -- 一時テーブルが存在する場合のみ復元を実行
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'pg_temp' AND tablename = 'users_backup') THEN
        INSERT INTO users (
            id, clerk_id, email, handle, handle_updated_at, 
            display_name, created_at, updated_at
        )
        SELECT 
            id, clerk_id, email, handle, handle_updated_at, 
            display_name, created_at, updated_at
        FROM users_backup;
        
        DROP TABLE users_backup;
    END IF;
END
$$;

-- インデックスの作成
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_handle ON users(handle);
CREATE INDEX idx_users_handle_trgm ON users USING GIN (handle gin_trgm_ops);
CREATE INDEX idx_users_display_name_trgm ON users USING GIN (display_name gin_trgm_ops);

-- RLSポリシーの設定
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ポリシーの作成
CREATE POLICY "Anyone can view public user data" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.jwt()->>'clerk_id' = clerk_id)
    WITH CHECK (auth.jwt()->>'clerk_id' = clerk_id);

CREATE POLICY "Service role can manage users" ON users
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- 更新トリガーの作成
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
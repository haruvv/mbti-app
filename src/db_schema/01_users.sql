-- ユーザーテーブルの定義とそれに関連する機能

-- 一時テーブルに既存のデータをバックアップ
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
        CREATE TEMP TABLE users_backup AS SELECT * FROM users;
    END IF;
END
$$;

-- 既存のトリガーを削除
DROP TRIGGER IF EXISTS users_updated_at ON users;
DROP FUNCTION IF EXISTS update_updated_at CASCADE;

-- 既存のテーブルを削除
DROP TABLE IF EXISTS users CASCADE;

-- ユーザーテーブルの作成（シンプルな構造）
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- インデックスの作成
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_email ON users(email);

-- バックアップからデータを復元
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'pg_temp' AND tablename = 'users_backup') THEN
        INSERT INTO users (
            id, clerk_id, email, created_at, updated_at
        )
        SELECT 
            id, clerk_id, email, created_at, updated_at
        FROM users_backup;
        
        DROP TABLE users_backup;
    END IF;
END
$$;

-- 更新日時自動更新用トリガー
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

-- RLSポリシーの設定
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 認証済みユーザーは自分の情報のみ参照可能
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (clerk_id = auth.jwt()->>'clerk_id');

-- サービスロールは全ユーザー情報を参照可能
CREATE POLICY "Service role can read all users" ON users
    FOR SELECT USING (auth.role() = 'service_role');

-- サービスロールのみがユーザー情報を変更可能
CREATE POLICY "Service role can manage users" ON users
    FOR ALL USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role'); 
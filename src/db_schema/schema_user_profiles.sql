-- プロフィールテーブルの作成
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) UNIQUE, -- usersテーブルへの外部キー（1:1関係）
  display_name TEXT,
  custom_image_url TEXT,
  preferred_mbti VARCHAR(4),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  -- 制約
  CONSTRAINT valid_mbti_type CHECK (
    preferred_mbti IS NULL OR preferred_mbti ~ '^[EI][NS][TF][JP]$' -- MBTIの形式チェック（例：INTJ）
  )
);

-- インデックスの作成
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- RLSポリシーの設定
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Service role can manage profiles" ON user_profiles;

-- ユーザー自身のプロフィールのみ参照可能（JWTベース）
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM users WHERE clerk_id = auth.jwt()->>'clerk_id'
    )
  );

-- ユーザー自身のプロフィールのみ更新可能（JWTベース）
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
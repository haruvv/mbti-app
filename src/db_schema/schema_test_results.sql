-- 診断結果テーブルの作成
CREATE TABLE test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id), -- usersテーブルへの外部キー
  mbti_type VARCHAR(4) NOT NULL,
  taken_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  -- 制約
  CONSTRAINT valid_mbti_type CHECK (
    mbti_type ~ '^[EI][NS][TF][JP]$' -- MBTIの形式チェック（例：INTJ）
  )
);

-- インデックスの作成
CREATE INDEX idx_test_results_user_id ON test_results(user_id);
CREATE INDEX idx_test_results_taken_at ON test_results(taken_at);

-- RLSポリシーの設定
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Users can view own results" ON test_results;
DROP POLICY IF EXISTS "Users can insert own results" ON test_results;
DROP POLICY IF EXISTS "Service role can manage results" ON test_results;

-- ユーザー自身の診断結果のみ参照可能（JWTベース）
CREATE POLICY "Users can view own results" ON test_results
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM users WHERE clerk_id = auth.jwt()->>'clerk_id'
    )
  );

-- ユーザー自身の診断結果のみ挿入可能（JWTベース）
CREATE POLICY "Users can insert own results" ON test_results
  FOR INSERT WITH CHECK (
    user_id IN (
      SELECT id FROM users WHERE clerk_id = auth.jwt()->>'clerk_id'
    )
  );

-- サービスロールに全ての権限を付与
CREATE POLICY "Service role can manage results" ON test_results
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
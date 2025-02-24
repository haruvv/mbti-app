-- ユーザーの診断結果を保存するテーブル
CREATE TABLE test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id TEXT NOT NULL,
  mbti_type VARCHAR(4) NOT NULL,
  taken_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  -- 制約
  CONSTRAINT valid_mbti_type CHECK (
    mbti_type ~ '^[EI][NS][TF][JP]$'  -- MBTIの形式チェック（例：INTJ）
  )
);

-- インデックス
CREATE INDEX idx_test_results_clerk_user_id ON test_results(clerk_user_id);
CREATE INDEX idx_test_results_taken_at ON test_results(taken_at);

-- RLSポリシー（Row Level Security）
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Users can view own results" ON test_results;
DROP POLICY IF EXISTS "Users can insert own results" ON test_results;

-- 新しいポリシーを作成
CREATE POLICY "Users can view own results" ON test_results
  FOR SELECT USING (clerk_user_id = current_setting('request.headers')::json->>'x-clerk-user-id');

CREATE POLICY "Users can insert own results" ON test_results
  FOR INSERT WITH CHECK (clerk_user_id = current_setting('request.headers')::json->>'x-clerk-user-id'); 
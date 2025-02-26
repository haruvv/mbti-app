-- テスト結果テーブルとその関連機能

-- 一時テーブルに既存のデータをバックアップ
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'test_results') THEN
        CREATE TEMP TABLE test_results_backup AS SELECT * FROM test_results;
    END IF;
END
$$;

-- 既存のテーブルを削除
DROP TABLE IF EXISTS test_results CASCADE;

-- 診断結果テーブルの作成
CREATE TABLE test_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    mbti_type VARCHAR(4) NOT NULL,
    answers JSONB DEFAULT '{}',
    taken_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
    -- 制約
    CONSTRAINT valid_mbti_type CHECK (
        mbti_type ~ '^[EI][NS][TF][JP]$' -- MBTIの形式チェック
    )
);

-- バックアップからデータを復元
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'pg_temp' AND tablename = 'test_results_backup') THEN
        INSERT INTO test_results (
            id, user_id, mbti_type, answers, taken_at
        )
        SELECT 
            id, user_id, mbti_type, 
            COALESCE(answers, '{}'::jsonb),
            taken_at
        FROM test_results_backup;
        
        DROP TABLE test_results_backup;
    END IF;
END
$$;

-- インデックスの作成
CREATE INDEX idx_test_results_user_id ON test_results(user_id);
CREATE INDEX idx_test_results_taken_at ON test_results(taken_at);
CREATE INDEX idx_test_results_mbti_type ON test_results(mbti_type);

-- RLSポリシーの設定
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- ユーザー自身の診断結果のみ参照可能
CREATE POLICY "Users can view own results" ON test_results
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM users WHERE clerk_id = auth.jwt()->>'clerk_id'
        )
    );

-- ユーザー自身の診断結果のみ挿入可能
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
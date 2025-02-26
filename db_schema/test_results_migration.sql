-- test_resultsテーブルに created_at カラムを追加する
ALTER TABLE test_results ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- 既存のデータには現在時刻を設定
UPDATE test_results SET created_at = now() WHERE created_at IS NULL;

-- 必要に応じて NOT NULL 制約を追加
ALTER TABLE test_results ALTER COLUMN created_at SET NOT NULL; 
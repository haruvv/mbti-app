-- 必要な拡張機能をまとめて有効化
CREATE EXTENSION IF NOT EXISTS pg_trgm;      -- あいまい検索用
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- UUID生成用 
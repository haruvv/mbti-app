-- ユーザープロフィールのハンドル更新日時を管理するトリガー
CREATE OR REPLACE FUNCTION update_handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  -- handleが変更された場合のみhandle_updated_atを更新
  IF (OLD.handle IS DISTINCT FROM NEW.handle) THEN
    NEW.handle_updated_at = TIMEZONE('utc'::text, NOW());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- トリガーが存在する場合は一旦削除
DROP TRIGGER IF EXISTS handle_updated_at_trigger ON user_profiles;

-- トリガーを作成
CREATE TRIGGER handle_updated_at_trigger
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_handle_updated_at(); 
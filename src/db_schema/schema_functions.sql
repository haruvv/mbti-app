-- ユーザーとプロフィールを同時に作成する関数
CREATE OR REPLACE FUNCTION create_user_with_profile(
  p_clerk_id TEXT,
  p_email TEXT,
  p_display_name TEXT
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_result json;
BEGIN
  -- ユーザーの作成または更新
  INSERT INTO users (
    clerk_id,
    email,
    display_name,
    handle_updated_at,
    updated_at
  )
  VALUES (
    p_clerk_id,
    p_email,
    p_display_name,
    NULL,
    TIMEZONE('utc'::text, NOW())
  )
  ON CONFLICT (clerk_id) DO UPDATE
  SET
    email = EXCLUDED.email,
    display_name = EXCLUDED.display_name,
    handle_updated_at = users.handle_updated_at,
    updated_at = TIMEZONE('utc'::text, NOW())
  RETURNING id INTO v_user_id;

  -- プロフィールが存在しない場合のみ作成
  INSERT INTO user_profiles (
    user_id,
    display_name
  )
  VALUES (
    v_user_id,
    p_display_name
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- 結果を返す
  SELECT json_build_object(
    'user_id', v_user_id,
    'clerk_id', p_clerk_id,
    'email', p_email,
    'display_name', p_display_name
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- ユーザーIDの変更が可能かチェックする関数
CREATE OR REPLACE FUNCTION check_handle_update_allowed(
  p_user_id UUID
) RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  v_last_update TIMESTAMP WITH TIME ZONE;
BEGIN
  -- 最後の更新日時を取得
  SELECT handle_updated_at
  INTO v_last_update
  FROM users
  WHERE id = p_user_id;

  -- 初回の更新または最後の更新から14日以上経過している場合はtrue
  RETURN (
    v_last_update IS NULL OR
    v_last_update < TIMEZONE('utc'::text, NOW()) - INTERVAL '14 days'
  );
END;
$$;

-- ユーザーIDを更新する関数
CREATE OR REPLACE FUNCTION update_user_handle(
  p_user_id UUID,
  p_new_handle TEXT
) RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  v_result json;
BEGIN
  -- ハンドルの形式チェック
  IF NOT (p_new_handle ~ '^[a-z0-9_]{1,15}$') THEN
    RAISE EXCEPTION 'Invalid handle format'
      USING HINT = 'Handle must be 1-15 characters long and contain only lowercase letters, numbers, and underscores';
  END IF;

  -- 更新可能かチェック
  IF NOT check_handle_update_allowed(p_user_id) THEN
    RAISE EXCEPTION 'Handle update not allowed'
      USING HINT = 'You can only update your handle once every 14 days';
  END IF;

  -- ハンドルの重複チェックと更新
  UPDATE users
  SET 
    handle = p_new_handle,
    handle_updated_at = TIMEZONE('utc'::text, NOW()),
    updated_at = TIMEZONE('utc'::text, NOW())
  WHERE 
    id = p_user_id
  RETURNING json_build_object(
    'user_id', id,
    'handle', handle,
    'handle_updated_at', handle_updated_at
  ) INTO v_result;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  RETURN v_result;
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Handle already taken'
      USING HINT = 'Please choose a different handle';
END;
$$; 
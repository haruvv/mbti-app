CREATE OR REPLACE FUNCTION public.toggle_follow_status(
  p_follower_id uuid,
  p_following_id uuid
)
RETURNS TABLE (is_following boolean) 
LANGUAGE plpgsql
AS $$
BEGIN
  -- フォロー状態を確認
  IF EXISTS (
    SELECT 1 FROM follows 
    WHERE follower_id = p_follower_id AND following_id = p_following_id
  ) THEN
    -- フォロー解除
    DELETE FROM follows 
    WHERE follower_id = p_follower_id AND following_id = p_following_id;
    RETURN QUERY SELECT false AS is_following;
  ELSE
    -- 自分自身をフォローしようとした場合はエラー
    IF p_follower_id = p_following_id THEN
      RAISE EXCEPTION 'Cannot follow yourself';
    END IF;

    -- フォロー追加
    INSERT INTO follows (follower_id, following_id)
    VALUES (p_follower_id, p_following_id);
    RETURN QUERY SELECT true AS is_following;
  END IF;
END;
$$; 
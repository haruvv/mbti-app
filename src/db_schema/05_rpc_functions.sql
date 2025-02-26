-- アプリケーションから呼び出されるRPC関数

-- ユーザーとプロフィールを作成/更新するRPC関数
CREATE OR REPLACE FUNCTION create_user_with_profile(
    p_clerk_id TEXT,
    p_email TEXT,
    p_display_name TEXT
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_profile_id UUID;
    v_result json;
BEGIN
    -- ユーザーの作成または更新
    INSERT INTO users (
        clerk_id,
        email,
        updated_at
    )
    VALUES (
        p_clerk_id,
        p_email,
        TIMEZONE('utc'::text, NOW())
    )
    ON CONFLICT (clerk_id) 
    DO UPDATE SET
        email = EXCLUDED.email,
        updated_at = TIMEZONE('utc'::text, NOW())
    RETURNING id INTO v_user_id;

    -- プロフィールの作成または更新
    INSERT INTO user_profiles (
        user_id,
        display_name,
        updated_at
    )
    VALUES (
        v_user_id,
        p_display_name,
        TIMEZONE('utc'::text, NOW())
    )
    ON CONFLICT (user_id)
    DO UPDATE
    SET
        display_name = COALESCE(p_display_name, user_profiles.display_name),
        updated_at = TIMEZONE('utc'::text, NOW())
    RETURNING id INTO v_profile_id;

    -- 結果を返す
    SELECT json_build_object(
        'user_id', u.id,
        'clerk_id', u.clerk_id,
        'email', u.email,
        'display_name', p.display_name,
        'handle', p.handle,
        'profile_id', p.id
    ) INTO v_result
    FROM users u
    LEFT JOIN user_profiles p ON u.id = p.user_id
    WHERE u.id = v_user_id;

    RETURN v_result;
END;
$$;

-- ハンドルを更新する関数
CREATE OR REPLACE FUNCTION update_user_handle(
    p_user_id UUID,
    p_new_handle TEXT
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result json;
BEGIN
    -- ハンドルが有効な形式かチェック
    IF p_new_handle !~ '^[a-z0-9_]{1,15}$' THEN
        RAISE EXCEPTION 'Invalid handle format'
            USING HINT = 'Handle must be 1-15 characters of lowercase letters, numbers, and underscores';
    END IF;

    -- 更新可能かチェック
    IF NOT check_handle_update_allowed(p_user_id) THEN
        RAISE EXCEPTION 'Handle update not allowed'
            USING HINT = 'You can only update your handle once every 14 days';
    END IF;

    -- ハンドルの更新（user_profilesテーブルに修正）
    UPDATE user_profiles
    SET 
        handle = p_new_handle,
        handle_updated_at = TIMEZONE('utc'::text, NOW()),
        updated_at = TIMEZONE('utc'::text, NOW())
    WHERE 
        user_id = p_user_id
    RETURNING json_build_object(
        'user_id', user_id,
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

-- フォロー/フォロー解除を切り替える関数
CREATE OR REPLACE FUNCTION toggle_follow(
    p_follower_id UUID,
    p_following_id UUID
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_is_following BOOLEAN;
    v_result json;
BEGIN
    -- 自分自身をフォローしようとしている場合はエラー
    IF p_follower_id = p_following_id THEN
        RAISE EXCEPTION 'Cannot follow yourself';
    END IF;

    -- 現在のフォロー状態を確認
    SELECT EXISTS(
        SELECT 1 FROM follows
        WHERE follower_id = p_follower_id AND following_id = p_following_id
    ) INTO v_is_following;

    IF v_is_following THEN
        -- フォロー解除
        DELETE FROM follows
        WHERE follower_id = p_follower_id AND following_id = p_following_id;
        
        v_result := json_build_object(
            'status', 'unfollowed',
            'follower_id', p_follower_id,
            'following_id', p_following_id
        );
    ELSE
        -- フォロー
        INSERT INTO follows (follower_id, following_id)
        VALUES (p_follower_id, p_following_id);
        
        v_result := json_build_object(
            'status', 'followed',
            'follower_id', p_follower_id,
            'following_id', p_following_id
        );
    END IF;

    RETURN v_result;
END;
$$;

-- フォロー数とフォロワー数を取得する関数
CREATE OR REPLACE FUNCTION get_follow_counts(
    p_user_id UUID
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_following_count INTEGER;
    v_followers_count INTEGER;
BEGIN
    -- フォロー数を取得
    SELECT COUNT(*) INTO v_following_count
    FROM follows
    WHERE follower_id = p_user_id;

    -- フォロワー数を取得
    SELECT COUNT(*) INTO v_followers_count
    FROM follows
    WHERE following_id = p_user_id;

    RETURN json_build_object(
        'user_id', p_user_id,
        'following_count', v_following_count,
        'followers_count', v_followers_count
    );
END;
$$;

-- フォロー/フォロワーの一覧を取得する関数
CREATE OR REPLACE FUNCTION get_follow_list(
    p_user_id UUID,
    p_type TEXT,
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result json;
    v_count INTEGER;
BEGIN
    IF p_type = 'following' THEN
        -- フォロー数を取得
        SELECT COUNT(*) INTO v_count
        FROM follows
        WHERE follower_id = p_user_id;

        -- フォロー一覧を取得
        SELECT json_agg(u) INTO v_result
        FROM (
            SELECT 
                u.id,
                u.handle,
                u.display_name,
                up.display_name as profile_display_name,
                up.custom_image_url,
                f.created_at as followed_at
            FROM follows f
            JOIN users u ON f.following_id = u.id
            LEFT JOIN user_profiles up ON u.id = up.user_id
            WHERE f.follower_id = p_user_id
            ORDER BY f.created_at DESC
            LIMIT p_limit
            OFFSET p_offset
        ) u;
    ELSIF p_type = 'followers' THEN
        -- フォロワー数を取得
        SELECT COUNT(*) INTO v_count
        FROM follows
        WHERE following_id = p_user_id;

        -- フォロワー一覧を取得
        SELECT json_agg(u) INTO v_result
        FROM (
            SELECT 
                u.id,
                u.handle,
                u.display_name,
                up.display_name as profile_display_name,
                up.custom_image_url,
                f.created_at as followed_at
            FROM follows f
            JOIN users u ON f.follower_id = u.id
            LEFT JOIN user_profiles up ON u.id = up.user_id
            WHERE f.following_id = p_user_id
            ORDER BY f.created_at DESC
            LIMIT p_limit
            OFFSET p_offset
        ) u;
    ELSE
        RAISE EXCEPTION 'Invalid type: must be "following" or "followers"';
    END IF;

    RETURN json_build_object(
        'users', COALESCE(v_result, '[]'::json),
        'total_count', v_count
    );
END;
$$;

-- ユーザープロフィールの更新関数
CREATE OR REPLACE FUNCTION update_user_profile(
    p_user_id UUID,
    p_display_name TEXT DEFAULT NULL,
    p_bio TEXT DEFAULT NULL,
    p_preferred_mbti TEXT DEFAULT NULL,
    p_custom_image_url TEXT DEFAULT NULL,
    p_bookmarked_types TEXT[] DEFAULT NULL,
    p_social_links JSONB DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result json;
BEGIN
    -- 各項目をNULLでなければ更新
    UPDATE user_profiles
    SET 
        display_name = COALESCE(p_display_name, display_name),
        bio = COALESCE(p_bio, bio),
        preferred_mbti = COALESCE(p_preferred_mbti, preferred_mbti),
        custom_image_url = COALESCE(p_custom_image_url, custom_image_url),
        bookmarked_types = COALESCE(p_bookmarked_types, bookmarked_types),
        social_links = COALESCE(p_social_links, social_links),
        updated_at = TIMEZONE('utc'::text, NOW())
    WHERE user_id = p_user_id
    RETURNING json_build_object(
        'id', id,
        'user_id', user_id,
        'display_name', display_name,
        'handle', handle,
        'bio', bio,
        'preferred_mbti', preferred_mbti,
        'custom_image_url', custom_image_url,
        'bookmarked_types', bookmarked_types,
        'social_links', social_links,
        'updated_at', updated_at
    ) INTO v_result;
    
    RETURN v_result;
END;
$$;

-- MBTIタイプに基づいた相性の良いユーザー検索
CREATE OR REPLACE FUNCTION find_compatible_users(
    p_user_id UUID,
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_mbti TEXT;
    v_compatible_types TEXT[];
    v_count INTEGER;
    v_result json;
BEGIN
    -- ユーザーのMBTIタイプを取得
    SELECT COALESCE(
        up.preferred_mbti,
        (SELECT tr.mbti_type FROM test_results tr 
         WHERE tr.user_id = p_user_id 
         ORDER BY tr.created_at DESC LIMIT 1)
    ) INTO v_mbti
    FROM user_profiles up
    WHERE up.user_id = p_user_id;
    
    -- 相性のいいMBTIタイプのリストを取得
    SELECT CASE v_mbti
        WHEN 'INTJ' THEN ARRAY['ENFP', 'ENTP']
        WHEN 'INTP' THEN ARRAY['ENTJ', 'ENFJ']
        WHEN 'ENTJ' THEN ARRAY['INTP', 'INFP']
        WHEN 'ENTP' THEN ARRAY['INTJ', 'INFJ']
        WHEN 'INFJ' THEN ARRAY['ENFP', 'ENTP']
        WHEN 'INFP' THEN ARRAY['ENTJ', 'ENFJ']
        WHEN 'ENFJ' THEN ARRAY['INTP', 'INFP']
        WHEN 'ENFP' THEN ARRAY['INTJ', 'INFJ']
        WHEN 'ISTJ' THEN ARRAY['ESFP', 'ESTP']
        WHEN 'ISFJ' THEN ARRAY['ESFP', 'ESTP']
        WHEN 'ESTJ' THEN ARRAY['ISFP', 'ISTP']
        WHEN 'ESFJ' THEN ARRAY['ISFP', 'ISTP']
        WHEN 'ISTP' THEN ARRAY['ESFJ', 'ESTJ']
        WHEN 'ISFP' THEN ARRAY['ESFJ', 'ESTJ']
        WHEN 'ESTP' THEN ARRAY['ISFJ', 'ISTJ']
        WHEN 'ESFP' THEN ARRAY['ISFJ', 'ISTJ']
        ELSE ARRAY[]::TEXT[]
    END INTO v_compatible_types;
    
    -- 該当するユーザー数をカウント
    SELECT COUNT(*) INTO v_count
    FROM user_profiles up
    WHERE 
        up.user_id <> p_user_id AND
        (up.preferred_mbti = ANY(v_compatible_types) OR
         EXISTS (
             SELECT 1 FROM test_results tr
             WHERE tr.user_id = up.user_id AND tr.mbti_type = ANY(v_compatible_types)
             ORDER BY tr.created_at DESC
             LIMIT 1
         ));
    
    -- 相性の良いユーザーを取得
    SELECT json_agg(u) INTO v_result
    FROM (
        SELECT 
            users.id,
            up.handle,
            up.display_name,
            up.custom_image_url,
            up.preferred_mbti,
            up.bio,
            COALESCE(
                up.preferred_mbti,
                (SELECT tr.mbti_type FROM test_results tr 
                 WHERE tr.user_id = up.user_id 
                 ORDER BY tr.created_at DESC LIMIT 1)
            ) as mbti_type,
            EXISTS(
                SELECT 1 FROM follows f
                WHERE f.follower_id = p_user_id AND f.following_id = users.id
            ) as is_following
        FROM user_profiles up
        JOIN users ON up.user_id = users.id
        WHERE 
            up.user_id <> p_user_id AND
            (up.preferred_mbti = ANY(v_compatible_types) OR
             EXISTS (
                 SELECT 1 FROM test_results tr
                 WHERE tr.user_id = up.user_id AND tr.mbti_type = ANY(v_compatible_types)
                 ORDER BY tr.created_at DESC
                 LIMIT 1
             ))
        ORDER BY 
            -- 既にフォローしているユーザーを下位に
            EXISTS(SELECT 1 FROM follows f WHERE f.follower_id = p_user_id AND f.following_id = users.id) ASC,
            -- プロフィールの完成度が高いユーザーを優先
            (up.display_name IS NOT NULL AND up.bio IS NOT NULL AND up.custom_image_url IS NOT NULL) DESC,
            -- 最新のユーザーを優先
            users.created_at DESC
        LIMIT p_limit
        OFFSET p_offset
    ) u;
    
    RETURN json_build_object(
        'users', COALESCE(v_result, '[]'::json),
        'total_count', v_count,
        'user_mbti', v_mbti,
        'compatible_types', v_compatible_types
    );
END;
$$;

-- 古い関数を削除
DROP FUNCTION IF EXISTS save_test_result(UUID, TEXT, JSONB);

-- 新しい関数に引数のデフォルト値を設定
CREATE OR REPLACE FUNCTION save_test_result(
    p_user_id UUID,
    p_mbti_type TEXT,
    p_answers JSONB DEFAULT '{}',
    p_e_score INTEGER DEFAULT 0,
    p_n_score INTEGER DEFAULT 0,
    p_f_score INTEGER DEFAULT 0,
    p_p_score INTEGER DEFAULT 0
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result_id UUID;
    v_result json;
BEGIN
    -- MBTIタイプの形式チェック
    IF p_mbti_type !~ '^[EI][NS][TF][JP]$' THEN
        RAISE EXCEPTION 'Invalid MBTI type format';
    END IF;

    -- 診断結果の保存
    INSERT INTO test_results (
        user_id,
        mbti_type,
        answers,
        created_at
    )
    VALUES (
        p_user_id,
        p_mbti_type,
        p_answers,
        TIMEZONE('utc'::text, NOW())
    )
    RETURNING id INTO v_result_id;

    -- 結果を返す
    SELECT json_build_object(
        'result_id', v_result_id,
        'user_id', user_id,
        'mbti_type', mbti_type,
        'created_at', created_at
    ) INTO v_result
    FROM test_results
    WHERE id = v_result_id;

    RETURN v_result;
END;
$$; 
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Camera, Save, Loader2, X, AlertCircle, Info } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { updateProfile } from "@/app/_actions/profile";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUserContext } from "@/contexts/UserContext";

export default function ProfileEditPage() {
  const { user, isLoaded } = useUser();
  const { updateHandle, refreshHandle } = useUserContext();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [handleError, setHandleError] = useState("");
  const [isHandleDisabled, setIsHandleDisabled] = useState(false);
  const [daysTillHandleChange, setDaysTillHandleChange] = useState(0);

  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    mbtiType: "",
    favoriteTypes: [] as string[],
    socialLinks: {
      twitter: "",
      instagram: "",
      website: "",
    },
    customImageUrl: "",
    handle: "",
  });

  const [error, setError] = useState<string | null>(null);

  // ページ読み込み時のデータ取得
  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      try {
        const response = await fetch("/api/profile");
        if (!response.ok) throw new Error("プロフィールの取得に失敗しました");

        const data = await response.json();
        setFormData({
          displayName: data.display_name || "",
          bio: data.bio || "",
          mbtiType: data.preferred_mbti || "",
          favoriteTypes: data.bookmarked_types || [],
          socialLinks: {
            twitter: data.social_links?.twitter || "",
            instagram: data.social_links?.instagram || "",
            website: data.social_links?.website || "",
          },
          customImageUrl: data.custom_image_url || "",
          handle: data.handle || "",
        });

        // ハンドル変更制限をチェック
        if (data.handle_updated_at) {
          const lastUpdate = new Date(data.handle_updated_at);
          const daysSince = Math.floor(
            (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24)
          );
          const daysRemaining = 14 - daysSince;

          if (daysRemaining > 0) {
            setIsHandleDisabled(true);
            setDaysTillHandleChange(daysRemaining);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(
          error instanceof Error
            ? error.message
            : "プロフィールの取得に失敗しました"
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (isLoaded) {
      fetchProfile();
    }
  }, [user, isLoaded]);

  // 入力値変更ハンドラー
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "handle") {
      // handleバリデーション
      if (!value.trim()) {
        setHandleError("ユーザーIDは必須です");
      } else if (!/^[a-zA-Z0-9_]{1,15}$/.test(value)) {
        setHandleError("ユーザーIDは1-15文字の半角英数字と_のみ使用できます");
      } else {
        setHandleError("");
      }
    }

    if (name === "displayName" && !value.trim()) {
      setError("表示名は必須です");
    } else {
      setError(null);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // MBTIタイプ変更ハンドラー
  const handleMbtiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, mbtiType: e.target.value }));
  };
  // 画像選択ボタンクリック時のハンドラー
  const handleImageButtonClick = () => {
    // ファイル選択ダイアログを表示する
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error("fileInputRef is null");
    }
  };

  // ファイル選択時のハンドラー
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

    if (file.size > maxSizeInBytes) {
      toast.error("ファイルサイズは5MB以下にしてください");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "画像のアップロードに失敗しました");
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "画像のアップロードに失敗しました");
      }

      setFormData((prev) => ({
        ...prev,
        customImageUrl: data.url,
      }));

      toast.success("画像をアップロードしました");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "画像のアップロードに失敗しました"
      );
    } finally {
      setIsUploading(false);
    }
  };

  // 画像削除ハンドラー
  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      customImageUrl: "",
    }));
    toast.success("画像を削除しました");
  };

  // ソーシャルリンクのバリデーション
  const validateSocialLinks = () => {
    let isValid = true;
    const errors = {
      twitter: "",
      instagram: "",
      website: "",
    };

    // Twitter (X)
    if (
      formData.socialLinks.twitter &&
      !formData.socialLinks.twitter.startsWith("https://x.com/")
    ) {
      errors.twitter = "TwitterのURLはhttps://x.com/で始まる必要があります";
      isValid = false;
    }

    // Instagram
    if (
      formData.socialLinks.instagram &&
      !formData.socialLinks.instagram.startsWith("https://instagram.com/")
    ) {
      errors.instagram =
        "InstagramのURLはhttps://instagram.com/で始まる必要があります";
      isValid = false;
    }

    return isValid;
  };

  // handleのバリデーション
  const validateHandle = () => {
    // 空チェックを追加
    if (!formData.handle.trim()) {
      setHandleError("ユーザーIDは必須です");
      return false;
    }

    // 既存のフォーマットチェック
    const isValid = /^[a-zA-Z0-9_]{1,15}$/.test(formData.handle);
    if (!isValid) {
      setHandleError("ユーザーIDは1-15文字の半角英数字と_のみ使用できます");
      return false;
    }

    setHandleError("");
    return true;
  };

  // 表示名のバリデーション関数を追加
  const validateDisplayName = () => {
    if (!formData.displayName.trim()) {
      setError("表示名は必須です");
      return false;
    }
    return true;
  };

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 表示名のバリデーション
    if (!validateDisplayName()) {
      toast.error("表示名は必須です");
      return;
    }

    // handleのバリデーション
    if (!validateHandle()) {
      toast.error(handleError || "ユーザーIDのフォーマットが不正です");
      return;
    }

    // ソーシャルリンクのバリデーション
    if (!validateSocialLinks()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const submitData = new FormData();
      submitData.append("displayName", formData.displayName);
      submitData.append("bio", formData.bio);
      submitData.append("mbtiType", formData.mbtiType);
      submitData.append("customImageUrl", formData.customImageUrl);
      submitData.append(
        "favoriteTypes",
        JSON.stringify(formData.favoriteTypes)
      );
      submitData.append("socialLinks", JSON.stringify(formData.socialLinks));

      // handleを追加
      submitData.append("handle", formData.handle);

      const result = await updateProfile(submitData);

      if (!result.success) {
        throw new Error(result.error || "更新に失敗しました");
      }

      toast.success("プロフィールを更新しました");

      // ハンドルを更新する時に確実にContextとローカルストレージを更新
      if (formData.handle) {
        updateHandle(formData.handle);
        // 明示的にセッションストレージにも保存（冗長かもしれませんが確実にするため）
        sessionStorage.setItem("userHandle", formData.handle);
      }

      // 強制的にコンテキストを再読み込み
      await refreshHandle();

      router.refresh();
      router.push(`/profile/${formData.handle}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(
        error instanceof Error ? error.message : "不明なエラーが発生しました"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // MBTIタイプの一覧
  const mbtiTypes = [
    "INTJ",
    "INTP",
    "ENTJ",
    "ENTP",
    "INFJ",
    "INFP",
    "ENFJ",
    "ENFP",
    "ISTJ",
    "ISFJ",
    "ESTJ",
    "ESFJ",
    "ISTP",
    "ISFP",
    "ESTP",
    "ESFP",
  ];

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">プロフィール編集</h1>
          <Link
            href="/profile"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            プロフィールに戻る
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              {/* プロフィール画像 */}
              <div className="mb-6 flex flex-col items-center">
                <div
                  className="relative w-24 h-24 rounded-full overflow-hidden mb-2 cursor-pointer group"
                  onClick={handleImageButtonClick}
                >
                  {isLoading || isUploading ? (
                    <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                      {isUploading && (
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                      )}
                    </div>
                  ) : formData.customImageUrl ? (
                    <>
                      <Image
                        src={formData.customImageUrl}
                        alt="プロフィール画像"
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                        {formData.displayName
                          ? formData.displayName.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  id="profile-image-upload"
                />
                <p className="text-sm text-gray-500 mb-2">
                  クリックして画像を変更
                </p>

                {formData.customImageUrl && (
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveImage}
                    >
                      <X className="w-4 h-4 mr-1" /> 画像を削除
                    </Button>
                  </div>
                )}
              </div>

              {/* 表示名 */}
              <div className="mb-4">
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  表示名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="あなたの表示名"
                />
                {!formData.displayName && (
                  <p className="mt-1 text-sm text-red-600">表示名は必須です</p>
                )}
              </div>

              {/* ユーザーID (handle) */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <label
                    htmlFor="handle"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    ユーザーID <span className="text-red-500">*</span>
                  </label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          検索やプロフィールURLに使用される一意のID
                          <br />
                          半角英数字とアンダースコア(_)のみ使用可
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    id="handle"
                    name="handle"
                    value={formData.handle}
                    onChange={handleInputChange}
                    disabled={isHandleDisabled}
                    maxLength={15}
                    className={`w-full px-3 py-2 border ${
                      handleError ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                      isHandleDisabled ? "bg-gray-100 text-gray-500" : ""
                    }`}
                    placeholder="例: mbti_lover123"
                  />
                  {isHandleDisabled && (
                    <div className="mt-1 text-sm text-amber-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      あと{daysTillHandleChange}日間は変更できません
                      (14日に1回のみ変更可能)
                    </div>
                  )}
                  {handleError && (
                    <div className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {handleError}
                    </div>
                  )}
                </div>
              </div>

              {/* 自己紹介 */}
              <div className="mb-4">
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  自己紹介
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  maxLength={300}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="あなたについて教えてください（300文字以内）"
                ></textarea>
                <div className="mt-1 text-right text-xs text-gray-500">
                  {formData.bio.length}/300
                </div>
              </div>

              {/* MBTIタイプ */}
              <div className="mb-4">
                <label
                  htmlFor="mbtiType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  MBTIタイプ
                </label>
                <select
                  id="mbtiType"
                  name="mbtiType"
                  value={formData.mbtiType}
                  onChange={handleMbtiChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">選択してください</option>
                  {mbtiTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* お気に入りタイプ */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  お気に入りのMBTIタイプ
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {mbtiTypes.map((type) => (
                    <label
                      key={type}
                      className={`flex items-center ${
                        !formData.favoriteTypes.includes(type) &&
                        formData.favoriteTypes.length >= 5
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={formData.favoriteTypes.includes(type)}
                        onChange={(e) => {
                          const checked = e.target.checked;

                          // チェックを付ける場合（お気に入り追加）で、既に5つ選択されている場合はブロック
                          if (checked && formData.favoriteTypes.length >= 5) {
                            toast.error("お気に入りは最大5つまで登録できます");
                            return;
                          }

                          // 通常の追加/削除処理
                          setFormData((prev) => ({
                            ...prev,
                            favoriteTypes: checked
                              ? [...prev.favoriteTypes, type]
                              : prev.favoriteTypes.filter((t) => t !== type),
                          }));
                        }}
                        disabled={
                          !formData.favoriteTypes.includes(type) &&
                          formData.favoriteTypes.length >= 5
                        }
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.favoriteTypes.length}/5 選択中
                </p>
              </div>

              {/* エラーメッセージ */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* 送信ボタン */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center bg-teal-700 hover:bg-teal-800 text-white"
                >
                  {isSubmitting && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  <Save className="w-4 h-4 mr-2" />
                  保存する
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { updateUserProfile } from "@/app/_actions/profile";
import { toast } from "sonner";
import { uploadImage } from "@/app/_actions/upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { typeDescriptions } from "@/app/data/mbtiTypes";
import { createClient } from "@/lib/supabase/client";

type MBTIOption = {
  type: string;
  title: string;
};

type FormData = {
  displayName: string;
  imageUrl: string;
  preferredMbti: string;
  bio: string;
  bookmarkedTypes: string[];
  handle: string;
};

type Props = {
  userId: string;
  initialData: FormData;
  mbtiOptions: MBTIOption[];
  latestMbtiType: string | null;
};

export function ProfileForm({
  userId,
  initialData = {
    displayName: "",
    imageUrl: "",
    preferredMbti: "",
    bio: "",
    bookmarkedTypes: [],
    handle: "",
  },
  mbtiOptions = [],
  latestMbtiType,
}: Props) {
  const router = useRouter();
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);

  // 変更されたフィールドを追跡
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());

  const [isHandleDisabled, setIsHandleDisabled] = useState(false);

  // コンポーネントのマウント時に制限をチェック
  useEffect(() => {
    const checkHandleRestriction = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("users")
          .select("handle_updated_at")
          .eq("clerk_id", userId)
          .single();

        if (data?.handle_updated_at) {
          const lastUpdate = new Date(data.handle_updated_at);
          const daysSinceLastUpdate =
            (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);

          if (daysSinceLastUpdate < 14) {
            setIsHandleDisabled(true);
          }
        }
      } catch (error) {
        console.error("Error checking handle restriction:", error);
      }
    };

    checkHandleRestriction();
  }, [userId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setChangedFields((prev) => new Set(prev).add(name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // プロフィールデータを正しい形式で準備
      const profileData = {
        displayName: formData.displayName,
        imageUrl: formData.imageUrl,
        preferredMbti: formData.preferredMbti || null,
        bio: formData.bio,
        bookmarkedTypes: formData.bookmarkedTypes,
        handle: formData.handle, // handleは常に含める
      };

      const { success, error } = await updateUserProfile(userId, profileData);

      if (!success) {
        toast.error(error);
        return;
      }

      toast.success("プロフィールを更新しました");
      router.push("/profile");
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      toast.error("更新に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialData);
    setChangedFields(new Set());
    toast("変更をリセットしました");
  };

  const isTypeBookmarked = (type: string) => {
    return formData.bookmarkedTypes?.includes(type) || false;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 基本プロフィール */}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="handle"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            ユニークID
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">@</span>
            <input
              type="text"
              id="handle"
              name="handle"
              value={formData.handle}
              onChange={handleChange}
              disabled={isHandleDisabled}
              pattern="^[a-z0-9_]{1,15}$"
              className={`w-full pl-8 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 ${
                isHandleDisabled
                  ? "bg-gray-100 cursor-not-allowed"
                  : changedFields.has("handle")
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200"
              }`}
              placeholder="johndoe"
            />
          </div>
          <div className="mt-1 space-y-1">
            <p className="text-sm text-gray-500">
              英小文字、数字、アンダースコア(_)のみ使用可能。最大15文字まで
            </p>
            {isHandleDisabled ? (
              <p className="text-sm text-amber-600">
                ※ ユニークIDは前回の変更から14日間経過後に再度変更可能になります
              </p>
            ) : (
              <p className="text-sm text-amber-600">
                ※ ユニークIDは変更後14日間は再度変更できません
              </p>
            )}
          </div>
        </div>

        <div>
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
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 ${
              changedFields.has("displayName")
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200"
            }`}
          />
          <p className="mt-1 text-sm text-gray-500">
            他のユーザーに表示される名前です
          </p>
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            プロフィール画像
          </label>
          <div className="flex gap-4 items-center">
            <div className="relative w-16 h-16">
              <Image
                src={formData.imageUrl}
                alt="プロフィール画像"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  if (file.size > 2 * 1024 * 1024) {
                    toast.error("画像サイズは2MB以下にしてください");
                    return;
                  }

                  try {
                    const { success, url, error } = await uploadImage(file);
                    if (!success || !url) throw new Error(error);

                    setFormData((prev) => ({ ...prev, imageUrl: url }));
                    setChangedFields((prev) => new Set(prev).add("imageUrl"));
                    toast.success("画像をアップロードしました");
                  } catch (error) {
                    toast.error("画像のアップロードに失敗しました");
                  }
                }}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                  file:rounded-full file:border-0 file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
              />
              <p className="mt-1 text-sm text-gray-500">
                2MB以下のJPG、PNG形式の画像をアップロードできます
              </p>
            </div>
          </div>
        </div>

        <div>
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
            onChange={handleChange}
            rows={4}
            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 ${
              changedFields.has("bio")
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200"
            }`}
            placeholder="あなたのことを教えてください"
          />
          <p className="mt-1 text-sm text-gray-500">
            最大500文字まで入力できます
          </p>
        </div>

        {/* 代表的なMBTIタイプ（表示のみ） */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            代表的なMBTIタイプ
          </label>
          {latestMbtiType ? (
            <div className="glass-effect p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xl font-bold text-indigo-600">
                  {latestMbtiType}
                </span>
                <span className="text-gray-600">
                  {typeDescriptions[latestMbtiType].title}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                最新の診断結果が自動的に設定されます
              </p>
            </div>
          ) : (
            <div className="glass-effect p-4 rounded-lg bg-gray-50">
              <p className="text-gray-500">
                まだ診断を受けていません。
                <a
                  href="/test"
                  className="text-indigo-600 hover:text-indigo-700 ml-2"
                >
                  診断を受ける →
                </a>
              </p>
            </div>
          )}
        </div>

        {/* お気に入りのタイプ選択 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            お気に入りのタイプ
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {Object.keys(typeDescriptions).map((type) => (
              <label
                key={type}
                className={`flex items-center justify-center px-2 py-1.5 rounded-lg border cursor-pointer transition-all text-center ${
                  formData.bookmarkedTypes?.includes(type)
                    ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                    : "border-gray-200 hover:bg-gray-50"
                } ${
                  !formData.bookmarkedTypes?.includes(type) &&
                  (formData.bookmarkedTypes?.length || 0) >= 5
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.bookmarkedTypes?.includes(type)}
                  onChange={(e) => {
                    const newTypes = e.target.checked
                      ? [...(formData.bookmarkedTypes || []), type].slice(0, 5)
                      : (formData.bookmarkedTypes || []).filter(
                          (t) => t !== type
                        );
                    setFormData((prev) => ({
                      ...prev,
                      bookmarkedTypes: newTypes,
                    }));
                    setChangedFields((prev) =>
                      new Set(prev).add("bookmarkedTypes")
                    );
                  }}
                  className="hidden"
                  disabled={
                    !formData.bookmarkedTypes?.includes(type) &&
                    (formData.bookmarkedTypes?.length || 0) >= 5
                  }
                />
                <span className="font-mono text-sm">{type}</span>
              </label>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            最大5つまで選択: {formData.bookmarkedTypes?.length || 0}/5
          </p>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          キャンセル
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          リセット
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isLoading ? "保存中..." : "保存"}
        </button>
      </div>
    </form>
  );
}

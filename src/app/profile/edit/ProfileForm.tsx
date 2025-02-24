"use client";

import { useState } from "react";
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

type MBTIOption = {
  type: string;
  title: string;
};

type FormData = {
  displayName: string;
  imageUrl: string;
  preferredMbti: string;
};

export function ProfileForm({
  userId,
  initialData,
  mbtiOptions = [],
}: {
  userId: string;
  initialData: FormData;
  mbtiOptions: MBTIOption[];
}) {
  const router = useRouter();
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 変更されたフィールドを追跡
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());

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
      const { success, error } = await updateUserProfile(userId, {
        display_name: formData.displayName,
        custom_image_url: formData.imageUrl,
        preferred_mbti: formData.preferredMbti,
      });

      if (!success) throw new Error(error);

      toast.success("プロフィールを更新しました");
      router.push("/profile");
      router.refresh();
    } catch (error) {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 基本プロフィール */}
      <div className="space-y-4">
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
            aria-describedby="name-description"
          />
          <p id="name-description" className="mt-1 text-sm text-gray-500">
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

                  // ファイルサイズチェック (2MB)
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
      </div>

      {/* 詳細設定 */}
      <div className="border-t pt-6">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2"
        >
          <span>詳細設定</span>
          <svg
            className={`w-5 h-5 transition-transform ${
              showAdvanced ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="preferredMbti"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                代表的なMBTIタイプ
              </label>
              <Select
                name="preferredMbti"
                value={formData.preferredMbti}
                onValueChange={(value: string) => {
                  setFormData((prev) => ({ ...prev, preferredMbti: value }));
                  setChangedFields((prev) =>
                    new Set(prev).add("preferredMbti")
                  );
                }}
              >
                <SelectTrigger
                  className={`w-full ${
                    changedFields.has("preferredMbti")
                      ? "border-indigo-500 bg-indigo-50"
                      : ""
                  }`}
                >
                  <SelectValue placeholder="タイプを選択" />
                </SelectTrigger>
                <SelectContent>
                  {mbtiOptions.map((option) => (
                    <SelectItem key={option.type} value={option.type}>
                      <span className="font-medium">{option.type}</span>
                      <span className="ml-2 text-gray-500">
                        - {option.title}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-1 text-sm text-gray-500">
                過去の診断結果から、あなたを最もよく表すタイプを選択できます
              </p>
            </div>
          </div>
        )}
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

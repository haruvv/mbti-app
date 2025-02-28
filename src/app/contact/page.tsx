"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  ArrowLeft,
  Send,
  MessageSquare,
  Info,
  Check,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/layout/PageContainer";
import { ContentCard } from "@/components/ui/layout/ContentCard";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// フォームのバリデーションスキーマ
const contactFormSchema = z.object({
  name: z.string().min(1, { message: "お名前を入力してください" }),
  email: z
    .string()
    .email({ message: "有効なメールアドレスを入力してください" }),
  type: z.string().min(1, { message: "お問い合わせ種類を選択してください" }),
  message: z
    .string()
    .min(10, { message: "メッセージは10文字以上入力してください" })
    .max(1000, { message: "メッセージは1000文字以内で入力してください" }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      type: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 実際のAPIエンドポイントに送信
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "エラーが発生しました");
      }

      console.log("送信されたデータ:", data);
      setIsSubmitted(true);
    } catch (error) {
      console.error("送信エラー:", error);
      setSubmitError(
        "メッセージの送信中にエラーが発生しました。後ほど再試行してください。"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    form.reset();
    setIsSubmitted(false);
    setSubmitError(null);
  };

  return (
    <PageContainer maxWidth="3xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          お問い合わせ
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          ご質問やフィードバックをお寄せください
        </p>
      </div>

      <ContentCard>
        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              送信完了しました
            </h2>
            <p className="text-gray-600 mb-6">
              お問い合わせありがとうございます。内容を確認次第、順次対応いたします。
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={handleReset} className="gap-2">
                新しいお問い合わせ
              </Button>
              <Link href="/">
                <Button className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  ホームに戻る <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-indigo-50 p-4 rounded-lg mb-6 border border-indigo-100">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-indigo-700 text-sm">
                    当サービスに関するご質問、ご意見、不具合の報告などをお寄せください。内容を確認し、必要に応じてご連絡いたします。
                  </p>
                </div>
              </div>

              {submitError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>エラー</AlertTitle>
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>お名前</FormLabel>
                      <FormControl>
                        <Input placeholder="お名前" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>メールアドレス</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@mail.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>お問い合わせの種類</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="お問い合わせの種類を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">一般的な質問</SelectItem>
                          <SelectItem value="test">
                            診断テストについて
                          </SelectItem>
                          <SelectItem value="result">
                            診断結果について
                          </SelectItem>
                          <SelectItem value="bug">不具合の報告</SelectItem>
                          <SelectItem value="feature">
                            機能のリクエスト
                          </SelectItem>
                          <SelectItem value="other">その他</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メッセージ</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="お問い合わせ内容を入力してください"
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between items-center pt-4">
                <Link href="/">
                  <Button type="button" variant="outline" className="gap-2">
                    <ArrowLeft className="h-4 w-4" /> 戻る
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="gap-2 bg-gradient-to-r from-slate-700 to-gray-600 hover:from-slate-800 hover:to-gray-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "送信中..." : "送信する"}
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        )}
      </ContentCard>
    </PageContainer>
  );
}

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    // リクエストボディからデータを取得
    const body = await request.json();
    const { name, email, type, message } = body;

    // 必須フィールドの検証
    if (!name || !email || !type || !message) {
      return NextResponse.json(
        { error: "必須フィールドがありません" },
        { status: 400 }
      );
    }

    // nodemailerのトランスポーターを設定
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // お問い合わせタイプのマッピング
    const typeMapping: Record<string, string> = {
      general: "一般的な質問",
      test: "診断テストについて",
      result: "診断結果について",
      bug: "不具合の報告",
      feature: "機能のリクエスト",
      other: "その他",
    };

    // お問い合わせタイプのテキストを取得
    const typeText = typeMapping[type] || type;

    // メールの内容を設定
    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      subject: `【お問い合わせ】${typeText}`,
      text: `
お名前: ${name}
メールアドレス: ${email}
お問い合わせの種類: ${typeText}

メッセージ:
${message}
      `,
      replyTo: email,
    };

    // メールを送信
    await transporter.sendMail(mailOptions);

    // 自動返信メールを送信 (オプション)
    const autoReplyOptions = {
      from: process.env.MAIL_FROM,
      to: email,
      subject: "【自動返信】お問い合わせを受け付けました",
      text: `
${name} 様

お問い合わせありがとうございます。
以下の内容でお問い合わせを受け付けました。
内容を確認次第、担当者からご連絡させていただきます。

----- お問い合わせ内容 -----
お問い合わせの種類: ${typeText}

メッセージ:
${message}
--------------------------

※ このメールは自動送信されています。返信はご遠慮ください。
      `,
    };

    await transporter.sendMail(autoReplyOptions);

    // 成功レスポンスを返す
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("メール送信エラー:", error);
    return NextResponse.json(
      { error: "メールの送信に失敗しました" },
      { status: 500 }
    );
  }
}

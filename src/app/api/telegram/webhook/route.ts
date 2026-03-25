import { NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEB_APP_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ottiz.vercel.app';

export async function POST(req: Request) {
  try {
    const update = await req.json();

    // Check if the update is a message and text is /start
    if (update?.message?.text === '/start') {
      const chatId = update.message.chat.id;
      const firstName = update.message.chat.first_name || 'Foydalanuvchi';

      const text = `Salom, *${firstName}*! 👋\n\nBu **Arenda to'lovlarini boshqarish** uchun rasmiy Telegram Botingiz.\n\nQuyidagi **"Tizimga kirish"** tugmasi orqali to'g'ridan-to'g'ri o'z kabinetingizni telegram ichida to'liq ekranda ocha olasiz!`;

      // Create an inline keyboard with a WebApp button
      const replyMarkup = {
        inline_keyboard: [
          [
            {
              text: "🌐 Tizimga Kirish (Mini App)",
              web_app: { url: WEB_APP_URL }
            }
          ]
        ]
      };

      // Send the welcoming message to the user
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'Markdown',
          reply_markup: replyMarkup
        })
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook xatosi:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function sendTelegramMessage(chatId: string, message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!token) {
    console.error('TELEGRAM_BOT_TOKEN .env faylida topilmadi!');
    return false;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        chat_id: chatId, // Telegram user'ning raqamli Chat ID'si bo'lishi kerak
        text: message 
      })
    });
    
    const data = await response.json();
    if (!data.ok) {
      console.error('Telegram API xatosi:', data);
      return false;
    }
    
    console.log(`Xabar muvaffaqiyatli yetkazildi: ${chatId}`);
    return true;
  } catch (error) {
    console.error('Telegram xabar jo\'natishda xatolik yuz berdi:', error);
    return false;
  }
}

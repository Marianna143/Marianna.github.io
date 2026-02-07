import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(req: Request) {
    try {
        // Получаем данные, которые прислала форма
        const body = await req.json();
        const { name, phone, message } = body; // Убедитесь, что имена совпадают с вашей формой

        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            return NextResponse.json({ error: 'Нет токенов' }, { status: 500 });
        }

        // Формируем красивое сообщение
        const text = `
📩 <b>Заявка с портфолио!</b>
👤 <b>Имя:</b> ${name}
📞 <b>Контакты:</b> ${phone}
💬 <b>Сообщение:</b> ${message}
    `;

        // Отправляем запрос в Телеграм
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: text,
                parse_mode: 'HTML',
            }),
        });

        if (response.ok) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Ошибка Telegram' }, { status: 500 });
        }

    } catch (error) {
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}
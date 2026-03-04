import { NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, phone, message } = body;

        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            return NextResponse.json({ error: "Нет данных для Телеграм" }, { status: 500 });
        }

        const text = `
📩 <b>Заявка с портфолио!</b>
👤 <b>Имя:</b> ${name}
📞 <b>Контакты:</b> ${phone}
💬 <b>Сообщение:</b> ${message}
        `;

        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text,
                parse_mode: "HTML",
            }),
        });

        if (response.ok) {
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Ошибка отправки в Телеграм" }, { status: 500 });
    } catch {
        return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
    }
}

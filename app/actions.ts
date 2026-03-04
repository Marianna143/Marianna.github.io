"use server";

export async function sendToTelegram(formData: FormData) {
    const name = formData.get("name") as string;
    const telegram = formData.get("telegram") as string;
    const type = formData.get("type") as string;
    const wishes = formData.get("wishes") as string;

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.error("Не настроены данные для Телеграм");
        return { success: false, message: "Ошибка конфигурации сервера" };
    }

    const text = `
🆕 <b>Новая заявка с портфолио!</b>

👤 <b>Имя:</b> ${name || "Не указано"}
📱 <b>Телеграм:</b> ${telegram || "Не указан"}
📋 <b>Тип проекта:</b> ${type || "Не выбран"}
💭 <b>Пожелания:</b> ${wishes || "Нет"}
    `;

    try {
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

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Ошибка Телеграм:", errorText);
            return { success: false, message: "Ошибка отправки в Телеграм" };
        }

        return { success: true, message: "Заявка успешно отправлена" };
    } catch (error) {
        console.error("Ошибка серверного действия:", error);
        return { success: false, message: "Сбой подключения" };
    }
}

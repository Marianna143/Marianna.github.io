"use server"

export async function sendToTelegram(formData: FormData) {
    const name = formData.get("name") as string;
    const telegram = formData.get("telegram") as string;
    const type = formData.get("type") as string;
    const wishes = formData.get("wishes") as string;

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.error("Telegram credentials not configured");
        return { success: false, message: "Server configuration error" };
    }

    const message = `
🆕 *Новая заявка с портфолио!*

👤 *Имя:* ${name}
📱 *Telegram:* ${telegram}
📋 *Тип проекта:* ${type}
💭 *Пожелания:* ${wishes || "Нет"}
    `.trim();

    try {
        const response = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: "Markdown",
                }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            console.error("Telegram API response error:", error);
            throw new Error("Failed to send message to Telegram");
        }

        return { success: true, message: "Message sent!" };
    } catch (error) {
        console.error("Error in sendToTelegram:", error);
        return { success: false, message: "Error sending message" };
    }
}

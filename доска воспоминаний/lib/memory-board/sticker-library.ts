export type StickerLibraryCategory = {
  key: string;
  name: string;
  icon: string;
  color: string;
};

export type StickerLibrarySticker = {
  name: string;
  emoji: string;
  color: string;
  categoryKey: string;
  imagePath: string;
};

const TWEMOJI_BASE_URL = "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72";
const VARIATION_SELECTOR_16 = 0xfe0f;

export const STICKER_LIBRARY_CATEGORIES: StickerLibraryCategory[] = [
  { key: "romance", name: "Сердца и банты", icon: "🎀", color: "#f3a6bf" },
  { key: "forest", name: "Лес и осень", icon: "🍂", color: "#b38a5a" },
  { key: "animals", name: "Зверята", icon: "🦌", color: "#d0b08a" },
  { key: "sky", name: "Звезды и ночь", icon: "🌙", color: "#9ea8c3" },
  { key: "retro", name: "Ретро вещи", icon: "📷", color: "#b59d7a" },
  { key: "cozy", name: "Уют и зима", icon: "🧸", color: "#cdb89a" },
];

const PRESET_STICKERS: Array<Omit<StickerLibrarySticker, "imagePath">> = [
  { name: "Бантик розовый", emoji: "🎀", color: "#f3a6bf", categoryKey: "romance" },
  { name: "Шелковая лента", emoji: "🎗️", color: "#f1b9cd", categoryKey: "romance" },
  { name: "Узелок", emoji: "🪢", color: "#d3b083", categoryKey: "romance" },
  { name: "Сердце классика", emoji: "❤️", color: "#da5b75", categoryKey: "romance" },
  { name: "Сердце розовое", emoji: "💗", color: "#ef7ea8", categoryKey: "romance" },
  { name: "Сердце блеск", emoji: "💖", color: "#f3a4c0", categoryKey: "romance" },
  { name: "Сердце с бантом", emoji: "💝", color: "#f6b2c7", categoryKey: "romance" },
  { name: "Сердце со стрелой", emoji: "💘", color: "#e87e99", categoryKey: "romance" },
  { name: "Сердце белое", emoji: "🤍", color: "#e9e2dc", categoryKey: "romance" },
  { name: "Сердце черное", emoji: "🖤", color: "#494949", categoryKey: "romance" },

  { name: "Кленовый лист", emoji: "🍁", color: "#ba7d45", categoryKey: "forest" },
  { name: "Осенний лист", emoji: "🍂", color: "#a5723f", categoryKey: "forest" },
  { name: "Желудь", emoji: "🌰", color: "#8d613c", categoryKey: "forest" },
  { name: "Веточка", emoji: "🌿", color: "#7d9158", categoryKey: "forest" },
  { name: "Листок", emoji: "🍃", color: "#8fa06a", categoryKey: "forest" },
  { name: "Колос", emoji: "🌾", color: "#b79d64", categoryKey: "forest" },
  { name: "Гриб", emoji: "🍄", color: "#bc8a58", categoryKey: "forest" },
  { name: "Ель", emoji: "🌲", color: "#5e7e4f", categoryKey: "forest" },
  { name: "Ромашка", emoji: "🌼", color: "#d4b172", categoryKey: "forest" },
  { name: "Клевер", emoji: "🍀", color: "#71935d", categoryKey: "forest" },
  { name: "Бревно", emoji: "🪵", color: "#9d7448", categoryKey: "forest" },
  { name: "Паутинка", emoji: "🕸️", color: "#9aa3ad", categoryKey: "forest" },
  { name: "Паучок", emoji: "🕷️", color: "#575757", categoryKey: "forest" },

  { name: "Кролик", emoji: "🐇", color: "#d9d5ce", categoryKey: "animals" },
  { name: "Зайка", emoji: "🐰", color: "#e6ddd4", categoryKey: "animals" },
  { name: "Котик", emoji: "🐈", color: "#c7b79d", categoryKey: "animals" },
  { name: "Черный кот", emoji: "🐈‍⬛", color: "#5a5a5a", categoryKey: "animals" },
  { name: "Кошачья мордочка", emoji: "🐱", color: "#d6b18b", categoryKey: "animals" },
  { name: "Олененок", emoji: "🦌", color: "#b89065", categoryKey: "animals" },
  { name: "Овечка", emoji: "🐑", color: "#e6e0d8", categoryKey: "animals" },
  { name: "Лисенок", emoji: "🦊", color: "#b97d4c", categoryKey: "animals" },
  { name: "Птичка", emoji: "🐦", color: "#8ea2b2", categoryKey: "animals" },
  { name: "Пчелка", emoji: "🐝", color: "#cfad61", categoryKey: "animals" },
  { name: "Бабочка", emoji: "🦋", color: "#9f96b2", categoryKey: "animals" },
  { name: "Улитка", emoji: "🐌", color: "#b99974", categoryKey: "animals" },
  { name: "Лягушка", emoji: "🐸", color: "#7d9b69", categoryKey: "animals" },
  { name: "Мышка", emoji: "🐭", color: "#b8b0aa", categoryKey: "animals" },
  { name: "Щенок", emoji: "🐶", color: "#cfb292", categoryKey: "animals" },
  { name: "Цыпленок", emoji: "🐥", color: "#dfc06f", categoryKey: "animals" },
  { name: "Енот", emoji: "🦝", color: "#7f7c80", categoryKey: "animals" },
  { name: "Бурундук", emoji: "🐿️", color: "#a9835b", categoryKey: "animals" },
  { name: "Сова", emoji: "🦉", color: "#9f805f", categoryKey: "animals" },

  { name: "Звезда", emoji: "⭐", color: "#d8bc70", categoryKey: "sky" },
  { name: "Звезда сияние", emoji: "🌟", color: "#e1c17a", categoryKey: "sky" },
  { name: "Искры", emoji: "✨", color: "#d6c48e", categoryKey: "sky" },
  { name: "Падающая звезда", emoji: "🌠", color: "#c7b8a2", categoryKey: "sky" },
  { name: "Полумесяц", emoji: "🌙", color: "#c8b58d", categoryKey: "sky" },
  { name: "Полная луна", emoji: "🌕", color: "#d6c69c", categoryKey: "sky" },
  { name: "Новолуние", emoji: "🌑", color: "#4f5054", categoryKey: "sky" },
  { name: "Облако", emoji: "☁️", color: "#c6ccd3", categoryKey: "sky" },
  { name: "Комета", emoji: "☄️", color: "#b9b6be", categoryKey: "sky" },
  { name: "Солнце", emoji: "☀️", color: "#d9b973", categoryKey: "sky" },

  { name: "Камера", emoji: "📷", color: "#8793a0", categoryKey: "retro" },
  { name: "Мгновенное фото", emoji: "📸", color: "#929ba4", categoryKey: "retro" },
  { name: "Кинопленка", emoji: "🎞️", color: "#a7a7a7", categoryKey: "retro" },
  { name: "Кассета", emoji: "📼", color: "#8f8581", categoryKey: "retro" },
  { name: "Письмо", emoji: "💌", color: "#c9a6a6", categoryKey: "retro" },
  { name: "Бумага", emoji: "📜", color: "#d0bb95", categoryKey: "retro" },
  { name: "Ножницы", emoji: "✂️", color: "#a7a09a", categoryKey: "retro" },
  { name: "Скрепка", emoji: "📎", color: "#9c9da0", categoryKey: "retro" },
  { name: "Булавка", emoji: "🧷", color: "#9e9aa0", categoryKey: "retro" },
  { name: "Бирка", emoji: "🏷️", color: "#c2a887", categoryKey: "retro" },
  { name: "Подарок", emoji: "🎁", color: "#bca47c", categoryKey: "retro" },
  { name: "Корзинка", emoji: "🧺", color: "#ad8f67", categoryKey: "retro" },
  { name: "Старинный ключ", emoji: "🗝️", color: "#a58f6b", categoryKey: "retro" },
  { name: "Книга", emoji: "📔", color: "#9d8f79", categoryKey: "retro" },
  { name: "Закладка", emoji: "🔖", color: "#b9a998", categoryKey: "retro" },

  { name: "Свеча", emoji: "🕯️", color: "#d1be98", categoryKey: "cozy" },
  { name: "Печенье", emoji: "🍪", color: "#bd8d5f", categoryKey: "cozy" },
  { name: "Чай", emoji: "🍵", color: "#b8ab8f", categoryKey: "cozy" },
  { name: "Кофе", emoji: "☕", color: "#9a866f", categoryKey: "cozy" },
  { name: "Плюшевый мишка", emoji: "🧸", color: "#b89a76", categoryKey: "cozy" },
  { name: "Клубок", emoji: "🧶", color: "#b89e8b", categoryKey: "cozy" },
  { name: "Шарф", emoji: "🧣", color: "#b09374", categoryKey: "cozy" },
  { name: "Носки", emoji: "🧦", color: "#9fa0a6", categoryKey: "cozy" },
  { name: "Варежки", emoji: "🧤", color: "#a99783", categoryKey: "cozy" },
  { name: "Елка", emoji: "🎄", color: "#6a865e", categoryKey: "cozy" },
  { name: "Снежинка", emoji: "❄️", color: "#bfd0dc", categoryKey: "cozy" },
  { name: "Леденец", emoji: "🍭", color: "#c9a2ad", categoryKey: "cozy" },
];

export function emojiToTwemojiUrl(emoji: string) {
  const codes = Array.from(emoji.trim())
    .map((symbol) => symbol.codePointAt(0))
    .filter((codePoint): codePoint is number => codePoint !== undefined && codePoint !== VARIATION_SELECTOR_16)
    .map((codePoint) => codePoint.toString(16));

  return `${TWEMOJI_BASE_URL}/${codes.join("-")}.png`;
}

export const STICKER_LIBRARY_STICKERS: StickerLibrarySticker[] = PRESET_STICKERS.map((sticker) => ({
  ...sticker,
  imagePath: emojiToTwemojiUrl(sticker.emoji),
}));

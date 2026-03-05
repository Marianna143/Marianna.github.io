# Доска воспоминаний

Автономный Next.js-проект внутри папки `доска воспоминаний`.

## URL внутри проекта

- Скрытый маршрут: `/dnewnik-cork-7g4m`
- Авторизация: `/dnewnik-cork-7g4m/auth`
- Export render: `/dnewnik-cork-7g4m/export-render`

## Что уже реализовано

- Личный кабинет (Supabase Auth) и защита route через middleware.
- Пробковая стена с палароидами, рукописной датой и гирляндой.
- Загрузка фото с EXIF-датой + ручная правка даты.
- Фотобудка (несколько фото в одном дне).
- Глобальные стикеры и кассеты (аудио upload).
- Drag & drop с сохранением позиции.
- Экспорт в PNG + PDF через API.

## API

- `GET /api/memory/state`
- `POST /api/photos/upload`
- `POST /api/audio/upload`
- `POST /api/day-entry/upsert`
- `POST /api/layout/save`
- `POST /api/sticker-categories/create`
- `POST /api/stickers/create`
- `POST /api/cassettes/upsert`
- `POST /api/export/year`
- `GET /api/export/:id`

## Supabase

SQL схема + RLS + buckets:

- `supabase/schema.sql`

ENV-переменные:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Локальный запуск

```bash
cd "доска воспоминаний"
npm install
npm run dev
```

## Сборка

```bash
npm run build
```

Примечание: в этой папке используется `next build --webpack`, потому что Turbopack в текущей версии может падать на unicode-пути.

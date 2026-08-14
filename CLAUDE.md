# UKOM Ners CBT

## Stack
- Next.js 16 (App Router), TypeScript, Tailwind CSS
- Lucide React icons
- LocalStorage for persistence (no backend)

## Commands
```bash
npm install    # Install dependencies
npm run dev    # Start dev server (http://localhost:3000)
npm run build  # Production build
```

## Bank Soal
- 260 soal di `lib/questions.ts` (7 domain kompetensi)
- Growable: tambah soal baru di `QuestionsDB`

## Arsitektur
- `app/` — pages (landing, quiz, result, review)
- `components/` — UI components (ui/, quiz/, result/)
- `lib/` — data, types, utils, store

## Passing Grade
- Default: 60%
- Konfigurasi: `lib/constants.ts` → `PASSING_GRADE`

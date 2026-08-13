# UKOM Ners CBT — Specification

## 1. Concept & Vision

Aplikasi CBT (Computer Based Test) untuk persiapan UKOM Profesi Ners Indonesia. Tampilan bersih, fokus pada reading — nggak ada distraksi visual. Nuansa profesional medis: tenang, terstruktur, trustworthy. Mahasiswa membuka aplikasi ini dan langsung merasa "ini serius, ini persiapan". Fokus pada 3 hal: **kerjakan soal → lihat skor → pelajari jawaban**.

## 2. Design Language

### Aesthetic Direction
Clinical minimalism — terinspirasi dari antarmuka aplikasi kesehatan modern (Halodoc, Alodokter). Spacious, readable, calming. Nggak crowded, nggak flashy.

### Color Palette
```
Primary:       #0F766E  (teal-700, medis/profesional)
Secondary:     #134E4A  (teal-900, deep accent)
Background:    #FAFAF9  (stone-50, warm off-white)
Surface:       #FFFFFF  (card background)
Text Primary:  #1C1917  (stone-900)
Text Secondary:#78716C  (stone-500)
Success:      #16A34A  (green-600)
Error:        #DC2626  (red-600)
Warning:      #D97706  (amber-600)
Border:       #E7E5E4  (stone-200)
```

### Typography
- **Heading**: Inter (weight 600-700)
- **Body**: Inter (weight 400-500)
- **Mono (kode/timer)**: JetBrains Mono
- Scale: 14px base, 1.25 ratio

### Spatial System
- Base unit: 4px
- Component padding: 16px / 24px
- Section spacing: 32px / 48px
- Border radius: 8px (cards), 6px (buttons/inputs)
- Max content width: 800px (centered)

### Motion Philosophy
- Subtle fade transitions (150ms ease-out) untuk page transitions
- Micro-interactions pada tombol (scale 0.98 on press)
- Progress bar animasi smooth
- Nggak ada animasi berlebihan — fokus tetap pada konten

### Visual Assets
- Lucide React icons (outline style, stroke 1.5)
- Nggak ada ilustrasi dekoratif
- Visual hanya: ikon fungsional, progress indicators, check/x marks

## 3. Layout & Structure

### Page Flow (3 layar utama)

```
[Layar 1] Landing/Setup
  ↓ pilih topik + jumlah soal
[Layar 2] Quiz
  ↓ selesai / submit
[Layar 3] Result + Review
```

### Landing Page
- Header: logo text + tagline
- Hero section: judul + deskripsi singkat UKOM
- Setup card: pilih topik (dropdown) + jumlah soal (slider/input) + tombol "Mulai"
- Info card kecil: jumlah soal tersedia, estimasi waktu
- Footer minimal

### Quiz Page
- Sticky header: topik, nomor soal sekarang / total, timer countdown
- Progress bar di bawah header
- Soal card: nomor, teks soal, opsi jawaban (A-E)
- Navigasi bawah: tombol Previous / Next / Submit
- Sidebar (desktop): mini-map nomor soal (answered/unanswered/flagged)

### Result Page
- Score hero: besar, centered (contoh: "78/100")
- Breakdown card: skor per topik (kalau multi-topik)
- Pass/fail indicator dengan warna
- Tombol "Review Jawaban"
- Tombol "Mulai Ulang"

### Review Page
- Setiap soal: teks soal + opsi jawaban
- Jawaban benar: highlight hijau + checkmark
- Jawaban user benar: highlight hijau + checkmark
- Jawaban user salah: highlight merah + X + highlight hijau di opsi benar
- Jawaban user belum dijawab: highlight kuning + teks "Tidak dijawab"
- Navigasi: Previous / Next soal
- Filter: Semua / Yang salah saja / Yang belum dijawab

### Responsive Strategy
- Mobile-first
- Quiz page: sidebar hilang di mobile, nomor soal di header saja
- Min-width: 375px
- Breakpoint utama: 768px (tablet/desktop)

## 4. Features & Interactions

### Quiz Engine
- Pilih topik → pilih jumlah soal (1-50, default 10)
- Soal di-random dari bank soal per topik
- Navigasi bebas: bisa lompat-lompat antar soal
- Flag/mark soal untuk review
- Konfirmasi submit saat navigasi ke soal terakhir atau klik Submit
- Auto-submit kalau timer habis
- **Nggak bisa submit kalau belum ada jawaban** (wajib konfirmasi)

### Scoring
- 1 soal = 1 poin
- Skor total = jumlah benar / total soal × 100
- Passing grade: **60%** (konfigurasi di constants)
- Display: skor angka + persentase + status LULUS/LIDAK LULUS

### Review Mode
- Bisa filter: Semua / Salah saja / Belum dijawab
- Setiap soal show: soal lengkap, semua opsi, benar salah per opsi
- Navigasi antar soal (Previous/Next)
- Badge menunjukkan "Soal ke-N dari M"

### Timer
- Countdown MM:SS
- Posisi: header kanan
- Warning state: kuning saat < 5 menit
- Critical state: merah + pulse saat < 1 menit
- Pause nggak ada (CBT模拟真实考场)

### Local Storage
- Quiz state: currentQuestionIndex, answers, flaggedQuestions, timeRemaining
- History: simpan hasil quiz terakhir (skor, tanggal, topik)
- Nggak ada auth, nggak ada backend

### Edge Cases
- Refresh halaman: restore state dari localStorage
- localStorage kosong: redirect ke landing
- Semua soal di-flag: boleh submit
- 0 jawaban: harus konfirmasi "Yakin submit kosong?"

## 5. Component Inventory

### Button
- Variants: primary (teal fill), secondary (outline), ghost, danger
- States: default, hover (darken 5%), active (scale 0.98), disabled (opacity 50%)
- Sizes: sm (h-8), md (h-10), lg (h-12)

### Card
- Background white, border stone-200, shadow-sm, rounded-lg
- Padding: 24px

### QuestionCard
- Nomor badge (teal bg, white text, rounded)
- Pertanyaan text (text-lg, font-medium)
- Opsi list: stacked vertically, gap-3
- Opsi item: border rounded-md, padding p-4, cursor-pointer
- Opsi selected: teal border + teal bg-light
- Opsi correct (review): green border + green bg-light + check icon
- Opsi wrong (review): red border + red bg-light + x icon

### ProgressBar
- Height: 4px, bg stone-200, fill teal-600
- Rounded-full, animated width transition

### Timer
- Font: JetBrains Mono
- Normal: text-secondary
- Warning (< 5min): text-amber-600
- Critical (< 1min): text-red-600, pulse animation

### Badge
- Topic badge: small rounded pill, teal bg-light
- Score badge: large rounded, color based on pass/fail

### NavButton (Prev/Next)
- Minimal ghost style
- Disabled state kalau di batas

### MiniMap (desktop sidebar)
- Grid 5-column dari nomor soal
- Dot per soal: gray=unanswered, teal=answered, amber=flagged, green=correct(review), red=wrong(review)

## 6. Technical Approach

### Stack
- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** (utility-first, custom theme)
- **Lucide React** (icons)
- **LocalStorage** (persistence)
- **TanStack Router** atau Next.js built-in routing

### File Structure
```
app/
  layout.tsx          (root layout, fonts, metadata)
  page.tsx            (landing/setup)
  quiz/page.tsx       (quiz engine)
  result/page.tsx     (score display)
  review/page.tsx     (answer review)
  globals.css         (Tailwind + custom CSS)
components/
  ui/                 (Button, Card, Badge, etc.)
  quiz/               (QuestionCard, OptionItem, Timer, ProgressBar, MiniMap)
  result/             (ScoreDisplay, TopicBreakdown)
lib/
  questions.ts        (bank soal + types)
  utils.ts            (shuffle, calculate score, etc.)
  store.ts            (localStorage helpers)
  constants.ts        (passingGrade, topic definitions)
```

### Data Model
```typescript
type Topic = {
  id: string
  name: string
  description: string
}

type Question = {
  id: string
  topicId: string
  question: string
  options: {
    A: string
    B: string
    C: string
    D: string
    E: string
  }
  correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E'
  explanation?: string
}

type QuizState = {
  topicId: string
  questionIds: string[]        // randomized subset
  answers: Record<string, 'A' | 'B' | 'C' | 'D' | 'E'>
  flaggedQuestions: string[]
  currentIndex: number
  startedAt: number
  timeRemaining: number         // seconds
}

type QuizResult = {
  topicId: string
  totalQuestions: number
  correctCount: number
  score: number
  passed: boolean
  answers: Record<string, 'A' | 'B' | 'C' | 'D' | 'E'>
  completedAt: string
}
```

### Routing
```
/                    → Landing (setup)
/quiz?topic=&count=  → Quiz (params from setup)
/result              → Result (read from store)
/review?filter=      → Review (params: all | wrong | unanswered)
```

## 7. Bank Soal — Domain Kompetensi UKOM Ners

### Domain yang Diujikan (8 Area)

1. **Etika Keperawatan & Hukum** — Etika kodeks PPNI, hukum kesehatan, informed consent, malpractice
2. **Asuhan Keperawatan Dasar** — Vital signs, hygiene, mobilization, nutrition, elimination, sleep/rest
3. **Keperawatan Medikal Bedah** — Sistem kardiovaskuler, respirasi, neurologi, gastrointestinal, muskuloskeletal, onkologi
4. **Keperawatan Maternitas** — Asuhan persalinan, postpartum, keluarga berencana, komplikasi obstetric
5. **Keperawatan Anak** — Tumbuh kembang, IMCI, neonatal care, penyakit anak
6. **Keperawatan Jiwa** — Gangguan jiwa, therapeutic communication, intervensi krisis, farmakologi psikiatri
7. **Keperawatan Gawat Darurat & kritis** — triage, BLS/ACLS, trauma, shock, disaster management
8. **Keperawatan Komunitas** — Promosi kesehatan, pencegahan penyakit, epidemiology, keluarga

### Jumlah Soal per Domain (Target Bank Awal)
Minimal **15 soal per domain** = **120 soal total** untuk fase awal.
Sifat bank soal: growable (data-driven, tinggal tambah di `questions.ts`).

### Format Setiap Soal
```
- ID unik
- Topic ID (link ke domain)
- Teks soal (case study atau direct question)
- 5 opsi (A-E)
- Jawaban benar (satu saja)
- Penjelasan singkat (untuk review) — opsional
```

### Catatan Soal
- Sesuaikan dengan standar kompetensi AIPNI/PPNI Indonesia
- Nomenklatur: gunakan istilah Indonesia yang lazim di UKOM
- Case study menggunakan skenario KJK (Keperawatan Jiwa, dll)
- Hindari soal yang ambiguous — setiap soal harus punya 1 jawaban jelas

## 8. Prioritas Implementasi

### Fase 1 — Core (Wajib)
- Landing page dengan setup
- Quiz engine (render soal, pilih jawaban, navigasi, timer)
- Scoring + result page
- Review page
- LocalStorage persistence
- Bank soal 120 soal (15 per domain)

### Fase 2 — Enhancement
- Sidebar mini-map (desktop)
- Filter review (salah / belum dijawab)
- Flag soal
- Progress tracking (history di localStorage)

### Fase 3 — Polish
- Animasi & micro-interactions
- Responsive refinement
- Sound feedback (optional toggle)
- Export hasil (PDF/cetak)

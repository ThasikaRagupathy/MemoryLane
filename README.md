# MemoryLane — A Living Digital Journal

> *Some moments deserve more than a camera roll.*

MemoryLane turns everyday moments into a personal, visual archive. Instead of presenting memories as a plain grid of files or an engagement-driven social feed, it gives them context through dates, moods, handwritten notes, photographs, and gentle rituals of rediscovery.

The experience is designed to feel like opening a beautifully kept journal or an independent photography magazine: warm, intimate, tactile, and unhurried.

---

## Key Features

- **Home ("A life, in little moments")**: Warm greeting, reflective editorial hero, quick memory capture, and live "On This Day" time capsule.
- **On This Day Rediscovery**: Automatically surfaces moments saved on the same calendar day in previous years with leap-year handling and carousel controls.
- **Chronological Timeline ("The story so far")**: Grouped by Year and Month with vertical date spines, real-time search across titles, places, notes, and tags, multi-filter chips, and sorting toggles.
- **Interactive Scrapbook ("Pieces of a day")**: Freeform canvas with draggable polaroid photo prints, sticky notes (in *paper*, *sage*, *butter*, and *terracotta* tones), and pinned memory cards. Complete with rotation controls, layering (*Bring Forward* / *Send Backward*), and keyboard arrow-key navigation.
- **Calendar & Annual Rhythm**: Interactive 7-day monthly calendar paired with a 52-week activity heatmap displaying memory density with accessible tooltips and date-specific memory inspection.
- **Mood & Custom Collections**: 8 default emotional archives (*Joyful*, *Peaceful*, *Grateful*, *Nostalgic*, *Excited*, *Melancholy*, *Loved*, *Reflective*) alongside customizable personal collections (*e.g., "Little adventures", "Quiet Sundays"*).
- **Memory Detail Stories**: Editorial reading experience with large serif typography, photo lightbox with keyboard navigation, full metadata, and adjacent memory navigation.
- **Client-Side Image Optimization**: Automatically resizes and compresses user-uploaded images via HTML5 Canvas before saving, protecting browser localStorage limits.
- **Data Portability**: Full JSON export and schema-validated import (offering both *Merge* and *Replace* modes), plus a 1-click demo data reset.

---

## Design System & Art Direction

MemoryLane is built upon an analog, literary design aesthetic:

- **Warm Cream Palette**:
  - `paper`: `#F7F3EB` (Main background)
  - `paper-deep`: `#EEE7DB` (Secondary surfaces)
  - `ink`: `#292821` (Primary typography)
  - `ink-muted`: `#777267` (Metadata and supporting text)
  - `line`: `#DDD5C8` (Subtle borders)
  - `olive`: `#777B5B` (Primary actions & selected states)
  - `terracotta`: `#B86F54` (Warm accent, favorites, alerts)
  - `butter`: `#E5D49A` (Warm highlight tone)
  - `sage`: `#DDE2D2` (Soft secondary surface)
- **Typography**: Cormorant Garamond / Lora (editorial serif headlines), DM Sans / Inter (neutral legible UI body), and Caveat (handwritten note accents).
- **Restrained Motion**: Subtle Framer Motion transitions designed to support emotional orientation without delaying interaction, fully responsive to `prefers-reduced-motion` settings.

---

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server & Client Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing, comprehensive data models)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom editorial tokens and typography)
- **Motion & Interactions**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Storage**: Browser LocalStorage (`memorylane:data:v1`) with hydration guards and quota protection

---

## Getting Started

### Prerequisites

- Node.js 18.17+ or later
- npm or pnpm

### Installation

1. Clone or open the repository:
   ```bash
   cd MemoryLane
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

---

## Browser Storage & Privacy

- **100% Private to your Device**: MemoryLane stores all data directly in your browser's `localStorage`. No accounts, no cookies, and no cloud uploads.
- **Storage Quota & Image Downscaling**: Raw photos can easily exceed typical 5MB-10MB browser storage limits. MemoryLane automatically compresses photos client-side to lightweight WebP/JPEG data URLs (typically 40KB - 90KB), enabling dozens of memories to be stored safely.
- **Backups**: Clearing your browser cache or site data will erase local data. Use the built-in **Export JSON** feature in **Settings** to save an offline backup anytime.

---

## Accessibility & Responsiveness

- **Keyboard Accessible**: Modals trap focus and close on `Escape`. Scrapbook items can be selected and nudged with keyboard arrow keys (`Shift + Arrow` for larger movements).
- **Reduced Motion**: Respects the OS-level `prefers-reduced-motion` setting as well as an in-app toggle in Settings.
- **Touch-Friendly**: Tested across desktop (sidebar layout), tablet (flexible columns), and mobile viewports (compact header, bottom navigation bar, and accessible touch targets).
- **Accessible Color Cues**: Heatmap cells and mood tags communicate intensity and status via text labels and counts, never by color alone.

---

## Project Structure

```text
MemoryLane/
├── app/
│   ├── calendar/
│   │   └── page.tsx              # Monthly calendar & Annual rhythm heatmap
│   ├── collections/
│   │   ├── [slug]/page.tsx       # Collection detail & memory view
│   │   └── page.tsx              # Mood archives & custom collections index
│   ├── memories/
│   │   └── [id]/page.tsx         # Memory detail story view & edit
│   ├── scrapbook/
│   │   └── page.tsx              # Freeform collage board
│   ├── settings/
│   │   └── page.tsx              # Preferences, storage inspector, export/import
│   ├── timeline/
│   │   └── page.tsx              # Chronological stream with filters & search
│   ├── globals.css               # Editorial color tokens & base styles
│   ├── layout.tsx                # Font loading, metadata & AppShell wrapper
│   └── page.tsx                  # Home: Hero, "On This Day", Recent moments
├── components/
│   ├── calendar/
│   │   ├── MemoryHeatmap.tsx     # 52-week activity heatmap with tooltips
│   │   └── MonthCalendar.tsx     # 7-day grid with date inspector
│   ├── collections/
│   │   ├── CollectionCard.tsx    # Curated collection card
│   │   └── CollectionGrid.tsx    # Collections overview & creator
│   ├── layout/
│   │   ├── AppShell.tsx          # Shell wrapper & modal provider
│   │   ├── MobileNavigation.tsx  # Mobile top and bottom nav
│   │   ├── PageHeader.tsx        # Serif header with actions
│   │   └── Sidebar.tsx           # Desktop left sidebar
│   ├── memory/
│   │   ├── MemoryCard.tsx        # Polaroid-framed memory card
│   │   ├── MemoryDetail.tsx      # Editorial story presentation
│   │   ├── MemoryFilters.tsx     # Search, mood, and tag filters
│   │   ├── MemoryForm.tsx        # Add/Edit form with photo compression
│   │   ├── MemoryGrid.tsx        # Responsive memory layout
│   │   ├── MemoryTimeline.tsx    # Grouped Year/Month chronological spine
│   │   ├── MoodBadge.tsx         # Understated mood badges
│   │   ├── OnThisDayCard.tsx     # Prior-year memory matching feature
│   │   └── PhotoGallery.tsx      # Gallery and photo lightbox
│   ├── scrapbook/
│   │   ├── ScrapbookCanvas.tsx   # Movable canvas with pointer & touch drag
│   │   └── ScrapbookItem.tsx     # Photo, handwritten note, and memory pins
│   └── ui/
│       ├── Button.tsx            # Styled buttons (primary, secondary, etc.)
│       ├── ConfirmDialog.tsx     # Destructive action confirmations
│       ├── Dialog.tsx            # Accessible modal dialog
│       ├── EmptyState.tsx        # Editorial empty states with CTAs
│       ├── Skeleton.tsx          # Loading placeholders
│       └── Toast.tsx             # Floating notification system
├── hooks/
│   ├── useMemoryLane.tsx         # Main context provider & storage sync
│   └── useReducedMotionPreference.ts # Accessibility motion hook
├── lib/
│   ├── constants.ts              # Mood metadata, descriptions, color tokens
│   ├── date-utils.ts             # Local date parsing & "On This Day" logic
│   ├── image-utils.ts            # Canvas downscaling & storage quota estimator
│   ├── memory-utils.ts           # Search, multi-filtering & Year/Month grouping
│   ├── sample-data.ts            # Curated fictional demo memories & boards
│   ├── schema.ts                 # Runtime validation for import JSON
│   └── storage.ts                # Typed LocalStorage persistence layer
├── types/
│   └── memory.ts                 # Core TypeScript interfaces
├── tailwind.config.js
└── tsconfig.json
```

---

## Future Roadmap

- **IndexedDB Binary Storage**: Support storing original high-resolution RAW/PNG photographs in browser IndexedDB while keeping metadata in LocalStorage.
- **Encrypted Local Backups**: Add client-side AES-GCM password encryption for exported JSON files.
- **Audio & Voice Notes**: Support small audio recordings preserved alongside journal entries.
- **Printable Journal PDF Export**: Render scrapbook boards and memory stories into print-ready PDF book spreads.

---

*Keep the moments that make a life.*

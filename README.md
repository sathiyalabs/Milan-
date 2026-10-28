# Milan ’26 — SRMIST Cultural Festival Website
### Student Technical Selection Task · Track B: Frontend Development
#### Directorate of Student Affairs (DSA) | SRM Institute of Science and Technology, Kattankulathur

---

## 1. Project Overview & Scope

This project is a responsive, accessible, frontend-only web application built for the **SRMIST DSA Tech Team Practical Selection Assignment (Track B — Frontend Development)**.

The interface presents the **“Milan After Dark”** visual identity, combining a near-black stage canvas (`#09080D`), deep plum structural surfaces (`#17101E`), and electric festival accents (magenta `#EC4899`, cyan `#06B6D4`, violet `#8B5CF6`, and lime `#84CC16`) with modern display typography (*Outfit*) and restrained Indian geometric jali motifs.

### Architecture Highlights:
- **Purely Frontend-Only**: No backend, database, authentication provider, payment gateway, or API keys. State resides strictly in client-side React memory.
- **Shared Filtering & Validation Utilities**:
  - `src/utils/filtering.ts`: Houses `filterFestivalEvents` used identically by `EventsListing.tsx` and automated tests.
  - `src/utils/validation.ts`: Houses `validateRegistrationField`, `validateRegistrationForm`, `normalisePhoneNumber`, and `generateSamplePaymentReference` used by both `RegistrationForm.tsx` and automated tests without duplicate code.
- **Honest Non-Official Scope**: Transparently documented as a student assessment prototype. Does not claim official fest dates or official ticket-issuance authority.
- **Simulated Demo Payment Reference**: Events with a sample fee (`feeAmount > 0`, e.g. *Vogue Milan* at ₹150) require a fictional payment reference formatted as `DEMO-MILAN-XXXXXXXX`. Free events (`feeAmount === 0`) bypass this requirement. Fictional references are accepted to demonstrate form validation and are **never processed or verified**.
- **Accessible Motion & Purposeful Micro-Interactions**:
  - Hero staggered entrance keyframes (`animate-hero-1` to `animate-hero-4`).
  - Viewport-aware scroll reveals (`RevealOnScroll`) with bounded delay.
  - Interactive SVG stage motion graphic equipped with a pause/resume control toggle.
  - Full support for `prefers-reduced-motion` in all programmatic scrolling and CSS animations.
  - WAI-ARIA modal dialog compliance with focus trapping, Escape dismiss, and keyboard-navigable mobile drawer with focus restoration.

---

## 2. Track B Evaluation Rubric Mapping (100 Points)

| Assessment Criterion | Weight | How This Implementation Satisfies the Requirement | Status |
| :--- | :---: | :--- | :---: |
| **Required functionality & interactions** | **25 pts** | • Homepage featuring brand header, editorial hero with stage lighting, artistic pillars, and 3 featured flagship showcases.<br>• Events directory with 8 detailed competitions spanning Dance, Music, Drama, Fashion, Fine Arts, and Literary & Media.<br>• Combined real-time keyword search and category filtering working together.<br>• Accessible event details modal with focus trapping, Escape dismiss, and focus restoration.<br>• Complete registration flow with client validation, pending state, and generated demo pass. | **PASS** |
| **Interface quality & implementation** | **20 pts** | • "Milan After Dark" identity with near-black canvas (`#09080D`), deep plum surfaces (`#17101E`), off-white typography, and vivid accents.<br>• Two-family typography: *Outfit* (font-black) for contemporary display festival headlines and *Plus Jakarta Sans* for readable body text.<br>• Zero-pill discipline: unboxed metadata with typographic dot separators.<br>• Authentic coordinator-supplied transparent Milan emblem (`/assets/milan-emblem.png`) paired with separately styled `MILAN ’26` text without distorting aspect ratio or placing white tiles behind it. | **PASS** |
| **Responsive design** | **15 pts** | • Verified across 320px, 360px, 390px, 768px, 1024px, and 1440px desktop baselines.<br>• Accessible mobile navigation drawer with touch targets $\ge 44\text{px}$.<br>• Horizontal single-line category filter tabs with smooth scrolling.<br>• Flexible card grids with zero horizontal layout overflow. | **PASS** |
| **Code structure & maintainability** | **15 pts** | • Strict TypeScript (`"strict": true` in `tsconfig.json`) with zero compiler warnings.<br>• Shared utilities in `src/utils/filtering.ts` and `src/utils/validation.ts` preventing test duplication.<br>• Unused packages removed.<br>• Safe rendering of user text inputs without unsanitized HTML injections. | **PASS** |
| **Data handling & API integration** | **10 pts** | • Event dataset isolated in `src/data/events.ts`.<br>• Explicit `feeAmount: number` modeled on each event.<br>• Free events vs. paid event (*Vogue Milan* with sample fee of ₹150) modeled with full consistency.<br>• Pure in-memory client state without external backend dependencies. | **PASS** |
| **Form validation & error states** | **10 pts** | • Preserves user's entered team size when switching events and revalidates bounds without silent clamping.<br>• Normalizes phone whitespace and hyphens (`normalisePhoneNumber`).<br>• Rejects non-integer/fractional team sizes via `Number.isInteger`.<br>• Auto-focuses the first invalid input on submit failure.<br>• Frozen validated submission snapshot prevents discrepancy during pending state.<br>• Unmount cleanup removes timers to prevent memory leaks.<br>• Demo payment reference validated against `^DEMO-MILAN-[A-Z0-9]{8}$` with "Use sample reference" convenience button.<br>• Generated pass ID created using full `crypto.randomUUID()` (`DEMO-PASS-...`) and distinctly labeled `DEMO — NOT VALID FOR ENTRY`. | **PASS** |
| **Testing, README & explanation** | **5 pts** | • Automated test suite in `tests/run_tests.ts` running via `npm test` verifying 5 distinct test suites.<br>• Complete local installation, build, and Vercel deployment documentation. | **PASS** |

---

## 3. Technology Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) with `"strict": true`
- **Build Tool**: [Vite 8](https://vitejs.dev/) with `@vitejs/plugin-react`
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Icons**: [Lucide React](https://lucide.dev/) (purposeful interactive affordances)
- **Typography**: Google Fonts (*Outfit*, *Plus Jakarta Sans*, *Space Mono*)
- **Test Runner**: Node.js test assertions via `tsx`

---

## 4. Local Installation & Run Instructions

### Prerequisites
- Node.js version 18.0 or higher
- npm version 9.0 or higher

### Steps to Run Locally

1. **Clone or navigate to the repository directory**:
   ```bash
   cd milan-cultural-fest
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.

4. **Run TypeScript typecheck**:
   ```bash
   npm run lint
   ```

5. **Run the automated verification test suite**:
   ```bash
   npm test
   ```
   Executes `tests/run_tests.ts` testing data integrity, search & filtering, form validation rules, bounds checks, phone normalization, team size preservation, and pass generation using the exact shared application utilities.

6. **Create a production build**:
   ```bash
   npm run build
   ```
   Compiled assets are generated in `dist/`.

7. **Preview production build**:
   ```bash
   npm run preview
   ```

---

## 5. Deployment Instructions (Vercel)

This application is a static Vite Single Page Application and deploys to Vercel without server configuration:

1. Push this repository to GitHub or GitLab.
2. In the [Vercel Dashboard](https://vercel.com/dashboard), click **"Add New"** > **"Project"**.
3. Import your repository.
4. Framework preset automatically detects:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. No environment variables are required. Click **"Deploy"**.

---

## 6. Authentic Assets & Attribution

| Asset File | Usage in Project | Source & Attribution |
| :--- | :--- | :--- |
| `public/assets/milan-emblem.png` | Navbar, Hero & Footer Brand Emblem | Coordinator-supplied official Milan transparent prism insignia. Paired with separate `MILAN ’26` text. |
| `public/assets/aistudio/image_e1297c07.png` | Hero Historical Archive Strip | Coordinator-supplied reference posters from previous editions (Anishma Anil Kumar, DJ Viola, Office Gaana). Presented as historical highlights, not scheduled performers for this demo. |
| `public/assets/aistudio/image_1d1cc9f6.png` | Archive Reference Graphic | Reference banner featuring `#LiveTheChange` motto. |

*Note: Stock or AI-generated portraits are never labeled as real Milan performers.*

---

## 7. Simulated Demo Payment Reference Details

- The registration flow introduces a **Demo payment reference** field that activates **only** when an event has a fee (`feeAmount > 0`, such as the sample event *Vogue Milan*).
- **Format**: `DEMO-MILAN-XXXXXXXX` (8 uppercase alphanumeric characters).
- Evaluators can click **"Use sample reference"** to automatically populate a valid fictional reference.
- **Safety & Simulation Notice**:
  - No real payment is ever requested, verified, or processed.
  - The application never asks for credit card details, CVV, OTP, bank login, or UPI addresses.
  - A syntactically valid demo reference is accepted solely to demonstrate form validation and state transitions.
  - The confirmation pass is explicitly marked:
    > *"DEMO — NOT VALID FOR ENTRY"*
    > *"Demo reference accepted — payment not verified."*
  - The user-entered demo payment reference is kept strictly distinct from the generated pass ID, which is created using `crypto.randomUUID()`.

---

## 8. Verification Results

| Verification Check | Exact Command | Actual Result | Status |
| :--- | :--- | :--- | :---: |
| **Unit & Logic Tests** | `npm test` | All 5 test suites passed cleanly with 0 assertion failures testing shared utilities (`filterFestivalEvents`, `validateRegistrationField`, `validateRegistrationForm`, `normalisePhoneNumber`, `crypto.randomUUID`). | **PASS** |
| **TypeScript Strict Check** | `npm run lint` (`tsc --noEmit`) | 0 type errors under `"strict": true`. | **PASS** |
| **Production Build** | `npm run build` (`vite build`) | Successfully compiled with output bundle in `dist/`. | **PASS** |
| **Reduced-Motion Support** | Programmatic test in `App.tsx` & `RegistrationForm.tsx` | All scrolls evaluate `prefers-reduced-motion` and switch between `'smooth'` and `'auto'`. CSS transitions clamped to 0.01ms under media query. Stage motion graphic has user pause toggle. | **PASS** |
| **Responsive Viewports** | Tested at 320px, 360px, 390px, 768px, 1440px | Layout verified: touch targets $\ge 44\text{px}$, single-line category filter bar with horizontal scroll, no horizontal body overflow. | **PASS** |

---

## 9. Assumptions & Known Limitations

- **In-Memory Client State**: Entered registrations reside in component state during the active session. Because no database is connected, refreshing the page resets the state.
- **Fictional Event Data**: All event dates, student coordinators, and campus venue allocations are fictional sample data created specifically for the selection task.
- **Non-Official Project**: This website is an engineering candidate demonstration and does not claim official communications or commitments from SRMIST or the Directorate of Student Affairs.

---
*Developed for the Directorate of Student Affairs (DSA) Tech Team Selection Assignment — SRMIST Kattankulathur.*

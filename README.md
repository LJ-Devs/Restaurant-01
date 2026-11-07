# Restaurant & café website template (Portugal)

A fast, bilingual (Portuguese/English) website for small restaurants and cafés in Portugal.
You set up a new client by **editing one file, replacing the photos and publishing**.

It comes with a **fictional** demo client, **Tasca do Largo**, a traditional restaurant in Coimbra
(azulejo blue, terracotta, Fraunces font).

What every site includes:

- Home page: photo header, optional **dish/menu of the day**, story, featured dishes, reviews, opening hours with an **"Aberto agora / Fechado agora"** badge (Lisbon time), map, contacts.
- Menu page with prices (`12,50 €`), portions (meia dose / dose), VAT and allergen notes, and a **print-friendly** version.
- Privacy policy page, a "page not found" page.
- European Portuguese at `/`, English at `/en/`. The language button keeps the visitor on the same page.
- "Reservar mesa" button (always visible, also on phones) that opens WhatsApp with a ready-made message, and a "Ligar / WhatsApp" bar on phones.
- Footer with legal name, NIF, Livro de Reclamações Eletrónico link and privacy policy.
- Google-friendly: structured data (`Restaurant`), sitemap, robots.txt, share images for WhatsApp/Facebook.
- **No cookies, no trackers, no Google Fonts**: no cookie banner needed. The Google map only loads if the visitor clicks it.
- Very fast: Lighthouse mobile scores of 97–100 (performance) and 100 (accessibility, best practices, SEO) in our tests.

---

## 1. What you need (one time)

1. **Node.js 24 or 26 (LTS)**: download the LTS version from <https://nodejs.org> and install it.
2. **Visual Studio Code**: <https://code.visualstudio.com>. When you open this folder, accept the suggestion to install the **Astro** extension.
3. Accounts on **GitHub** and **Vercel** (only needed to publish; see section 9 about Vercel's plans).

## 2. Run the site on your computer

Open a terminal in this folder (in VS Code: *Terminal → New Terminal*) and type:

```bash
npm install      # only the first time: downloads the tools (1–2 minutes)
npm run dev      # starts the site
```

Open <http://localhost:4321> in your browser. When you save a file, the page updates by itself.
Press `Ctrl + C` in the terminal to stop.

Other commands:

| Command | What it does |
| --- | --- |
| `npm run build` | Checks everything and creates the final site in the `dist/` folder. **Always run this before publishing.** |
| `npm run preview` | Shows the final site from `dist/`, exactly as it will be online. |

## 3. Where things are

```
src/
├── config/
│   ├── site.config.ts            ← THE CLIENT FILE: all texts, menu, hours, colours… (edit this)
│   ├── fonts.ts                  ← list of fonts you can use
│   ├── types.ts                  ← describes every field (do not edit)
│   ├── validate.ts               ← checks the config when you build (do not edit)
│   └── index.ts                  ← chooses which config is used
├── assets/
│   ├── images/<client id>/       ← THE CLIENT'S PHOTOS
│   └── fonts/                    ← font files (self-hosted)
├── i18n/pt.ts, en.ts             ← interface texts: buttons, labels, notes (same for all clients)
├── legal/privacy.pt.md, .en.md   ← privacy policy text
├── components/, layouts/, pages/ ← the design and pages (only for design changes)
├── scripts/main.ts               ← the little JavaScript of the site
└── styles/global.css             ← global styles (Tailwind CSS)
vercel.json                       ← Vercel settings: build command, security headers, cache
```

## 4. Create a site for a new client (about 45 minutes)

Collect the information first with **[CLIENT-CHECKLIST.md](CLIENT-CHECKLIST.md)**.

**Recommended: one copy of the project per client.** It keeps every client independent.

1. **Copy the project.** On GitHub, mark this repository as a *Template repository* (Settings) and click **Use this template** for each new client. Or simply copy the folder (without `node_modules` and `dist`).
2. **Open `src/config/site.config.ts`** and change `id` to a short name for the client, e.g. `'cafe-central'` (lowercase, no spaces or accents).
3. **Rename the photo folder** `src/assets/images/tasca-do-largo` to the same name (`src/assets/images/cafe-central`).
4. **Fill in every field** of `site.config.ts`, top to bottom. Every visible text has a Portuguese (`pt`) and an English (`en`) version. Your editor shows a short explanation when you hover over a field name, and underlines mistakes in red.
5. **Replace the photos** (see the next section).
6. Set **`isDemo: false`** (removes the "demo site" line in the footer) and set **`url`** to the real web address.
7. Run **`npm run build`**. If something is wrong you get a clear list, for example:
   - `Missing text at config.menu[2].items[0].description.en` → an English text is empty.
   - `photo not found: src/assets/images/cafe-central/hero.jpg` → check the file name.
   - `colour contrast too low for accent text on background` → the colour is too light to read; make it darker.
8. **Publish** (sections 9 and 10).

Useful tips while filling in the config:

- **Prices**: write `12.5` (with a dot); the site shows `12,50 €`. For portions use a list:
  `price: [{ label: { pt: 'Meia dose', en: 'Half portion' }, price: 9.5 }, { label: { pt: 'Dose', en: 'Full portion' }, price: 14 }]`.
  No fixed price? Leave `price` out and use `priceNote: { pt: 'Preço do dia', en: 'Market price' }`.
- **Opening hours**: `[]` means closed; two periods = lunch and dinner; a closing time after midnight (`'01:00'`) works.
- **Featured dishes**: list 4–6 menu item `id`s in `featuredDishes`. Each needs a photo.
- **GPS coordinates**: in Google Maps, right-click the restaurant and click the numbers at the top to copy them (e.g. `40.2097, -8.4303`).
- **Google reviews link**: in the Google Business Profile, click *Reviews* and copy the share link into `reviews.googleUrl`. Copy the average (`rating`) and number of reviews (`count`) by hand and update them from time to time.
- **WhatsApp**: write the number with the country code: `'+351 912 345 678'`.
- **Booking**: by default the button opens WhatsApp with `booking.message`. Use `booking.url` for an online booking page (e.g. TheFork), or `booking.label` to change the button text (e.g. "Encomendar bolo" for a pastry shop). Phones show a short text ("Reservar"); if you change the label, also set `booking.shortLabel` (12 letters max, e.g. "Encomendar").
- **Dish / menu of the day**: `dailySpecial` shows a card at the top of the home page and of the menu (name, details, price). Update it when it changes, or delete the block to hide it. A fixed lunch deal ("Menu do dia: sopa, prato, bebida e café") changes less often than a daily dish.
- **Notice bar**: `notice` shows a coloured line at the top of every page ("Encerrado para férias de 1 a 15 de agosto"). Remove it when it no longer applies.
- **Logo**: optional `images.logo` (SVG or transparent PNG). Without it, the name is written in the title font.
- **RAL (consumer arbitration)**: only if the business is a member of an arbitration centre, fill in `legal.disputeResolution`, e.g. `{ name: 'CIMAAL, Centro de Informação, Mediação e Arbitragem de Conflitos de Consumo do Algarve', url: 'https://www.consumoalgarve.pt' }`.

### Several clients in one project (optional)

You can also keep all clients in one project and publish each one as a separate Vercel project:

1. Copy `site.config.ts` to `src/config/<id>.config.ts` and fill it in; put the photos in `src/assets/images/<id>/`.
2. Add it to the `configs` list in `src/config/index.ts` (the comment above the list shows how).
3. In the client's Vercel project, add the environment variable `SITE_CONFIG = <id>`.

Advantage: a design improvement reaches all clients at once. Disadvantage: every change must be tested for every client.

## 5. Replace the images

Put the client's photos in `src/assets/images/<id>/`. The easiest way: **use the same file names** as the demo, then you don't need to change the config. Otherwise, write the new file names in the config.

| Image | Demo file name | Shape | Recommended size |
| --- | --- | --- | --- |
| Big photo at the top (hero) | `hero-mesa-petiscos.jpg` | landscape 3:2 | **2400 × 1600** (at least 1600 wide) |
| About us, photo 1 | `sobre-tachos-ao-lume.jpg` | portrait 4:5 | **1200 × 1500** |
| About us, photos 2 and 3 | `sobre-pao-e-azeite.jpg`, `sobre-mesa-posta.jpg` | landscape 4:3 | **1200 × 900** |
| Dish photos (menu items) | `prato-….jpg`, `sobremesa-….jpg` | landscape 4:3 | **1200 × 900** |
| Sharing image (WhatsApp, Facebook) | `partilha-redes-sociais.jpg` | 1.91:1 | **1200 × 630**, with the name or logo on it |
| Logo (optional) | (none in the demo), e.g. `logo.svg` | any | SVG, or PNG with transparent background, at least 160 px tall |

Good to know:

- JPG, PNG or WebP are fine; phone photos are fine. When you build, Astro **resizes, crops and converts** them to modern formats (AVIF/WebP), and lazy-loads them. You don't need to make them small yourself (but under ~5 MB keeps builds quick).
- Photos are **cropped automatically** to the shape above, from the centre.
- On phones the top photo is shown as a **tall strip**. Choose which part with `images.hero.focus`: `'left'`, `'center'` (default) or `'right'`, the side where the main subject is (the demo uses `'right'` to keep the wine glass).
- File names: lowercase, no spaces, no accents (`arroz-de-pato.jpg`, not `Arroz de Pato.JPG`). Names are case-sensitive.
- The site icon (favicon) is generated automatically from the brand colour.
- Write a short `alt` text for each photo in both languages, describing what is in it (for blind visitors and Google).
- **Demo pictures:** the demo uses free stock photos from Pexels and Unsplash (sources in `src/assets/images/tasca-do-largo/CREDITS.md`). They are only for the demo: a real client's site must show **the client's own food**, otherwise customers are misled.

Why the photos are in `src/assets/images/` and not in `public/images/`: Astro only optimises images that are inside `src/`. Files in `public/` are published as they are, so big phone photos would make the site slow.

## 6. Change colours and fonts

In the config, `theme.colors` has 8 colours (as hex codes like `#1D4F91`). The site derives lighter and darker shades from them. `npm run build` warns you if a colour combination is hard to read (WCAG AA contrast). Tips: `primary` must be dark enough for white text; `accent` is used for small text and prices, so it must not be too light.

`theme.fonts` has a font for titles and one for normal text. Choose from the list in `src/config/fonts.ts`:
Fraunces, Playfair Display, Lora (titles) and Source Sans 3, Nunito Sans, Figtree (text). The fonts are stored in the project, so visitors never contact Google. The instructions to add another font are at the top of `fonts.ts`.

## 7. Texts that are the same for every client

- Buttons, labels and notes: `src/i18n/pt.ts` (European Portuguese) and `src/i18n/en.ts`.
- Privacy policy: `src/legal/privacy.pt.md` and `privacy.en.md`. Words in `{{double braces}}` are filled in from the config. **Review it with each client** (it is a template, not legal advice) and update the date at the top when you change it.

## 8. Switch between configs (only with several clients in one project)

| Where | How |
| --- | --- |
| On your computer | Create a file named `.env` (copy `.env.example`) containing `SITE_CONFIG=<id>`, then restart `npm run dev` |
| Vercel | Project → *Settings → Environment Variables*: add `SITE_CONFIG` with the config `id` |

Without `SITE_CONFIG`, `src/config/site.config.ts` is used.

## 9. Publish on Vercel

**Which Vercel plan?** Vercel's free **Hobby** plan is only for personal, non-commercial use. Vercel counts
"receiving payment to create, update, or host the site" as commercial use, so **client sites need the Pro
plan** (US$20 per month per team member; one Pro team can host all your client projects). See
<https://vercel.com/docs/limits/fair-use-guidelines#commercial-usage>. If you are unsure about your demos,
ask Vercel support.

**Steps (updates are automatic after this):**

1. Put the project on GitHub (in VS Code: *Source Control → Publish to GitHub*).
2. On <https://vercel.com>: **Add New… → Project**, then **Import** the GitHub repository.
3. The settings are read from `vercel.json` (framework Astro, build command `npm run build`, output folder `dist`). You don't need to change anything. Optionally add environment variables (e.g. `SITE_CONFIG`).
4. Click **Deploy**. After 1–2 minutes the site is online at `https://<project-name>.vercel.app`.

Every push to the main branch publishes a new version. Other branches get a private *preview* address, useful to show changes to the owner before they go live.

Good to know:

- **Node.js version:** Vercel uses the newest version allowed by `engines.node` in `package.json` (currently Node 26). You don't need to set it.
- **Another client from the same repository** (see "Several clients in one project"): import the repository again as a new project and add the environment variable `SITE_CONFIG = <id>` before the first deploy.
- **Public address:** while `url` in the config is still an `example.com` placeholder (as in the demo), the site uses the project's Vercel address for Google and share previews. Once you write the real address in `url`, that one is used.
- The site is plain static files (`dist/`), so it also runs on other static hosts if you ever move.

## 10. Connect the client's domain (e.g. `www.restaurante.pt`)

The client keeps ownership of the domain. A `.pt` domain is bought from a registrar accredited by DNS.pt (for example PTisp, Amen or Dominios.pt). You need access to its **DNS settings**.

1. In the Vercel project: *Settings → Domains → Add*, type `www.restaurante.pt` and also `restaurante.pt`. Choose to **redirect** one to the other (most sites use `www` as the main address).
2. Vercel shows the exact DNS records to add at the registrar (an `A` record for the domain without `www` and a `CNAME` for `www`). Add them there. Alternatively, point the domain's nameservers to Vercel.
3. HTTPS (the padlock) is added automatically for free.

DNS changes can take a few minutes to a few hours. When the domain works:

1. Set `url` in the config to the main address (e.g. `'https://www.restaurante.pt'`) and publish again.
2. Add the site to **Google Search Console** (<https://search.google.com/search-console>) and submit `https://www.restaurante.pt/sitemap.xml`.
3. Put the website link in the client's **Google Business Profile**, Instagram and Facebook.

## 11. Before showing a site to a client or going live

- `npm run build` shows no errors or warnings.
- `isDemo` is `false`, `url` is correct, phone, WhatsApp and email work (tap them on a phone).
- All demo texts and photos are replaced; prices and hours checked by the owner.
- The English texts were read by someone who speaks English well.
- Test on a phone, and run Lighthouse (Chrome → DevTools → Lighthouse) or <https://pagespeed.web.dev>.
- The client is registered on the **Livro de Reclamações Eletrónico** (<https://www.livroreclamacoes.pt>); the footer link points to it.

## 12. Monthly maintenance (ideas for your subscription)

Update opening hours and holiday closures (`notice`), menu and prices, the Google rating and number of reviews, seasonal photos, and the privacy policy date if it changes. Edit, run `npm run build`, push to GitHub: the host publishes the new version automatically.

## 13. Problems?

| Problem | Solution |
| --- | --- |
| `npm` is not recognised | Install Node.js (LTS) and open a new terminal. |
| `The engine "node" is incompatible` | Your Node.js is too old. Install the current LTS version (24 or 26). |
| Port 4321 is in use | Another copy of the site is running. Stop it with `Ctrl + C`, or use the address shown in the terminal. |
| The build lists problems in the config | Read each line: it says which field and what is wrong. |
| A photo looks badly cropped | Use a photo closer to the recommended shape, with the subject in the centre. |
| I replaced a photo but still see the old one | Your browser kept the old copy. Press `Ctrl + F5` (Mac: `Cmd + Shift + R`) once. If it stays, stop `npm run dev` and start it again. |
| The share preview on WhatsApp/Facebook shows an old image | They keep a copy for a while. Use <https://developers.facebook.com/tools/debug/> to refresh it. |

---

### Technical notes (for developers)

- **Stack:** Astro 7 (static output), Tailwind CSS 4 (`@tailwindcss/vite`), TypeScript (strict). `npm run build` runs `astro check` first.
- **Config:** `src/config/index.ts` picks the config from `SITE_CONFIG` and validates it at build time (`validate.ts`). `astro.config.ts` loads the same config to set `site`, the fonts and the `@client-images` alias, so only the active client's photos are bundled.
- **Public URL:** `SITE_URL` env var → `url` in the config → while `url` is an `example.com` placeholder, Vercel's `VERCEL_PROJECT_PRODUCTION_URL`.
- **Fonts:** Astro Fonts API with the `local` provider (files in `src/assets/fonts/`, metric-matched fallbacks, preloaded).
- **Images:** `astro:assets` `<Picture>` (AVIF + WebP, `srcset`, lazy loading, width/height). The hero is art-directed: a 2:3 crop for phones, 3:2 for larger screens, high fetch priority.
- **i18n:** explicit routes (`src/pages/` and `src/pages/en/`), route map in `src/i18n/index.ts`, `hreflang` alternates in the `<head>` and in `sitemap.xml`.
- **JavaScript:** one small module (`src/scripts/main.ts`): mobile menu (`<details>`, works without JS), language switch keeping the section anchor, open-now badge (`Intl` with `Europe/Lisbon`, run when the browser is idle), click-to-load map, menu tab highlighting, print button.
- **SEO:** JSON-LD `Restaurant`/`Bakery` with address, geo, opening hours, menu URL, cuisine, price range and phone. Reviews are deliberately not in the structured data (Google ignores self-published reviews of a business).
- **Dev image cache:** `src/middleware.ts` sends `Cache-Control: no-cache` for `/_image` during `npm run dev`, so a photo replaced under the same file name shows up immediately (no effect on the built site).
- **Hosting:** `vercel.json` (framework, build command, `trailingSlash: true`, security headers, one-year cache for `/_astro/*`). Vercel serves `dist/404.html` for unknown pages.
- **Fonts licence:** SIL Open Font License, see `src/assets/fonts/licenses/`.

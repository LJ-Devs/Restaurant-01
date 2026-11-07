# Restaurant & café website template (Portugal)

A fast, bilingual (Portuguese/English) website for small restaurants and cafés in Portugal.
You set up a new client by **editing one file, replacing the photos and publishing**.

It comes with two **fictional** demo clients:

| Demo | Type | Look |
| --- | --- | --- |
| **Tasca do Largo** (Coimbra) | Traditional restaurant | Azulejo blue, terracotta, Fraunces font |
| **Pastelaria Sol** (Faro) | Café & pastry shop | Atlantic teal, sun yellow, Playfair Display font, logo, notice bar |

What every site includes:

- Home page: photo header, story, featured dishes, reviews, opening hours with an **"Aberto agora / Fechado agora"** badge (Lisbon time), map, contacts.
- Menu page with prices (`12,50 €`), portions (meia dose / dose), vegetarian / vegan / gluten-free labels, VAT and allergen notes, and a **print-friendly** version.
- Privacy policy page, a "page not found" page.
- European Portuguese at `/`, English at `/en/`. The language button keeps the visitor on the same page.
- "Reservar mesa" button that opens WhatsApp with a ready-made message, and a "Ligar / WhatsApp" bar on phones.
- Footer with legal name, NIF, Livro de Reclamações Eletrónico link and privacy policy.
- Google-friendly: structured data (`Restaurant`), sitemap, robots.txt, share images for WhatsApp/Facebook.
- **No cookies, no trackers, no Google Fonts**: no cookie banner needed. The Google map only loads if the visitor clicks it.
- Very fast: Lighthouse mobile scores of 97–100 (performance) and 100 (accessibility, best practices, SEO) in our tests.

---

## 1. What you need (one time)

1. **Node.js 24 (LTS)**: download it from <https://nodejs.org> and install it.
2. **Visual Studio Code**: <https://code.visualstudio.com>. When you open this folder, accept the suggestion to install the **Astro** extension.
3. Free accounts on **GitHub** and on **Netlify** or **Cloudflare** (only needed to publish).

## 2. Run the site on your computer

Open a terminal in this folder (in VS Code: *Terminal → New Terminal*) and type:

```bash
npm install      # only the first time: downloads the tools (1–2 minutes)
npm run dev      # starts the site
```

Open <http://localhost:4321> in your browser. When you save a file, the page updates by itself.
Press `Ctrl + C` in the terminal to stop.

To see the second demo (Pastelaria Sol): `npm run dev:sol`.

Other commands:

| Command | What it does |
| --- | --- |
| `npm run build` | Checks everything and creates the final site in the `dist/` folder. **Always run this before publishing.** |
| `npm run build:sol` | Same, for Pastelaria Sol. |
| `npm run preview` | Shows the final site from `dist/`, exactly as it will be online. |

## 3. Where things are

```
src/
├── config/
│   ├── site.config.ts            ← THE CLIENT FILE: all texts, menu, hours, colours… (edit this)
│   ├── pastelaria-sol.config.ts  ← second example client
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
scripts/generate-placeholders.mjs ← draws the demo illustrations (not needed for clients)
public/_headers                   ← security and cache settings for Netlify / Cloudflare
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
8. **Publish** (sections 8–10).

Useful tips while filling in the config:

- **Prices**: write `12.5` (with a dot); the site shows `12,50 €`. For portions use a list:
  `price: [{ label: { pt: 'Meia dose', en: 'Half portion' }, price: 9.5 }, { label: { pt: 'Dose', en: 'Full portion' }, price: 14 }]`.
  No fixed price? Leave `price` out and use `priceNote: { pt: 'Preço do dia', en: 'Market price' }`.
- **Opening hours**: `[]` means closed; two periods = lunch and dinner; a closing time after midnight (`'01:00'`) works.
- **Featured dishes**: list 4–6 menu item `id`s in `featuredDishes`. Each needs a photo.
- **GPS coordinates**: in Google Maps, right-click the restaurant and click the numbers at the top to copy them (e.g. `40.2097, -8.4303`).
- **Google reviews link**: in the Google Business Profile, click *Reviews* and copy the share link into `reviews.googleUrl`. Copy the average (`rating`) and number of reviews (`count`) by hand and update them from time to time.
- **WhatsApp**: write the number with the country code: `'+351 912 345 678'`.
- **Booking**: by default the button opens WhatsApp with `booking.message`. Use `booking.url` for an online booking page (e.g. TheFork), or `booking.label` to change the button text (Pastelaria Sol uses "Encomendar bolo").
- **Notice bar**: `notice` shows a coloured line at the top of every page ("Encerrado para férias de 1 a 15 de agosto"). Remove it when it no longer applies.
- **RAL (consumer arbitration)**: only if the business is a member of an arbitration centre, fill in `legal.disputeResolution` (see Pastelaria Sol).

### Several clients in one project (optional)

You can also keep all clients in one project and publish each one as a separate Netlify/Cloudflare site:

1. Copy `site.config.ts` to `src/config/<id>.config.ts` and fill it in; put the photos in `src/assets/images/<id>/`.
2. Add it to the `configs` list in `src/config/index.ts` (copy how `pastelariaSol` is done).
3. On the client's Netlify/Cloudflare site, add the environment variable `SITE_CONFIG = <id>`.

Advantage: a design improvement reaches all clients at once. Disadvantage: every change must be tested for every client.

## 5. Replace the images

Put the client's photos in `src/assets/images/<id>/`. The easiest way: **use the same file names** as the demo, then you don't need to change the config. Otherwise, write the new file names in the config.

| Image | Demo file name | Shape | Recommended size |
| --- | --- | --- | --- |
| Big photo at the top (hero) | `hero-mesa-petiscos.jpg` | landscape 3:2 | **2400 × 1600** (at least 1600 wide) |
| About us, photo 1 | `sobre-tachos-ao-lume.jpg` | portrait 4:5 | **1200 × 1500** |
| About us, photos 2 and 3 | `sobre-pao-azeite-vinho.jpg`, `sobre-mesa-posta.jpg` | landscape 4:3 | **1200 × 900** |
| Dish photos (menu items) | `prato-….jpg`, `sobremesa-….jpg` | landscape 4:3 | **1200 × 900** |
| Sharing image (WhatsApp, Facebook) | `partilha-redes-sociais.jpg` | 1.91:1 | **1200 × 630**, with the name or logo on it |
| Logo (optional) | `logo-sol.svg` (Pastelaria Sol) | any | SVG, or PNG with transparent background, at least 160 px tall |

Good to know:

- JPG, PNG or WebP are fine; phone photos are fine. When you build, Astro **resizes, crops and converts** them to modern formats (AVIF/WebP), and lazy-loads them. You don't need to make them small yourself (but under ~5 MB keeps builds quick).
- Photos are **cropped automatically** to the shape above, from the centre. On phones the top photo is shown as a tall crop of its **centre**: keep the main subject in the middle.
- File names: lowercase, no spaces, no accents (`arroz-de-pato.jpg`, not `Arroz de Pato.JPG`). Names are case-sensitive.
- The site icon (favicon) is generated automatically from the brand colour.
- Write a short `alt` text for each photo in both languages, describing what is in it (for blind visitors and Google).
- The demo pictures are **illustrations** made by `scripts/generate-placeholders.mjs`. Replace them with the client's real photos.

Why the photos are in `src/assets/images/` and not in `public/images/`: Astro only optimises images that are inside `src/`. Files in `public/` are published as they are, so big phone photos would make the site slow.

## 6. Change colours and fonts

In the config, `theme.colors` has 8 colours (as hex codes like `#1D4F91`). The site derives lighter and darker shades from them. `npm run build` warns you if a colour combination is hard to read (WCAG AA contrast). Tips: `primary` must be dark enough for white text; `accent` is used for small text and prices, so it must not be too light.

`theme.fonts` has a font for titles and one for normal text. Choose from the list in `src/config/fonts.ts`:
Fraunces, Playfair Display, Lora (titles) and Source Sans 3, Nunito Sans, Figtree (text). The fonts are stored in the project, so visitors never contact Google. The instructions to add another font are at the top of `fonts.ts`.

## 7. Texts that are the same for every client

- Buttons, labels and notes: `src/i18n/pt.ts` (European Portuguese) and `src/i18n/en.ts`.
- Privacy policy: `src/legal/privacy.pt.md` and `privacy.en.md`. Words in `{{double braces}}` are filled in from the config. **Review it with each client** (it is a template, not legal advice) and update the date at the top when you change it.

## 8. Switch between configs

| Where | How |
| --- | --- |
| On your computer | `npm run dev:sol` / `npm run build:sol`, or create a file named `.env` (copy `.env.example`) containing `SITE_CONFIG=pastelaria-sol` |
| Netlify / Cloudflare | Add the environment variable `SITE_CONFIG` with the config `id` |

Without `SITE_CONFIG`, `src/config/site.config.ts` is used.

## 9. Publish on Netlify (free)

**With GitHub (recommended: updates are automatic)**

1. Put the project on GitHub (in VS Code: *Source Control → Publish to GitHub*).
2. On <https://app.netlify.com>: **Add new project → Import an existing project → GitHub** (older screens say *Add new site*), and choose the repository.
3. The settings are read from `netlify.toml` (build command `npm run build`, folder `dist`, Node 24). Click **Deploy**.
4. After 1–2 minutes the site is online at an address like `https://your-name.netlify.app`. You can change the name in the project (site) configuration.

Every time you push a change to GitHub, Netlify publishes the new version automatically.
To publish the second demo from the same repository, import it a second time and add the environment variable `SITE_CONFIG = pastelaria-sol` before deploying.

**Without GitHub (quick test):** run `npm run build`, then drag the `dist` folder onto <https://app.netlify.com/drop>. You will have to drag it again after every change.

## 10. Publish on Cloudflare Pages (free)

1. Put the project on GitHub.
2. On <https://dash.cloudflare.com>: **Workers & Pages → Create → Pages → Connect to Git**, and choose the repository. (Cloudflare changes its menus from time to time; look for the option to deploy a Pages site from Git.)
3. Framework preset: **Astro**. Build command: `npm run build`. Build output directory: `dist`.
4. Environment variables: `NODE_VERSION = 24` (and `SITE_CONFIG` if needed).
5. Click **Save and Deploy**. The site appears at `https://your-name.pages.dev`.

Important on Cloudflare: set `url` in the config to the final address (e.g. `https://your-name.pages.dev` or the client's domain). Cloudflare does not tell the build the public address, and Google and WhatsApp previews use it. Netlify does this automatically.

## 11. Connect the client's domain (e.g. `www.restaurante.pt`)

The client keeps ownership of the domain. A `.pt` domain is bought from a registrar accredited by DNS.pt (for example PTisp, Amen or Dominios.pt). You need access to its **DNS settings**.

**Netlify:** *Domain management → Add a domain*, type the domain, and follow the instructions. Netlify shows the exact records to add at the registrar (usually a `CNAME` for `www` and an `A` record for the domain without `www`). Or move the DNS to Netlify (Netlify DNS), the simplest option. HTTPS (the padlock) is added automatically for free.

**Cloudflare Pages:** open the project → *Custom domains → Set up a custom domain*, and follow the steps. It is easiest if the domain's DNS is managed by Cloudflare (add the domain to your Cloudflare account and change the nameservers at the registrar).

DNS changes can take a few minutes to a few hours. When the domain works:

1. Set `url` in the config to the new address (e.g. `'https://www.restaurante.pt'`) and publish again.
2. Add the site to **Google Search Console** (<https://search.google.com/search-console>) and submit `https://www.restaurante.pt/sitemap.xml`.
3. Put the website link in the client's **Google Business Profile**, Instagram and Facebook.

## 12. Before showing a site to a client or going live

- `npm run build` shows no errors or warnings.
- `isDemo` is `false`, `url` is correct, phone, WhatsApp and email work (tap them on a phone).
- All demo texts and photos are replaced; prices and hours checked by the owner.
- The English texts were read by someone who speaks English well.
- Test on a phone, and run Lighthouse (Chrome → DevTools → Lighthouse) or <https://pagespeed.web.dev>.
- The client is registered on the **Livro de Reclamações Eletrónico** (<https://www.livroreclamacoes.pt>); the footer link points to it.

## 13. Monthly maintenance (ideas for your subscription)

Update opening hours and holiday closures (`notice`), menu and prices, the Google rating and number of reviews, seasonal photos, and the privacy policy date if it changes. Edit, run `npm run build`, push to GitHub: the host publishes the new version automatically.

## 14. Problems?

| Problem | Solution |
| --- | --- |
| `npm` is not recognised | Install Node.js 24 and open a new terminal. |
| `The engine "node" is incompatible` | Your Node.js is too old. Install Node.js 24 LTS. |
| Port 4321 is in use | Another copy of the site is running. Stop it with `Ctrl + C`, or use the address shown in the terminal. |
| The build lists problems in the config | Read each line: it says which field and what is wrong. |
| A photo looks badly cropped | Use a photo closer to the recommended shape, with the subject in the centre. |
| The share preview on WhatsApp/Facebook shows an old image | They keep a copy for a while. Use <https://developers.facebook.com/tools/debug/> to refresh it. |

---

### Technical notes (for developers)

- **Stack:** Astro 7 (static output), Tailwind CSS 4 (`@tailwindcss/vite`), TypeScript (strict). `npm run build` runs `astro check` first.
- **Config:** `src/config/index.ts` picks the config from `SITE_CONFIG` and validates it at build time (`validate.ts`). `astro.config.ts` loads the same config to set `site`, the fonts and the `@client-images` alias, so only the active client's photos are bundled.
- **Public URL:** `SITE_URL` env var → Netlify's `URL` env var (when building on Netlify) → `url` in the config.
- **Fonts:** Astro Fonts API with the `local` provider (files in `src/assets/fonts/`, metric-matched fallbacks, preloaded).
- **Images:** `astro:assets` `<Picture>` (AVIF + WebP, `srcset`, lazy loading, width/height). The hero is art-directed: a 2:3 crop for phones, 3:2 for larger screens, high fetch priority.
- **i18n:** explicit routes (`src/pages/` and `src/pages/en/`), route map in `src/i18n/index.ts`, `hreflang` alternates in the `<head>` and in `sitemap.xml`.
- **JavaScript:** one small module (`src/scripts/main.ts`): mobile menu (`<details>`, works without JS), language switch keeping the section anchor, open-now badge (`Intl` with `Europe/Lisbon`, run when the browser is idle), click-to-load map, menu tab highlighting, print button.
- **SEO:** JSON-LD `Restaurant`/`Bakery` with address, geo, opening hours, menu URL, cuisine, price range and phone. Reviews are deliberately not in the structured data (Google ignores self-published reviews of a business).
- **Headers:** `public/_headers` (security headers + one-year cache for `/_astro/*`) works on Netlify and Cloudflare Pages.
- **Fonts licence:** SIL Open Font License, see `src/assets/fonts/licenses/`.

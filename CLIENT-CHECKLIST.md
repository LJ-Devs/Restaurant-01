# New client checklist

Everything to collect from a restaurant or café before building its site.
Each item matches a field in `src/config/site.config.ts` (shown in `code`).
Visible texts are needed in **Portuguese**; you can write the English versions yourself, but have them checked.

A short message you can send to the client (in Portuguese) is at the end.

---

## 1. Business details

- [ ] Business name, exactly as on the sign: `name`
- [ ] Type of business: restaurant, café, pastry shop, bar: `businessType`
- [ ] Type of food in a few words (e.g. "Cozinha tradicional portuguesa", "Marisqueira", "Pastelaria e café"): `cuisine`
- [ ] Price level: € / €€ / €€€: `priceRange`
- [ ] One short sentence that describes them (tagline): `tagline`
- [ ] Their story, 2–3 short paragraphs: when they opened, who runs it, specialities, where the products come from: `story`

## 2. Contacts and location

- [ ] Full address: street and number, postal code (`0000-000`), city, district: `address`
- [ ] Google Maps link to the business (or GPS coordinates): `geo`, `map.directionsUrl`
- [ ] Phone number for the public: `contact.phone`. Is it a landline (2…) or a mobile (9…)? The site adds the legally required note "Chamada para a rede fixa/móvel nacional" automatically.
- [ ] WhatsApp number (if they use it) and who answers it: `contact.whatsapp`
- [ ] Public email address: `contact.email`
- [ ] How do customers book or order? WhatsApp, phone, or an online booking page such as TheFork (link): `booking`
- [ ] Button text if not "Reservar mesa" (e.g. "Encomendar bolo"): `booking.label`

## 3. Opening hours

- [ ] Hours for **each day** of the week, including lunch and dinner if they close in between: `hours`

  | Day | Opens | Closes | Opens again | Closes |
  | --- | --- | --- | --- | --- |
  | Segunda | | | | |
  | Terça | | | | |
  | Quarta | | | | |
  | Quinta | | | | |
  | Sexta | | | | |
  | Sábado | | | | |
  | Domingo | | | | |

- [ ] Closed days, and what happens on public holidays: `hoursNote`
- [ ] Kitchen closing time, if earlier than the doors: `hoursNote`
- [ ] Planned holidays or temporary notices (e.g. closed in August): `notice`

## 4. Menu

- [ ] The current menu (photo or PDF of the printed menu is fine), split into categories (Entradas, Sopas, Peixe, Carne, Sobremesas, Bebidas…): `menu`
- [ ] For each item: name, short description, **price with VAT**, and portions if any (meia dose / dose, copo / garrafa)
- [ ] Items without a fixed price (e.g. fresh fish "preço ao kg" or "preço do dia")
- [ ] Which items are **vegetarian**, **vegan** and **gluten-free**: confirm with the cook, these labels must be true: `tags`
- [ ] Confirmation that allergen information is available on request (EU rule; the site shows a note about it)
- [ ] Menu do dia / prato do dia: do they want it on the site? (It changes daily: usually better as a note, e.g. "Pergunte-nos pelo prato do dia".)
- [ ] 4–6 **signature dishes** to feature on the home page (each needs a photo): `featuredDishes`
- [ ] Short intro sentence for the menu page (optional): `menuIntro`

## 5. Photos

Ask for the **original files** (not screenshots, not photos sent through WhatsApp, which compresses them). Landscape photos are best.

- [ ] 1 big photo for the top of the home page: the dining room, the façade or a table full of dishes. Landscape, at least 1600 px wide (ideally 2400 × 1600). Main subject in the centre: `images.hero`
- [ ] 2–3 photos for "about us": the team, the kitchen, the room, details: `images.about`
- [ ] 1 photo of each featured dish (and of other dishes if they have them). Landscape 4:3, about 1200 × 900, natural light: `photo`
- [ ] Logo, if they have one: SVG or PNG with a transparent background: `images.logo`
- [ ] Permission to use every photo (whoever took it), and consent from any person who can be recognised in it (GDPR)

Tips for photos taken with a phone: daylight near a window, no flash, clean table, shoot dishes from above or at a 45° angle, keep the phone horizontal, take several of each.

## 6. Brand

- [ ] Colours of the logo, sign or menu (hex codes if they have them, e.g. `#1D4F91`; otherwise take them from the logo): `theme.colors`
- [ ] Style they like (traditional, modern, rustic, elegant), and websites they like
- [ ] Fonts: choose from `src/config/fonts.ts`, unless they have their own brand font: `theme.fonts`

## 7. Reviews and social media

- [ ] Link to their **Google Business Profile** reviews: `reviews.googleUrl`
- [ ] Current Google average rating and number of reviews: `reviews.rating`, `reviews.count`
- [ ] 3–6 favourite reviews from Google (copy the text; **first name only**): `reviews.featured`
- [ ] Instagram, Facebook and Tripadvisor links: `social`

## 8. Legal (Portugal)

- [ ] Legal company name (e.g. "Restaurante X, Lda." or the owner's name for an "empresário em nome individual"): `legal.companyName`
- [ ] NIF / NIPC: `legal.nif`
- [ ] They are registered on the **Livro de Reclamações Eletrónico** (<https://www.livroreclamacoes.pt>). The site links to it in the footer, as the law requires for businesses with a website.
- [ ] Are they a member of a consumer arbitration centre (RAL)? If yes: name and website of the centre: `legal.disputeResolution`
- [ ] Who answers privacy requests (usually the same email): checked in the privacy policy
- [ ] The privacy policy text has been read by the owner (it is a template; adapt it if they use other services, e.g. an online booking system)

## 9. Domain and access

- [ ] Do they already own a domain (e.g. `restaurante.pt`)? Registrar name and login, or someone who can change the DNS
- [ ] If not: which domain to buy, and in whose name (it should be the client's)
- [ ] Is there an old website or email on that domain that must keep working? (Don't break their email when changing DNS.)
- [ ] Who approves the texts and who is your contact for monthly changes

## 10. Before going live

- [ ] Owner checked all texts, prices and hours (in a preview link)
- [ ] English texts checked by a fluent speaker
- [ ] `isDemo: false`, `url` set to the real domain
- [ ] Phone, WhatsApp and email tested on a phone
- [ ] `npm run build` with no errors or warnings
- [ ] Site added to Google Search Console, `sitemap.xml` submitted
- [ ] Website link added to Google Business Profile, Instagram and Facebook

---

## Message to send to the client (Portuguese)

> Olá! Para preparar o vosso site, preciso de:
>
> 1. **Dados**: nome do estabelecimento, nome da empresa e NIF, morada completa, telefone, WhatsApp (se usarem) e email.
> 2. **Horário** de cada dia da semana (almoço e jantar), dias de encerramento e o que fazem nos feriados.
> 3. **Menu** atual com preços (pode ser uma foto ou PDF), indicando os pratos vegetarianos, vegan e sem glúten.
> 4. **Fotografias** em boa qualidade (os ficheiros originais, não enviados pelo WhatsApp): uma da sala ou da fachada, 2 ou 3 da equipa ou da cozinha, e dos 4 a 6 pratos mais conhecidos. Se tiverem logótipo, enviem-no também.
> 5. Um pequeno texto sobre a **vossa história** (quando abriram, quem são, o que vos distingue).
> 6. Links do **Google** (perfil da empresa), **Instagram** e **Facebook**.
> 7. Se já têm um **domínio** (ex.: www.restaurante.pt), quem é o fornecedor e quem tem acesso.
>
> Obrigado!

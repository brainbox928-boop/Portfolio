# Portfolio Boilerplate — Setup Instructions

## Files
- `index.html` — page markup (all 7 sections, commented with `TODO` markers)
- `style.css` — dark/light slate theme, edit the `:root` variables to re-theme
- `script.js` — footer year + mobile nav auto-close

## FontAwesome Icons
Icons are already linked via CDN in `index.html`'s `<head>`:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
```

No extra setup needed — just use `<i class="fa-solid fa-icon-name"></i>` (or `fa-brands`
for brand logos like WhatsApp/Telegram/GitHub/LinkedIn) anywhere in the HTML.

To browse/search available icons: https://fontawesome.com/search

If you prefer a local install instead of the CDN:
1. Download the FontAwesome "Free" package from https://fontawesome.com/download
2. Copy the `css/` and `webfonts/` folders into your project (e.g. into `/assets/fontawesome/`)
3. Replace the CDN `<link>` tag with: `<link rel="stylesheet" href="assets/fontawesome/css/all.min.css">`

## What to fill in
Search the HTML for `TODO` comments — each marks a spot to replace with your
own content:
- Hero tagline/intro
- About photo, bio paragraphs, stats
- Focus area copy/images for Private, Government, Freelance tabs
- Marketplace description, architecture notes, progress percentages
- 10 project cards: image, title, description, live link, code link
- Donation platform links (Buy Me a Coffee, PayPal, Crypto wallet)
- Contact form action endpoint (e.g. connect to Formspree, Netlify Forms, or your own backend)
- Social links: WhatsApp, Telegram, GitHub, LinkedIn hrefs
- Footer email/location

## Running locally
Just open `index.html` in a browser, or serve the folder with any static
server (e.g. VS Code Live Server extension).

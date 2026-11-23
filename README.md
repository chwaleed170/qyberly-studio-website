# QYBERLY Studio Website v4.0

A six-page, static creative technology studio website built with plain HTML, CSS and vanilla JavaScript.

## Pages
- `index.html` — Home
- `about.html` — Studio
- `services.html` — Services + interactive scope finder
- `portfolio.html` — Selected work, category filters, live search and case-study dialog
- `process.html` — Working process and FAQs
- `contact.html` — Project brief builder

## v4.0 additions
- Interactive three-step scope finder on Services. It suggests a starting scope and carries the selection into the contact brief.
- Live portfolio search works alongside the category filters.
- Keyboard quick-navigation palette: press `Ctrl+K` (or `Cmd+K` on macOS).
- Existing mobile navigation, service tabs, case-study dialog, FAQ accordions, reading progress, back-to-top and local project brief save/copy/email handoff are retained.
- QYBERLY's supplied SVG and PNG logo assets are retained.

## Run locally
No install, package manager, framework, build command or API key is required. Extract the folder and open `index.html` in a browser. For best local development, use VS Code with a simple static server extension, but it is optional.

## Deploy
This is a static site. Upload the contents of this folder to a GitHub repository, then connect that repository to a static host such as Cloudflare Pages. Use no build command; set the output directory to `/` (or the repository root, depending on the provider's interface).

## Important functionality notes
- The project brief is stored in the visitor's browser while they work. The submit action opens their email application with a prepared message; it does not send to a server.
- Portfolio items are explicitly labelled concept studies where appropriate. Do not present them as paid client projects.
- External Unsplash image URLs require an internet connection and remain subject to the image provider's terms.
- No testimonials, client logos, conversion statistics or project outcomes have been invented.

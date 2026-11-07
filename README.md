# Our Love Story

A romantic, interactive birthday website built with React and Vite.

The site opens with a candle-lit birthday hero. After the visitor clicks **Open Your Surprise**, it reveals a love letter, photo gallery, scrapbook page, 100 reasons, relationship timeline, Open When letters, music corner, bucket list, birthday celebration, and a final surprise.

## Quick start

```bash
npm install
npm run dev
```

Build and preview the production version:

```bash
npm run build
npm run preview
```

The production output is written to `dist/`.

## Personalizing the site

All built-in copy and sample content lives in:

```text
src/data/defaultContent.js
```

Content can also be edited directly in the browser. Changes are saved to `localStorage` under the key `our-love-story.content.v1`.

### Creator tools

Open the site with `?admin=1` to show the creator tools button:

```text
http://localhost:5173/?admin=1
```

From there you can:

- Export the complete story as `content.json`.
- Import a previously exported story.
- Reset this browser to the published content.

To publish browser edits for everyone, export the story, replace `public/content.json` with the downloaded file, then rebuild and deploy.

`public/content.json` intentionally starts as `{}`. Leaving it empty makes the site use the built-in defaults.

## Adding the scrapbook page

Place your finished scrapbook collage in `public/images/` using one of these names, in priority order:

```text
scrapbook.jpg
scrapbook.png
scrapbook.webp
```

The image is displayed without cropping. Until a real collage is added, the site shows `scrapbook-placeholder.svg` with setup instructions.

## Photographs and persistence

Gallery and timeline photographs can be added from the site. Images are resized and compressed in the browser before being stored as data URLs inside the saved content.

Because browser storage is limited, very large collections may eventually fill it. If that happens, the site shows a warning and suggests exporting the story through the creator tools. For a permanent public gallery, add photos through the creator workflow, export the content, and commit the exported `content.json`.

## Deployment

The Vite config uses `base: './'`, so the built site works from a domain root or a subdirectory on any static host, including:

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- Traditional Apache/Nginx hosting

Deploy the contents of `dist/` after running `npm run build`.

## Project structure

```text
public/                  Static assets, default gallery art, content.json
src/components/          Page sections, modals, and reusable UI
src/context/             Content loading, editing, and localStorage persistence
src/data/                Default personalization content
src/hooks/               Reveal animations and body-scroll locking
src/icons/               Inline SVG icon set
src/styles/              Base, layout, component, and section styles
src/utils/               Image compression, dates, assets, and helpers
```

## Verification

```bash
npm run build
```

The production build should complete without errors. The site is responsive down to 320px, respects reduced-motion preferences, and does not autoplay audio.

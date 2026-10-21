# United Medwear landing page

A standalone Next.js landing page for United Medwear, LLC: custom lab coats,
scrubs and outfitting programs for practices, hospitals and university medical
programs. It deploys to Vercel as a standard Next.js project.

## Local development

```bash
npm install
npm run dev
```

## Editing

- Copy, product line, process steps and ceremony schedule:
  `src/content/site.ts`. Values marked `CONFIRM` are placeholders to verify
  before launch (quote inbox, ceremony lead times).
- Styles: `src/app/globals.css`
- Hero embroidery preview: `src/components/coat-studio.tsx`
- Design studio (logo upload, placement, sizing, proofs):
  `src/components/studio/`. Garment drawings, fabric colors and placement
  sizes live in `garments.tsx`; logo handling runs entirely in the browser
  in `logo-processing.ts`.
- White coat ceremony back-scheduler: `src/components/ceremony-planner.tsx`
- Quote form: `src/components/quote-form.tsx`. There is no backend yet; it
  opens a pre-filled email to the quote inbox.

## Quality checks

```bash
npm run verify
```

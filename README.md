# Jerseys

A multi-sport jersey customizer built with React + Vite.  
Design jerseys, tweak color/preset systems, add player text, upload custom SVG overlays, and export finished results as SVG or JSON.  
Includes AI-assisted config generation via Gemini.

## Features

- Supports 5 sports:
  - football
  - basketball
  - hockey
  - american-football
  - formula-1
- Jersey editor with:
  - Primary/secondary team colors
  - Sport-specific presets (vertical, horizontal, custom, side stripe)
  - Player name/number (football, basketball, hockey)
  - Custom SVG overlay upload + transform controls
- Import/export:
  - Upload JSON file
  - Paste JSON
  - Download JSON config
  - Download SVG (with server-side text-to-path conversion for portability)
- AI tools:
  - Copy sport-specific prompt for external AI tools
  - Generate valid jersey config directly through Gemini
- Draft autosave in local storage
- Optional password gate middleware

## Tech

### Stack

- React 19 + TypeScript
- Vite 7
- React Router 7
- HeroUI + Tailwind CSS v4
- Framer Motion
- Netlify Functions (serverless):
  - `netlify/functions/generate-jersey.js`
  - `netlify/functions/export-svg.js`

### App architecture

- Routing is defined in `src/main.tsx`:
  - `/` home
  - `/football`
  - `/basketball`
  - `/hockey`
  - `/american-football`
  - `/formula-1`
  - `/enter-password`
- State is managed by `JerseyColorsProvider` (`src/context/JerseyContext/jerseyContext.tsx`).
- Rendering is handled by `src/components/Jersey/base.tsx`.
- Config parsing/validation for imports is in `src/utils/jerseyConfig.ts`.
- AI prompt templates live in `src/utils/aiPromptTemplates.ts`.

### Serverless functions

- `generate-jersey`
  - Takes user brief + sport
  - Calls Gemini
  - Normalizes and validates output against strict schema/rules
  - Returns `{ config }`
- `export-svg`
  - Accepts raw SVG
  - Converts text elements to vector paths when possible
  - Inlines Google Fonts CSS/font data for better portability
  - Returns processed SVG XML

## Setup

### Prerequisites

- Node.js 20+
- npm
- Optional: Netlify CLI if you want local serverless functions (`netlify dev`)

### Install

```bash
npm install
```

### Environment variables

Create `.env.local`:

```bash
# Optional route password gate. Enable only if you want the app locked.
VITE_ROUTE_PASSWORD_ENABLED=false
VITE_APP_SECRET_PASSWORD=

# Optional override for AI endpoint (if not using Netlify function path)
VITE_AI_PROXY_URL=/.netlify/functions/generate-jersey
```

If you want password protection, set both:

```bash
VITE_ROUTE_PASSWORD_ENABLED=true
VITE_APP_SECRET_PASSWORD=your_password_here
```

For AI generation, set server-side variables (Netlify/local function runtime):

```bash
GEMINI_API_KEY=your_gemini_api_key
# Optional, defaults to gemini-2.0-flash
GEMINI_MODEL=gemini-2.0-flash
```

### Run

Frontend only:

```bash
npm run dev
```

Build:

```bash
npm run build
```

If you want local function endpoints under `/.netlify/functions/*`, run with Netlify CLI:

```bash
netlify dev
```

## User Guide

### 1. Enter the app

- Password protection is optional.
- If enabled, enter password on `/enter-password`.
- You can also unlock by query param:
  - `/?pw=YOUR_PASSWORD`

### 2. Pick a sport

From the home page, choose one of the 5 sport editors.

### 3. Build your jersey

- Set jersey name
- Set theme colors:
  - `primary`
  - `secondary` (not used for formula-1)
- Open setting cards to:
  - choose presets
  - tune individual part colors
  - add/edit player text (where supported)
  - upload and transform a custom SVG overlay

#### Preset/shape rules

- A jersey can only use one main shape preset at a time:
  - `stripesPreset` (vertical) OR
  - `horizontalStripesPreset` OR
  - `customShapePreset`
- Keep the other preset keys as `""` when one is active.
- Basketball `sideStripePreset` is a separate lane and may be combined with some looks, but should still avoid conflicting combinations (especially with horizontal/custom unless intentionally designed).

#### Backside text guidance

- Player text is intended for football, basketball, and hockey.
- For small render sizes/export targets, avoid heavy outlines:
  - keep `footballBackTextOutlineEnabled` off when possible
  - if enabled, keep `footballBackTextOutlineWidth` conservative (thin strokes)
- Oversized outline width can degrade legibility and produce muddy glyph edges in compact logos/previews.

### 4. Save and restore drafts

- Drafts autosave as you edit (local storage).
- Open “Recent Jerseys” from the header to load/delete drafts.

### 5. Import config JSON

Use upload menu:

- `Upload JSON` from file
- `Paste JSON`

Accepted formats:

- Flat config object
- Config with nested `state` object (parser merges known values)

### 6. Export

- `Download SVG`
  - If text exists, export goes through `export-svg` function for text-to-path and font inlining.
  - Jerseys using name/number text should be exported through this function to avoid font dependency/rendering differences across viewers.
- `Download JSON`
  - Exports a full reusable config object.

### 7. AI tools

From upload menu:

- `Copy AI prompt`
  - Generates and copies a sport-specific prompt template for external AI use.
- `Generate with AI`
  - Sends form data to AI endpoint (`VITE_AI_PROXY_URL` or default Netlify function)
  - Validates result
  - Applies config to the editor

Required for AI generate:

- `GEMINI_API_KEY` available to the function runtime

## JSON Config

### Minimal practical example

```json
{
  "name": "maple-leafs-alt",
  "sport": "hockey",
  "primary": "#003E7E",
  "secondary": "#FFFFFF",
  "stripesPreset": "",
  "horizontalStripesPreset": "hockeyTripleBottomStripe",
  "customShapePreset": "",
  "sideStripePreset": "",
  "baseColor": "#003E7E",
  "leftSleeveColor": "#003E7E",
  "rightSleeveColor": "#003E7E",
  "leftSleeveDetailColor": "",
  "rightSleeveDetailColor": "",
  "neckCircleColor": "#FFFFFF",
  "leftNeckCircleColor": "",
  "shoulderPanelColor": "",
  "stripePrimaryColor": "#FFFFFF",
  "stripeSecondaryColor": "#003E7E",
  "stripeTertiaryColor": "#002F5F",
  "sleeveStripePrimaryColor": "#FFFFFF",
  "sleeveStripeSecondaryColor": "#003E7E",
  "sideStripePrimaryColor": "",
  "sideStripeSecondaryColor": "",
  "footballBackEnabled": true,
  "footballBackName": "MATTHEWS",
  "footballBackNumber": "34",
  "footballBackFontFamily": "Barlow Condensed",
  "footballBackFontWeight": 700,
  "footballBackTextColor": "#FFFFFF",
  "footballBackTextOutlineEnabled": false,
  "footballBackTextOutlineColor": "#000000",
  "footballBackTextOutlineWidth": 2,
  "footballBackNameCurveAmount": 0,
  "footballBackNameSize": 4,
  "footballBackNumberSize": 16,
  "footballBackNameY": 11,
  "footballBackNumberY": 21,
  "state": {
    "baseColor": "#003E7E",
    "leftSleeveColor": "#003E7E",
    "rightSleeveColor": "#003E7E",
    "leftSleeveDetailColor": "",
    "rightSleeveDetailColor": "",
    "neckCircleColor": "#FFFFFF",
    "leftNeckCircleColor": "",
    "shoulderPanelColor": "",
    "stripePrimaryColor": "#FFFFFF",
    "stripeSecondaryColor": "#003E7E",
    "stripeTertiaryColor": "#002F5F",
    "sleeveStripePrimaryColor": "#FFFFFF",
    "sleeveStripeSecondaryColor": "#003E7E",
    "sideStripePrimaryColor": "",
    "sideStripeSecondaryColor": "",
    "footballBackEnabled": true,
    "footballBackName": "MATTHEWS",
    "footballBackNumber": "34",
    "footballBackFontFamily": "Barlow Condensed",
    "footballBackFontWeight": 700,
    "footballBackTextColor": "#FFFFFF",
    "footballBackTextOutlineEnabled": false,
    "footballBackTextOutlineColor": "#000000",
    "footballBackTextOutlineWidth": 2,
    "footballBackNameCurveAmount": 0,
    "footballBackNameSize": 4,
    "footballBackNumberSize": 16,
    "footballBackNameY": 11,
    "footballBackNumberY": 21
  }
}
```

### Notes

- Use uppercase `#RRGGBB` for non-empty colors.
- For non-applicable fields in a sport, prefer `""`.
- Keep top-level color/player fields in sync with `state` fields.
- Keep only one main preset key populated (`stripesPreset`, `horizontalStripesPreset`, or `customShapePreset`).
- For small-size renders, keep text outlines subtle to preserve readability.

## API Contracts

### Generate jersey

`POST /.netlify/functions/generate-jersey`

Request:

```json
{
  "sport": "basketball",
  "teamName": "Chicago Bulls",
  "leagueOrCountry": "NBA, USA",
  "designBrief": "City edition, clean side stripes",
  "styleNotes": "City edition, clean side stripes",
  "includePlayerText": true
}
```

Success response:

```json
{
  "config": {
    "...": "validated jersey config object"
  }
}
```

Error response:

```json
{
  "error": "message"
}
```

### Export SVG

`POST /.netlify/functions/export-svg`

Request:

```json
{
  "filename": "my-jersey.svg",
  "svg": "<svg ...>...</svg>"
}
```

Success response:

- HTTP 200
- Body: SVG XML (`image/svg+xml`)

## Custom SVG Overlay Guide

- Use the `Custom Overlay` section in a sport editor.
- Upload `.svg` files only.
- The app sanitizes uploaded SVG by removing:
  - `<script>`
  - `<foreignObject>`
  - inline event handlers (`on*`)
  - `javascript:` links in `href`/`xlink:href`
- You can tune:
  - X offset
  - Y offset
  - Scale
  - Rotation

## AI Prompt Copy Guide

- Open upload menu -> `Copy AI prompt`.
- Choose sport (if needed), enter team + country/league + optional brief.
- Toggle include player text.
- Click `Copy prompt`.
- Paste into your own LLM workflow if you want manual iteration outside the app.

## Troubleshooting

- `Missing GEMINI_API_KEY`
  - Set `GEMINI_API_KEY` in function environment.
- AI generate returns validation errors
  - Ensure request sport is valid and required fields are sent.
- SVG export fails
  - Check `/.netlify/functions/export-svg` availability.
  - Validate generated SVG payload size (< 2 MB).
- Redirects to password page repeatedly
  - Confirm both `VITE_ROUTE_PASSWORD_ENABLED=true` and `VITE_APP_SECRET_PASSWORD` are set.
  - Clear browser storage/cookies if needed.

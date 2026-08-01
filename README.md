[![Travel Albums](/readme/landing.png)](https://github.com/rand0mC0d3r/trip-gallery)

**[Try out the DEMO](https://app.travel-albums.com/#/allPhotos)**


# 🗺️ Travel Albums

> **TL;DR:** A local-first React gallery for exploring a Google Takeout-style photo archive. It indexes photo metadata, generates thumbnails, and turns a large personal collection into filterable galleries, timelines, places, trips, albums, and maps.

Travel Albums pairs a Vite/React interface with a small Express server and a Node-based indexer. Your original files remain on disk; the app reads from configured folders and serves local previews.

## ✨ What it can do

[![Travel Albums](/readme/features.png)](https://github.com/rand0mC0d3r/trip-gallery)

- 🖼️ Browse all indexed photos in grid, row, scroller, day, or negative-conversion views.
- 🧭 Group collections into dashboard sections such as albums, countries, cities, people/pets, trips, timeline, tags, and “now and then”.
- 📍 Use EXIF/GPS metadata for location-aware views and nearby-place suggestions.
- 🔎 Filter, sort, search, pin, select, favorite, tag, ignore, or mark photos private.
- ⌨️ Navigate and select photos with keyboard shortcuts.
- 🗂️ Generate thumbnails and normalized metadata from Takeout sidecar JSON files.
- ⚙️ Configure source, cache, metadata, thumbnail size, and quality paths through the UI/server configuration.
- 🎞️ Inspect EXIF details, maps, charts, collages, and image-negative conversion tools.

## 🚀 Quick start

### Prerequisites

- Node.js 18 or higher (a current LTS release is recommended). The bundled server targets Node 18; newer supported Node releases are expected to work.
- npm
- A local photo archive with Google Takeout-compatible JSON sidecars
- Enough disk space for the thumbnail cache


### Install and run

> ⚠️ **Local-only data:** the server can read your configured media directories. Before starting it, keep the machine firewall enabled and do not expose port `3001` (or your chosen `PORT`) to untrusted networks.

```bash
npm install
npm run dev
```

This starts:

| Service | Default address | Purpose |
| --- | --- | --- |
| Vite client | `http://localhost:5173` | React gallery UI |
| Express server | `http://localhost:3001` | Local archive, thumbnail, metadata, and job API |

> 💡 Set `PORT` before starting the server to use another API port, for example `PORT=4000 npm run server`.

### Index a collection

```bash
npm run indexer:hdd
```

The indexer reads `server-config.json`, discovers JSON sidecars, creates thumbnails under `TARGET_ROOT/thumbnails`, and appends normalized records to `TARGET_ROOT/metadata.json`. Re-running it resumes from metadata already written, so it is suitable for long-running collections.

> ⚠️ **Privacy:** this application is intended for local use. Do not expose the Express server to an untrusted network: it reads local media and offers configured, allowlisted script jobs.

## 🧑‍💻 Everyday use

| Goal | Where to start |
| --- | --- |
| Browse everything | Open **All Photos** |
| Discover groups | Open the **Dashboard** and select a populated section |
| Change presentation | Use the gallery-type control to switch grid, rows, scroller, per-day, or negative modes |
| Compare or curate | Turn on selection mode, select photos, then apply favorite/private/ignore/tag actions |
| Navigate efficiently | Use `←` / `→` to move the preview; in selection mode, use `Enter` to toggle the current photo |
| Refresh source data | Check **Indexer** and **Settings** |

The UI uses hash routing, so it can be hosted from a relative path and its views can be deep-linked with URLs such as `#/allPhotos` and `#/selectedPhotos/:type_name/:id`.

## 🗂️ Project structure

```text
.
├── src/
│   ├── components/       # Reusable UI pieces and route host
│   ├── context/          # App-wide state providers and persisted stores
│   ├── data/             # Routes and geographic reference data
│   ├── hooks/            # Fetching, transforms, pipelines, sections, and workers
│   ├── layout/           # Header, sidebar, breadcrumbs, status bar, shell
│   ├── lib/              # Shared domain types, i18n, storage, and services
│   ├── modals/           # Onboarding, server, search, and indexer flows
│   ├── pages/            # Route-level gallery/dashboard/settings views
│   └── routes.ts         # Data-driven route normalization and menu generation
├── scripts/
│   └── indexer.mjs       # Takeout scanner, thumbnail creator, metadata writer
├── server-utils/         # Compression, filesystem, thumbnail, and job helpers
├── server.mjs            # Local Express API and static media serving
├── server-config.json    # Local archive/cache configuration (machine-specific)
└── vite.config.ts        # Vite, aliases, build options, and bundle analysis
```

## 🧩 Architecture and patterns

### Client

- **React 19 + TypeScript + Vite** power the client; `@/` aliases `src/`.
- **Material UI** and Emotion provide the component system and theme-aware styling.
- **React Router** maps a JSON route catalog to pages, redirects, and menu items.
- **React Query** wraps client data fetching, while focused React context stores hold gallery state.
- **i18next** supplies localization wiring.

`AppProviders` composes settings, theme, notifications, filters, selection, labels, favorites, privacy, and derived gallery-data providers around the route tree. This keeps page components focused on rendering and interaction.

### Server and indexer

- The Express server exposes health, configuration, local file, thumbnail, metadata, city, airport, and script-job endpoints.
- Images are served only after path containment and image-type checks.
- The indexer uses `sharp` to create thumbnails, reads JSON sidecars, derives dimensions and location context, and writes records incrementally.
- `server-utils/` centralizes filesystem, compression, thumbnails, and controlled script execution.

### Data model

The client’s core `GalleryPhoto` model (`src/lib/galleryData.ts`) includes:

```text
id, albumName, title, batch, takenAt, takenAtTs, width,
latitude?, longitude?, people[], imageUrl, sourceUrl, tiny,
likes, views, description, social[]
```

Section hooks transform these records into UI-ready groups. A section contains a type, title, and sets of photos; the dashboard and selected routes consume those derived collections rather than reimplementing grouping logic.

## 🎛️ Extending the interface

### Add a route or page

1. Create a page under `src/pages/`.
2. Register its component key in `src/routes.ts`.
3. Add a matching entry in `src/data/routes.json`.
4. Control visibility, menu inclusion, label, icon, and order from the route JSON.

### Add a derived gallery section

Place reusable grouping logic in `src/hooks/sections/`. Compose existing data-transform hooks and return stable, UI-ready section data. The section provider makes the result available to the dashboard, navigation, and selected-gallery routes.

### Add a visualization

The gallery visualization selector chooses a renderer based on the persisted `albumType` setting. Keep a new page-local renderer adjacent to its consuming page in a feature-specific components folder; place shared UI in `src/components/`. Use the existing renderer contracts that accept `GalleryPhoto[]`.

### Add state or remote data

- Keep reusable state logic in `src/hooks/`.
- Use a focused context store when state is shared across unrelated views.
- Put request wrappers in `src/hooks/remote/` and expose loading, error, data, and refresh/cancellation behavior.
- Keep source modules out of `src/gallery`, which is reserved for volatile gallery data/assets.

## ⚡ Performance notes

Trip Gallery is designed for photo libraries that do not fit comfortably in a single DOM render:

- `react-virtuoso` backs grid and row gallery renderers to virtualize long lists.
- Background workers perform expensive grouping and filtering for sections.
- Derived hooks favor memoized, stable data transformations to limit rerenders.
- The indexer uses configurable HDD/SSD concurrency, streams metadata in batches, resumes existing records, and disables Sharp’s in-process cache.
- The server coalesces concurrent archive scans, caches selected API responses, compresses responses, and emits immutable cache headers for thumbnails and geographic reference data.
- Vite ignores archive, thumbnail, and sprite folders during development watch; `npm run analyze` emits `dist/stats.json` for bundle inspection.

## 🛠️ Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite client and local server together |
| `npm run server` | Start only the Express server |
| `npm run build` | Create a production client build |
| `npm run preview` | Build, preview the client, and start the server |

## 🧠 Scripts documentation

- Human + AI guide for the indexing pipeline: [scripts/README.md](scripts/README.md)

## ✅ Contribution guidelines

- Keep components small and place reusable components in `src/components/`.
- Use one React component per file.
- Prefer Material UI component props, theme tokens, and scoped `sx` styling over raw inline styles.
- Extract reusable React behavior into `src/hooks/`; name hooks with `use…`.
- Keep transforms deterministic and memoize expensive derived data.
- If `src/gallery` is present in a working copy, treat it as volatile gallery data/assets and do not add source modules there.
- Do not commit personal paths, archives, thumbnails, generated metadata, or credentials.
- Run `npm run lint` and `npm run build` before opening a pull request.

## 📦 Build and packaging

The standard build produces static client assets in `dist/` with relative asset paths, which supports desktop/embedded packaging. The project also includes commands to bundle the Node server and indexer with esbuild and copy artifacts to a sibling builder project.

---

Built for exploring local travel memories—without handing your photo library to a cloud service. ✈️

# Admin Dashboard (Astro)

This project is a minimal Astro conversion of the provided HTML/CSS.

How to run

1. Install dependencies:

```powershell
npm install
```

2. Start the dev server:

```powershell
npm run dev
```

Notes
- Your original `style.css` was copied to `public/style.css` and is loaded from the base layout.
- Components live in `src/components`. The page `src/pages/index.astro` uses `Search` and `ProfileCard` components.
- If you have local images in the existing `assets/` folder, move them into `public/assets/` so they are served correctly by Astro.

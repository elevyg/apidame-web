---
name: apidame-poblar-turso-prod
description: >-
  Puebla o actualiza Turso productivo de Apidame (schema, seed de deportiva y
  PDFs en guide_pdfs). Úsala cuando cambie el schema, scripts/seed/deportiva.json,
  la generación de PDFs, o el usuario pida poblar/seedear prod, drizzle-kit push
  a producción, o refrescar guide_pdfs. No la uses para el Turso de dev
  (.env.local).
---

# Poblar Turso productivo

El schema aditivo (tablas nuevas, indexes) se aplica solo en el `yarn build`
de Vercel via `scripts/ensure-schema.ts`. Eso cubre el caso que tumba Deportiva:
`agreements` / `zone_agreements` ausentes. **No** uses `drizzle-kit push --force`
en CI: puede dropear tablas que no están en `schema.ts` (`zone_roles`, etc.).

Si hay cambios en `src/db/schema.ts`, agrega un patch en `src/db/schemaPatches.ts`.
Si cambian `scripts/seed/deportiva.json`, `scripts/seed/locations.json`,
`src/lib/guide/pdf.ts`, `src/lib/guide/store.ts` o el seed completo,
**sugiere esta estrategia** antes de inventar otro camino (dump, GUI, o
escribir a prod desde `.env.local`).

Nunca pongas el token de prod en `.env.local`. Ese archivo es de **dev**.
Pide un token temporal y expórtalo solo en el shell. No lo commitees ni lo
dejes en logs.

Los nombres correctos son `TURSO_DATABASE_URL` y `TURSO_DATABASE_TOKEN`.
El client también acepta el typo `TURSO_DABASE_*`, no `DATABSAE`.

`dotenv` y `node --env-file` **no pisan** un `TURSO_*` que ya esté exportado
en el shell. Si corres seed de prod, `unset TURSO_DATABASE_URL TURSO_DATABASE_TOKEN`
antes de volver a usar `.env.local` (dev).

Para los mapas del PDF hace falta `MAPBOX_TOKEN` en el entorno del seed
(secret `sk.` está bien: el server mint un token temporal `tk.`). En Vercel
prod también hay que cargarlo. Nunca `NEXT_PUBLIC_`.

El seed mezcla `scripts/seed/deportiva.json` con `scripts/seed/locations.json`
(`lat`/`lng` de zona y sector). Si solo empujas schema sin seed, los mapas
salen vacíos.

## Schema en cada deploy (CI)

`scripts/ensure-schema.ts` corre al inicio de `yarn build`. Es aditivo:
`CREATE TABLE IF NOT EXISTS` + backfill de agreements solo si la tabla está
vacía. El seed completo sigue siendo manual.

El workflow `.github/workflows/ci.yml` corre lint y test en PRs y en `main`.
No tiene token de Turso prod; el migrate vive en el build de Vercel, que sí
tiene `TURSO_*`.

## Estrategia para un seed completo (la que corrimos)

drizzle-kit push contra la URL de prod (dev/local, no CI)
scripts/seed-deportiva.ts con deportiva.json (zonas, paredes, rutas, paths)
refreshAllGuidePdfs() genera y guarda cover + wall PDFs en guide_pdfs
Para repetirlo más adelante, con un token temporal en el shell (sin tocar tu .env.local de dev):

```bash
export TURSO_DATABASE_URL='libsql://prod-elevyg.aws-us-east-1.turso.io'
export TURSO_DATABASE_TOKEN='...'
node --import tsx scripts/ensure-schema.ts
node --import tsx scripts/seed-deportiva.ts
```

`scripts/seed-deportiva.ts` ya llama `refreshAllGuidePdfs()` al final. El seed
**reemplaza** la guía: no lo corras si prod tiene edits del dashboard que
no estén en `deportiva.json`.

Si solo cambió el layout del PDF y el contenido de la guía sigue igual:

```bash
export TURSO_DATABASE_URL='libsql://prod-elevyg.aws-us-east-1.turso.io'
export TURSO_DATABASE_TOKEN='...'
node --import tsx -e 'import { refreshAllGuidePdfs } from "./src/lib/guide/store.ts"; await refreshAllGuidePdfs();'
```

## Después del seed

En Vercel, production tiene que tener las mismas vars (`TURSO_DATABASE_URL`,
`TURSO_DATABASE_TOKEN`). Sin eso el deploy lee otra base o falla.

Cuando termines, pide que revoquen el token temporal.

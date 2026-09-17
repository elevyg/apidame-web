"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  searchAdminCatalog,
  type AdminKind,
  type AdminSearchItem,
} from "@/lib/guide/adminSearch";

const KIND_LABEL: Record<AdminKind, string> = {
  zona: "Zona",
  sector: "Sector",
  pared: "Pared",
  ruta: "Ruta",
};

type AdminSearchProps = {
  items: AdminSearchItem[];
};

function contextFromPath(pathname: string, items: AdminSearchItem[]) {
  const zoneId = pathname.match(/\/dashboard\/zonas\/([^/#]+)/)?.[1];
  const wallId = pathname.match(/\/dashboard\/paredes\/([^/#]+)/)?.[1];
  const routeId = pathname.match(/\/dashboard\/rutas\/([^/#]+)/)?.[1];
  const here = items.find((item) => {
    if (routeId) return item.kind === "ruta" && item.id === routeId;
    if (wallId) return item.kind === "pared" && item.id === wallId;
    if (zoneId) return item.kind === "zona" && item.id === zoneId;
    return false;
  });
  return {
    zoneId: here?.zoneId ?? zoneId,
    sectorId: here?.sectorId,
    wallId: here?.wallId ?? wallId,
  };
}

export default function AdminSearch({ items }: AdminSearchProps) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  useEffect(() => {
    setQuery("");
  }, [pathname]);
  const result = useMemo(
    () => searchAdminCatalog(items, query),
    [items, query],
  );
  const context = useMemo(
    () => contextFromPath(pathname, items),
    [pathname, items],
  );
  const addHref = (kind: "sector" | "pared" | "ruta") => {
    const params = new URLSearchParams({ q: query.trim(), kind });
    if (context.zoneId) params.set("zoneId", context.zoneId);
    if (context.sectorId) params.set("sectorId", context.sectorId);
    if (context.wallId) params.set("wallId", context.wallId);
    return `/dashboard/agregar?${params.toString()}`;
  };

  return (
    <div>
      <label className="font-brown text-ink-soft text-xs tracking-[0.16em] uppercase">
        Buscar o agregar
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Zona, sector, pared o ruta"
          className="border-rule text-ink mt-2 block w-full border px-4 py-3 text-base tracking-normal normal-case"
          autoComplete="off"
        />
      </label>
      {query.trim() ? (
        <div className="mt-4">
          {result.hits.length > 0 ? (
            <ul className="divide-rule divide-y border-rule border-y">
              {result.hits.map((hit) => (
                <li key={`${hit.kind}-${hit.id}`}>
                  <Link
                    href={hit.href}
                    className="flex items-baseline justify-between gap-4 py-3"
                  >
                    <span>
                      <span className="font-display text-xl">{hit.name}</span>
                      <span className="font-brown text-ink-soft mt-1 block text-xs">
                        {hit.crumb}
                      </span>
                    </span>
                    <span className="font-brown text-ink-soft text-xs tracking-[0.14em] uppercase">
                      {KIND_LABEL[hit.kind]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-brown text-ink-soft text-sm">
              No está en la guía.
            </p>
          )}
          {result.canCreate ? (
            <div className="mt-5">
              <p className="font-brown text-sm">
                ¿Agregar “{query.trim()}” como qué?
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href={addHref("sector")}
                  className="font-brown border-rule border px-3 py-2 text-xs tracking-[0.14em] uppercase"
                >
                  Sector
                </Link>
                <Link
                  href={addHref("pared")}
                  className="font-brown border-rule border px-3 py-2 text-xs tracking-[0.14em] uppercase"
                >
                  Pared
                </Link>
                <Link
                  href={addHref("ruta")}
                  className="font-brown border-rule border px-3 py-2 text-xs tracking-[0.14em] uppercase"
                >
                  Ruta
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

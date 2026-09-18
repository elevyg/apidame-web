import Link from "next/link";
import { actorZoneIds, requireActor } from "@/lib/guide/authz";
import { getAdminTree } from "@/lib/guide/queries";
import { nextCreateStep, type CreateKind } from "@/lib/guide/adminCreate";
import { createRoute, createSector, createWall } from "../actions";

type AddPageProps = {
  searchParams: Promise<{
    q?: string;
    kind?: string;
    zoneId?: string;
    sectorId?: string;
    wallId?: string;
  }>;
};

function asKind(value?: string): CreateKind | null {
  if (value === "sector" || value === "pared" || value === "ruta") return value;
  return null;
}

function hrefWith(
  current: Record<string, string | undefined>,
  patch: Record<string, string>,
) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...current, ...patch })) {
    if (value) params.set(key, value);
  }
  return `/dashboard/agregar?${params.toString()}`;
}

export default async function AddEntityPage({ searchParams }: AddPageProps) {
  const params = await searchParams;
  const kind = asKind(params.kind);
  const actor = await requireActor();
  const zoneIds = await actorZoneIds(actor);
  const tree = await getAdminTree(zoneIds);
  const zone = tree.find((row) => row.id === params.zoneId) ?? null;
  const sector =
    zone?.sectors.find((row) => row.id === params.sectorId) ??
    tree
      .flatMap((row) => row.sectors)
      .find((row) => row.id === params.sectorId) ??
    null;
  const inferredZone = zone ?? tree.find((row) =>
    row.sectors.some((item) => item.id === sector?.id),
  );
  const wall =
    sector?.walls.find((row) => row.id === params.wallId) ??
    tree
      .flatMap((row) => row.sectors.flatMap((item) => item.walls))
      .find((row) => row.id === params.wallId) ??
    null;
  const step = nextCreateStep({
    kind,
    zoneId: inferredZone?.id ?? params.zoneId,
    sectorId: sector?.id ?? params.sectorId,
    wallId: wall?.id ?? params.wallId,
  });
  const name = (params.q ?? "").trim();
  const current = {
    q: params.q,
    kind: params.kind,
    zoneId: inferredZone?.id ?? params.zoneId,
    sectorId: sector?.id ?? params.sectorId,
    wallId: wall?.id ?? params.wallId,
  };

  return (
    <section className="page-shell py-12">
      <p className="kicker">Agregar</p>
      <h1 className="font-display mt-2 text-4xl">
        {name || "Nueva entidad"}
      </h1>
      <Link
        href="/dashboard"
        className="font-brown text-ink-soft mt-3 inline-block text-xs tracking-[0.14em] uppercase"
      >
        Volver
      </Link>

      {step === "kind" ? (
        <Choice
          title="¿Qué es?"
          options={[
            { href: hrefWith(current, { kind: "sector" }), label: "Sector" },
            { href: hrefWith(current, { kind: "pared" }), label: "Pared" },
            { href: hrefWith(current, { kind: "ruta" }), label: "Ruta" },
          ]}
        />
      ) : null}

      {step === "zone" ? (
        <Choice
          title="¿En qué zona?"
          options={tree.map((item) => ({
            href: hrefWith(current, { zoneId: item.id }),
            label: item.name,
          }))}
        />
      ) : null}

      {step === "sector" ? (
        <Choice
          title="¿En qué sector?"
          options={(inferredZone?.sectors ?? []).map((item) => ({
            href: hrefWith(current, {
              zoneId: inferredZone?.id ?? "",
              sectorId: item.id,
            }),
            label: item.name,
          }))}
        />
      ) : null}

      {step === "wall" ? (
        <Choice
          title="¿En qué pared?"
          options={(sector?.walls ?? []).map((item) => ({
            href: hrefWith(current, { wallId: item.id }),
            label: item.name,
          }))}
        />
      ) : null}

      {step === "ready" && kind === "sector" && inferredZone ? (
        <form action={createSector} className="mt-10 grid max-w-xl gap-3">
          <input type="hidden" name="zoneId" value={inferredZone.id} />
          <NameField defaultValue={name} />
          <p className="font-brown text-ink-soft text-sm">
            Queda en {inferredZone.name}.
          </p>
          <Submit label="Crear sector" />
        </form>
      ) : null}

      {step === "ready" && kind === "pared" && sector ? (
        <form action={createWall} className="mt-10 grid max-w-xl gap-3">
          <input type="hidden" name="sectorId" value={sector.id} />
          <NameField defaultValue={name} />
          <p className="font-brown text-ink-soft text-sm">
            Queda en {inferredZone?.name} · {sector.name}.
          </p>
          <Submit label="Crear pared" />
        </form>
      ) : null}

      {step === "ready" && kind === "ruta" && wall ? (
        <form action={createRoute} className="mt-10 grid max-w-xl gap-3">
          <input type="hidden" name="wallId" value={wall.id} />
          <NameField defaultValue={name} />
          <label className="font-brown text-sm">
            Grado
            <input
              name="grade"
              className="border-rule mt-1 block w-full border px-3 py-2"
            />
          </label>
          <p className="font-brown text-ink-soft text-sm">
            Queda en {wall.name}.
          </p>
          <Submit label="Crear ruta" />
        </form>
      ) : null}
    </section>
  );
}

function NameField({ defaultValue }: { defaultValue: string }) {
  return (
    <label className="font-brown text-sm">
      Nombre
      <input
        name="name"
        defaultValue={defaultValue}
        required
        className="border-rule mt-1 block w-full border px-3 py-2"
      />
    </label>
  );
}

function Submit({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="font-brown border-rule w-fit border px-4 py-2 text-xs tracking-[0.16em] uppercase"
    >
      {label}
    </button>
  );
}

function Choice({
  title,
  options,
}: {
  title: string;
  options: Array<{ href: string; label: string }>;
}) {
  return (
    <div className="mt-10">
      <h2 className="font-display text-2xl">{title}</h2>
      {options.length === 0 ? (
        <p className="font-brown text-ink-soft mt-4 text-sm">
          No hay opciones todavía. Crea el padre antes.
        </p>
      ) : (
        <ul className="divide-rule mt-4 divide-y border-rule border-y">
          {options.map((option) => (
            <li key={option.href}>
              <Link
                href={option.href}
                className="font-display block py-4 text-2xl"
              >
                {option.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

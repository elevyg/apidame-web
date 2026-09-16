import {
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
  index,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  image: text("image"),
  role: text("role").notNull().default("user"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const zones = sqliteTable(
  "zones",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    coverImageUrl: text("cover_image_url"),
    coverImageWidth: integer("cover_image_width"),
    coverImageHeight: integer("cover_image_height"),
    coverPublicId: text("cover_public_id"),
    published: integer("published", { mode: "boolean" }).notNull().default(true),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [uniqueIndex("zones_slug_idx").on(table.slug)],
);

export const sectors = sqliteTable(
  "sectors",
  {
    id: text("id").primaryKey(),
    zoneId: text("zone_id")
      .notNull()
      .references(() => zones.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    position: integer("position").notNull().default(0),
    kind: text("kind").notNull().default("Wall"),
  },
  (table) => [
    index("sectors_zone_idx").on(table.zoneId),
    uniqueIndex("sectors_zone_slug_idx").on(table.zoneId, table.slug),
  ],
);

export const walls = sqliteTable(
  "walls",
  {
    id: text("id").primaryKey(),
    sectorId: text("sector_id")
      .notNull()
      .references(() => sectors.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    position: integer("position").notNull().default(0),
  },
  (table) => [
    index("walls_sector_idx").on(table.sectorId),
    uniqueIndex("walls_sector_slug_idx").on(table.sectorId, table.slug),
  ],
);

export const topos = sqliteTable(
  "topos",
  {
    id: text("id").primaryKey(),
    wallId: text("wall_id")
      .notNull()
      .references(() => walls.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name"),
    position: integer("position").notNull().default(0),
    main: integer("main", { mode: "boolean" }).notNull().default(false),
    routeStrokeWidth: real("route_stroke_width").notNull().default(1),
    imageUrl: text("image_url").notNull(),
    imageWidth: integer("image_width"),
    imageHeight: integer("image_height"),
    imagePublicId: text("image_public_id"),
  },
  (table) => [index("topos_wall_idx").on(table.wallId)],
);

export const routes = sqliteTable(
  "routes",
  {
    id: text("id").primaryKey(),
    wallId: text("wall_id")
      .notNull()
      .references(() => walls.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    position: integer("position").notNull().default(0),
    kind: text("kind").notNull().default("Sport"),
    unknownName: integer("unknown_name", { mode: "boolean" })
      .notNull()
      .default(false),
    description: text("description"),
    grade: text("grade"),
    gradeSystem: text("grade_system"),
    length: real("length"),
    lengthUnit: text("length_unit"),
  },
  (table) => [index("routes_wall_idx").on(table.wallId)],
);

export const routePaths = sqliteTable(
  "route_paths",
  {
    id: text("id").primaryKey(),
    topoId: text("topo_id")
      .notNull()
      .references(() => topos.id, { onDelete: "cascade" }),
    routeId: text("route_id")
      .notNull()
      .references(() => routes.id, { onDelete: "cascade" }),
    path: text("path").notNull(),
    labelPoint: text("label_point"),
    pitchLabelPoint: text("pitch_label_point"),
    hideStart: integer("hide_start", { mode: "boolean" })
      .notNull()
      .default(false),
  },
  (table) => [
    index("route_paths_topo_idx").on(table.topoId),
    index("route_paths_route_idx").on(table.routeId),
  ],
);

export const zonesRelations = relations(zones, ({ many }) => ({
  sectors: many(sectors),
}));

export const sectorsRelations = relations(sectors, ({ one, many }) => ({
  zone: one(zones, { fields: [sectors.zoneId], references: [zones.id] }),
  walls: many(walls),
}));

export const wallsRelations = relations(walls, ({ one, many }) => ({
  sector: one(sectors, { fields: [walls.sectorId], references: [sectors.id] }),
  topos: many(topos),
  routes: many(routes),
}));

export const toposRelations = relations(topos, ({ one, many }) => ({
  wall: one(walls, { fields: [topos.wallId], references: [walls.id] }),
  paths: many(routePaths),
}));

export const routesRelations = relations(routes, ({ one, many }) => ({
  wall: one(walls, { fields: [routes.wallId], references: [walls.id] }),
  paths: many(routePaths),
}));

export const routePathsRelations = relations(routePaths, ({ one }) => ({
  topo: one(topos, { fields: [routePaths.topoId], references: [topos.id] }),
  route: one(routes, { fields: [routePaths.routeId], references: [routes.id] }),
}));

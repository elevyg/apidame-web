CREATE TABLE IF NOT EXISTS `agreements` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`classic` text,
	`icon` text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `guide_pdfs` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`zone_id` text NOT NULL,
	`wall_id` text,
	`filename` text NOT NULL,
	`bytes` blob NOT NULL,
	`generated_at` integer NOT NULL,
	FOREIGN KEY (`zone_id`) REFERENCES `zones`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`wall_id`) REFERENCES `walls`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `guide_pdfs_zone_idx` ON `guide_pdfs` (`zone_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `guide_pdfs_wall_idx` ON `guide_pdfs` (`wall_id`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `route_paths` (
	`id` text PRIMARY KEY NOT NULL,
	`topo_id` text NOT NULL,
	`route_id` text NOT NULL,
	`path` text NOT NULL,
	`label_point` text,
	`pitch_label_point` text,
	`hide_start` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`topo_id`) REFERENCES `topos`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`route_id`) REFERENCES `routes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `route_paths_topo_idx` ON `route_paths` (`topo_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `route_paths_route_idx` ON `route_paths` (`route_id`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `routes` (
	`id` text PRIMARY KEY NOT NULL,
	`wall_id` text NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	`kind` text DEFAULT 'Sport' NOT NULL,
	`unknown_name` integer DEFAULT false NOT NULL,
	`description` text,
	`grade` text,
	`grade_system` text,
	`length` real,
	`length_unit` text,
	FOREIGN KEY (`wall_id`) REFERENCES `walls`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `routes_wall_idx` ON `routes` (`wall_id`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `sectors` (
	`id` text PRIMARY KEY NOT NULL,
	`zone_id` text NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	`kind` text DEFAULT 'Wall' NOT NULL,
	`latitude` real,
	`longitude` real,
	FOREIGN KEY (`zone_id`) REFERENCES `zones`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `sectors_zone_idx` ON `sectors` (`zone_id`);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `sectors_zone_slug_idx` ON `sectors` (`zone_id`,`slug`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `topos` (
	`id` text PRIMARY KEY NOT NULL,
	`wall_id` text NOT NULL,
	`slug` text NOT NULL,
	`name` text,
	`position` integer DEFAULT 0 NOT NULL,
	`main` integer DEFAULT false NOT NULL,
	`route_stroke_width` real DEFAULT 1 NOT NULL,
	`image_url` text NOT NULL,
	`image_width` integer,
	`image_height` integer,
	`image_public_id` text,
	FOREIGN KEY (`wall_id`) REFERENCES `walls`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `topos_wall_idx` ON `topos` (`wall_id`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`image` text,
	`role` text DEFAULT 'user' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `walls` (
	`id` text PRIMARY KEY NOT NULL,
	`sector_id` text NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`sector_id`) REFERENCES `sectors`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `walls_sector_idx` ON `walls` (`sector_id`);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `walls_sector_slug_idx` ON `walls` (`sector_id`,`slug`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `zone_agreements` (
	`id` text PRIMARY KEY NOT NULL,
	`zone_id` text NOT NULL,
	`agreement_id` text NOT NULL,
	`level` text NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	`comment` text,
	FOREIGN KEY (`zone_id`) REFERENCES `zones`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`agreement_id`) REFERENCES `agreements`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `zone_agreements_zone_idx` ON `zone_agreements` (`zone_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `zone_agreements_agreement_idx` ON `zone_agreements` (`agreement_id`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `zones` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`cover_image_url` text,
	`cover_image_width` integer,
	`cover_image_height` integer,
	`cover_public_id` text,
	`latitude` real,
	`longitude` real,
	`published` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `zones_slug_idx` ON `zones` (`slug`);
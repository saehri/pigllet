PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_subscriptions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`amount` integer NOT NULL,
	`billed` text NOT NULL,
	`due_date` text NOT NULL,
	`started_at` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_subscriptions`("id", "name", "amount", "billed", "due_date", "started_at") SELECT "id", "name", "amount", "billed", "due_date", "started_at" FROM `subscriptions`;--> statement-breakpoint
DROP TABLE `subscriptions`;--> statement-breakpoint
ALTER TABLE `__new_subscriptions` RENAME TO `subscriptions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `subscriptions_name_unique` ON `subscriptions` (`name`);
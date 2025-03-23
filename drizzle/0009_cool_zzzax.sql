CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`label` text NOT NULL,
	`icon_name` text NOT NULL,
	`type` text NOT NULL,
	`budget_id` integer,
	`created_at` text NOT NULL,
	FOREIGN KEY (`budget_id`) REFERENCES `budgets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_label_unique` ON `categories` (`label`);--> statement-breakpoint
CREATE UNIQUE INDEX `categories_icon_name_unique` ON `categories` (`icon_name`);
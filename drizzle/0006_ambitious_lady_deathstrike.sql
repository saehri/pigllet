PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`card_name` text NOT NULL,
	`card_holder` text NOT NULL,
	`card_number` text,
	`balance` integer NOT NULL,
	`is_default` integer DEFAULT 0,
	`created_at` text NOT NULL,
	`card_design` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_accounts`("id", "card_name", "card_holder", "card_number", "balance", "is_default", "created_at", "card_design") SELECT "id", "card_name", "card_holder", "card_number", "balance", "is_default", "created_at", "card_design" FROM `accounts`;--> statement-breakpoint
DROP TABLE `accounts`;--> statement-breakpoint
ALTER TABLE `__new_accounts` RENAME TO `accounts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`amount` integer NOT NULL,
	`note` text,
	`account_id` integer NOT NULL,
	`related_account_id` integer,
	`category_id` integer NOT NULL,
	`type` text NOT NULL,
	`image` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`related_account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_transactions`("id", "amount", "note", "account_id", "related_account_id", "category_id", "type", "image", "created_at") SELECT "id", "amount", "note", "account_id", "related_account_id", "category_id", "type", "image", "created_at" FROM `transactions`;--> statement-breakpoint
DROP TABLE `transactions`;--> statement-breakpoint
ALTER TABLE `__new_transactions` RENAME TO `transactions`;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD `created_at` text NOT NULL;
DROP TABLE `expense_categories`;--> statement-breakpoint
DROP TABLE `expenses`;--> statement-breakpoint
DROP TABLE `income_categories`;--> statement-breakpoint
DROP TABLE `incomes`;--> statement-breakpoint
DROP TABLE `transfer_categories`;--> statement-breakpoint
DROP TABLE `transfers`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`amount` integer NOT NULL,
	`note` text,
	`account_id` integer NOT NULL,
	`related_account_id` integer,
	`category_id` integer NOT NULL,
	`type` text NOT NULL,
	`image` text,
	`created_date` integer NOT NULL,
	`created_month` integer NOT NULL,
	`created_year` integer NOT NULL,
	`budget_id` integer,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`related_account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`budget_id`) REFERENCES `budgets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_transactions`("id", "amount", "note", "account_id", "related_account_id", "category_id", "type", "image", "created_date", "created_month", "created_year", "budget_id") SELECT "id", "amount", "note", "account_id", "related_account_id", "category_id", "type", "image", "created_date", "created_month", "created_year", "budget_id" FROM `transactions`;--> statement-breakpoint
DROP TABLE `transactions`;--> statement-breakpoint
ALTER TABLE `__new_transactions` RENAME TO `transactions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `categories` DROP COLUMN `created_at`;
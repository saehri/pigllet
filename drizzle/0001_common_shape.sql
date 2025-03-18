ALTER TABLE `categories` RENAME TO `expense_categories`;--> statement-breakpoint
CREATE TABLE `income_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`label` text NOT NULL,
	`icon_name` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `transfer_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`label` text NOT NULL,
	`icon_name` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `expense_categories` ADD `icon_name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `expense_categories` ADD `budget_id` integer REFERENCES budgets(id);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category_id` integer NOT NULL,
	`amount` integer NOT NULL,
	`note` text,
	`wallet_id` integer NOT NULL,
	`budget_id` integer,
	`created_date` integer NOT NULL,
	`created_month` integer NOT NULL,
	`created_year` integer NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `expense_categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`wallet_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`budget_id`) REFERENCES `budgets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_expenses`("id", "category_id", "amount", "note", "wallet_id", "budget_id", "created_date", "created_month", "created_year") SELECT "id", "category_id", "amount", "note", "wallet_id", "budget_id", "created_date", "created_month", "created_year" FROM `expenses`;--> statement-breakpoint
DROP TABLE `expenses`;--> statement-breakpoint
ALTER TABLE `__new_expenses` RENAME TO `expenses`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_incomes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`amount` integer NOT NULL,
	`note` text,
	`category_id` integer NOT NULL,
	`to_wallet_id` integer NOT NULL,
	`created_date` integer NOT NULL,
	`created_month` integer NOT NULL,
	`created_year` integer NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `income_categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`to_wallet_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_incomes`("id", "amount", "note", "category_id", "to_wallet_id", "created_date", "created_month", "created_year") SELECT "id", "amount", "note", "category_id", "to_wallet_id", "created_date", "created_month", "created_year" FROM `incomes`;--> statement-breakpoint
DROP TABLE `incomes`;--> statement-breakpoint
ALTER TABLE `__new_incomes` RENAME TO `incomes`;--> statement-breakpoint
CREATE TABLE `__new_transfers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`amount` integer NOT NULL,
	`note` text,
	`category_id` integer NOT NULL,
	`from_wallet_id` integer NOT NULL,
	`to_wallet_id` integer NOT NULL,
	`created_date` integer NOT NULL,
	`created_month` integer NOT NULL,
	`created_year` integer NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `transfer_categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`from_wallet_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`to_wallet_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_transfers`("id", "amount", "note", "category_id", "from_wallet_id", "to_wallet_id", "created_date", "created_month", "created_year") SELECT "id", "amount", "note", "category_id", "from_wallet_id", "to_wallet_id", "created_date", "created_month", "created_year" FROM `transfers`;--> statement-breakpoint
DROP TABLE `transfers`;--> statement-breakpoint
ALTER TABLE `__new_transfers` RENAME TO `transfers`;
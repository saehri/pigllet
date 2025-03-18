PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category_id` integer NOT NULL,
	`amount` integer NOT NULL,
	`note` text,
	`account_id` integer NOT NULL,
	`budget_id` integer,
	`created_date` integer NOT NULL,
	`created_month` integer NOT NULL,
	`created_year` integer NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `expense_categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`budget_id`) REFERENCES `budgets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_expenses`("id", "category_id", "amount", "note", "account_id", "budget_id", "created_date", "created_month", "created_year") SELECT "id", "category_id", "amount", "note", "account_id", "budget_id", "created_date", "created_month", "created_year" FROM `expenses`;--> statement-breakpoint
DROP TABLE `expenses`;--> statement-breakpoint
ALTER TABLE `__new_expenses` RENAME TO `expenses`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_incomes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`amount` integer NOT NULL,
	`note` text,
	`category_id` integer NOT NULL,
	`to_account_id` integer NOT NULL,
	`created_date` integer NOT NULL,
	`created_month` integer NOT NULL,
	`created_year` integer NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `income_categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`to_account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_incomes`("id", "amount", "note", "category_id", "to_account_id", "created_date", "created_month", "created_year") SELECT "id", "amount", "note", "category_id", "to_account_id", "created_date", "created_month", "created_year" FROM `incomes`;--> statement-breakpoint
DROP TABLE `incomes`;--> statement-breakpoint
ALTER TABLE `__new_incomes` RENAME TO `incomes`;--> statement-breakpoint
CREATE TABLE `__new_transfers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`amount` integer NOT NULL,
	`note` text,
	`category_id` integer NOT NULL,
	`from_account_id` integer NOT NULL,
	`to_account_id` integer NOT NULL,
	`created_date` integer NOT NULL,
	`created_month` integer NOT NULL,
	`created_year` integer NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `transfer_categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`from_account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`to_account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_transfers`("id", "amount", "note", "category_id", "from_account_id", "to_account_id", "created_date", "created_month", "created_year") SELECT "id", "amount", "note", "category_id", "from_account_id", "to_account_id", "created_date", "created_month", "created_year" FROM `transfers`;--> statement-breakpoint
DROP TABLE `transfers`;--> statement-breakpoint
ALTER TABLE `__new_transfers` RENAME TO `transfers`;--> statement-breakpoint
DROP INDEX `expense_categories_icon_name_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `expense_categories_label_unique` ON `expense_categories` (`label`);--> statement-breakpoint
ALTER TABLE `accounts` ADD `is_cash` integer DEFAULT 0;--> statement-breakpoint
CREATE UNIQUE INDEX `income_categories_label_unique` ON `income_categories` (`label`);--> statement-breakpoint
CREATE UNIQUE INDEX `subscriptions_name_unique` ON `subscriptions` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `transfer_categories_label_unique` ON `transfer_categories` (`label`);
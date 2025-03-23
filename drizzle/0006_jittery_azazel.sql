PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category_id` integer NOT NULL,
	`amount` integer NOT NULL,
	`note` text,
	`account_id` integer NOT NULL,
	`budget_id` integer,
	`image` text,
	`created_date` text NOT NULL,
	`created_month` integer NOT NULL,
	`created_year` integer NOT NULL,
	`created_day` integer NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `expense_categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`budget_id`) REFERENCES `budgets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_expenses`("id", "category_id", "amount", "note", "account_id", "budget_id", "image", "created_date", "created_month", "created_year", "created_day") SELECT "id", "category_id", "amount", "note", "account_id", "budget_id", "image", "created_date", "created_month", "created_year", "created_day" FROM `expenses`;--> statement-breakpoint
DROP TABLE `expenses`;--> statement-breakpoint
ALTER TABLE `__new_expenses` RENAME TO `expenses`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_incomes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`amount` integer NOT NULL,
	`note` text,
	`category_id` integer NOT NULL,
	`to_account_id` integer NOT NULL,
	`image` text,
	`created_date` text NOT NULL,
	`created_month` integer NOT NULL,
	`created_year` integer NOT NULL,
	`created_day` integer NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `income_categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`to_account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_incomes`("id", "amount", "note", "category_id", "to_account_id", "image", "created_date", "created_month", "created_year", "created_day") SELECT "id", "amount", "note", "category_id", "to_account_id", "image", "created_date", "created_month", "created_year", "created_day" FROM `incomes`;--> statement-breakpoint
DROP TABLE `incomes`;--> statement-breakpoint
ALTER TABLE `__new_incomes` RENAME TO `incomes`;--> statement-breakpoint
CREATE TABLE `__new_subscriptions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`amount` integer NOT NULL,
	`billed` text NOT NULL,
	`due_date` text NOT NULL,
	`created_date` text NOT NULL,
	`created_month` integer NOT NULL,
	`created_year` integer NOT NULL,
	`created_day` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_subscriptions`("id", "name", "amount", "billed", "due_date", "created_date", "created_month", "created_year", "created_day") SELECT "id", "name", "amount", "billed", "due_date", "created_date", "created_month", "created_year", "created_day" FROM `subscriptions`;--> statement-breakpoint
DROP TABLE `subscriptions`;--> statement-breakpoint
ALTER TABLE `__new_subscriptions` RENAME TO `subscriptions`;--> statement-breakpoint
CREATE UNIQUE INDEX `subscriptions_name_unique` ON `subscriptions` (`name`);--> statement-breakpoint
CREATE TABLE `__new_transfers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`amount` integer NOT NULL,
	`note` text,
	`category_id` integer NOT NULL,
	`from_account_id` integer NOT NULL,
	`to_account_id` integer NOT NULL,
	`image` text,
	`created_date` text NOT NULL,
	`created_month` integer NOT NULL,
	`created_year` integer NOT NULL,
	`created_day` integer NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `transfer_categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`from_account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`to_account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_transfers`("id", "amount", "note", "category_id", "from_account_id", "to_account_id", "image", "created_date", "created_month", "created_year", "created_day") SELECT "id", "amount", "note", "category_id", "from_account_id", "to_account_id", "image", "created_date", "created_month", "created_year", "created_day" FROM `transfers`;--> statement-breakpoint
DROP TABLE `transfers`;--> statement-breakpoint
ALTER TABLE `__new_transfers` RENAME TO `transfers`;
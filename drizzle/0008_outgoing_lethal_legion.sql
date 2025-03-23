CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`amount` integer NOT NULL,
	`note` text,
	`account_id` integer NOT NULL,
	`related_account_id` integer,
	`category_id` integer NOT NULL,
	`type` text NOT NULL,
	`image` text,
	`created_date` text NOT NULL,
	`created_month` integer NOT NULL,
	`created_year` integer NOT NULL,
	`created_day` integer NOT NULL,
	`budget_id` integer,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`related_account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`budget_id`) REFERENCES `budgets`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE UNIQUE INDEX `accounts_number_unique` ON `accounts` (`number`);--> statement-breakpoint
CREATE UNIQUE INDEX `expense_categories_icon_name_unique` ON `expense_categories` (`icon_name`);--> statement-breakpoint
CREATE UNIQUE INDEX `income_categories_icon_name_unique` ON `income_categories` (`icon_name`);--> statement-breakpoint
CREATE UNIQUE INDEX `transfer_categories_icon_name_unique` ON `transfer_categories` (`icon_name`);
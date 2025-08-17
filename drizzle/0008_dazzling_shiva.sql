CREATE UNIQUE INDEX `budgets_category_id_unique` ON `budgets` (`category_id`);--> statement-breakpoint
ALTER TABLE `budgets` DROP COLUMN `note`;
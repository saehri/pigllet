ALTER TABLE `expenses` ADD `type` text DEFAULT 'expense';--> statement-breakpoint
ALTER TABLE `incomes` ADD `type` text DEFAULT 'income';--> statement-breakpoint
ALTER TABLE `transfers` ADD `type` text DEFAULT 'transfer';
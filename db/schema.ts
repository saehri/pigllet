import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const expenses = sqliteTable('expenses', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	category_id: integer('category_id')
		.notNull()
		.references(() => expenseCategories.id),
	amount: integer('amount').notNull(),
	note: text('note'),
	account_id: integer('account_id')
		.notNull()
		.references(() => accounts.id),
	budget_id: integer('budget_id').references(() => budget.id),
	created_date: text('created_date').notNull(),
	created_month: integer('created_month').notNull(),
	created_year: integer('created_year').notNull(),
	created_day: integer('created_date').notNull(),
});

export const incomes = sqliteTable('incomes', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	amount: integer('amount').notNull(),
	note: text('note'),
	category_id: integer('category_id')
		.notNull()
		.references(() => incomeCategories.id),
	to_account_id: integer('to_account_id')
		.notNull()
		.references(() => accounts.id),
	created_date: text('created_date').notNull(),
	created_month: integer('created_month').notNull(),
	created_year: integer('created_year').notNull(),
	created_day: integer('created_date').notNull(),
});

export const transfers = sqliteTable('transfers', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	amount: integer('amount').notNull(),
	note: text('note'),
	category_id: integer('category_id')
		.notNull()
		.references(() => transferCategories.id),
	from_account_id: integer('from_account_id')
		.notNull()
		.references(() => accounts.id),
	to_account_id: integer('to_account_id')
		.notNull()
		.references(() => accounts.id),
	created_date: text('created_date').notNull(),
	created_month: integer('created_month').notNull(),
	created_year: integer('created_year').notNull(),
	created_day: integer('created_date').notNull(),
});

export const expenseCategories = sqliteTable('expense_categories', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	label: text('label').notNull().unique(),
	icon_name: text('icon_name').notNull(),
	budget_id: integer('budget_id').references(() => budget.id),
	created_at: text('created_at').notNull(),
});

export const incomeCategories = sqliteTable('income_categories', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	label: text('label').notNull().unique(),
	icon_name: text('icon_name').notNull().unique(),
	created_at: text('created_at').notNull(),
});

export const transferCategories = sqliteTable('transfer_categories', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	label: text('label').notNull().unique(),
	icon_name: text('icon_name').notNull().unique(),
	created_at: text('created_at').notNull(),
});

export const accounts = sqliteTable('accounts', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	number: text('number').notNull().unique(),
	balance: integer('balance').notNull(),
	is_cash: integer('is_cash').default(0),
	image: text('image'),
	created_at: text('created_at').notNull(),
});

export const budget = sqliteTable('budgets', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	period: text('period').notNull(),
	max_spending: integer('max_spending').notNull(),
	current_spending: integer('current_spending').notNull(),
	note: text('note'),
	created_at: text('created_at').notNull(),
});

export const subscriptions = sqliteTable('subscriptions', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique(),
	amount: integer('amount').notNull(),
	billed: text('billed').notNull(), // --> once, weekly, monthly, yearly
	due_date: text('due_date').notNull(),
	created_date: text('created_date').notNull(),
	created_month: integer('created_month').notNull(),
	created_year: integer('created_year').notNull(),
	created_day: integer('created_date').notNull(),
});

// Export Task to use as an interface in your app
export type Expense = typeof expenses.$inferSelect;
export type ExpenseCategory = typeof expenseCategories.$inferInsert;
export type Income = typeof incomes.$inferInsert;
export type IncomeCategory = typeof incomeCategories.$inferInsert;
export type Transfer = typeof transfers.$inferInsert;
export type TransferCategory = typeof transferCategories.$inferInsert;
export type Accounts = typeof accounts.$inferInsert;
export type Budget = typeof budget.$inferInsert;
export type Subscription = typeof subscriptions.$inferInsert;

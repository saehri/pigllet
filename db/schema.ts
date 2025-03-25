import { relations } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const transactions = sqliteTable('transactions', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	amount: integer('amount').notNull(),
	note: text('note'),
	account_id: integer('account_id')
		.notNull()
		.references(() => accounts.id, { onDelete: 'cascade' }),
	related_account_id: integer('related_account_id').references(
		() => accounts.id,
		{ onDelete: 'cascade' }
	),
	category_id: integer('category_id')
		.notNull()
		.references(() => categories.id),
	type: text('type').notNull(), // 'expense', 'income', 'transfer'
	image: text('image'),
	created_date: integer('created_date').notNull(),
	created_month: integer('created_month').notNull(),
	created_year: integer('created_year').notNull(),
	budget_id: integer('budget_id').references(() => budget.id),
});

export const categories = sqliteTable('categories', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	label: text('label').notNull().unique(),
	icon_name: text('icon_name').notNull(),
	type: text('type').notNull(), // 'expense', 'income', or 'transfer'
	budget_id: integer('budget_id').references(() => budget.id), // Only for expense categories
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
	created_day: integer('created_day').notNull(),
});

// Define relations for transactions
export const transactionsRelations = relations(transactions, ({ one }) => ({
	account: one(accounts, {
		fields: [transactions.account_id],
		references: [accounts.id],
		relationName: 'accountTransactions',
	}),
	relatedAccount: one(accounts, {
		fields: [transactions.related_account_id],
		references: [accounts.id],
		relationName: 'relatedAccountTransactions',
	}),
	category: one(categories, {
		fields: [transactions.category_id],
		references: [categories.id],
	}),
	budget: one(budget, {
		fields: [transactions.budget_id],
		references: [budget.id],
	}),
}));

// Export Task to use as an interface in your app
export type Accounts = typeof accounts.$inferInsert;
export type Budget = typeof budget.$inferInsert;
export type Subscription = typeof subscriptions.$inferInsert;
export type Transaction = typeof transactions.$inferInsert;
export type TransactionCategories = typeof categories.$inferInsert;

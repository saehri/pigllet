import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// --- ENUMS (enforced in app logic, not DB constraints) ---
export const transactionTypes = ['expense', 'income', 'transfer'] as const;
export type TransactionType = (typeof transactionTypes)[number];

export const billingFrequencies = [
	'once',
	'weekly',
	'monthly',
	'yearly',
] as const;
export type BillingFrequency = (typeof billingFrequencies)[number];

// --- ACCOUNTS ---
export const accounts = sqliteTable('accounts', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	number: text('number').notNull().unique(),
	balance: integer('balance').notNull(),
	is_cash: integer('is_cash').default(0),
	image: text('image'),
	created_at: text('created_at').notNull(), // ISO string
});

// --- CATEGORIES ---
export const categories = sqliteTable('categories', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	label: text('label').notNull().unique(),
	icon_name: text('icon_name').notNull(),
	type: text('type').notNull(), // Enforce app-level: 'expense' | 'income' | 'transfer'
});

// --- BUDGETS ---
export const budgets = sqliteTable('budgets', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	period: text('period').notNull(), // e.g., '2025-01', '2025-Q1'
	max_spending: integer('max_spending').notNull(),
	current_spending: integer('current_spending').notNull(),
	note: text('note'),
	created_at: text('created_at').notNull(),
});

// --- TRANSACTIONS ---
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
	budget_id: integer('budget_id').references(() => budgets.id),
	type: text('type').notNull(), // Enforce at app level: 'expense' | 'income' | 'transfer'
	image: text('image'),
	created_at: text('created_at').notNull(), // ISO 8601 format
});

// --- SUBSCRIPTIONS ---
export const subscriptions = sqliteTable('subscriptions', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique(),
	amount: integer('amount').notNull(),
	billed: text('billed').notNull(), // Enforce in app: 'monthly', etc.
	due_date: text('due_date').notNull(), // ISO date
	started_at: text('started_at').notNull(), // ISO date
});

// --- RELATIONS ---
export const transactionsRelations = relations(transactions, ({ one }) => ({
	account: one(accounts, {
		fields: [transactions.account_id],
		references: [accounts.id],
	}),
	relatedAccount: one(accounts, {
		fields: [transactions.related_account_id],
		references: [accounts.id],
	}),
	category: one(categories, {
		fields: [transactions.category_id],
		references: [categories.id],
	}),
	budget: one(budgets, {
		fields: [transactions.budget_id],
		references: [budgets.id],
	}),
}));

// --- TYPES FOR INSERTS ---
export type Account = typeof accounts.$inferInsert;
export type Category = typeof categories.$inferInsert;
export type Budget = typeof budgets.$inferInsert;
export type Transaction = typeof transactions.$inferInsert;
export type Subscription = typeof subscriptions.$inferInsert;


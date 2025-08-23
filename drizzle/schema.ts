import { pgTable, index, unique, pgPolicy, check, uuid, text, timestamp, bigint, boolean, foreignKey, integer, jsonb, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const appUserPermission = pgEnum("app_user_permission", ['read', 'write', 'admin'])


export const emailAccounts = pgTable("email_accounts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	provider: text().default('gmail').notNull(),
	emailAddress: text("email_address").notNull(),
	refreshToken: text("refresh_token").notNull(),
	accessToken: text("access_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true, mode: 'string' }),
	scope: text(),
	tokenType: text("token_type"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	historyId: bigint("history_id", { mode: "number" }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	signatureText: text("signature_text"),
	signatureHtml: text("signature_html"),
	initialImportCompleted: boolean("initial_import_completed").default(false).notNull(),
	initialImportCompletedAt: timestamp("initial_import_completed_at", { withTimezone: true, mode: 'string' }),
	autoFilteringEnabled: boolean("auto_filtering_enabled").default(true).notNull(),
}, (table) => [
	index("idx_email_accounts_import_status").using("btree", table.userId.asc().nullsLast().op("uuid_ops"), table.initialImportCompleted.asc().nullsLast().op("bool_ops")),
	unique("email_accounts_user_email_unique").on(table.userId, table.emailAddress),
	pgPolicy("Users can view their own email accounts", { as: "permissive", for: "select", to: ["public"], using: sql`(auth.uid() = user_id)` }),
	pgPolicy("Users can insert their own email accounts", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Users can update their own email accounts", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("Users can delete their own email accounts", { as: "permissive", for: "delete", to: ["public"] }),
	check("provider_is_gmail", sql`provider = 'gmail'::text`),
]);

export const emailMessages = pgTable("email_messages", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	accountId: uuid("account_id").notNull(),
	gmailMessageId: text("gmail_message_id").notNull(),
	threadId: text("thread_id"),
	subject: text(),
	fromAddress: text("from_address"),
	toAddresses: text("to_addresses").array(),
	ccAddresses: text("cc_addresses").array(),
	bccAddresses: text("bcc_addresses").array(),
	snippet: text(),
	internalDate: timestamp("internal_date", { withTimezone: true, mode: 'string' }),
	labelIds: text("label_ids").array(),
	isRead: boolean("is_read").default(false).notNull(),
	bodyText: text("body_text"),
	bodyHtml: text("body_html"),
	sizeEstimate: integer("size_estimate"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_email_messages_account").using("btree", table.accountId.asc().nullsLast().op("uuid_ops")),
	index("idx_email_messages_internal_date").using("btree", table.internalDate.desc().nullsFirst().op("timestamptz_ops")),
	index("idx_email_messages_is_read").using("btree", table.userId.asc().nullsLast().op("uuid_ops"), table.isRead.asc().nullsLast().op("uuid_ops")),
	index("idx_email_messages_labels").using("gin", table.labelIds.asc().nullsLast().op("array_ops")),
	index("idx_email_messages_search").using("gin", sql`to_tsvector('english'::regconfig, ((((((COALESCE(subject, ''::t`),
	index("idx_email_messages_user").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	index("idx_email_messages_user_date").using("btree", table.userId.asc().nullsLast().op("timestamptz_ops"), table.internalDate.desc().nullsFirst().op("uuid_ops")),
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [emailAccounts.id],
			name: "email_messages_account_id_fkey"
		}).onDelete("cascade"),
	unique("email_messages_gmail_message_id_key").on(table.gmailMessageId),
	pgPolicy("Users can view their own messages", { as: "permissive", for: "select", to: ["public"], using: sql`(auth.uid() = user_id)` }),
	pgPolicy("Users can insert their own messages", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Users can update their own messages", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("Users can delete their own messages", { as: "permissive", for: "delete", to: ["public"] }),
]);

export const outgoingMailLogs = pgTable("outgoing_mail_logs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	accountId: uuid("account_id").notNull(),
	toAddresses: text("to_addresses").array().notNull(),
	ccAddresses: text("cc_addresses").array(),
	bccAddresses: text("bcc_addresses").array(),
	subject: text(),
	bodyText: text("body_text"),
	bodyHtml: text("body_html"),
	status: text().default('queued').notNull(),
	errorMessage: text("error_message"),
	gmailMessageId: text("gmail_message_id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [emailAccounts.id],
			name: "outgoing_mail_logs_account_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("Users can view their own send logs", { as: "permissive", for: "select", to: ["public"], using: sql`(auth.uid() = user_id)` }),
	pgPolicy("Users can insert their own send logs", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Users can update their own send logs", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("Users can delete their own send logs", { as: "permissive", for: "delete", to: ["public"] }),
	check("outgoing_mail_logs_status_check", sql`status = ANY (ARRAY['queued'::text, 'sent'::text, 'failed'::text])`),
]);

export const apps = pgTable("apps", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().default('Unnamed App').notNull(),
	description: text().default('No description').notNull(),
	gitRepo: text("git_repo").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	baseId: text("base_id").default('nextjs-dkjfgdf').notNull(),
	previewDomain: text("preview_domain"),
}, (table) => [
	unique("apps_preview_domain_key").on(table.previewDomain),
]);

export const appUsers = pgTable("app_users", {
	userId: text("user_id").notNull(),
	appId: uuid("app_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	permissions: appUserPermission(),
	freestyleIdentity: text("freestyle_identity").notNull(),
	freestyleAccessToken: text("freestyle_access_token").notNull(),
	freestyleAccessTokenId: text("freestyle_access_token_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.appId],
			foreignColumns: [apps.id],
			name: "app_users_app_id_fkey"
		}).onDelete("cascade"),
]);

export const messages = pgTable("messages", {
	id: text().primaryKey().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	appId: uuid("app_id").notNull(),
	message: jsonb().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.appId],
			foreignColumns: [apps.id],
			name: "messages_app_id_fkey"
		}),
]);

export const appDeployments = pgTable("app_deployments", {
	appId: uuid("app_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	deploymentId: text("deployment_id").notNull(),
	commit: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.appId],
			foreignColumns: [apps.id],
			name: "app_deployments_app_id_fkey"
		}).onDelete("cascade"),
]);

export const emailMessageTags = pgTable("email_message_tags", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	messageId: uuid("message_id").notNull(),
	tagId: uuid("tag_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_email_message_tags_message").using("btree", table.messageId.asc().nullsLast().op("uuid_ops")),
	index("idx_email_message_tags_tag").using("btree", table.tagId.asc().nullsLast().op("uuid_ops")),
	unique("email_message_tags_message_id_tag_id_key").on(table.messageId, table.tagId),
	pgPolicy("Users can create their own message tags", { as: "permissive", for: "insert", to: ["public"], withCheck: sql`(auth.uid() = user_id)`  }),
	pgPolicy("Users can update their own message tags", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("Users can view their own message tags", { as: "permissive", for: "select", to: ["public"] }),
	pgPolicy("Users can delete their own message tags", { as: "permissive", for: "delete", to: ["public"] }),
]);

export const emailFilters = pgTable("email_filters", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	name: text().notNull(),
	description: text(),
	conditions: jsonb().default({}).notNull(),
	actions: jsonb().default({}).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	priority: integer().default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	pgPolicy("Users can view their own filters", { as: "permissive", for: "select", to: ["public"], using: sql`(auth.uid() = user_id)` }),
	pgPolicy("Users can create their own filters", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Users can update their own filters", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("Users can delete their own filters", { as: "permissive", for: "delete", to: ["public"] }),
]);

export const emailTags = pgTable("email_tags", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	name: text().notNull(),
	color: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_email_tags_user_name").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.name.asc().nullsLast().op("text_ops")),
	pgPolicy("Users can view their own tags", { as: "permissive", for: "select", to: ["public"], using: sql`(auth.uid() = user_id)` }),
	pgPolicy("Users can create their own tags", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Users can update their own tags", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("Users can delete their own tags", { as: "permissive", for: "delete", to: ["public"] }),
]);

export const gmailLabels = pgTable("gmail_labels", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	accountId: uuid("account_id").notNull(),
	gmailLabelId: text("gmail_label_id").notNull(),
	name: text().notNull(),
	type: text().default('user').notNull(),
	colorBackground: text("color_background"),
	colorText: text("color_text"),
	messagesTotal: integer("messages_total").default(0),
	messagesUnread: integer("messages_unread").default(0),
	threadsTotal: integer("threads_total").default(0),
	threadsUnread: integer("threads_unread").default(0),
	isVisible: boolean("is_visible").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_gmail_labels_gmail_id").using("btree", table.gmailLabelId.asc().nullsLast().op("text_ops")),
	index("idx_gmail_labels_user_account").using("btree", table.userId.asc().nullsLast().op("uuid_ops"), table.accountId.asc().nullsLast().op("uuid_ops")),
	pgPolicy("Users can view their own labels", { as: "permissive", for: "select", to: ["public"], using: sql`(auth.uid() = user_id)` }),
	pgPolicy("Users can insert their own labels", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Users can update their own labels", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("Users can delete their own labels", { as: "permissive", for: "delete", to: ["public"] }),
]);

export const gmailContacts = pgTable("gmail_contacts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	accountId: uuid("account_id").notNull(),
	gmailContactId: text("gmail_contact_id").notNull(),
	displayName: text("display_name"),
	emailAddresses: jsonb("email_addresses").default([]),
	phoneNumbers: jsonb("phone_numbers").default([]),
	photoUrl: text("photo_url"),
	organization: text(),
	jobTitle: text("job_title"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_gmail_contacts_gmail_id").using("btree", table.gmailContactId.asc().nullsLast().op("text_ops")),
	index("idx_gmail_contacts_user_account").using("btree", table.userId.asc().nullsLast().op("uuid_ops"), table.accountId.asc().nullsLast().op("uuid_ops")),
	pgPolicy("Users can view their own contacts", { as: "permissive", for: "select", to: ["public"], using: sql`(auth.uid() = user_id)` }),
	pgPolicy("Users can insert their own contacts", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Users can update their own contacts", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("Users can delete their own contacts", { as: "permissive", for: "delete", to: ["public"] }),
]);

export const syncStatus = pgTable("sync_status", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	accountId: uuid("account_id").notNull(),
	syncType: text("sync_type").notNull(),
	status: text().default('pending').notNull(),
	totalItems: integer("total_items").default(0),
	syncedItems: integer("synced_items").default(0),
	lastSyncToken: text("last_sync_token"),
	errorMessage: text("error_message"),
	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }),
	completedAt: timestamp("completed_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_sync_status_user_account").using("btree", table.userId.asc().nullsLast().op("uuid_ops"), table.accountId.asc().nullsLast().op("uuid_ops")),
	pgPolicy("Users can view their own sync status", { as: "permissive", for: "select", to: ["public"], using: sql`(auth.uid() = user_id)` }),
	pgPolicy("Users can insert their own sync status", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Users can update their own sync status", { as: "permissive", for: "update", to: ["public"] }),
]);

export const syncJobs = pgTable("sync_jobs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	accountId: uuid("account_id").notNull(),
	jobType: text("job_type").notNull(),
	status: text().default('pending').notNull(),
	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }),
	completedAt: timestamp("completed_at", { withTimezone: true, mode: 'string' }),
	errorMessage: text("error_message"),
	metadata: jsonb().default({}),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_sync_jobs_account").using("btree", table.accountId.asc().nullsLast().op("uuid_ops")),
	index("idx_sync_jobs_user_status").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.status.asc().nullsLast().op("text_ops")),
	pgPolicy("Users can view their own sync jobs", { as: "permissive", for: "select", to: ["public"], using: sql`(auth.uid() = user_id)` }),
	pgPolicy("Users can create their own sync jobs", { as: "permissive", for: "insert", to: ["public"] }),
]);

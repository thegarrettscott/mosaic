import { relations } from "drizzle-orm/relations";
import { emailAccounts, emailMessages, outgoingMailLogs, apps, appUsers, messages, appDeployments } from "./schema";

export const emailMessagesRelations = relations(emailMessages, ({one}) => ({
	emailAccount: one(emailAccounts, {
		fields: [emailMessages.accountId],
		references: [emailAccounts.id]
	}),
}));

export const emailAccountsRelations = relations(emailAccounts, ({many}) => ({
	emailMessages: many(emailMessages),
	outgoingMailLogs: many(outgoingMailLogs),
}));

export const outgoingMailLogsRelations = relations(outgoingMailLogs, ({one}) => ({
	emailAccount: one(emailAccounts, {
		fields: [outgoingMailLogs.accountId],
		references: [emailAccounts.id]
	}),
}));

export const appUsersRelations = relations(appUsers, ({one}) => ({
	app: one(apps, {
		fields: [appUsers.appId],
		references: [apps.id]
	}),
}));

export const appsRelations = relations(apps, ({many}) => ({
	appUsers: many(appUsers),
	messages: many(messages),
	appDeployments: many(appDeployments),
}));

export const messagesRelations = relations(messages, ({one}) => ({
	app: one(apps, {
		fields: [messages.appId],
		references: [apps.id]
	}),
}));

export const appDeploymentsRelations = relations(appDeployments, ({one}) => ({
	app: one(apps, {
		fields: [appDeployments.appId],
		references: [apps.id]
	}),
}));
-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."app_user_permission" AS ENUM('read', 'write', 'admin');--> statement-breakpoint
CREATE TABLE "email_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"provider" text DEFAULT 'gmail' NOT NULL,
	"email_address" text NOT NULL,
	"refresh_token" text NOT NULL,
	"access_token" text,
	"access_token_expires_at" timestamp with time zone,
	"scope" text,
	"token_type" text,
	"history_id" bigint,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"signature_text" text,
	"signature_html" text,
	"initial_import_completed" boolean DEFAULT false NOT NULL,
	"initial_import_completed_at" timestamp with time zone,
	"auto_filtering_enabled" boolean DEFAULT true NOT NULL,
	CONSTRAINT "email_accounts_user_email_unique" UNIQUE("user_id","email_address"),
	CONSTRAINT "provider_is_gmail" CHECK (provider = 'gmail'::text)
);
--> statement-breakpoint
ALTER TABLE "email_accounts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "email_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"gmail_message_id" text NOT NULL,
	"thread_id" text,
	"subject" text,
	"from_address" text,
	"to_addresses" text[],
	"cc_addresses" text[],
	"bcc_addresses" text[],
	"snippet" text,
	"internal_date" timestamp with time zone,
	"label_ids" text[],
	"is_read" boolean DEFAULT false NOT NULL,
	"body_text" text,
	"body_html" text,
	"size_estimate" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "email_messages_gmail_message_id_key" UNIQUE("gmail_message_id")
);
--> statement-breakpoint
ALTER TABLE "email_messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "outgoing_mail_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"to_addresses" text[] NOT NULL,
	"cc_addresses" text[],
	"bcc_addresses" text[],
	"subject" text,
	"body_text" text,
	"body_html" text,
	"status" text DEFAULT 'queued' NOT NULL,
	"error_message" text,
	"gmail_message_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "outgoing_mail_logs_status_check" CHECK (status = ANY (ARRAY['queued'::text, 'sent'::text, 'failed'::text]))
);
--> statement-breakpoint
ALTER TABLE "outgoing_mail_logs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "apps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text DEFAULT 'Unnamed App' NOT NULL,
	"description" text DEFAULT 'No description' NOT NULL,
	"git_repo" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"base_id" text DEFAULT 'nextjs-dkjfgdf' NOT NULL,
	"preview_domain" text,
	CONSTRAINT "apps_preview_domain_key" UNIQUE("preview_domain")
);
--> statement-breakpoint
CREATE TABLE "app_users" (
	"user_id" text NOT NULL,
	"app_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"permissions" "app_user_permission",
	"freestyle_identity" text NOT NULL,
	"freestyle_access_token" text NOT NULL,
	"freestyle_access_token_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"app_id" uuid NOT NULL,
	"message" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app_deployments" (
	"app_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deployment_id" text NOT NULL,
	"commit" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_message_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"message_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "email_message_tags_message_id_tag_id_key" UNIQUE("message_id","tag_id")
);
--> statement-breakpoint
ALTER TABLE "email_message_tags" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "email_filters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"conditions" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"actions" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "email_filters" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "email_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"color" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "email_tags" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "gmail_labels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"gmail_label_id" text NOT NULL,
	"name" text NOT NULL,
	"type" text DEFAULT 'user' NOT NULL,
	"color_background" text,
	"color_text" text,
	"messages_total" integer DEFAULT 0,
	"messages_unread" integer DEFAULT 0,
	"threads_total" integer DEFAULT 0,
	"threads_unread" integer DEFAULT 0,
	"is_visible" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gmail_labels" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "gmail_contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"gmail_contact_id" text NOT NULL,
	"display_name" text,
	"email_addresses" jsonb DEFAULT '[]'::jsonb,
	"phone_numbers" jsonb DEFAULT '[]'::jsonb,
	"photo_url" text,
	"organization" text,
	"job_title" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gmail_contacts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sync_status" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"sync_type" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"total_items" integer DEFAULT 0,
	"synced_items" integer DEFAULT 0,
	"last_sync_token" text,
	"error_message" text,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sync_status" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sync_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"job_type" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"error_message" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sync_jobs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "email_messages" ADD CONSTRAINT "email_messages_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."email_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outgoing_mail_logs" ADD CONSTRAINT "outgoing_mail_logs_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."email_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_users" ADD CONSTRAINT "app_users_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_deployments" ADD CONSTRAINT "app_deployments_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_email_accounts_import_status" ON "email_accounts" USING btree ("user_id" uuid_ops,"initial_import_completed" bool_ops);--> statement-breakpoint
CREATE INDEX "idx_email_messages_account" ON "email_messages" USING btree ("account_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_email_messages_internal_date" ON "email_messages" USING btree ("internal_date" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_email_messages_is_read" ON "email_messages" USING btree ("user_id" uuid_ops,"is_read" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_email_messages_labels" ON "email_messages" USING gin ("label_ids" array_ops);--> statement-breakpoint
CREATE INDEX "idx_email_messages_search" ON "email_messages" USING gin (to_tsvector('english'::regconfig, ((((((COALESCE(subject, ''::t tsvector_ops);--> statement-breakpoint
CREATE INDEX "idx_email_messages_user" ON "email_messages" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_email_messages_user_date" ON "email_messages" USING btree ("user_id" timestamptz_ops,"internal_date" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_email_message_tags_message" ON "email_message_tags" USING btree ("message_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_email_message_tags_tag" ON "email_message_tags" USING btree ("tag_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_email_tags_user_name" ON "email_tags" USING btree ("user_id" text_ops,"name" text_ops);--> statement-breakpoint
CREATE INDEX "idx_gmail_labels_gmail_id" ON "gmail_labels" USING btree ("gmail_label_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_gmail_labels_user_account" ON "gmail_labels" USING btree ("user_id" uuid_ops,"account_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_gmail_contacts_gmail_id" ON "gmail_contacts" USING btree ("gmail_contact_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_gmail_contacts_user_account" ON "gmail_contacts" USING btree ("user_id" uuid_ops,"account_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_sync_status_user_account" ON "sync_status" USING btree ("user_id" uuid_ops,"account_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_sync_jobs_account" ON "sync_jobs" USING btree ("account_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_sync_jobs_user_status" ON "sync_jobs" USING btree ("user_id" text_ops,"status" text_ops);--> statement-breakpoint
CREATE POLICY "Users can view their own email accounts" ON "email_accounts" AS PERMISSIVE FOR SELECT TO public USING ((auth.uid() = user_id));--> statement-breakpoint
CREATE POLICY "Users can insert their own email accounts" ON "email_accounts" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Users can update their own email accounts" ON "email_accounts" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "Users can delete their own email accounts" ON "email_accounts" AS PERMISSIVE FOR DELETE TO public;--> statement-breakpoint
CREATE POLICY "Users can view their own messages" ON "email_messages" AS PERMISSIVE FOR SELECT TO public USING ((auth.uid() = user_id));--> statement-breakpoint
CREATE POLICY "Users can insert their own messages" ON "email_messages" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Users can update their own messages" ON "email_messages" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "Users can delete their own messages" ON "email_messages" AS PERMISSIVE FOR DELETE TO public;--> statement-breakpoint
CREATE POLICY "Users can view their own send logs" ON "outgoing_mail_logs" AS PERMISSIVE FOR SELECT TO public USING ((auth.uid() = user_id));--> statement-breakpoint
CREATE POLICY "Users can insert their own send logs" ON "outgoing_mail_logs" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Users can update their own send logs" ON "outgoing_mail_logs" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "Users can delete their own send logs" ON "outgoing_mail_logs" AS PERMISSIVE FOR DELETE TO public;--> statement-breakpoint
CREATE POLICY "Users can create their own message tags" ON "email_message_tags" AS PERMISSIVE FOR INSERT TO public WITH CHECK ((auth.uid() = user_id));--> statement-breakpoint
CREATE POLICY "Users can update their own message tags" ON "email_message_tags" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "Users can view their own message tags" ON "email_message_tags" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Users can delete their own message tags" ON "email_message_tags" AS PERMISSIVE FOR DELETE TO public;--> statement-breakpoint
CREATE POLICY "Users can view their own filters" ON "email_filters" AS PERMISSIVE FOR SELECT TO public USING ((auth.uid() = user_id));--> statement-breakpoint
CREATE POLICY "Users can create their own filters" ON "email_filters" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Users can update their own filters" ON "email_filters" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "Users can delete their own filters" ON "email_filters" AS PERMISSIVE FOR DELETE TO public;--> statement-breakpoint
CREATE POLICY "Users can view their own tags" ON "email_tags" AS PERMISSIVE FOR SELECT TO public USING ((auth.uid() = user_id));--> statement-breakpoint
CREATE POLICY "Users can create their own tags" ON "email_tags" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Users can update their own tags" ON "email_tags" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "Users can delete their own tags" ON "email_tags" AS PERMISSIVE FOR DELETE TO public;--> statement-breakpoint
CREATE POLICY "Users can view their own labels" ON "gmail_labels" AS PERMISSIVE FOR SELECT TO public USING ((auth.uid() = user_id));--> statement-breakpoint
CREATE POLICY "Users can insert their own labels" ON "gmail_labels" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Users can update their own labels" ON "gmail_labels" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "Users can delete their own labels" ON "gmail_labels" AS PERMISSIVE FOR DELETE TO public;--> statement-breakpoint
CREATE POLICY "Users can view their own contacts" ON "gmail_contacts" AS PERMISSIVE FOR SELECT TO public USING ((auth.uid() = user_id));--> statement-breakpoint
CREATE POLICY "Users can insert their own contacts" ON "gmail_contacts" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Users can update their own contacts" ON "gmail_contacts" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "Users can delete their own contacts" ON "gmail_contacts" AS PERMISSIVE FOR DELETE TO public;--> statement-breakpoint
CREATE POLICY "Users can view their own sync status" ON "sync_status" AS PERMISSIVE FOR SELECT TO public USING ((auth.uid() = user_id));--> statement-breakpoint
CREATE POLICY "Users can insert their own sync status" ON "sync_status" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Users can update their own sync status" ON "sync_status" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "Users can view their own sync jobs" ON "sync_jobs" AS PERMISSIVE FOR SELECT TO public USING ((auth.uid() = user_id));--> statement-breakpoint
CREATE POLICY "Users can create their own sync jobs" ON "sync_jobs" AS PERMISSIVE FOR INSERT TO public;
*/
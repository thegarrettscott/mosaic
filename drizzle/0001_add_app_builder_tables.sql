-- Migration: Add App Builder Tables
-- This migration adds new tables for the app builder functionality
-- without affecting existing email management tables

-- Create apps table
CREATE TABLE IF NOT EXISTS "apps" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL DEFAULT 'Unnamed App',
  "description" text NOT NULL DEFAULT 'No description',
  "git_repo" text NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "base_id" text NOT NULL DEFAULT 'superhuman',
  "preview_domain" text UNIQUE
);

-- Create app_user_permission enum
DO $$ BEGIN
  CREATE TYPE "app_user_permission" AS ENUM ('read', 'write', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create app_users table
CREATE TABLE IF NOT EXISTS "app_users" (
  "user_id" text NOT NULL,
  "app_id" uuid NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "permissions" "app_user_permission",
  "freestyle_identity" text NOT NULL,
  "freestyle_access_token" text NOT NULL,
  "freestyle_access_token_id" text NOT NULL,
  CONSTRAINT "app_users_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE cascade ON UPDATE no action
);

-- Create messages table
CREATE TABLE IF NOT EXISTS "messages" (
  "id" text PRIMARY KEY,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "app_id" uuid NOT NULL,
  "message" json NOT NULL,
  CONSTRAINT "messages_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE no action ON UPDATE no action
);

-- Create app_deployments table
CREATE TABLE IF NOT EXISTS "app_deployments" (
  "app_id" uuid NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "deployment_id" text NOT NULL,
  "commit" text NOT NULL,
  CONSTRAINT "app_deployments_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE cascade ON UPDATE no action
);

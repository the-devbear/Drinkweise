alter table "public"."users" add column "notification_preferences" jsonb not null default '{"drinkSession": {"reminders": true}}'::jsonb;

-- Create enum for feature request status
create type "public"."feature_request_status" as enum (
    'submitted',
    'under_review',
    'in_progress',
    'completed',
    'rejected'
);

-- Create feature_requests table
create table "public"."feature_requests" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "description" text not null,
    "user_id" uuid not null,
    "status" feature_request_status not null default 'submitted'::feature_request_status,
    "upvotes_count" integer not null default 0,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);

-- Create feature_request_upvotes table for tracking user upvotes
create table "public"."feature_request_upvotes" (
    "id" uuid not null default gen_random_uuid(),
    "feature_request_id" uuid not null,
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default now()
);

-- Enable RLS
alter table "public"."feature_requests" enable row level security;
alter table "public"."feature_request_upvotes" enable row level security;

-- Add primary keys
alter table "public"."feature_requests" add constraint "feature_requests_pkey" primary key ("id");
alter table "public"."feature_request_upvotes" add constraint "feature_request_upvotes_pkey" primary key ("id");

-- Add foreign key constraints
alter table "public"."feature_requests" add constraint "feature_requests_user_id_fkey" 
    foreign key ("user_id") references "public"."users"("id") on update cascade on delete cascade;

alter table "public"."feature_request_upvotes" add constraint "feature_request_upvotes_feature_request_id_fkey" 
    foreign key ("feature_request_id") references "public"."feature_requests"("id") on update cascade on delete cascade;

alter table "public"."feature_request_upvotes" add constraint "feature_request_upvotes_user_id_fkey" 
    foreign key ("user_id") references "public"."users"("id") on update cascade on delete cascade;

-- Add unique constraint to prevent duplicate upvotes
alter table "public"."feature_request_upvotes" add constraint "unique_user_feature_request_upvote" 
    unique ("feature_request_id", "user_id");

-- Create indexes for better performance
create index "feature_requests_user_id_idx" on "public"."feature_requests" ("user_id");
create index "feature_requests_upvotes_count_idx" on "public"."feature_requests" ("upvotes_count" desc);
create index "feature_requests_created_at_idx" on "public"."feature_requests" ("created_at" desc);
create index "feature_request_upvotes_feature_request_id_idx" on "public"."feature_request_upvotes" ("feature_request_id");
create index "feature_request_upvotes_user_id_idx" on "public"."feature_request_upvotes" ("user_id");

-- RLS policies for feature_requests
create policy "Anyone can view feature requests"
on "public"."feature_requests"
as permissive
for select
to public
using (true);

create policy "Authenticated users can create feature requests"
on "public"."feature_requests"
as permissive
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own feature requests"
on "public"."feature_requests"
as permissive
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own feature requests"
on "public"."feature_requests"
as permissive
for delete
to authenticated
using ((select auth.uid()) = user_id);

-- RLS policies for feature_request_upvotes
create policy "Anyone can view upvotes"
on "public"."feature_request_upvotes"
as permissive
for select
to public
using (true);

create policy "Authenticated users can create upvotes"
on "public"."feature_request_upvotes"
as permissive
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own upvotes"
on "public"."feature_request_upvotes"
as permissive
for delete
to authenticated
using ((select auth.uid()) = user_id);

-- Function to update upvotes count when upvotes are added/removed
create or replace function update_feature_request_upvotes_count()
returns trigger as $$
begin
    if TG_OP = 'INSERT' then
        update feature_requests
        set upvotes_count = upvotes_count + 1,
            updated_at = now()
        where id = NEW.feature_request_id;
        return NEW;
    elsif TG_OP = 'DELETE' then
        update feature_requests
        set upvotes_count = upvotes_count - 1,
            updated_at = now()
        where id = OLD.feature_request_id;
        return OLD;
    end if;
    return null;
end;
$$ language plpgsql security definer;

-- Create triggers to automatically update upvotes count
create trigger feature_request_upvotes_count_trigger
after insert or delete on feature_request_upvotes
for each row execute function update_feature_request_upvotes_count();

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    NEW.updated_at = now();
    return NEW;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
create trigger update_feature_requests_updated_at
before update on feature_requests
for each row execute function update_updated_at_column();

-- Grant permissions
grant all on table "public"."feature_requests" to "anon";
grant all on table "public"."feature_requests" to "authenticated";
grant all on table "public"."feature_requests" to "service_role";

grant all on table "public"."feature_request_upvotes" to "anon";
grant all on table "public"."feature_request_upvotes" to "authenticated";
grant all on table "public"."feature_request_upvotes" to "service_role";

-- Enable real-time for the tables
alter publication supabase_realtime add table feature_requests;
alter publication supabase_realtime add table feature_request_upvotes;
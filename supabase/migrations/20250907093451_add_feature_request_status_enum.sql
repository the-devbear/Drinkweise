-- Create enum for feature request status
create type "public"."feature_request_status" as enum (
    'submitted',
    'under_review',
    'in_progress',
    'completed',
    'rejected'
);

-- Update the feature_requests table to use the enum
alter table "public"."feature_requests" 
alter column "status" type feature_request_status using status::feature_request_status;

-- Update the default value to use the enum
alter table "public"."feature_requests" 
alter column "status" set default 'submitted'::feature_request_status;
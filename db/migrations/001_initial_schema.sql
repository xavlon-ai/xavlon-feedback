-- PostgreSQL/Supabase production schema. Apply through the provider migration workflow.
create extension if not exists pgcrypto;
create type feedback_status as enum ('under_review','planned','in_progress','complete','not_planned');
create table feedback_requests (id uuid primary key default gen_random_uuid(),slug text unique not null,title text not null check (char_length(btrim(title)) between 5 and 120),description text not null check (char_length(btrim(description)) between 20 and 2000),status feedback_status not null default 'under_review',upvote_count integer not null default 0 check(upvote_count>=0),is_public boolean not null default true,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table feedback_votes (id uuid primary key default gen_random_uuid(),feedback_request_id uuid not null references feedback_requests(id),voter_token_hash text not null,created_at timestamptz not null default now(),unique(feedback_request_id,voter_token_hash));
create table admin_profiles (user_id uuid primary key references auth.users(id),role text not null check(role='admin'),created_at timestamptz not null default now());
create table feedback_status_history (id uuid primary key default gen_random_uuid(),feedback_request_id uuid not null references feedback_requests(id),from_status feedback_status,to_status feedback_status not null,changed_by uuid references auth.users(id),created_at timestamptz not null default now());
create index feedback_public_order_idx on feedback_requests(is_public,upvote_count desc,created_at desc);create index feedback_status_idx on feedback_requests(status) where is_public;
-- Production adapter must call a SECURITY DEFINER transaction/function for add/remove vote and role-check every admin mutation.

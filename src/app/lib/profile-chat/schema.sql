create table if not exists profile_chat_rate_limits (
    key text primary key,
    request_count integer not null check (request_count > 0),
    expires_at timestamptz not null
);

create index if not exists profile_chat_rate_limits_expiration
    on profile_chat_rate_limits (expires_at);

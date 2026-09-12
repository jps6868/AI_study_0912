-- 매출 테이블: 2026-01-01 ~ 2026-09-12 일별 매출
-- 002_items.sql을 먼저 실행해 품목을 채운 뒤 이 파일을 실행하세요.

create table if not exists sales (
  id bigint generated always as identity primary key,
  item_id bigint not null references items(id) on delete cascade,
  sale_date date not null,
  quantity integer not null,
  amount numeric(14,2) not null,
  created_at timestamptz not null default now()
);

truncate table sales restart identity;

insert into sales (item_id, sale_date, quantity, amount)
select
  i.id,
  day::date as sale_date,
  q.quantity,
  round((q.quantity * i.unit_price * (0.85 + random() * 0.3))::numeric, 2) as amount
from items i
cross join generate_series('2026-01-01'::date, '2026-09-12'::date, interval '1 day') as day
cross join lateral (
  -- 판매 없는 날도 섞이도록 약 15% 확률로 0 (0은 아래에서 제외)
  select case when random() < 0.15 then 0 else (floor(random() * 20) + 1)::int end as quantity
) as q
where q.quantity > 0;

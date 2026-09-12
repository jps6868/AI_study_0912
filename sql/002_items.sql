-- 품목 테이블: 대리점당 5~10개 랜덤 생성 (카테고리도 품목마다 랜덤)
-- 기존 items를 지우면 sales도 FK cascade로 함께 삭제되므로, 이 파일 실행 후 003_sales.sql을 다시 실행해야 합니다.

create table if not exists items (
  id bigint generated always as identity primary key,
  dealership_id bigint not null references dealerships(id) on delete cascade,
  name text not null,
  category text,
  unit_price numeric(12,2) not null,
  created_at timestamptz not null default now()
);

truncate table items restart identity cascade;

insert into items (dealership_id, name, category, unit_price)
select
  d.id,
  itm.category || '-' || itm.gs as name,
  itm.category,
  round((random() * 90000 + 10000)::numeric, -3) as unit_price   -- 1만~10만원대, 천원 단위
from dealerships d
cross join lateral (
  select
    gs,
    (array['가전','생활용품','주방용품','계절가전','소형가전','디지털기기','인테리어소품'])[
      floor(random() * 7 + 1)::int
    ] as category
  from generate_series(1, (floor(random() * 6) + 5)::int) as gs   -- 대리점당 5~10개
) as itm;

-- 대리점 테이블 생성 + 샘플 데이터 10건

create table if not exists dealerships (
  id bigint generated always as identity primary key,
  name text not null,
  district text not null,
  address text,
  opened_at date,
  created_at timestamptz not null default now()
);

insert into dealerships (name, district, address, opened_at) values
('종로대리점',   '종로구',   '서울특별시 종로구 종로 12',      '2017-03-02'),
('중구대리점',   '중구',     '서울특별시 중구 을지로 45',      '2018-06-15'),
('용산대리점',   '용산구',   '서울특별시 용산구 한강대로 88',  '2016-11-20'),
('성동대리점',   '성동구',   '서울특별시 성동구 왕십리로 23',  '2019-01-10'),
('마포대리점',   '마포구',   '서울특별시 마포구 월드컵로 12',  '2017-04-19'),
('영등포대리점', '영등포구', '서울특별시 영등포구 여의대로 5', '2016-08-25'),
('서초대리점',   '서초구',   '서울특별시 서초구 서초대로 77',  '2017-02-09'),
('강남대리점',   '강남구',   '서울특별시 강남구 테헤란로 152', '2015-09-01'),
('송파대리점',   '송파구',   '서울특별시 송파구 올림픽로 300', '2016-12-12'),
('강동대리점',   '강동구',   '서울특별시 강동구 천호대로 1200','2019-03-28');

# 대리점 매출 대시보드 (web)

Vite + React (TS) + Supabase + Recharts + Tailwind CSS.

## 로컬 실행

```bash
npm install
cp .env.example .env.local   # 값 채우기
npm run dev
```

`.env.local`에 Supabase 프로젝트 정보를 넣어야 합니다 (Project Settings > API).

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxx
```

`sales`, `items`, `dealerships` 테이블은 `../sql`의 스크립트로 미리 생성/시드되어 있어야 하며,
클라이언트(anon key)에서 조회하므로 각 테이블에 읽기 RLS 정책이 필요합니다.

```sql
alter table dealerships enable row level security;
alter table items enable row level security;
alter table sales enable row level security;

create policy "public read" on dealerships for select using (true);
create policy "public read" on items for select using (true);
create policy "public read" on sales for select using (true);
```

## Vercel 배포

1. 이 저장소를 Vercel에 연결
2. **Root Directory**를 `web`으로 설정
3. Environment Variables에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 추가
4. Build Command: `npm run build` / Output: `dist` (Vite 프리셋 자동 감지됨)

# 05 — MSW + component integration

## 1. Goal
test component ที่ดึงข้อมูลจาก API โดย **mock ที่ระดับ network** ด้วย MSW ให้ component, hook และ fetch ทำงานจริงทั้งหมด

## 2. Scope
มุมผู้ใช้: เลือกกองทุนแล้วเห็นการ์ด ระหว่างโหลดเห็น skeleton → สำเร็จเห็นชื่อ + NAV → พังเห็น "Something went wrong" → ไม่มีกองทุนนี้เห็น "Fund not found"

```
FundCard → useFund → api/getFund → GET /api/funds/:id → MSW (src/mocks/handlers.ts)
   │          │            │
   │          │            └─ 404 → null, 500 → throw Error
   │          └─ TanStack Query (isPending / isError / data)
   └─ formatAmount(nav) → "NAV: 12.50"
```

### ทำไม mock ที่ network ไม่ใช่ mock function?

```
vi.mock('@/hooks/useFund')  →  ข้าม useFund, getFund, fetch, การ parse JSON, 404/500
MSW                         →  ทุกอย่างรันจริง ยกเว้น "server" ที่ตอบกลับ
```

- test ไม่ผูกกับชื่อ hook / ชื่อไฟล์ → refactor ได้โดย test ไม่พัง (ดูบท 06)
- handler ชุดเดียวกันใช้ทั้งใน test (`msw/node`) และ `npm run dev` (`msw/browser`)

### Setup (ทำไว้แล้ว)

`src/test/setup.ts` ถูกโหลดก่อนทุกไฟล์ test (ดู `setupFiles` ใน `vitest.config.ts`):

```ts
beforeAll(() => server.listen({ onUnhandledRequest: 'error' })); // request ที่ไม่มี handler = fail
afterEach(() => {
  cleanup();
  server.resetHandlers(); // ล้าง server.use(...) ของ test ก่อนหน้า
});
afterAll(() => server.close());
```

`src/test/renderWithProviders.tsx`: สร้าง `QueryClient` **ใหม่ทุก test** (ไม่แชร์ cache) และ `retry: false` (ให้ error ขึ้นทันที ไม่ต้องรอ retry 3 รอบ)

### Override ทีละ test ด้วย `server.use`

```ts
server.use(http.get('/api/funds/:id', () => new HttpResponse(null, { status: 500 })));
```

handler นี้ใช้แค่ใน test นั้น แล้วถูกล้างโดย `resetHandlers()`

## 3. Before you start
เขียนรายการ state ทั้งหมดที่ผู้ใช้อาจเห็นบน `FundCard` และแต่ละ state เกิดจาก response แบบไหน

## 4. Exercise
1. เปิด `src/mocks/handlers.ts` ดูว่า API ปกติตอบอะไร
2. `npm run dev` แล้วเลือก Fund A ดู skeleton และการ์ดจริง
3. เขียน `exercise/FundCard.test.tsx` ให้ครบ 4 กรณี: loading, success, error (500), not found (404)
4. ใช้ `findBy...` สำหรับสิ่งที่ขึ้นหลังจาก API ตอบ
5. `npm run test:lesson -- 05` แล้วเทียบกับ `solution/`

## 5. Hints
<details>
<summary>เปิดดู hint</summary>

- loading: ทำให้ response ไม่มาเลย
  ```ts
  server.use(http.get('/api/funds/:id', async () => { await delay('infinite'); }));
  ```
  แล้ว `screen.getByRole('status', { name: 'Loading fund' })`
- success: `await screen.findByRole('heading', { name: 'Fund A' })`
- 500: `new HttpResponse(null, { status: 500 })` → `await screen.findByRole('alert')`
- 404: ใช้ `fundId="999"` (ไม่มีใน data) หรือ override ด้วย `HttpResponse.json({...}, { status: 404 })`
- ถ้าเห็น error `[MSW] Error: intercepted a request without a matching request handler` แปลว่า URL ไม่ตรงกับ handler
</details>

## 6. Key points
- mock ที่ **network** (MSW) ไม่ใช่ mock hook หรือ function
- handler ปกติอยู่ที่เดียว (`src/mocks/handlers.ts`) override ทีละ test ด้วย `server.use`
- `QueryClient` ใหม่ทุก test + `retry: false`
- test ทุก state ที่ผู้ใช้เห็น: loading, success, error, empty / not found
- สิ่งที่มาจาก API ใช้ `findBy` (รอ) ไม่ใช่ `getBy`

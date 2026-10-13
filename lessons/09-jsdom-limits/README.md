# 09 — jsdom limits

## 1. Goal
เข้าใจว่า RTL + Vitest รันใน **jsdom ไม่ใช่ browser จริง** รู้ว่า jsdom ทำอะไรไม่ได้ และ mock `IntersectionObserver` เป็น

## 2. Scope
มุมผู้ใช้: หน้า "All funds" แสดงกองทุนทีละ 3 ตัว เลื่อนลงไปถึงล่างสุด → โหลดเพิ่มอีก 3 ตัว จนครบ

```
AllFundsPage ──► useFunds ──► GET /api/funds
     └─► LazyFundList (funds, pageSize = 3)
            ├─ <li> × count
            └─ <div role="status">Loading more...</div>  ← IntersectionObserver ดู div นี้
                     เข้ามาในจอ → count += 3
```

### jsdom คืออะไร
jsdom = DOM ที่เขียนด้วย JavaScript รันใน Node ไม่มีหน้าจอ ไม่มีการวาด

| ทำได้ ✅ | ทำไม่ได้ ❌ |
| --- | --- |
| สร้าง / หา element, อ่าน text | **layout**: `getBoundingClientRect()` ได้ 0 ทุกค่า |
| event: click, type, submit | **CSS จริง** จากไฟล์ `.css` ไม่ถูก apply |
| `fetch` (ผ่าน MSW) | **scroll** จริง |
| form, focus, ARIA | **`IntersectionObserver`**, **`ResizeObserver`**, **`matchMedia`** ไม่มี |

ดูตัวอย่างจริงใน `solution/jsdomLimits.test.tsx`

### Mock IntersectionObserver

```ts
let notify: IntersectionObserverCallback = () => {};

class FakeIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    notify = callback;          // เก็บ callback ไว้ เพื่อเรียกเองทีหลัง
  }
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  // ...
}

beforeEach(() => vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver));
afterEach(() => vi.unstubAllGlobals());

// "เลื่อนถึงล่างสุด"
act(() => notify([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
```

เรา mock เพราะ **browser API ไม่มีใน jsdom** (เป็นขอบของระบบ เหมือน network) ไม่ใช่ mock code ของเราเอง

### Vitest Browser Mode
ถ้าต้อง test layout, scroll หรือ CSS จริง ๆ Vitest มี **Browser Mode** ที่รัน test ใน browser จริง (ผ่าน Playwright / WebdriverIO) โดยเขียน test แบบเดิมได้ ช้ากว่า jsdom และต้อง setup เพิ่ม repo นี้ไม่ได้ setup ไว้ ดู https://vitest.dev/guide/browser/

## 3. Before you start
ลองเดา: ถ้า render `<LazyFundList />` ใน test ตรง ๆ โดยไม่ mock อะไร จะเกิดอะไรขึ้น?

## 4. Exercise
1. ใน `exercise/LazyFundList.test.tsx` render `<LazyFundList funds={funds} pageSize={3} />` แบบไม่ mock อ่าน error
2. `npm run dev` → เมนู "All funds" เลื่อนลงดูว่าโหลดเพิ่มจริง
3. สร้าง `FakeIntersectionObserver` แล้ว `vi.stubGlobal` ใน `beforeEach`
4. เขียน test ให้ครบทุก `it.todo`
5. เปิด `solution/jsdomLimits.test.tsx` อ่านว่า jsdom ให้ค่าอะไรกับ `getBoundingClientRect` และ CSS
6. `npm run test:lesson -- 09` แล้วเทียบกับ `solution/`

## 5. Hints
<details>
<summary>เปิดดู hint</summary>

- error ข้อ 1: `ReferenceError: IntersectionObserver is not defined`
- `funds` จาก `@/mocks/data` มี 7 ตัว: 3 → 6 → 7
- ต้องเรียก callback ใน `act()` เพราะมันทำให้ state เปลี่ยน
- component สร้าง observer ใหม่ทุกครั้งที่ count เปลี่ยน → `notify` จะชี้ไปที่ callback ล่าสุดเสมอ
- ลืม `vi.unstubAllGlobals()` → fake ค้างอยู่ใน test อื่นของไฟล์เดียวกัน ทำให้ test ที่ไม่ได้ตั้งใจใช้ fake ได้ผลผิด
</details>

## 6. Key points
- RTL ไม่ได้เปิด browser จริง มันรันใน jsdom
- jsdom ไม่มี layout, CSS จริง, scroll, `IntersectionObserver` / `ResizeObserver` / `matchMedia`
- browser API ที่ไม่มีให้ mock ด้วย `vi.stubGlobal` แล้วคืนค่าด้วย `vi.unstubAllGlobals`
- เก็บ callback ไว้แล้วเรียกเองใน `act()` เพื่อจำลองเหตุการณ์
- ถ้าต้อง test layout จริง ใช้ Vitest Browser Mode หรือ E2E

# 11 — Async & flaky tests

## 1. Goal
รู้จัก test ที่ **ผ่านบ้างไม่ผ่านบ้าง** (flaky) และ test ที่ **ผ่านตลอดแม้ app พัง** แล้วแก้ให้เสถียร

## 2. Scope
code เดิมจากบท 05 และ 07: `FundCard` (โหลดผ่าน MSW) และ `useFundSearch`

ปัญหาที่เจอบ่อยในงานจริง 3 แบบ:

| ปัญหา | อาการ |
| --- | --- |
| รอด้วย `setTimeout` | ผ่านบนเครื่องเรา พังบน CI ที่ช้ากว่า |
| ลืม `await` | ผ่านเสมอ แม้ข้อความบนจอผิด |
| แชร์ state ระหว่าง test | ผ่านเมื่อรันตามลำดับ พังเมื่อสลับลำดับหรือรันแยก |

## 3. Before you start
เปิด `exercise/flaky.bad.test.tsx` อ่านแต่ละ test แล้วเดาว่าจะพังเมื่อไหร่ ก่อนลองข้อ 4

## 4. Exercise
1. **ทำให้ API ช้าลง**: ใน `src/mocks/handlers.ts` เปลี่ยน `await delay()` ของ `/api/funds/:id` เป็น `await delay(200)`
   แล้วรัน `npm run test:lesson -- 11` → bad test "shows the fund name" พัง ❌ solution ยังผ่าน ✅ (แก้กลับ)
2. **ทำให้ข้อความผิด**: ใน bad test เปลี่ยน `'NAV: 12.50'` เป็น `'NAV: 99.99'` → ยัง **ผ่าน** ❌ ทำไม? (แก้กลับ)
3. **สลับลำดับ test**:
   ```bash
   npm run test:lesson -- 11 exercise --sequence.shuffle --sequence.seed=3
   ```
   → "returns all 7 funds" พัง เพราะ test อีกตัวเพิ่ม fund เข้าไปใน array ที่ใช้ร่วมกันแล้ว
4. **Rewrite** ใน `exercise/flaky.test.tsx` ให้ผ่านทั้ง 3 ข้อข้างบน
5. เทียบกับ `solution/flaky.test.tsx`

## 5. Hints
<details>
<summary>วิธีแก้</summary>

1. ใช้ `await screen.findBy...` แทน `setTimeout` + `getBy` (`findBy` รอได้ถึง 1 วินาที และคืนทันทีที่เจอ)
2. `findBy` คืน Promise และ Promise เป็น truthy เสมอ ต้อง `expect(await screen.findBy...)` ESLint rule `testing-library/await-async-queries` จับให้ได้
3. แต่ละ test สร้างข้อมูลของตัวเอง เช่น `[...funds, newFund]` ไม่ `push` ใส่ของที่ใช้ร่วมกัน
4. เรื่องเวลา (debounce) ใช้ fake timers แบบบท 07 ไม่รอเวลาจริง
</details>

## 6. Key points
- ห้าม "รอให้นานพอ" ด้วย `setTimeout` ให้รอ **สิ่งที่ผู้ใช้เห็น** ด้วย `findBy` / `waitFor`
- ทุก query ที่ขึ้นต้นด้วย `find` ต้อง `await`
- test ต้องผ่านได้ไม่ว่าจะรันลำดับไหน หรือรันตัวเดียว (`it.only`)
- test ที่ flaky แย่กว่าไม่มี test เพราะทีมจะเลิกเชื่อ CI
- จบบทแล้วรีวิวด้วย [checklist](../../REVIEW-CHECKLIST.md)

# 12 — Capstone: Sell fund

## 1. Goal
ใช้ทุกอย่างที่เรียนมา: **วางแผนเอง เขียน test เองทั้งหมด** กับฟีเจอร์ใหม่ที่ยังไม่มี test แล้ววัดผลด้วย coverage และ Stryker

## 2. Scope
ฟีเจอร์ขายกองทุน (ยังไม่ได้ต่อเข้าหน้าไหนในแอป ใช้เป็น component เดี่ยว ๆ)

```
components/SellFundForm.tsx ──► utils/calcSellAmount.ts
props: fund, unitsHeld, daysHeld, onSubmit(units)
```

spec (สิ่งที่ผู้ใช้เห็น):

| สถานการณ์ | ผู้ใช้เห็น |
| --- | --- |
| ยังไม่กรอก | ปุ่ม Sell กดไม่ได้ ไม่มี error |
| กรอก units ถูกต้อง | "You get X THB" (units × NAV ปัดลง 2 ตำแหน่ง) และกด Sell ได้ |
| กด "Sell all" | ช่อง Units ถูกเติมด้วยจำนวนที่ถืออยู่ทั้งหมด |
| ถือไม่ถึง 30 วัน | ข้อความ "Held less than 30 days: 0.5% fee" และหักค่าธรรมเนียม 0.5% (ปัดลง 2 ตำแหน่ง) |
| มีแต่ช่องว่าง (เช่น `'   '`) | "Please enter units" (ลบจนช่องว่างเปล่า = ไม่มี error เหมือนแถวแรก) |
| ไม่ใช่ตัวเลข, 0, ติดลบ | "Units must be greater than 0" |
| มากกว่าที่ถือ | "You only have N units" |

## 3. Before you start
**อย่าเพิ่งเปิด `solution/`** เขียนแผน test ลงกระดาษหรือ comment ก่อน:
- อะไร test ที่ `calcSellAmount` (pure function) อะไร test ผ่าน `SellFundForm`
- ค่าขอบมีอะไรบ้าง (29 vs 30 วัน, เท่ากับที่ถือพอดี, การปัด)
- เลือก query และ matcher อะไร

## 4. Exercise
1. เขียนแผน (ข้อ 3) ให้ผู้สอนดู
2. เขียน `exercise/calcSellAmount.test.ts` และ `exercise/SellFundForm.test.tsx`
3. วัดผล
   ```bash
   npm run test:lesson -- 12 exercise
   npm run coverage:capstone        # ดู branch coverage ของ 2 ไฟล์นี้
   npm run test:mutation:capstone   # Stryker → reports/mutation-capstone/index.html
   ```
   เป้า: mutation score 90% ขึ้นไป และอธิบายได้ทุกบรรทัดที่ยังไม่ถูกรัน หรือ mutant ที่ยังรอด
4. ดู mutant ที่รอด แล้วตัดสินใจ: เพิ่ม test หรืออธิบายได้ว่าทำไมไม่ต้อง
5. รีวิวด้วย [checklist](../../REVIEW-CHECKLIST.md) แล้วเทียบกับ `solution/`

## 5. Hints
<details>
<summary>mutant ที่เฉลยก็ยังฆ่าไม่ได้ (2 ตัว)</summary>

- ลบ `event.preventDefault()` → jsdom ไม่เปลี่ยนหน้าเวลา submit form จึงไม่มีอะไรให้เห็น (บท 09)
- เปลี่ยน `if (error === null)` ใน `handleSubmit` เป็น `if (true)` → ปุ่ม disabled อยู่แล้ว ผู้ใช้ submit ตอน error ไม่ได้ (coverage ก็บอกว่า branch นี้ไม่ถูกรัน)

ทั้งหมดนี้ "ไม่คุ้มที่จะ test" หรือ test ไม่ได้ใน jsdom ตอบได้แบบนี้ก็ถือว่าผ่าน
</details>

<details>
<summary>ตัวเลขที่ใช้ได้</summary>

- Fund A (NAV 12.5) 100 units, 60 วัน → 1,250.00
- Fund A (NAV 12.5) 100 units, 29 วัน → 1,243.75
- Fund B (NAV 8.2345) 1.2345 units = 10.1654... → 10.16 (ปัดลง ไม่ใช่ 10.17) test ที่ `calcSellAmount`
</details>

## 6. Key points
- เริ่มจาก spec ที่ผู้ใช้เห็น แล้วค่อยแยกว่าอะไร test ที่ function อะไร test ที่ component
- coverage บอกว่า code ไหน **ไม่ถูกรัน** Stryker บอกว่า code ไหน **ไม่ถูกเช็ค**
- mutation score 100% ไม่ใช่เป้าเสมอไป ให้อธิบาย mutant ที่รอดได้ก็พอ

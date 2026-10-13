# 10 — Bug hunt

## 1. Goal
ฝึกคิดว่า **ควร test อะไร** โดยไม่มีใครบอก: มี bug ซ่อนอยู่ 1 ตัว ให้เขียน test จนจับได้เอง

## 2. Scope
function ที่เคยเจอแล้วในบท 01-02 bug อยู่ในไฟล์ใดไฟล์หนึ่ง

```
utils/validateAmount.ts   utils/calcFee.ts   utils/calcUnits.ts   utils/formatAmount.ts
```

มี bug ให้สุ่ม 6 แบบ แต่ละแบบทำให้ app ผิดในแบบที่ผู้ใช้เจอได้จริง

## 3. Before you start
**ห้ามเปิด `scripts/bug-hunt.mjs`** (รายการ bug อยู่ในนั้น)
เขียนรายการก่อนว่าแต่ละ function มีจุดไหนที่ bug น่าจะซ่อน เช่น ค่าขอบ, การปัด, input แปลก ๆ

## 4. Exercise
1. ปลูก bug แบบสุ่ม
   ```bash
   npm run bug:plant
   ```
2. เขียน test ใน `exercise/bugHunt.test.ts` แล้วรัน `npm run test:lesson -- 10 exercise`
3. test fail แล้ว? **เดาก่อน** ว่า bug คืออะไร อยู่ไฟล์ไหน แล้วค่อยเฉลย
   ```bash
   npm run bug:reveal   # บอกว่าเป็น bug ไหน และคืนค่า src/ ให้
   ```
4. ทำซ้ำจนจับได้ครบทั้ง 6 ตัว (เลือกเลขได้ เช่น `npm run bug:plant -- 4`) โดยใช้ test ชุดเดิม เพิ่มเฉพาะที่ขาด
5. เทียบกับ `solution/bugHunt.test.ts` (test 6 ตัว จับ bug ได้ทั้ง 6 แบบ)

ถ้าลืม reveal แล้วไฟล์ใน `src/` ค้าง ให้ `npm run bug:reveal` หรือ `git checkout -- src`

## 5. Hints
<details>
<summary>bug ชอบซ่อนตรงไหน</summary>

- **ค่าขอบพอดี**: ใส่เท่ากับ min หรือเท่ากับ balance พอดี ควรผ่านไหม (`<` กับ `<=` ต่างกันแค่ตัวเดียว)
- **input ที่ดูว่าง**: `''` กับ `'   '` ต่างกันไหมในสายตาผู้ใช้
- **การปัดเศษ**: ปัดขึ้น / ลง / ใกล้สุด ลองเลขที่ผลต่างกัน เช่น 18.5184
- **floating point**: `1004 / 12.5`
- **ค่าแปลก**: `NaN`, `null`
</details>

## 6. Key points
- test happy path อย่างเดียวจับ bug ได้น้อยมาก bug ส่วนใหญ่อยู่ที่ **ขอบ**
- เขียน test จาก **spec** (ควรเป็นยังไง) ไม่ใช่จาก code (ตอนนี้เป็นยังไง)
- test ที่ดีชุดเดียว ควรจับ bug ได้หลายแบบโดยไม่ต้องรู้ล่วงหน้าว่า bug คืออะไร
- จบบทแล้วรีวิวด้วย [checklist](../../REVIEW-CHECKLIST.md)

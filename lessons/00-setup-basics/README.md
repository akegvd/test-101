# 00 — Setup & basics

## 1. Goal
รัน test ให้เป็น (ทั้งหมด, watch mode, ทีละไฟล์) และรู้จัก `describe`, `test` / `it`, `expect` กับ matcher พื้นฐาน

## 2. Scope
บทนี้ยังไม่มี UI เราจะลองเขียน test สั้น ๆ กับ pure function ใน `src/utils/`

```
basics.test.ts ──► utils/formatAmount.ts   (1000 → "1,000.00")
               ──► utils/validateAmount.ts ("999" → "Minimum amount is 1,000.00")
               ──► utils/calcFee.ts        (0 → throw Error)
```

คำสั่งที่ต้องรู้:

| คำสั่ง | ทำอะไร |
| --- | --- |
| `npm test` | รัน test ทั้งหมด 1 รอบ |
| `npm run test:watch` | watch mode: แก้ไฟล์แล้ว test รันใหม่เอง (กด `h` ดูปุ่มลัด) |
| `npm run test:ui` | เปิด Vitest UI ใน browser |
| `npx vitest run lessons/00-setup-basics/exercise/basics.test.ts` | รันไฟล์เดียว |
| `npm run test:lesson -- 00` | รันทั้งบท (exercise + solution) |
| `npm run test:lesson -- 00 exercise` | รันเฉพาะ exercise |
| `npx vitest run -t "formatAmount"` | รันเฉพาะ test ที่ชื่อมีคำนี้ |

`test` กับ `it` คือ **ตัวเดียวกัน** ต่างกันแค่ตอนอ่าน:

```ts
test('formatAmount: 1000 → "1,000.00"', ...);   // นอก describe ใช้ test

describe('validateAmount', () => {
  it('valid amount → null', ...);                // ใน describe ใช้ it → อ่านเป็นประโยค
});
```

repo นี้บังคับด้วย ESLint (`vitest/consistent-test-it`): นอก `describe` ใช้ `test` ใน `describe` ใช้ `it`

Matcher ที่ใช้บ่อย:

| Matcher | ใช้เมื่อ |
| --- | --- |
| `toBe(x)` | ค่า primitive (string, number, boolean) เท่ากันเป๊ะ |
| `toEqual(obj)` | object / array ที่ "หน้าตา" เหมือนกัน |
| `toBeNull()` | ต้องเป็น `null` |
| `toContain('x')` | string / array มีค่านี้อยู่ข้างใน |
| `toThrow('msg')` | function ต้อง throw (ต้องส่งเป็น `() => fn()`) |
| `not.` | กลับความหมาย เช่น `not.toBe` |

## 3. Before you start
ลองตอบก่อน: `expect({ a: 1 }).toBe({ a: 1 })` ผ่านหรือไม่ผ่าน? เพราะอะไร?

## 4. Exercise
1. `npm install` แล้ว `npm test` ดูว่ามี test กี่ไฟล์ ผ่านกี่ตัว และเป็น `todo` กี่ตัว
2. รันแค่บทนี้: `npm run test:lesson -- 00 exercise`
3. เปิด watch mode: `npm run test:watch -- lessons/00-setup-basics/exercise` แล้วแก้ `'1,000.00'` เป็น `'1000.00'` ดูว่า error message บอกอะไร แล้วแก้กลับ
4. เปิด `exercise/basics.test.ts` เปลี่ยน `it.todo(...)` ทุกตัวให้เป็น test จริง (ใช้ matcher ตามที่ชื่อ test บอก)
5. รัน `npm run lint` ให้ผ่าน แล้วเทียบกับ `solution/basics.test.ts`

## 5. Hints
<details>
<summary>เปิดดู hint</summary>

- `validateAmount('5000', { min: 1000, balance: 50000 })` → `null`
- `toThrow` ต้องส่ง function: `expect(() => calcFee(0, false)).toThrow('...')`
  ถ้าเขียน `expect(calcFee(0, false))` มันจะ throw ก่อนถึง `expect`
- คำตอบ "Before you start": **ไม่ผ่าน** เพราะ `toBe` เช็คว่าเป็น object **ตัวเดียวกัน** (`Object.is`) ต้องใช้ `toEqual`
</details>

## 6. Key points
- `test` = `it` ใช้ `it` ใน `describe` เพื่อให้อ่านเป็นประโยค
- รันทีละไฟล์ / watch mode ทำให้ loop "แก้ → เห็นผล" เร็วขึ้นมาก
- primitive ใช้ `toBe` ส่วน object / array ใช้ `toEqual`
- `toThrow` ต้องห่อด้วย `() =>`
- ลองทำให้ test fail ดูก่อนเสมอ จะได้รู้ว่า test จับ bug ได้จริง

# 02 — Coverage

## 1. Goal
อ่าน coverage report เป็น และเข้าใจว่า **coverage 100% ≠ test ดี** coverage บอกแค่ว่า code "ถูกรัน" ไม่ได้บอกว่า "ถูกเช็ค"

## 2. Scope
มุมผู้ใช้: ตอนซื้อกองทุน ระบบคิดค่าธรรมเนียม (fee) และเช็คยอดเงินที่กรอก

```
utils/calcFee.ts        amount <= 0 → throw    VIP → 0    อื่น ๆ → 1.5% ปัด 2 ตำแหน่ง
utils/validateAmount.ts ""  → "Please enter an amount"
                        "abc" → "Please enter a number"
                        < min → "Minimum amount is 1,000.00"
                        > balance → "Insufficient balance"
                        ok → null

ConfirmPage ──► calcFee
BuyFundForm ──► validateAmount
```

### 4 คอลัมน์ใน report

| คอลัมน์ | นับอะไร |
| --- | --- |
| Statements | คำสั่งแต่ละคำสั่งถูกรันไหม |
| Branches | **ทุกทาง** ของ `if/else`, `? :`, `&&`, `\|\|` ถูกรันไหม |
| Functions | function ถูกเรียกไหม |
| Lines | บรรทัดถูกรันไหม |

**Branch สำคัญที่สุด** เพราะ bug มักซ่อนอยู่ในทางที่ไม่เคยถูกรัน เช่น `if` ที่ไม่เคยเป็น `true`

### Demo: 100% coverage แต่ไม่จับ bug

`exercise/calcFee.weak.test.ts`:

```ts
it('runs every line', () => {
  expect(calcFee(1000, false)).toBeDefined();   // แค่เช็คว่า "มีค่า"
  expect(calcFee(1000, true)).toBeDefined();
  expect(() => calcFee(0, false)).toThrow();
});
```

```bash
npm run coverage -- lessons/02-coverage/exercise/calcFee.weak --coverage.include=src/utils/calcFee.ts
```

ได้ 100% ทุกคอลัมน์ ✅ ทีนี้แก้ `src/utils/calcFee.ts` เปลี่ยน `0.015` เป็น `0.15` (fee แพงขึ้น 10 เท่า!) แล้วรันใหม่ → **ยังผ่าน** ❌

ลองรัน test ที่ดีกว่า (`solution/calcFee.test.ts`) ซึ่งมี coverage 100% เท่ากัน:

```bash
npx vitest run lessons/02-coverage/solution/calcFee
```

→ `normal customer pays 1.5% of the amount: 1000 → 15` **fail** จับ bug ได้ (อย่าลืมแก้ `0.15` กลับเป็น `0.015`)

### 100% ก็ยังพลาดได้

แม้ test ดี + coverage 100% ก็ยังมีกรณีที่ไม่มีใครคิดถึง:

- `calcFee(NaN, false)` → ได้ `NaN` (ไม่ throw!) เพราะ `NaN <= 0` เป็น `false`
- `calcFee(0.01, false)` → ได้ `0` (ซื้อ 1 สตางค์ไม่เสีย fee) ตั้งใจไหม?

coverage ไม่รู้จัก input ที่คุณ **ไม่ได้** เขียน มันวัดได้แค่ code ที่มีอยู่แล้ว

### อ่าน HTML report

`npm run coverage` แล้วเปิด `coverage/index.html` ใน browser → คลิกไปที่ไฟล์

| เห็นอะไร | หมายความว่า |
| --- | --- |
| แถบ **แดง** | บรรทัด / statement นี้ไม่เคยถูกรัน |
| แถบ **เหลือง** | branch ถูกรันแค่บางทาง |
| `I` หน้า `if` | ทาง `if` (เงื่อนไขเป็น true) ไม่เคยถูกรัน |
| `E` หน้า `if` | ทาง `else` (เงื่อนไขเป็น false) ไม่เคยถูกรัน |
| `5x` ทางซ้าย | hit count: บรรทัดนี้ถูกรัน 5 ครั้ง |

## 3. Before you start
ดู `src/utils/validateAmount.ts` แล้วตอบ: มีกี่ branch? `exercise/validateAmount.test.ts` ตอนนี้ cover กี่ branch?

## 4. Exercise
1. ทำ demo ข้างบน (weak test ผ่าน แม้ fee ผิด 10 เท่า)
2. รัน `npm run coverage -- lessons/02-coverage/exercise/validateAmount --coverage.include=src/utils/validateAmount.ts`
3. เปิด `coverage/index.html` → `validateAmount.ts` หาบรรทัดแดง / เหลือง / `I` / `E`
4. สำหรับแต่ละ branch ที่ยังไม่ถูก cover ตัดสินใจ: **ควร test ไหม? ทำไม?** แล้วเพิ่ม test ใน `exercise/validateAmount.test.ts`
5. คิดต่อ: ถ้า coverage ได้ 100% แล้ว ยังขาด test อะไรอีก? (ดูขอบ: เท่ากับ min พอดี, เท่ากับ balance พอดี)
6. เทียบกับ `solution/`

## 5. Hints
<details>
<summary>branch ที่ยังไม่ถูก cover</summary>

- `text === ''` → "Please enter an amount" ควร test: ผู้ใช้ลบจนว่างได้จริง
- `Number.isNaN(amount)` → "Please enter a number" ควร test: ผู้ใช้พิมพ์ผิดได้จริง
- `amount > balance` → "Insufficient balance" **ต้อง** test: เป็นกฎทางธุรกิจที่สำคัญ
- ขอบ `1000` (min พอดี) และ `50000` (balance พอดี) ไม่ได้เพิ่ม coverage เลย แต่จับ bug `<` vs `<=` ได้ → ไปต่อที่บท 03
</details>

<details>
<summary>เมื่อไหร่ "ไม่ต้อง" test branch</summary>

ถ้า branch นั้นเป็นแค่ code ป้องกันที่เกิดขึ้นไม่ได้จริง หรือ test แล้วต้อง mock เยอะจนไม่คุ้ม ก็ข้ามได้ แต่ให้ **ตัดสินใจโดยตั้งใจ** ไม่ใช่ลืม
</details>

## 6. Key points
- coverage บอกว่า code **ถูกรัน** ไม่ได้บอกว่า **ถูกเช็ค**
- Branch coverage สำคัญกว่า Line coverage
- ใช้ coverage หา "ที่ที่ยังไม่ได้ test" ไม่ใช่เป็นเป้าหมาย
- 100% ยังพลาด input แปลก ๆ อย่าง `NaN`, `0.01`, ค่าที่ขอบพอดี
- weak assertion อย่าง `toBeDefined()` เพิ่ม coverage แต่แทบไม่ช่วยอะไร

# 01 — Pure functions & readable tests

## 1. Goal
เขียน test ที่ **อ่านแล้วรู้เลยว่าเช็คอะไร**: ตั้งชื่อดี, Arrange-Act-Assert, ไม่มี logic ใน test และคิด edge case เป็น

## 2. Scope
มุมผู้ใช้: หน้าซื้อกองทุนแสดงยอดเงินแบบ `1,234.50` และหน้า confirm แสดงจำนวน units ที่จะได้

```
utils/formatAmount.ts   1234.5 → "1,234.50"     null / NaN → "-"
utils/calcUnits.ts      amount / NAV → ปัดลง 4 ตำแหน่ง   (200 / 3 → 66.6666)
                        NAV <= 0 หรือ NaN → throw    amount < 0 หรือ NaN → throw

ใช้ที่:  FundCard, BuyFundForm ──► formatAmount
         ConfirmPage          ──► formatAmount, calcUnits
```

ทั้งสองเป็น **pure function**: input เดิม → output เดิมเสมอ ไม่มี API ไม่มี state จึง test ง่ายที่สุด

### ❌ test ที่ไม่ดี (`exercise/formatAmount.bad.test.ts`)

```ts
test('formatAmount works', () => {
  const values = [0, 1000, 1234.5, -50];
  for (const value of values) {
    const expected = value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    expect(formatAmount(value)).toBe(expected);
  }
});
```

### ✅ แบบที่ดี (`solution/formatAmount.test.ts`)

```ts
it.each([
  { value: 1000, expected: '1,000.00' },
  { value: 1234567, expected: '1,234,567.00' },
])('adds a comma every 3 digits: $value → "$expected"', ({ value, expected }) => {
  expect(formatAmount(value)).toBe(expected);
});
```

ตั้งชื่อ test แบบ **"condition → result"** เช่น `null → "-"`, `NAV 0 → throws "NAV must be greater than 0"`

**Arrange-Act-Assert (AAA)**:

```ts
it('rounds long decimals to 2 places: 1.239 → "1.24"', () => {
  const value = 1.239;                // Arrange: เตรียมข้อมูล
  const result = formatAmount(value); // Act: เรียกสิ่งที่ test
  expect(result).toBe('1.24');        // Assert: เช็คผล
});
```

## 3. Before you start
1. เปิด `exercise/formatAmount.bad.test.ts` แล้ว **เขียนรายการปัญหา** ของ test นี้ (อย่างน้อย 3 ข้อ)
2. เขียนรายการว่า `calcUnits` ควร test กรณีไหนบ้าง (คิด edge case: 0, ติดลบ, ทศนิยมยาว, เลขใหญ่มาก, `NaN`, floating point)

## 4. Exercise
1. ทำข้อ "Before you start" ให้เสร็จ
2. เขียน `exercise/formatAmount.test.ts` ด้วย `it.each` และ expected value แบบ hard-code
3. เขียน `exercise/calcUnits.test.ts` ให้ครบทุก `it.todo`
4. ลองทำให้ code พัง: ใน `src/utils/calcUnits.ts` เปลี่ยน `Math.floor` เป็น `Math.round` → test ไหน fail? (แล้วแก้กลับ)
5. `npm run test:lesson -- 01` แล้วเทียบกับ `solution/`

## 5. Hints
<details>
<summary>ปัญหาของ bad test</summary>

1. ชื่อ `'formatAmount works'` ไม่บอกว่าเช็คอะไร พอ fail ก็ไม่รู้ว่ากรณีไหนพัง
2. มี loop → fail ตัวแรกแล้วหยุด ไม่รู้ว่าค่าอื่นผ่านไหม และ report ไม่บอกว่า value ไหนพัง
3. **คำนวณ expected ใหม่ใน test** (copy logic มาจาก code) → ถ้า logic ผิด test ก็ผิดตาม แล้วผ่านไปด้วยกัน
4. ไม่มี edge case: `null`, `NaN`, เลขใหญ่, ทศนิยมยาว
5. ทุกอย่างอัดอยู่ใน test เดียว ไม่ใช่ 1 test = 1 พฤติกรรม
</details>

<details>
<summary>ค่า expected ของ calcUnits</summary>

- `calcUnits(1000, 10)` → `100`
- `calcUnits(200, 3)` → `66.6666` (ไม่ใช่ 66.6667 เพราะปัด **ลง**)
- `calcUnits(1000, 8.2345)` → `121.4402`
- `calcUnits(1_000_000_000, 12.5)` → `80_000_000`
- `calcUnits(1004, 12.5)` → `80.32` (ถ้าใช้ `Math.floor` ตรง ๆ จะได้ `80.3199` เพราะ floating point: `1004 / 12.5 * 10000` = `803199.9999999999`)
- `it.each([0, -5, NaN])('NAV %s → throws ...', (nav) => ...)`
</details>

## 6. Key points
- ชื่อ test = "condition → result" อ่านแล้วรู้ว่าพังตรงไหนโดยไม่ต้องเปิด code
- expected ต้อง **hard-code** ห้ามคำนวณใหม่ใน test
- ไม่มี `if` / `for` ใน test → ใช้ `it.each` แทน
- Arrange-Act-Assert ทำให้ test อ่านง่าย
- edge case ที่ต้องคิดเสมอ: 0, ติดลบ, ทศนิยมยาว, เลขใหญ่มาก, `NaN`, `null`

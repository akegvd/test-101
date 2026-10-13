# 03 — Mutation testing

## 1. Goal
ใช้ Stryker วัดว่า test **จับ bug ได้จริงไหม** ไม่ใช่แค่ "รัน code ครบไหม" แบบ coverage

## 2. Scope
code ที่ test: `src/utils/calcFee.ts` และ `src/utils/calcUnits.ts` (ดูพฤติกรรมในบท 01 และ 02)

```
Stryker ──► แก้ code ทีละจุด (mutant)  เช่น  <=  → <    *  → /    'msg' → ""
        ──► รัน test ที่เกี่ยวข้อง
              test fail  → mutant "killed"   ✅ test จับ bug นี้ได้
              test ผ่าน  → mutant "survived" ❌ ถ้ามี bug แบบนี้จริง test จะไม่รู้

stryker.config.json           ──► รันกับ lessons/03-mutation-testing/solution
stryker.exercise.config.json  ──► รันกับ lessons/03-mutation-testing/exercise
```

ตัวอย่าง mutant ที่รอดจาก weak test ของบท 02:

```diff
- return Math.round(amount * FEE_RATE * 100) / 100;
+ return Math.round(amount / FEE_RATE * 100) / 100;     ← test ยังผ่าน!
```

```diff
- if (isVip) {
+ if (false) {                                           ← VIP เสีย fee แต่ test ยังผ่าน!
```

**Mutation score** = mutant ที่ถูก kill / mutant ทั้งหมด

| คำสั่ง | ทำอะไร |
| --- | --- |
| `npm run test:mutation:exercise` | รันกับ test ของคุณใน `exercise/` |
| `npm run test:mutation` | รันกับ `solution/` (ควรได้ 100%) |

report HTML อยู่ที่ `reports/mutation-exercise/index.html` และ `reports/mutation/index.html`

## 3. Before you start
coverage ของ `exercise/` ตอนนี้ = 100% แล้ว ลองเดาก่อน: mutation score จะได้กี่ %? mutant แบบไหนจะรอด?

## 4. Exercise
1. `npm run test:mutation:exercise` (ใช้เวลาประมาณ 20 วินาที)
2. อ่านรายการ `[Survived]` ใน terminal หรือเปิด `reports/mutation-exercise/index.html` (คลิกจุดสีแดงเพื่อดู mutant)
3. ทุก mutant ที่รอด ถามตัวเองว่า "ถ้ามี bug แบบนี้จริง ผู้ใช้จะเห็นอะไรผิด?" แล้วเขียน test ที่จับได้
4. เปลี่ยน `it.todo` ใน `exercise/calcFee.test.ts` และ `exercise/calcUnits.test.ts` เป็น test จริง
5. รัน `npm run test:mutation:exercise` ซ้ำ จนได้ 100% (หรือใกล้เคียง) แล้วลบ weak test เดิมทิ้ง
6. เทียบกับ `npm run test:mutation` และ `solution/`

## 5. Hints
<details>
<summary>mutant ที่รอด → test ที่ต้องเพิ่ม</summary>

| Mutant | test ที่ kill ได้ |
| --- | --- |
| `throw new Error("")` | `toThrow('Amount must be greater than 0')` เช็ค message ด้วย |
| `if (true)` / `if (false)` ที่ `isVip` | `calcFee(1000, true)` → `0` และ `calcFee(1000, false)` → `15` |
| `* FEE_RATE` → `/ FEE_RATE` | `calcFee(1000, false)` → `15` (ค่าเป๊ะ ไม่ใช่ `toBeDefined`) |
| `/ 100` → `* 100` | ค่าเป๊ะ เช่น `calcFee(1234.56, false)` → `18.52` |
| `amount < 0` → `amount <= 0` (calcUnits) | `calcUnits(0, 10)` → `0` (ค่าที่ขอบพอดี) |
| `amount / nav` → `amount * nav` | `calcUnits(1000, 10)` → `100` |
</details>

<details>
<summary>ทำไม mutation score ไม่ต้อง 100% เสมอ</summary>

บาง mutant เป็น "equivalent mutant" คือแก้แล้วพฤติกรรมเหมือนเดิม จึง kill ไม่ได้ และ mutation testing ช้า ใช้กับ logic สำคัญ (เงิน, กฎธุรกิจ) ก็พอ
</details>

## 6. Key points
- coverage วัดว่า code "ถูกรัน" ส่วน mutation วัดว่า test "จับการเปลี่ยนแปลงได้"
- mutant ที่รอด = bug ที่ test ของเราจะไม่เห็น
- assertion ที่ค่าเป๊ะ (`toBe(15)`) kill mutant ได้มากกว่า `toBeDefined()` / `toBeGreaterThan(0)`
- test ค่าที่ขอบพอดี (0, min, balance) เพื่อ kill mutant `<` ↔ `<=`
- mutation testing ช้า ใช้กับ code สำคัญ ไม่ต้องรันทุก commit

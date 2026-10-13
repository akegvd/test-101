# 08 — Page / feature integration

## 1. Goal
test **ทั้ง flow** ของผู้ใช้ข้ามหลาย component และหลายหน้า ด้วย `MemoryRouter` + providers + MSW

## 2. Scope
มุมผู้ใช้: เลือกกองทุน → กรอกจำนวนเงิน → กด Buy → ไปหน้า confirm เห็นจำนวนเงิน "5,000.00" และ fee

```
AppRoutes (App.tsx)
 ├─ "/"        BuyFundPage
 │               ├─ useFunds    → GET /api/funds
 │               ├─ useAccount  → GET /api/account   (balance, isVip)
 │               ├─ FundList    → useFundSearch
 │               ├─ FundCard    → useFund → GET /api/funds/:id
 │               └─ BuyFundForm → onSubmit → navigate("/confirm?fundId=1&amount=5000")
 │
 └─ "/confirm" ConfirmPage
                 ├─ useFund, useAccount
                 └─ formatAmount, calcFee, calcUnits
                    "Amount: 5,000.00 THB"  "Fee: 75.00 THB"  "Units: 400.0000"
```

### Render ทั้งแอปใน test

```tsx
renderWithProviders(
  <MemoryRouter initialEntries={['/']}>   {/* router ในหน่วยความจำ ไม่ต้องมี browser URL */}
    <AppRoutes />                          {/* routes จริงของแอป */}
  </MemoryRouter>,
);
```

### test แต่ละแบบต่างกันยังไง

| แบบ | test อะไร | ตัวอย่างใน repo | เร็ว | มั่นใจ |
| --- | --- | --- | --- | --- |
| Unit | function / hook เดี่ยว ๆ | บท 01–03, 07 (hook) | ⚡⚡⚡ | ⭐ |
| Component integration | component + hook + API (MSW) | บท 04–06 | ⚡⚡ | ⭐⭐ |
| Page integration | หลาย component + routing + API (MSW) | **บทนี้** | ⚡⚡ | ⭐⭐⭐ |
| Contract | frontend กับ backend ตกลง format API ตรงกัน (เช่น Pact, OpenAPI) | ไม่มี | ⚡⚡ | ⭐⭐ (ด้าน API) |
| E2E | browser จริง + backend จริง (Playwright, Cypress) | ไม่มี | ⚡ | ⭐⭐⭐⭐ |

### Testing Trophy 🏆

```
        ▲  E2E            น้อย ๆ (ช้า, เปราะ)
      ▐███▌ Integration   ส่วนใหญ่อยู่ตรงนี้
       ▐█▌  Unit          logic ล้วน ๆ (เงิน, format, validation)
        ▔   Static        TypeScript + ESLint (ได้ฟรี)
```

ทำไม integration เยอะสุด: ใกล้กับที่ผู้ใช้ใช้จริง, refactor ข้างในได้ไม่พัง, แต่ยังเร็วพอรันทุก commit (ไม่ต้องเปิด browser)

## 3. Before you start
เขียน flow สำคัญของหน้านี้ 3–5 flow (happy path + กรณีผิดพลาด) ที่ถ้าพังแล้ว **ผู้ใช้เสียเงินหรือซื้อไม่ได้**

## 4. Exercise
1. `npm run dev` ลองซื้อ Fund A 5,000 บาทด้วยมือ ดูทุกหน้าจอ
2. เขียน `exercise/BuyFlow.test.tsx` ให้ครบทุก `it.todo`
3. เขียน test ให้เหมือนสคริปต์ของผู้ใช้: click → type → click → เช็คหน้าจอ
4. ใช้ `server.use` เปลี่ยน account เป็น VIP และทำให้ `/api/funds` พัง
5. `npm run test:lesson -- 08` แล้วเทียบกับ `solution/`

## 5. Hints
<details>
<summary>เปิดดู hint</summary>

- รอให้รายการกองทุนโหลดก่อน: `await user.click(await screen.findByRole('button', { name: 'Fund A' }))`
- หลังกด Buy หน้าเปลี่ยนและต้องโหลด API ใหม่ → ใช้ `findBy...`
- 5000 × 1.5% = 75.00 และ 5000 / 12.5 = 400.0000 units
- VIP: `server.use(http.get('/api/account', () => HttpResponse.json({ balance: 50000, isVip: true })))`
- `/confirm` ไม่มี query string → "No order to confirm" ไม่ต้องรอ API (ใช้ `getBy` ได้)
- ไม่ต้อง test ทุกกรณีของฟอร์มซ้ำที่นี่ บท 04 ทำแล้ว เลือกแค่ flow สำคัญ
</details>

## 6. Key points
- page integration test = สคริปต์ของผู้ใช้ทั้ง flow
- `MemoryRouter` + `AppRoutes` จริง + providers + MSW
- ส่วนใหญ่ของ test ควรเป็น integration (Testing Trophy)
- ไม่ต้อง test ทุก edge case ซ้ำ ระดับ page เน้น flow สำคัญ
- E2E (browser จริง) ใช้กับ flow สำคัญมาก ๆ ไม่กี่ตัว ไม่ได้ setup ใน repo นี้

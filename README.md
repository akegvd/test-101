# Test 101 — Frontend unit & integration testing

repo สำหรับสอนการเขียน test ฝั่ง frontend แบบตัวต่อตัว ครั้งละประมาณ 1 ชั่วโมง
เป้าหมายคือเขียน test ที่ **มีประโยชน์** ไม่ใช่แค่ test ที่ผ่าน

app ตัวอย่างคือแอปซื้อกองทุนรวมแบบง่าย ๆ (รายการกองทุน, การ์ดกองทุน, ฟอร์มซื้อ, หน้า confirm)
ข้อมูลทั้งหมดเป็นของปลอม (Fund A, Fund B, ...)

## เริ่มต้น

ต้องมี Node.js 22 ขึ้นไป

```bash
npm install
npm run dev            # เปิดแอปที่ http://localhost:5173 (API ปลอมด้วย MSW ใน browser)
npm run test:solution  # รัน test เฉลยทั้งหมด ต้องผ่านหมด
```

## Lessons

แต่ละบททำจบในตัวเอง: เปิดโฟลเดอร์ → อ่าน README → ทำ `exercise/` → รัน test → เทียบกับ `solution/`

| # | บท | เรียนอะไร |
| --- | --- | --- |
| 00 | [Setup & basics](lessons/00-setup-basics/README.md) | รัน test, watch mode, `test` vs `it`, `describe`, matcher พื้นฐาน |
| 01 | [Pure functions & readable tests](lessons/01-pure-functions/README.md) | ชื่อ test ที่ดี, AAA, ไม่มี logic ใน test, `test.each`, edge case |
| 02 | [Coverage](lessons/02-coverage/README.md) | อ่าน coverage report และทำไม 100% ยังไม่พอ |
| 03 | [Mutation testing](lessons/03-mutation-testing/README.md) | ใช้ Stryker หา test ที่จับ bug ไม่ได้ |
| 04 | [Form with RTL + user-event](lessons/04-form-testing/README.md) | test แบบผู้ใช้, query priority, `getBy` / `queryBy` / `findBy` |
| 05 | [MSW + component integration](lessons/05-msw-integration/README.md) | mock ที่ network, `server.use`, loading / error / 404 |
| 06 | [Fix the bad test](lessons/06-fix-the-bad-test/README.md) | หาปัญหาของ test ที่ผูกกับ implementation แล้ว rewrite |
| 07 | [Custom hooks](lessons/07-custom-hooks/README.md) | `renderHook`, `act`, fake timers กับ debounce |
| 08 | [Page / feature integration](lessons/08-page-integration/README.md) | test ทั้ง flow ข้ามหน้าด้วย `MemoryRouter`, Testing Trophy |
| 09 | [jsdom limits](lessons/09-jsdom-limits/README.md) | jsdom ทำอะไรไม่ได้, mock `IntersectionObserver` |

คำถามที่พบบ่อยอยู่ใน [FAQ.md](FAQ.md)

## Scripts

| คำสั่ง | ทำอะไร |
| --- | --- |
| `npm run dev` | รันแอปพร้อม MSW mock ใน browser |
| `npm test` | รัน test ทั้งหมด 1 รอบ (exercise + solution) |
| `npm run test:watch` | watch mode |
| `npm run test:ui` | Vitest UI |
| `npm run test:lesson -- 05` | รันบท 05 (เพิ่ม `exercise` หรือ `solution` ต่อท้ายได้) |
| `npm run test:solution` | รัน test เฉลยทุกบท |
| `npm run coverage` | coverage report → `coverage/index.html` |
| `npm run test:mutation` | Stryker กับ `calcFee.ts` + `calcUnits.ts` โดยใช้ test เฉลยบท 03 → `reports/mutation/` |
| `npm run test:mutation:exercise` | Stryker แบบเดียวกัน แต่ใช้ test ใน `exercise/` ของบท 03 |
| `npm run lint` | ESLint + TypeScript type check |
| `npm run demo:rename` / `demo:revert` | demo ของบท 06 (refactor แล้วดูว่า test ไหนพัง) |

## โครงสร้าง

```
src/
├── api/          fetch functions (getFunds, getFund, getAccount)
├── hooks/        useFund, useFunds, useAccount, useFundSearch
├── utils/        pure functions (formatAmount, calcUnits, calcFee, validateAmount)
├── components/   FundCard, BuyFundForm, FundList, LazyFundList
├── pages/        BuyFundPage, ConfirmPage, AllFundsPage
├── mocks/        MSW handlers + fake data (ใช้ทั้งใน test และ npm run dev)
└── test/         setup.ts (MSW server), renderWithProviders
lessons/
└── NN-name/
    ├── README.md
    ├── exercise/  test ให้ผู้เรียนเขียน (it.todo) และตัวอย่าง test ที่ไม่ดี (*.bad.test.*)
    └── solution/  test เฉลย
```

code ของแอปอยู่ใน `src/` ที่เดียว ทุกบทใช้ร่วมกัน ในบทเรียนมีแค่ test กับ README

## หมายเหตุ

- `npm test` จะเห็น `todo` เยอะ เป็นเรื่องปกติ คือ test ที่รอผู้เรียนเขียน
- ไฟล์ `*.bad.test.*` ผ่าน แต่ตั้งใจให้เป็นตัวอย่างที่ไม่ดี ESLint ปิดบาง rule ให้ไฟล์พวกนี้
- ใช้ Vitest 4.1 (ไม่ใช่ 5) เพราะ Stryker ยังไม่รองรับ Vitest 5
- ถ้า `npm install` ด้วย npm 10 แล้วเจอ error `Cannot read properties of null (reading 'edgesOut')` ให้ใช้ `package-lock.json` ที่มากับ repo (อย่าลบ) หรืออัปเดตเป็น npm 11

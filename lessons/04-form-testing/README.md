# 04 — Form with RTL + user-event

## 1. Goal
test component **แบบที่ผู้ใช้ใช้งาน**: พิมพ์, คลิก แล้วเช็คสิ่งที่เห็นบนจอ และเลือก query ให้ถูก

## 2. Scope
มุมผู้ใช้: กรอกจำนวนเงิน → ถ้าผิดเห็นข้อความ error และกด Buy ไม่ได้ → ถ้าถูกกด Buy แล้วส่งจำนวนเงินออกไป

```
BuyFundForm.tsx  (props: minAmount, balance, onSubmit)
   ├──► utils/validateAmount.ts   ข้อความ error
   ├──► utils/formatAmount.ts     "Min 1,000.00 · Balance 50,000.00"
   └──► onSubmit(5000)            ส่งให้ parent (BuyFundPage)
```

หน้าตา:

```
Amount (THB)  [ 999            ]
Min 1,000.00 · Balance 50,000.00
Minimum amount is 1,000.00          ← role="alert"
[ Buy ]  (disabled)
```

### Query priority (ใช้ตัวบนก่อน)

1. `getByRole('button', { name: 'Buy' })` สิ่งที่ผู้ใช้และ screen reader เห็น
2. `getByLabelText('Amount (THB)')` input ที่มี label
3. `getByText('Insufficient balance')` ข้อความทั่วไป
4. `getByTestId(...)` ใช้ **สุดท้าย** ผู้ใช้มองไม่เห็น test id

### getBy vs queryBy vs findBy

| | ไม่เจอ | เจอหลายตัว | รอได้ไหม | ใช้เมื่อ |
| --- | --- | --- | --- | --- |
| `getBy` | throw | throw | ไม่ | สิ่งนั้นต้องมีอยู่แล้ว |
| `queryBy` | `null` | throw | ไม่ | เช็คว่า **ไม่มี** (`not.toBeInTheDocument()`) |
| `findBy` | throw (หลังรอ) | throw | รอได้ถึง 1 วินาที | สิ่งที่ขึ้นมาทีหลัง (API) → บท 05 |

### user-event

```ts
const user = userEvent.setup();                                   // สร้างก่อน render
await user.type(screen.getByLabelText('Amount (THB)'), '5000');   // พิมพ์ทีละตัวเหมือนคนจริง
await user.click(screen.getByRole('button', { name: 'Buy' }));
```

`onSubmit` เป็น prop ที่ component ส่งค่า **ออก** ไปให้ parent การใช้ `vi.fn()` ตรงนี้จึงโอเค เพราะเราเช็ค output ไม่ได้เช็คว่าข้างใน component ทำงานยังไง

## 3. Before you start
มองจากมุมผู้ใช้ เขียนรายการว่าฟอร์มนี้ควร test อะไรบ้าง (อย่างน้อย 5 ข้อ) ก่อนเปิด `exercise/`

## 4. Exercise
1. เขียน `exercise/BuyFundForm.test.tsx` ให้ครบทุก `it.todo`
2. ใช้ `getByRole` / `getByLabelText` เท่านั้น (ห้าม `container.querySelector`)
3. เช็ค "ไม่มี error" ด้วย `queryByRole('alert')`
4. ลอง: เปลี่ยน `getByRole('button', { name: 'Buy' })` เป็น `getByRole('button', { name: 'Sell' })` อ่าน error message ของ RTL ดูว่ามันช่วยบอกอะไรบ้าง
5. `npm run test:lesson -- 04` แล้วเทียบกับ `solution/`

## 5. Hints
<details>
<summary>เปิดดู hint</summary>

- render ใน helper เพื่อลด code ซ้ำ:
  ```ts
  function renderForm() {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<BuyFundForm minAmount={1000} balance={50000} onSubmit={onSubmit} />);
    return { user, onSubmit };
  }
  ```
- error อยู่ใน `role="alert"` → `expect(screen.getByRole('alert')).toHaveTextContent('Insufficient balance')`
- `toBeDisabled()` / `toBeEnabled()` มาจาก `@testing-library/jest-dom`
- `onSubmit` ต้องได้ **number** `5000` ไม่ใช่ string `'5000'`
- ถ้าไม่รู้ว่าควร query อะไร ใส่ `screen.logTestingPlaygroundURL()` ใน test แล้วเปิดลิงก์ที่ได้
</details>

## 6. Key points
- test สิ่งที่ผู้ใช้ **เห็นและทำ** ไม่ใช่ state หรือ function ข้างใน
- Query: `getByRole` → `getByLabelText` → `getByText` → `getByTestId`
- `getBy` = ต้องมี, `queryBy` = เช็คว่าไม่มี, `findBy` = รอ
- ใช้ `userEvent.setup()` และ `await` ทุก action
- ถ้า query ด้วย role ไม่ได้ อาจแปลว่า component ไม่ accessible

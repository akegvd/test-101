# FAQ

### TDD จำเป็นไหม?
ไม่จำเป็น สิ่งสำคัญคือมี test ที่ดี ไม่ว่าจะเขียนก่อนหรือหลัง code
TDD ช่วยมากกับ logic ที่ชัด (เช่น `calcFee`) เพราะบังคับให้คิด case ก่อน
สำหรับ UI ที่ยังเปลี่ยนบ่อย เขียน test หลังจากหน้าตานิ่งแล้วก็ได้

### Snapshot test ดีไหม?
ส่วนใหญ่ **ไม่คุ้ม** สำหรับ component: snapshot ใหญ่ ไม่มีใครอ่าน พอเปลี่ยนอะไรนิดเดียวก็พัง แล้วคนก็กด `-u` อัปเดตโดยไม่ดู
ใช้ได้กับ output เล็ก ๆ ที่อ่านง่าย (เช่น inline snapshot ของ object สั้น ๆ)
ถ้าอยากรู้ว่าผู้ใช้เห็นอะไร ให้ assert ตรง ๆ ด้วย `getByRole` / `getByText`

### Unit vs integration ต่างกันยังไง?
**Unit** test ชิ้นเดียวแยกออกมา (เช่น `formatAmount`, `useFundSearch`)
**Integration** test หลายชิ้นทำงานด้วยกัน (เช่น `FundCard` + `useFund` + fetch + MSW)
ดูตารางเต็มใน [บท 08](lessons/08-page-integration/README.md)

### Test custom hook ยังไง?
ถ้า hook ใช้ใน component เดียว → test ผ่าน component นั้น
ถ้าใช้หลายที่หรือ logic ซับซ้อน → `renderHook` + `act` (และ fake timers ถ้ามีเรื่องเวลา)
ดู [บท 07](lessons/07-custom-hooks/README.md)

### Coverage ควรได้กี่ %?
ไม่มีตัวเลขวิเศษ ทีมส่วนใหญ่ใช้ 70–80% เป็นขั้นต่ำ
ดู **branch coverage** มากกว่า line และใช้ coverage หา "จุดที่ยังไม่ได้ test" ไม่ใช่เป้าหมาย
100% ก็ยังมี bug ได้ ([บท 02](lessons/02-coverage/README.md)) ใช้ mutation testing ([บท 03](lessons/03-mutation-testing/README.md)) เช็คคุณภาพ test

### ควร mock อะไร?
mock **ขอบของระบบ**: network (MSW), เวลา (fake timers), browser API ที่ jsdom ไม่มี (`IntersectionObserver`)
**อย่า** mock code ของเราเอง (hook, util, component ลูก) เพราะ test จะผูกกับ implementation
callback prop อย่าง `onSubmit` ใช้ `vi.fn()` ได้ เพราะเป็น output ของ component

### `test` vs `it`?
ตัวเดียวกัน ต่างแค่การอ่าน
repo นี้ใช้ `test` นอก `describe` และ `it` ใน `describe` (อ่านเป็นประโยค: "FundCard it shows ...")
ESLint (`vitest/consistent-test-it`) เช็คให้

### RTL เปิด browser จริงไหม?
ไม่เปิด RTL + Vitest รันใน **jsdom** (DOM จำลองใน Node) จึงเร็ว แต่ไม่มี layout, CSS จริง, scroll
ถ้าต้องการ browser จริงใช้ Vitest Browser Mode หรือ E2E (Playwright) ดู [บท 09](lessons/09-jsdom-limits/README.md)

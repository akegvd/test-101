# 07 — Custom hooks

## 1. Goal
test custom hook ด้วย `renderHook` + `act` ใช้ fake timers กับ debounce และรู้ว่าเมื่อไหร่ควร test hook เดี่ยว ๆ หรือ test ผ่าน component

## 2. Scope
มุมผู้ใช้: พิมพ์ในช่อง "Search funds" → หยุดพิมพ์ 300ms → รายการกองทุนถูกกรอง

```
FundList.tsx ──► hooks/useFundSearch.ts
                    query       ← ค่าที่พิมพ์ (เปลี่ยนทันที)
                    setQuery()
                    results     ← กรองจาก query หลังหยุดพิมพ์ 300ms (debounce)
                                   ไม่สนตัวพิมพ์ใหญ่ / เล็ก
```

```
พิมพ์ "Fund"   ──200ms──  พิมพ์ "Fund A"  ──300ms──►  กรอง "Fund A"
                          (timer เริ่มใหม่)
```

### renderHook + act

```ts
const { result } = renderHook(() => useFundSearch(funds));

act(() => result.current.setQuery('Fund B'));   // เปลี่ยน state ต้องอยู่ใน act
act(() => vi.advanceTimersByTime(300));          // เดินเวลาปลอม 300ms

expect(result.current.results).toEqual([fundB]);
```

- `result.current` = ค่าล่าสุดที่ hook return (อ่านใหม่ทุกครั้ง ห้ามเก็บไว้ในตัวแปร)
- `act()` บอก React ว่า "อัปเดต state ให้เสร็จก่อน แล้วค่อยเช็ค"

### Fake timers

```ts
beforeEach(() => vi.useFakeTimers());   // setTimeout ไม่รันเองแล้ว
afterEach(() => vi.useRealTimers());    // คืนค่าทุกครั้ง!
```

test ไม่ต้องรอ 300ms จริง และควบคุมได้เป๊ะ เช่น 299ms ยังไม่กรอง 300ms กรองแล้ว

### Hook เดี่ยว ๆ vs ผ่าน component

| test hook เดี่ยว ๆ (`renderHook`) | test ผ่าน component (`render`) |
| --- | --- |
| hook ใช้ในหลาย component | hook ใช้ใน component เดียว |
| logic ซับซ้อน มีหลายกรณี / timing | อยากรู้ว่าผู้ใช้เห็นผลถูกไหม |
| ต้องเช็คขอบเวลาเป๊ะ ๆ (299 vs 300ms) | ไม่สนรายละเอียดข้างใน (refactor ได้) |

ส่วนใหญ่ **เริ่มจาก test ผ่าน component** ก่อน แล้วค่อยเพิ่ม test hook เมื่อ logic ซับซ้อน

## 3. Before you start
เขียนรายการว่า `useFundSearch` ควรถูก test อะไรบ้าง โดยเฉพาะเรื่องเวลา (ก่อน 300ms, หลัง 300ms, พิมพ์ต่อเนื่อง)

## 4. Exercise
1. เขียน `exercise/useFundSearch.test.ts` ด้วย `renderHook` + `act` + fake timers
2. ลองลบ `act(...)` ออกจากบรรทัด `advanceTimersByTime` → เกิดอะไรขึ้น? (แล้วใส่กลับ)
3. ลองลืม `vi.useRealTimers()` ใน `afterEach` แล้วคิดว่าจะกระทบ test อื่นยังไง
4. เขียน `exercise/FundList.test.tsx` test การค้นหาเดียวกันผ่าน component (ใช้ timer จริง)
5. เปรียบเทียบสองไฟล์: ไฟล์ไหนยังผ่าน ถ้าเปลี่ยน delay จาก 300 เป็น 500ms?
6. `npm run test:lesson -- 07` แล้วเทียบกับ `solution/`

## 5. Hints
<details>
<summary>เปิดดู hint</summary>

- สร้างข้อมูล test เองในไฟล์ (สั้นและอ่านง่าย):
  ```ts
  const fundA: Fund = { id: '1', name: 'Fund A', nav: 10, minAmount: 1000 };
  ```
- `toEqual([fundA, fundB, fundC])` ดีกว่า `toHaveLength(3)` เพราะเช็คว่าเป็นกองไหนด้วย
- ผ่าน component: `await user.type(screen.getByRole('searchbox', { name: 'Search funds' }), 'Fund B')`
  แล้ว `await waitFor(() => expect(screen.queryByRole('button', { name: 'Fund A' })).not.toBeInTheDocument())`
- ข้อ 5: test ผ่าน component ยังผ่าน (`waitFor` รอได้ถึง 1 วินาที) ส่วน hook test ที่เช็ค 300ms จะ fail → เพราะมันเช็ครายละเอียดเวลา ซึ่งบางครั้งก็คือสิ่งที่เราอยากเช็ค
</details>

## 6. Key points
- `renderHook` + `result.current` สำหรับ test hook เดี่ยว ๆ
- เปลี่ยน state หรือเดินเวลา ต้องอยู่ใน `act()`
- fake timers ทำให้ test debounce เร็วและแม่น อย่าลืม `vi.useRealTimers()`
- เริ่มจาก test ผ่าน component ก่อน test hook เดี่ยว ๆ เมื่อ logic ซับซ้อนหรือใช้หลายที่

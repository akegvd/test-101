# 06 — Fix the bad test

## 1. Goal
มองให้ออกว่า test ไหน "ผ่านแต่ไม่มีประโยชน์" และ rewrite ให้ test **พฤติกรรม** ไม่ใช่ **implementation**

## 2. Scope
component เดียวกับบท 05:

```
FundCard → useFund → api/getFund → GET /api/funds/:id → MSW
```

ผู้ใช้เห็นอะไรได้บ้าง:

| สถานการณ์ | ผู้ใช้เห็น |
| --- | --- |
| กำลังโหลด | skeleton (`role="status"`, name "Loading fund") |
| สำเร็จ | ชื่อกองทุน (heading) + "NAV: 12.50" |
| server error | "Something went wrong" |
| ไม่มีกองทุนนี้ (404) | "Fund not found" |

## 3. Before you start
**อย่าเพิ่งเปิดไฟล์ใน `exercise/`** เขียนรายการก่อนว่า `FundCard` ควรถูก test อะไรบ้าง จากตารางข้างบน

เสร็จแล้วค่อยเปิด `exercise/FundCard.bad.test.tsx`:

```tsx
vi.mock('@/hooks/useFund');
vi.mock('@/utils/formatAmount');

describe('FundCard', () => {
  it('FundCard', () => {
    vi.mocked(useFund).mockReturnValue({ data: { id: '1', name: 'Fund A', ... }, isPending: false, isError: false });
    vi.mocked(formatAmount).mockReturnValue('12.50');

    const { container } = render(<FundCard fundId="1" />);

    expect(useFund).toHaveBeenCalled();
    expect(useFund).toHaveBeenCalledWith('1');
    expect(formatAmount).toHaveBeenCalledWith(12.5);
    expect(container.querySelector('.fund-card__name')?.textContent).toBe('Fund A');
  });
});
```

## 4. Exercise
1. **เขียนรายการปัญหาทั้งหมด** ของ bad test (คำตอบอยู่ใน Hints)
2. **Demo: refactor แล้วดูว่า test ไหนพัง**
   ```bash
   npm run demo:rename          # useFund → useFundDetail และ class fund-card__name → fund-card__title
   npm run test:lesson -- 06    # bad test พัง ❌  good test (solution) ยังผ่าน ✅
   npm run demo:revert          # เปลี่ยนกลับ
   ```
   app ทำงานเหมือนเดิมทุกอย่าง (ลอง `npm run dev` ระหว่าง demo ได้) แต่ bad test พัง = **false alarm**
   ถ้าใช้ git ก็คืนค่าได้ด้วย `git checkout -- src && git clean -fd src`
3. **ลองอีกทาง: ทำให้ app พังจริง** แล้วรัน `npm run test:lesson -- 06` ทีละข้อ (แก้กลับทุกครั้ง)
   - `src/api/fund.ts`: เปลี่ยน URL เป็น `/api/fund/${id}` (พิมพ์ผิด) → การ์ดขึ้น "Something went wrong" ตลอด
   - `src/utils/formatAmount.ts`: เปลี่ยน `FractionDigits: 2` ทั้งสองบรรทัดเป็น `1` → NAV แสดง `12.5` แทน `12.50`
   - `src/components/FundCard.tsx`: ลบข้อความ `Something went wrong` ออก

   bad test **ผ่านทุกข้อ** ❌ (missed bug) ส่วน good test fail ✅
4. **Rewrite** ใน `exercise/FundCard.test.tsx` ด้วย RTL + MSW (ห้าม `vi.mock`) ให้ครบทุกแถวในตาราง
5. เทียบกับ `solution/FundCard.test.tsx`

## 5. Hints
<details>
<summary>ปัญหาของ bad test</summary>

1. **ชื่อ test** `'FundCard'` ไม่บอกว่าเช็คพฤติกรรมอะไร
2. **mock hook ของตัวเอง** (`useFund`) → ไม่ได้ test การดึงข้อมูลจริงเลย และพังทันทีที่เปลี่ยนชื่อ / ย้ายไฟล์ hook
3. **mock pure function** (`formatAmount`) → ถ้า format ผิด (เช่นแสดง `12.5`) test ไม่รู้ และไม่มีเหตุผลต้อง mock เพราะมันเร็วและไม่มี side effect
4. **`toHaveBeenCalled` / `toHaveBeenCalledWith`** เช็คว่า "เรียกยังไง" (implementation) ไม่ใช่ "ผู้ใช้เห็นอะไร"
5. **หา element ด้วย CSS class** → เปลี่ยน class เพื่อแต่ง style ก็พัง ผู้ใช้มองไม่เห็น class
6. **ไม่เช็ค NAV บนจอ** เช็คแค่ว่า `formatAmount` ถูกเรียก
7. **ไม่มี loading, error, not found** มีแค่ happy path
8. mock return value ต้อง cast type (`as ReturnType<...>`) = สัญญาณว่ากำลังสร้างของปลอมที่ไม่เหมือนจริง
</details>

<details>
<summary>โครง test ที่ดี</summary>

```tsx
it('success → shows the fund name and formatted NAV', async () => {
  renderWithProviders(<FundCard fundId="1" />);

  expect(await screen.findByRole('heading', { name: 'Fund A' })).toBeInTheDocument();
  expect(screen.getByText('NAV: 12.50')).toBeInTheDocument();
});
```
</details>

## 6. Key points
- test ที่ดี **พังเมื่อ app พัง** และ **ไม่พังเมื่อแค่ refactor**
- mock เฉพาะขอบของระบบ (network) ไม่ mock code ของเราเอง
- เช็คสิ่งที่ผู้ใช้เห็น ไม่ใช่ว่า function ถูกเรียกกี่ครั้ง
- ห้ามหา element ด้วย CSS class ใช้ role / label / text
- ก่อนเขียน test ให้เขียนรายการ "ผู้ใช้เห็นอะไรได้บ้าง" ก่อนเสมอ

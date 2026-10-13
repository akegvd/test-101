"""ฟังก์ชันคำนวณราคาหลังหักส่วนลด ใช้เป็นตัวอย่างสำหรับบทที่ 1"""


def calculate_discount(price: float, percent: float) -> float:
    """คืนราคาหลังหักส่วนลด ``percent`` เปอร์เซ็นต์ ปัดเศษ 2 ตำแหน่ง

    - ``price`` ต้องไม่ติดลบ
    - ``percent`` ต้องอยู่ระหว่าง 0 ถึง 100
    """
    if price < 0:
        raise ValueError("price must not be negative")
    if not 0 <= percent <= 100:
        raise ValueError("percent must be between 0 and 100")

    return round(price * (100 - percent) / 100, 2)

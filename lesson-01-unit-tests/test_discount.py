import pytest

from discount import calculate_discount


# --- กรณีปกติ (happy path) ---

def test_applies_ten_percent_discount():
    # Arrange: เตรียมข้อมูลนำเข้าและค่าที่คาดหวัง
    price = 200
    percent = 10

    # Act: เรียกฟังก์ชันที่ต้องการทดสอบ
    result = calculate_discount(price, percent)

    # Assert: ตรวจว่าผลลัพธ์ตรงกับที่คาดไว้
    assert result == 180


def test_zero_percent_returns_original_price():
    # Arrange
    price = 99.5

    # Act
    result = calculate_discount(price, 0)

    # Assert
    assert result == 99.5


# --- กรณีขอบ (edge cases) ---

def test_hundred_percent_makes_it_free():
    # Arrange
    price = 350

    # Act
    result = calculate_discount(price, 100)

    # Assert
    assert result == 0


def test_result_is_rounded_to_two_decimals():
    # Arrange: 19.99 ลด 15% = 16.9915 ต้องปัดเป็น 16.99
    price = 19.99
    percent = 15

    # Act
    result = calculate_discount(price, percent)

    # Assert
    assert result == 16.99


# --- กรณีข้อมูลผิด (error cases) ---

def test_negative_price_raises_error():
    # Arrange
    price = -1

    # Act + Assert: pytest.raises ตรวจว่ามี exception เกิดขึ้นจริง
    with pytest.raises(ValueError):
        calculate_discount(price, 10)


@pytest.mark.parametrize("percent", [-5, 101])
def test_percent_out_of_range_raises_error(percent):
    # Arrange: ค่า percent มาจาก parametrize (รันเทสต์นี้ 2 รอบ)
    price = 100

    # Act + Assert
    with pytest.raises(ValueError):
        calculate_discount(price, percent)

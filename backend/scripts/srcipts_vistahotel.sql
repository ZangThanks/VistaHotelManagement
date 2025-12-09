USE vistalhoteldbs;
INSERT INTO hourly_rate_policy (id, policy_name, weekend_surcharge)
VALUES (1, 'Chính sách tiêu chuẩn 2025-2026', 15.0);


INSERT INTO policy_weekend_days (policy_id, day_of_week)
VALUES (1, 'SATURDAY'),
       (1, 'SUNDAY');

INSERT INTO check_in_out_policy (id, name, standard_check_in_time, standard_check_out_time)
VALUES (1, 'Chính sách Toàn Hệ Thống 2024', '14:00:00', '12:00:00');

-- =============================================
-- A. CHECK-IN SỚM (Early Check-in)
-- =============================================

-- 1. Từ 05:00 - 09:00: Tính 50%
INSERT INTO policy_rule (policy_id, type, start_time, end_time, surcharge_percentage, is_day_charge,
                         free_for_min_rank_level)
VALUES (1, 'EARLY_CHECKIN', '05:00:00', '09:00:00', 50.0, FALSE, NULL);

-- 2. Từ 09:00 - 13:30: Tính 30%
INSERT INTO policy_rule (policy_id, type, start_time, end_time, surcharge_percentage, is_day_charge,
                         free_for_min_rank_level)
VALUES (1, 'EARLY_CHECKIN', '09:00:00', '13:30:00', 30.0, FALSE, NULL);


-- =============================================
-- B. CHECK-OUT MUỘN (Late Check-out)
-- =============================================

-- 3. Từ 12:00 - 13:00: Miễn phí cho Gold (Level 2) trở lên
-- (Giả sử khách thường bị tính 10% phí phục vụ, hoặc bạn có thể để 0.0 nếu khách thường cũng free nhưng không khuyến khích)
INSERT INTO policy_rule (policy_id, type, start_time, end_time, surcharge_percentage, is_day_charge,
                         free_for_min_rank_level)
VALUES (1, 'LATE_CHECKOUT', '12:00:00', '13:00:00', 10.0, FALSE, 2);

-- 4. Từ 13:00 - 15:00: Tính 30% (Không ai được miễn)
INSERT INTO policy_rule (policy_id, type, start_time, end_time, surcharge_percentage, is_day_charge,
                         free_for_min_rank_level)
VALUES (1, 'LATE_CHECKOUT', '13:00:00', '15:00:00', 30.0, FALSE, NULL);

-- 5. Từ 15:00 - 18:00: Tính 50%
INSERT INTO policy_rule (policy_id, type, start_time, end_time, surcharge_percentage, is_day_charge,
                         free_for_min_rank_level)
VALUES (1, 'LATE_CHECKOUT', '15:00:00', '18:00:00', 50.0, FALSE, NULL);

-- 6. Sau 18:00: Tính 100% (Coi như 1 ngày)
-- is_day_charge = TRUE để hệ thống biết tính full giá
INSERT INTO policy_rule (policy_id, type, start_time, end_time, surcharge_percentage, is_day_charge,
                         free_for_min_rank_level)
VALUES (1, 'LATE_CHECKOUT', '18:00:00', '23:59:59', 100.0, TRUE, NULL);


-- ROOM TYPES
INSERT INTO room_types (room_type_id, area, base_price, description, max_occupancy, type_name, hourly_rate_policy_id,
                        check_in_out_policy_id)
VALUES ('STD', 22, 900000, 'Phòng tiêu chuẩn, phù hợp cho 2 người, view thành phố', 2, 'Standard', 1, 1),
       ('DLX', 32, 1500000, 'Phòng Deluxe, rộng rãi, ban công, view biển', 3, 'Deluxe', 1, 1),
       ('STE', 50, 3000000, 'Phòng Suite, cao cấp, phòng khách riêng, view toàn cảnh', 4, 'Suite', 1, 1);


INSERT INTO policy_base_rates (policy_id, hours_duration, percentage)
VALUES (1, 1, 15.0),
       (1, 2, 25.0),
       (1, 3, 35.0),
       (1, 4, 45.0),
       (1, 5, 55.0),
       (1, 6, 65.0),
       (1, 7, 75.0),
       (1, 8, 85.0),
       (1, 9, 100.0);


-- ROOM TYPE AMENTIES
INSERT INTO room_type_amenties (room_type_id, amenties)
VALUES ('STD', 'WiFi'),
       ('STD', 'TV'),
       ('STD', 'Minibar'),
       ('DLX', 'WiFi'),
       ('DLX', 'TV'),
       ('DLX', 'Minibar'),
       ('DLX', 'Ban công'),
       ('STE', 'WiFi'),
       ('STE', 'TV'),
       ('STE', 'Minibar'),
       ('STE', 'Ban công');

-- ROOMS
INSERT INTO rooms (room_number, floor, last_cleaned, notes, status, room_type_id)
VALUES ('STD101', 1, '2024-06-01 12:00:00', 'Sạch sẽ', 'AVAILABLE', 'STD'),
       ('STD102', 1, '2024-06-01 13:00:00', 'Sạch sẽ', 'BOOKED', 'STD'),
       ('STD103', 1, '2024-06-01 14:00:00', 'Đang bảo trì', 'MAINTENANCE', 'STD'),
       ('DLX201', 2, '2024-06-01 11:00:00', 'Sạch sẽ', 'AVAILABLE', 'DLX'),
       ('DLX202', 2, '2024-06-01 12:30:00', 'Đang dọn dẹp', 'CLEANING', 'DLX'),
       ('DLX203', 2, '2024-06-01 13:30:00', 'Sạch sẽ', 'AVAILABLE', 'DLX'),
       ('STE301', 3, '2024-06-01 10:00:00', 'Sạch sẽ', 'AVAILABLE', 'STE'),
       ('STE302', 3, '2024-06-01 09:00:00', 'Sạch sẽ', 'BOOKED', 'STE');

-- ROOM TYPE IMAGES
INSERT INTO room_images (room_id, images_url)
VALUES ('STD101', 'https://res.cloudinary.com/dk8gvar3y/image/upload/v1763548281/travel-1677347_1280_bxcvrh.jpg'),
       ('STD101', 'https://res.cloudinary.com/dk8gvar3y/image/upload/v1763548281/travel-1677347_1280_bxcvrh.jpg'),
       ('STD101', 'https://res.cloudinary.com/dk8gvar3y/image/upload/v1763548240/hotel-1749602_1280_ci7gbv.jpg'),
       ('STD101',
        'https://pix8.agoda.net/hotelImages/7394456/87898656/a9ed80d50120f6b39035912334b2c530.jpg?ce=0&s=600x'),
       ('STD101',
        'https://pix8.agoda.net/hotelImages/7394456/93823858/036cf046c58da8fff1cf92aaf3aa7f37.jpg?ce=2&s=600x'),
       ('DLX201',
        'https://pix8.agoda.net/hotelImages/7394456/87898656/a12bb62e00b1bd42f5bcd4168742230a.jpg?ce=2&s=600x'),
       ('DLX202',
        'https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/629964341.jpg?k=119039eeeec43b29489f366935c93223415e50bca6c94593a0baa3b4f0f1f473&o=&s=600x'),
       ('STE301', 'https://pix8.agoda.net/property/73668369/0/ab0f949fe65b213cc9b1ad2f32c3271f.jpeg?ce=2&s=600x'),
       ('STD103',
        'https://pix8.agoda.net/hotelImages/7394456/87898656/a9ed80d50120f6b39035912334b2c530.jpg?ce=0&s=600x'),
       ('DLX203',
        'https://pix8.agoda.net/hotelImages/7394456/93823858/036cf046c58da8fff1cf92aaf3aa7f37.jpg?ce=2&s=600x'),
       ('DLX203',
        'https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/629950678.jpg?k=519c28836f153d0fc993144aca31868f5489a3d1590a2af8ba7be2d2b5de05a9&o=&s=600x'),
       ('STE302', 'https://pix8.agoda.net/property/73668369/0/ab0f949fe65b213cc9b1ad2f32c3271f.jpeg?ce=2&s=600x');


INSERT INTO seasonal_prices (season_name, price_multiplier, start_date, end_date, description)
VALUES ('Season 1', 1.2, '2025-01-01', '2025-01-31', 'Giá mặc định cho Season 1'),
       ('Season 2', 1.3, '2025-02-01', '2025-02-28', 'Giá mặc định cho Season 2'),
       ('Season 3', 1.4, '2025-03-01', '2025-03-31', 'Giá mặc định cho Season 3'),
       ('Season 4', 1.0, '2025-04-01', '2025-04-30', 'Giá mặc định cho Season 4'),
       ('Season 5', 1.5, '2025-05-01', '2025-05-31', 'Giá mặc định cho Season 5'),
       ('Season 6', 1.0, '2025-06-01', '2025-06-30', 'Giá mặc định cho Season 6'),
       ('Season 7', 1.8, '2025-07-01', '2025-07-31', 'Giá mặc định cho Season 7'),
       ('Season 8', 1.0, '2025-08-01', '2025-08-31', 'Giá mặc định cho Season 8'),
       ('Season 9', 1.2, '2025-09-01', '2025-09-30', 'Giá mặc định cho Season 9'),
       ('Season 10', 1.1, '2025-10-01', '2025-10-31', 'Giá mặc định cho Season 10');

-- STD
INSERT INTO room_type_seasonal_price (room_type_id, seasonal_price_id)
VALUES ('STD', 1),
       ('STD', 2),
       ('STD', 3),
       ('STD', 4),
       ('STD', 6),
       ('STD', 8),
       ('STD', 9),
       ('STD', 10);

-- DLX
INSERT INTO room_type_seasonal_price (room_type_id, seasonal_price_id)
VALUES ('DLX', 1),
       ('DLX', 2),
       ('DLX', 3),
       ('DLX', 4),
       ('DLX', 5),
       ('DLX', 6),
       ('DLX', 7),
       ('DLX', 8),
       ('DLX', 9),
       ('DLX', 10);

-- STE
INSERT INTO room_type_seasonal_price (room_type_id, seasonal_price_id)
VALUES ('STE', 3),
       ('STE', 5),
       ('STE', 7),
       ('STE', 9);

-- CUSTOMERS
INSERT INTO customers (customer_id, address, email, full_name, PASSWORD, joined_date, phone, user_name, user_role,
                       birth_date, gender, loyalty_points, membership_level)
VALUES ('CUS0412250001', 'TP.HCM', 'nguyenvana@gmail.com', 'Nguyễn Văn A', 'hashedpw1', '2025-10-20', '0901234567',
        'nguyenvana', 'CUSTOMER', '1990-05-20', 'MALE', 12000, 'SILVER'),
       ('CUS0412250002', 'TP.HCM', 'tranthib@gmail.com', 'Trần Thị B', 'hashedpw2', '2025-10-20', '0912345678', 'tranthib',
        'CUSTOMER', '1988-08-15', 'FEMALE', 55000, 'GOLD'),
       ('CUS0412250003', 'TP.HCM', 'lequocd@gmail.com', 'Lê Quốc D', 'hashedpw3', '2025-10-20', '0923456789', 'lequocd',
        'CUSTOMER', '1995-12-01', 'MALE', 2500, 'BRONZE'),
       ('CUS0412250004', 'TP.HCM', 'phamthic@gmail.com', 'Phạm Thị C', 'hashedpw4', '2025-10-20', '0934567890', 'phamthic',
        'CUSTOMER', '1992-03-10', 'FEMALE', 105000, 'PLATINUM');

-- ADMINS
INSERT INTO admins (admin_id, address, email, full_name, password, phone, user_name, user_role, admin_level)
VALUES ('ADMIN001', 'TP.HCM', 'admin@vista.com', 'Admin Vista', '@admin', '0999999999', 'adminvista', 'ADMIN', 1);

-- ADMIN PERMISSIONS
INSERT INTO admin_permissions (user_id, permissions)
VALUES ('ADMIN001', 'ALL');

-- SERVICES
INSERT INTO services (service_id, availability, description, price, service_category, service_hours, service_name)
VALUES ('SV001', b'1', 'Phở bò đặc biệt', 80000, 'FOOD_BEVERAGE', '06:00-22:00', 'Phở bò'),
       ('SV002', b'1', 'Bia', 35000, 'FOOD_BEVERAGE', '06:00-23:00', 'Bia Hà Nội'),
       ('SV003', b'1', 'Giặt ủi quần áo', 50000, 'LAUNDRY', '08:00-20:00', 'Giặt ủi'),
       ('SV004', b'1', 'Bánh ngọt tráng miệng', 45000, 'FOOD_BEVERAGE', '06:00-22:00', 'Bánh ngọt'),
       ('SV005', b'1', 'Nước ép cam', 40000, 'FOOD_BEVERAGE', '06:00-22:00', 'Nước ép cam');

INSERT INTO service_images(service_id, images_url)
VALUES ('SV001',
        'https://res.cloudinary.com/dk8gvar3y/image/upload/v1763537227/washing-machine-4124121_1280_sys95s.jpg'),
       ('SV002', 'https://res.cloudinary.com/dk8gvar3y/image/upload/v1763537484/towel-8445521_1280_lnbep7.jpg'),
       ('SV003', 'https://res.cloudinary.com/dk8gvar3y/image/upload/v1763537491/interior-8813803_1280_beoav9.jpg'),
       ('SV004', 'https://res.cloudinary.com/dk8gvar3y/image/upload/v1763537531/interior-8813800_1280_inm40k.jpg'),
       ('SV005',
        'https://res.cloudinary.com/dk8gvar3y/image/upload/v1763537341/washing-machine-9262103_1280_dxw3xm.jpg');

-- PROMOTION TYPE
INSERT INTO promotion_types(promotion_type_id, promotion_type_name, description)
VALUES ('PROMTYPECM', 'Summer Sale', 'Summer Sale'),
       ('PROMTYPEFB', 'First-booking discount', 'First-booking discount');


-- PROMOTIONS
INSERT INTO promotions (promotion_id, description, discount_type, is_active, promotion_name, admin_id,
                        promotion_type_id)
VALUES ('PROMO001', 'Giảm giá mùa hè 10%', 'PERCENT', b'1', 'Summer Sale', 'ADMIN001', 'PROMTYPECM'),
       ('PROMO002', 'Giảm giá lễ hội 200.000 VND', 'FIXED', b'1', 'Festival Discount', 'ADMIN001', 'PROMTYPECM'),
       ('PROMO003', 'Giảm giá cho khách đặt phòng Standard lần đầu 10%', 'PERCENT', b'1',
        'First-booking discount for Standard Room', 'ADMIN001', 'PROMTYPEFB'),
       ('PROMO004', 'Giảm giá cho khách đặt phòng Deluxe lần đầu 12%', 'PERCENT', b'1',
        'First-booking discount for Deluxe Room', 'ADMIN001', 'PROMTYPEFB'),
       ('PROMO005', 'Giảm giá cho khách đặt phòng Suite lần đầu 15%', 'PERCENT', b'1',
        'First-booking discount for Suite Room', 'ADMIN001', 'PROMTYPEFB');

-- ROOM TYPE PROMOTIONS
INSERT INTO room_type_promotions (discount_value, end_date, start_date, room_type_id, promotion_id)
VALUES (10, '2026-08-31', '2025-06-01', 'STD', 'PROMO001'),
       (200000, '2026-07-10', '2025-06-20', 'DLX', 'PROMO002'),
       (10, '2026-07-10', '2025-06-20', 'STD', 'PROMO003'),
       (12, '2026-07-10', '2025-06-20', 'DLX', 'PROMO004'),
       (15, '2026-07-10', '2025-06-20', 'STE', 'PROMO005');

-- VOUCHERS
INSERT INTO vouchers (voucher_id, discount_percentage, discount_type, discount_value, end_date, is_active, start_date,
                      voucher_name)
VALUES ('VOUCHER001', 5, 'PERCENT', NULL, '2024-12-31', b'1', '2024-06-01', 'Giảm giá 5% toàn bộ dịch vụ'),
       ('VOUCHER002', NULL, 'FIXED', 100000, '2024-09-30', b'1', '2024-06-01', 'Giảm 100.000 VND cho khách hàng mới');

-- CUSTOMER VOUCHERS
INSERT INTO customer_vouchers (state, vouchers_id, customer_id)
VALUES (b'1', 'VOUCHER001', 'CUS0412250003'),
       (b'1', 'VOUCHER002', 'CUS0412250001');

-- REVIEWS (Need to create reviews before booking_details since booking_details references reviews)
INSERT INTO reviews (review_id, comment, is_anonymous, location, rating, review_date, room_quality, service_quantity,
                     value_for_money, flag)
VALUES ('REVIEW001', 'Phòng sạch sẽ, nhân viên thân thiện', b'0', 5, 4.5, '2024-06-12 13:00:00', 1, 2, 5, true),
       ('REVIEW002', 'View biển đẹp, đồ ăn ngon', b'1', 4, 4.8, '2024-06-18 13:00:00', 1, 3, 5, true);

-- REVIEW IMAGES
INSERT INTO review_images (review_id, images_url)
VALUES ('REVIEW001',
        'https://res.cloudinary.com/dk8gvar3y/image/upload/v1763549637/hotel-room-5858067_1280_auoi0o.jpg'),
       ('REVIEW001',
        'https://res.cloudinary.com/dk8gvar3y/image/upload/v1763549646/living-room-4809590_1280_avtvye.jpg'),
       ('REVIEW002', 'https://res.cloudinary.com/dk8gvar3y/image/upload/v1763549658/cosy-2648851_1280_hborix.jpg'),
       ('REVIEW002', 'https://res.cloudinary.com/dk8gvar3y/image/upload/v1763549643/curtain-1758853_1280_exc0tv.jpg');

-- BOOKINGS
INSERT INTO `bookings` (`booking_id`, `actual_check_in_time`, `actual_check_out_time`, `booking_date`, `cancellation_date`, `check_in_date`, `check_out_date`, `duration`, `hourly_rate`, `invoice_type`, `number_of_guests`, `package_type`, `payment_status`, `special_requests`, `status`, `total_amount`, `total_cost`, `type`, `customer_id`, `employee_id`) VALUES
      ('B0501250001', '2025-05-01 14:05:00.000000', '2025-05-03 12:00:00.000000', '2025-04-25 10:12:00.000000', NULL, '2025-05-01 14:00:00.000000', '2025-05-03 12:00:00.000000', 2, NULL, NULL, 2, 'Standard', 'COMPLETED', 'Near elevator', 'CHECKED_OUT', 240000, 180000, 'DAILY', 'CUS0412250001', 'EMP002'),
      ('B0601250002', '2025-06-12 15:20:00.000000', '2025-06-15 11:30:00.000000', '2025-06-01 09:30:00.000000', NULL, '2025-06-12 14:00:00.000000', '2025-06-15 12:00:00.000000', 3, NULL, NULL, 3, 'Deluxe', 'COMPLETED', 'High floor requested', 'CHECKED_OUT', 540000, 400000, 'DAILY', 'CUS0412250004', 'EMP001'),
      ('B0701250003', '2025-07-04 13:55:00.000000', '2025-07-06 12:10:00.000000', '2025-07-01 11:45:00.000000', NULL, '2025-07-04 14:00:00.000000', '2025-07-06 12:00:00.000000', 2, NULL, NULL, 1, 'Suite', 'COMPLETED', '', 'CHECKED_OUT', 600000, 420000, 'DAILY', 'CUS0412250002', 'EMP003'),
      ('B0801250004', '2025-08-20 16:10:00.000000', '2025-08-21 11:50:00.000000', '2025-08-05 08:20:00.000000', NULL, '2025-08-20 14:00:00.000000', '2025-08-21 12:00:00.000000', 1, NULL, NULL, 1, 'Standard', 'COMPLETED', 'Early check-in', 'CHECKED_OUT', 120000, 90000, 'DAILY', 'CUS0412250003', 'EMP004'),
      ('B0901250005', '2025-09-10 14:40:00.000000', '2025-09-14 12:15:00.000000', '2025-09-01 10:00:00.000000', NULL, '2025-09-10 14:00:00.000000', '2025-09-14 12:00:00.000000', 4, NULL, NULL, 2, 'Deluxe', 'COMPLETED', 'Extra towels', 'CHECKED_OUT', 800000, 600000, 'DAILY', 'CUS0412250002', 'EMP001'),
      ('B1001250006', '2025-10-02 15:05:00.000000', '2025-10-05 11:45:00.000000', '2025-09-28 12:00:00.000000', NULL, '2025-10-02 14:00:00.000000', '2025-10-05 12:00:00.000000', 3, NULL, NULL, 2, 'Standard', 'COMPLETED', '', 'CHECKED_OUT', 360000, 270000, 'DAILY', 'CUS0412250001', 'EMP002'),
      ('B1101250007', '2025-11-18 13:30:00.000000', '2025-11-19 12:00:00.000000', '2025-11-10 09:45:00.000000', NULL, '2025-11-18 14:00:00.000000', '2025-11-19 12:00:00.000000', 1, NULL, NULL, 1, 'Suite', 'COMPLETED', 'Anniversary setup', 'CHECKED_OUT', 320000, 250000, 'DAILY', 'CUS0412250004', 'EMP005'),
      ('B1201250008', '2025-12-24 14:10:00.000000', '2025-12-27 11:55:00.000000', '2025-12-01 16:20:00.000000', NULL, '2025-12-24 14:00:00.000000', '2025-12-27 12:00:00.000000', 3, NULL, NULL, 2, 'Deluxe', 'COMPLETED', 'Christmas decoration', 'CHECKED_OUT', 950000, 700000, 'DAILY', 'CUS0412250002', 'EMP001'),
      ('B0201250009', '2025-02-14 14:00:00.000000', '2025-02-15 12:05:00.000000', '2025-02-01 08:00:00.000000', NULL, '2025-02-14 14:00:00.000000', '2025-02-15 12:00:00.000000', 1, NULL, NULL, 2, 'Standard', 'COMPLETED', 'Late arrival', 'CHECKED_OUT', 150000, 110000, 'DAILY', 'CUS0412250001', 'EMP003'),
      ('B0301250010', '2025-03-08 15:45:00.000000', '2025-03-10 11:40:00.000000', '2025-03-01 10:10:00.000000', NULL, '2025-03-08 14:00:00.000000', '2025-03-10 12:00:00.000000', 2, NULL, NULL, 1, 'Suite', 'COMPLETED', 'Extra pillows', 'CHECKED_OUT', 420000, 300000, 'DAILY', 'CUS0412250004', 'EMP002');


INSERT INTO `bookings` (`booking_id`, `actual_check_in_time`, `actual_check_out_time`, `booking_date`, `cancellation_date`, `check_in_date`, `check_out_date`, `duration`, `hourly_rate`, `invoice_type`, `number_of_guests`, `package_type`, `payment_status`, `special_requests`, `status`, `total_amount`, `total_cost`, `type`, `customer_id`, `employee_id`) VALUES
      ('B1301250011', '2025-01-20 14:10:00.000000', '2025-01-22 11:50:00.000000', '2025-01-13 09:00:00.000000', NULL, '2025-01-20 14:00:00.000000', '2025-01-22 12:00:00.000000', 2, NULL, NULL, 2, 'Standard', 'COMPLETED', 'Late arrival', 'CHECKED_OUT', 500000, 400000, 'DAILY', 'CUS0412250001', 'EMP001'),
      ('B1401250012', '2025-01-30 15:05:00.000000', '2025-02-02 12:10:00.000000', '2025-01-25 10:20:00.000000', NULL, '2025-01-30 14:00:00.000000', '2025-02-02 12:00:00.000000', 3, NULL, NULL, 3, 'Deluxe', 'COMPLETED', 'High floor', 'CHECKED_OUT', 900000, 700000, 'DAILY', 'CUS0412250002', 'EMP002'),
      ('B1502250013', '2025-02-14 14:25:00.000000', '2025-02-15 11:55:00.000000', '2025-02-01 08:30:00.000000', NULL, '2025-02-14 14:00:00.000000', '2025-02-15 12:00:00.000000', 1, NULL, NULL, 1, 'Suite', 'COMPLETED', 'Anniversary', 'CHECKED_OUT', 350000, 250000, 'DAILY', 'CUS0412250003', 'EMP003'),
      ('B1603250014', '2025-03-12 13:45:00.000000', '2025-03-15 12:00:00.000000', '2025-03-01 11:00:00.000000', NULL, '2025-03-12 14:00:00.000000', '2025-03-15 12:00:00.000000', 3, NULL, NULL, 2, 'Standard', 'COMPLETED', '', 'CHECKED_OUT', 720000, 540000, 'DAILY', 'CUS0412250004', 'EMP004'),
      ('B1704250015', '2025-04-05 14:00:00.000000', '2025-04-07 11:40:00.000000', '2025-03-28 09:15:00.000000', NULL, '2025-04-05 14:00:00.000000', '2025-04-07 12:00:00.000000', 2, NULL, NULL, 1, 'Suite', 'COMPLETED', 'Extra pillows', 'CHECKED_OUT', 640000, 480000, 'DAILY', 'CUS0412250001', 'EMP005'),
      ('B1805250016', '2025-05-10 14:20:00.000000', '2025-05-12 12:05:00.000000', '2025-05-01 16:45:00.000000', NULL, '2025-05-10 14:00:00.000000', '2025-05-12 12:00:00.000000', 2, NULL, NULL, 2, 'Deluxe', 'COMPLETED', 'Near elevator', 'CHECKED_OUT', 760000, 580000, 'DAILY', 'CUS0412250002', 'EMP001'),
      ('B1906250017', '2025-06-20 15:10:00.000000', '2025-06-23 12:00:00.000000', '2025-06-05 10:00:00.000000', NULL, '2025-06-20 14:00:00.000000', '2025-06-23 12:00:00.000000', 3, NULL, NULL, 3, 'Deluxe', 'COMPLETED', 'Birthday setup', 'CHECKED_OUT', 1100000, 850000, 'DAILY', 'CUS0412250003', 'EMP002'),
      ('B2007250018', '2025-07-08 13:50:00.000000', '2025-07-10 11:30:00.000000', '2025-07-01 12:10:00.000000', NULL, '2025-07-08 14:00:00.000000', '2025-07-10 12:00:00.000000', 2, NULL, NULL, 1, 'Standard', 'COMPLETED', 'Quiet room', 'CHECKED_OUT', 260000, 200000, 'DAILY', 'CUS0412250004', 'EMP003'),
      ('B2108250019', '2025-08-15 14:05:00.000000', '2025-08-18 12:00:00.000000', '2025-08-01 09:00:00.000000', NULL, '2025-08-15 14:00:00.000000', '2025-08-18 12:00:00.000000', 3, NULL, NULL, 2, 'Suite', 'COMPLETED', 'Late checkout', 'CHECKED_OUT', 980000, 760000, 'DAILY', 'CUS0412250001', 'EMP004'),
      ('B2209250020', '2025-09-02 15:30:00.000000', '2025-09-04 11:55:00.000000', '2025-08-20 08:50:00.000000', NULL, '2025-09-02 14:00:00.000000', '2025-09-04 12:00:00.000000', 2, NULL, NULL, 2, 'Deluxe', 'COMPLETED', 'Sea view', 'CHECKED_OUT', 820000, 650000, 'DAILY', 'CUS0412250002', 'EMP001'),
      ('B2310250021', '2025-10-10 14:00:00.000000', '2025-10-13 12:00:00.000000', '2025-09-28 11:20:00.000000', NULL, '2025-10-10 14:00:00.000000', '2025-10-13 12:00:00.000000', 3, NULL, NULL, 3, 'Suite', 'COMPLETED', 'Complimentary wine', 'CHECKED_OUT', 1300000, 980000, 'DAILY', 'CUS0412250003', 'EMP005'),
      ('B2411250022', '2025-11-20 14:18:00.000000', '2025-11-22 11:40:00.000000', '2025-11-05 10:10:00.000000', NULL, '2025-11-20 14:00:00.000000', '2025-11-22 12:00:00.000000', 2, NULL, NULL, 2, 'Standard', 'COMPLETED', '', 'CHECKED_OUT', 340000, 260000, 'DAILY', 'CUS0412250004', 'EMP002'),
      ('B2512250023', '2025-12-24 14:05:00.000000', '2025-12-27 12:00:00.000000', '2025-12-01 09:30:00.000000', NULL, '2025-12-24 14:00:00.000000', '2025-12-27 12:00:00.000000', 3, NULL, NULL, 2, 'Deluxe', 'COMPLETED', 'Christmas package', 'CHECKED_OUT', 1250000, 900000, 'DAILY', 'CUS0412250001', 'EMP001'),
      ('B2601250024', '2025-01-05 14:12:00.000000', '2025-01-07 12:00:00.000000', '2025-01-02 07:45:00.000000', NULL, '2025-01-05 14:00:00.000000', '2025-01-07 12:00:00.000000', 2, NULL, NULL, 1, 'Standard', 'COMPLETED', 'Early check-in', 'CHECKED_OUT', 280000, 210000, 'DAILY', 'CUS0412250002', 'EMP003'),
      ('B2702250025', '2025-02-20 15:00:00.000000', '2025-02-22 12:10:00.000000', '2025-02-10 09:00:00.000000', NULL, '2025-02-20 14:00:00.000000', '2025-02-22 12:00:00.000000', 2, NULL, NULL, 2, 'Deluxe', 'COMPLETED', 'Extra towels', 'CHECKED_OUT', 640000, 480000, 'DAILY', 'CUS0412250003', 'EMP004'),
      ('B2803250026', '2025-03-18 14:30:00.000000', '2025-03-19 11:50:00.000000', '2025-03-05 12:30:00.000000', NULL, '2025-03-18 14:00:00.000000', '2025-03-19 12:00:00.000000', 1, NULL, NULL, 1, 'Suite', 'COMPLETED', 'Quiet floor', 'CHECKED_OUT', 420000, 300000, 'DAILY', 'CUS0412250004', 'EMP005'),
      ('B2904250027', '2025-04-25 14:22:00.000000', '2025-04-28 11:45:00.000000', '2025-04-10 11:00:00.000000', NULL, '2025-04-25 14:00:00.000000', '2025-04-28 12:00:00.000000', 3, NULL, NULL, 3, 'Deluxe', 'COMPLETED', 'Airport pickup', 'CHECKED_OUT', 1020000, 770000, 'DAILY', 'CUS0412250001', 'EMP001'),
      ('B3005250028', '2025-05-30 13:55:00.000000', '2025-06-01 12:00:00.000000', '2025-05-15 10:05:00.000000', NULL, '2025-05-30 14:00:00.000000', '2025-06-01 12:00:00.000000', 2, NULL, NULL, 2, 'Standard', 'COMPLETED', '', 'CHECKED_OUT', 460000, 350000, 'DAILY', 'CUS0412250002', 'EMP002'),
      ('B3106250029', '2025-06-21 14:40:00.000000', '2025-06-23 11:55:00.000000', '2025-06-10 09:40:00.000000', NULL, '2025-06-21 14:00:00.000000', '2025-06-23 12:00:00.000000', 2, NULL, NULL, 1, 'Suite', 'COMPLETED', 'Complimentary breakfast', 'CHECKED_OUT', 700000, 520000, 'DAILY', 'CUS0412250003', 'EMP003'),
      ('B3207250030', '2025-07-28 15:15:00.000000', '2025-07-31 12:00:00.000000', '2025-07-01 08:20:00.000000', NULL, '2025-07-28 14:00:00.000000', '2025-07-31 12:00:00.000000', 3, NULL, NULL, 2, 'Deluxe', 'COMPLETED', 'Ocean view', 'CHECKED_OUT', 1500000, 1120000, 'DAILY', 'CUS0412250004', 'EMP004');


-- BOOKING DETAILS
INSERT INTO booking_details (room_price, booking_id, room_number, review_id) VALUES
(900000, 'B2803250026', 'STD101', 'REVIEW001'),
(1500000, 'B3005250028', 'DLX201', 'REVIEW002'),
(3000000, 'B2411250022', 'STE301', NULL),
(1500000, 'B3106250029', 'DLX202', NULL);

INSERT INTO `booking_details` (room_price, booking_id, room_number, review_id) VALUES
(900000,  'B2904250027', 'STD102', NULL),
(900000,  'B2702250025', 'STD101', NULL),
(1500000, 'B2108250019', 'DLX203', NULL),
(1500000, 'B1805250016', 'DLX201', NULL),
(3000000, 'B1201250008', 'STE302', NULL),
(900000,  'B2310250021', 'STD103', NULL),
(1500000, 'B1906250017', 'DLX202', NULL),
(3000000, 'B1805250016', 'STE301', NULL),
(900000,  'B0201250009', 'STD101', NULL),
(1500000, 'B2209250020', 'DLX201', NULL);


-- BOOKING SERVICES
INSERT INTO booking_services (quantity, service_price, total_amount, booking_id, service_id)
VALUES (2, 80000, 160000, 'B2803250026', 'SV001'),
       (1, 35000, 35000, 'B3005250028', 'SV002'),
       (3, 50000, 150000, 'B2411250022', 'SV003'),
       (1, 45000, 45000, 'B3207250030', 'SV004');

-- EARLY CHECKINS
INSERT INTO early_checkins (request_id, additional_fee, approval_status, request_date, request_time, booking_id)
VALUES ('EC001', 450000, 'APPROVED', '2024-06-10 08:00:00', '2024-06-10 08:00:00', 'B3207250030'),
       ('EC002', 900000, 'PENDING', '2024-06-15 07:30:00', '2024-06-15 07:30:00', 'B2411250022');

-- MAINTENANCE REQUESTS
INSERT INTO maintenance_requests (request_id, actual_cost, assigned_to, completion_date, description, estimated_time,
                                  prioty, request_date, status, booking_id)
VALUES ('MR001', 500000, 'EMP002', '2024-06-01 16:00:00', 'Sửa điều hòa phòng DLX201', 2, 'HIGH', '2024-06-01 14:00:00',
        'COMPLETED', 'B3207250030'),
       ('MR002', 200000, 'EMP002', NULL, 'Thay bóng đèn phòng STD103', 1, 'LOW', '2024-06-01 15:00:00', 'PENDING',
        NULL),
       ('MR003', 150000, 'EMP004', NULL, 'Sửa vòi sen phòng STE301', 1, 'MEDIUM', '2024-06-02 10:00:00', 'PENDING',
        'B3005250028');

-- REPORTS
INSERT INTO reports (report_id, generated_date, report_period, report_type, employee_id)
VALUES ('REP001', '2024-06-01 18:00:00', '2024-06', 'OCCUPANCY', 'EMP003'),
       ('REP002', '2024-06-01 18:00:00', '2024-06', 'REVENUE', 'EMP003'),
       ('REP003', '2024-06-02 09:00:00', '2024-06', 'MAINTENANCE', 'EMP002'),
       ('REP004', '2024-06-03 10:00:00', '2024-06', 'SERVICE', 'EMP005');

INSERT INTO cart_beans (cart_bean_id, customer_id)
                              VALUES ('CA5073', 'CUS0412250001');

INSERT INTO cart_items (room_number, cart_bean_id)
VALUES ('STD101', 'CA5073'),
       ('DLX201', 'CA5073');

INSERT INTO `bookings` (`booking_id`, `actual_check_in_time`, `actual_check_out_time`, `booking_date`, `cancellation_date`, `check_in_date`, `check_out_date`, `duration`, `hourly_rate`, `invoice_type`, `number_of_guests`, `package_type`, `payment_status`, `special_requests`, `status`, `total_amount`, `total_cost`, `type`, `customer_id`, `employee_id`) VALUES
-- 2022 (8 rows)
('B2202010001','2022-01-05 14:10:00.000000','2022-01-07 12:00:00.000000','2022-01-01 09:00:00.000000',NULL,'2022-01-05 14:00:00.000000','2022-01-07 12:00:00.000000',2,NULL,NULL,2,'Standard','COMPLETED','No requests','CHECKED_OUT',300000,220000,'DAILY','CUS0412250001','EMP001'),
('B2202030002','2022-02-10 15:20:00.000000','2022-02-12 11:45:00.000000','2022-02-01 10:00:00.000000',NULL,'2022-02-10 14:00:00.000000','2022-02-12 12:00:00.000000',2,NULL,NULL,1,'Suite','COMPLETED','Anniversary','CHECKED_OUT',900000,680000,'DAILY','CUS0412250002','EMP002'),
('B2203040003','2022-03-15 13:30:00.000000','2022-03-16 12:05:00.000000','2022-03-01 08:30:00.000000',NULL,'2022-03-15 14:00:00.000000','2022-03-16 12:00:00.000000',1,NULL,NULL,2,'Deluxe','COMPLETED','Extra towels','CHECKED_OUT',380000,280000,'DAILY','CUS0412250003','EMP003'),
('B2204050004','2022-04-20 14:05:00.000000','2022-04-23 12:00:00.000000','2022-04-10 11:00:00.000000',NULL,'2022-04-20 14:00:00.000000','2022-04-23 12:00:00.000000',3,NULL,NULL,3,'Deluxe','COMPLETED','High floor','CHECKED_OUT',1150000,860000,'DAILY','CUS0412250004','EMP004'),
('B2205060005','2022-05-02 14:12:00.000000','2022-05-04 12:00:00.000000','2022-05-01 09:30:00.000000',NULL,'2022-05-02 14:00:00.000000','2022-05-04 12:00:00.000000',2,NULL,NULL,1,'Standard','COMPLETED','Late arrival','CHECKED_OUT',320000,240000,'DAILY','CUS0412250001','EMP005'),
('B2206070006','2022-06-18 13:55:00.000000','2022-06-20 12:10:00.000000','2022-06-01 10:10:00.000000',NULL,'2022-06-18 14:00:00.000000','2022-06-20 12:00:00.000000',2,NULL,NULL,1,'Suite','COMPLETED','Complimentary breakfast','CHECKED_OUT',780000,560000,'DAILY','CUS0412250002','EMP001'),
('B2207080007','2022-07-25 16:10:00.000000','2022-07-26 11:50:00.000000','2022-07-05 08:20:00.000000',NULL,'2022-07-25 14:00:00.000000','2022-07-26 12:00:00.000000',1,NULL,NULL,2,'Standard','COMPLETED','Early check-in','CHECKED_OUT',140000,100000,'DAILY','CUS0412250003','EMP002'),
('B2208090008','2022-08-10 14:40:00.000000','2022-08-14 12:15:00.000000','2022-08-01 10:00:00.000000',NULL,'2022-08-10 14:00:00.000000','2022-08-14 12:00:00.000000',4,NULL,NULL,2,'Deluxe','COMPLETED','Birthday setup','CHECKED_OUT',980000,730000,'DAILY','CUS0412250004','EMP003'),

-- 2023 (8 rows)
('B2301010009','2023-01-12 14:05:00.000000','2023-01-14 12:00:00.000000','2023-01-05 09:30:00.000000',NULL,'2023-01-12 14:00:00.000000','2023-01-14 12:00:00.000000',2,NULL,NULL,2,'Standard','COMPLETED','Near elevator','CHECKED_OUT',300000,220000,'DAILY','CUS0412250001','EMP002'),
('B2302030010','2023-02-18 15:20:00.000000','2023-02-21 11:30:00.000000','2023-02-01 09:30:00.000000',NULL,'2023-02-18 14:00:00.000000','2023-02-21 12:00:00.000000',3,NULL,NULL,3,'Deluxe','COMPLETED','Late checkout','CHECKED_OUT',840000,620000,'DAILY','CUS0412250004','EMP001'),
('B2303040011','2023-03-04 13:55:00.000000','2023-03-05 12:10:00.000000','2023-03-01 11:45:00.000000',NULL,'2023-03-04 14:00:00.000000','2023-03-05 12:00:00.000000',1,NULL,NULL,1,'Suite','COMPLETED','','CHECKED_OUT',560000,390000,'DAILY','CUS0412250002','EMP003'),
('B2304050012','2023-04-22 16:10:00.000000','2023-04-23 11:50:00.000000','2023-04-10 08:20:00.000000',NULL,'2023-04-22 14:00:00.000000','2023-04-23 12:00:00.000000',1,NULL,NULL,1,'Standard','COMPLETED','Extra pillows','CHECKED_OUT',130000,95000,'DAILY','CUS0412250003','EMP004'),
('B2305060013','2023-05-30 14:40:00.000000','2023-06-03 12:15:00.000000','2023-05-01 10:00:00.000000',NULL,'2023-05-30 14:00:00.000000','2023-06-03 12:00:00.000000',4,NULL,NULL,2,'Deluxe','COMPLETED','Ocean view','CHECKED_OUT',1200000,900000,'DAILY','CUS0412250002','EMP001'),
('B2306070014','2023-06-11 15:05:00.000000','2023-06-14 11:45:00.000000','2023-05-28 12:00:00.000000',NULL,'2023-06-11 14:00:00.000000','2023-06-14 12:00:00.000000',3,NULL,NULL,2,'Standard','COMPLETED','','CHECKED_OUT',420000,310000,'DAILY','CUS0412250001','EMP002'),
('B2307080015','2023-07-18 13:30:00.000000','2023-07-19 12:00:00.000000','2023-07-10 09:45:00.000000',NULL,'2023-07-18 14:00:00.000000','2023-07-19 12:00:00.000000',1,NULL,NULL,1,'Suite','COMPLETED','Anniversary setup','CHECKED_OUT',320000,250000,'DAILY','CUS0412250004','EMP005'),
('B2308090016','2023-08-24 14:10:00.000000','2023-08-27 11:55:00.000000','2023-08-01 16:20:00.000000',NULL,'2023-08-24 14:00:00.000000','2023-08-27 12:00:00.000000',3,NULL,NULL,2,'Deluxe','COMPLETED','Christmas practice','CHECKED_OUT',980000,720000,'DAILY','CUS0412250002','EMP001'),

-- 2024 (7 rows)
('B2401010017','2024-01-05 14:12:00.000000','2024-01-07 12:00:00.000000','2024-01-02 07:45:00.000000',NULL,'2024-01-05 14:00:00.000000','2024-01-07 12:00:00.000000',2,NULL,NULL,1,'Standard','COMPLETED','Early check-in','CHECKED_OUT',280000,210000,'DAILY','CUS0412250002','EMP003'),
('B2402030018','2024-02-20 15:00:00.000000','2024-02-22 12:10:00.000000','2024-02-10 09:00:00.000000',NULL,'2024-02-20 14:00:00.000000','2024-02-22 12:00:00.000000',2,NULL,NULL,2,'Deluxe','COMPLETED','Extra towels','CHECKED_OUT',640000,480000,'DAILY','CUS0412250003','EMP004'),
('B2403040019','2024-03-18 14:30:00.000000','2024-03-19 11:50:00.000000','2024-03-05 12:30:00.000000',NULL,'2024-03-18 14:00:00.000000','2024-03-19 12:00:00.000000',1,NULL,NULL,1,'Suite','COMPLETED','Quiet floor','CHECKED_OUT',420000,300000,'DAILY','CUS0412250004','EMP005'),
('B2404050020','2024-04-25 14:22:00.000000','2024-04-28 11:45:00.000000','2024-04-10 11:00:00.000000',NULL,'2024-04-25 14:00:00.000000','2024-04-28 12:00:00.000000',3,NULL,NULL,3,'Deluxe','COMPLETED','Airport pickup','CHECKED_OUT',1020000,770000,'DAILY','CUS0412250001','EMP001'),
('B2405060021','2024-05-30 13:55:00.000000','2024-06-01 12:00:00.000000','2024-05-15 10:05:00.000000',NULL,'2024-05-30 14:00:00.000000','2024-06-01 12:00:00.000000',2,NULL,NULL,2,'Standard','COMPLETED','','CHECKED_OUT',460000,350000,'DAILY','CUS0412250002','EMP002'),
('B2406070022','2024-06-21 14:40:00.000000','2024-06-23 11:55:00.000000','2024-06-10 09:40:00.000000',NULL,'2024-06-21 14:00:00.000000','2024-06-23 12:00:00.000000',2,NULL,NULL,1,'Suite','COMPLETED','Complimentary breakfast','CHECKED_OUT',700000,520000,'DAILY','CUS0412250003','EMP003'),
('B2407080023','2024-07-28 15:15:00.000000','2024-07-31 12:00:00.000000','2024-07-01 08:20:00.000000',NULL,'2024-07-28 14:00:00.000000','2024-07-31 12:00:00.000000',3,NULL,NULL,2,'Deluxe','COMPLETED','Ocean view','CHECKED_OUT',1500000,1120000,'DAILY','CUS0412250004','EMP004'),

-- 2025 (7 rows)
('B2501010024','2025-01-15 14:10:00.000000','2025-01-17 11:50:00.000000','2025-01-05 09:00:00.000000',NULL,'2025-01-15 14:00:00.000000','2025-01-17 12:00:00.000000',2,NULL,NULL,2,'Standard','COMPLETED','Late arrival','CHECKED_OUT',520000,410000,'DAILY','CUS0412250001','EMP001'),
('B2502030025','2025-02-10 15:05:00.000000','2025-02-12 11:55:00.000000','2025-02-01 08:30:00.000000',NULL,'2025-02-10 14:00:00.000000','2025-02-12 12:00:00.000000',2,NULL,NULL,1,'Suite','COMPLETED','Anniversary','CHECKED_OUT',650000,480000,'DAILY','CUS0412250003','EMP003'),
('B2503040026','2025-03-12 13:45:00.000000','2025-03-15 12:00:00.000000','2025-03-01 11:00:00.000000',NULL,'2025-03-12 14:00:00.000000','2025-03-15 12:00:00.000000',3,NULL,NULL,2,'Standard','COMPLETED','','CHECKED_OUT',720000,540000,'DAILY','CUS0412250004','EMP004'),
('B2504050027','2025-04-05 14:00:00.000000','2025-04-07 11:40:00.000000','2025-03-28 09:15:00.000000',NULL,'2025-04-05 14:00:00.000000','2025-04-07 12:00:00.000000',2,NULL,NULL,1,'Suite','COMPLETED','Extra pillows','CHECKED_OUT',640000,480000,'DAILY','CUS0412250001','EMP005'),
('B2505060028','2025-05-10 14:20:00.000000','2025-05-12 12:05:00.000000','2025-05-01 16:45:00.000000',NULL,'2025-05-10 14:00:00.000000','2025-05-12 12:00:00.000000',2,NULL,NULL,2,'Deluxe','COMPLETED','Near elevator','CHECKED_OUT',760000,580000,'DAILY','CUS0412250002','EMP001'),
('B2506070029','2025-06-20 15:10:00.000000','2025-06-23 12:00:00.000000','2025-06-05 10:00:00.000000',NULL,'2025-06-20 14:00:00.000000','2025-06-23 12:00:00.000000',3,NULL,NULL,3,'Deluxe','COMPLETED','Birthday setup','CHECKED_OUT',1100000,850000,'DAILY','CUS0412250003','EMP002'),
('B2507080030','2025-07-08 13:50:00.000000','2025-07-10 11:30:00.000000','2025-07-01 12:10:00.000000',NULL,'2025-07-08 14:00:00.000000','2025-07-10 12:00:00.000000',2,NULL,NULL,1,'Standard','COMPLETED','Quiet room','CHECKED_OUT',260000,200000,'DAILY','CUS0412250004','EMP003');


INSERT INTO `bookings` (`booking_id`, `actual_check_in_time`, `actual_check_out_time`, `booking_date`, `cancellation_date`, `check_in_date`, `check_out_date`, `duration`, `hourly_rate`, `invoice_type`, `number_of_guests`, `package_type`, `payment_status`, `special_requests`, `status`, `total_amount`, `total_cost`, `type`, `customer_id`, `employee_id`) VALUES
('B2501011011','2025-01-10 14:05:00.000000','2025-01-12 12:00:00.000000','2025-12-01 09:10:00.000000',NULL,'2025-01-10 14:00:00.000000','2025-01-12 12:00:00.000000',2,NULL,NULL,2,'Standard','COMPLETED','Near pool','CHECKED_OUT',420000,300000,'DAILY','CUS0412250001',NULL),
('B2502021012','2025-02-21 15:00:00.000000','2025-02-23 11:50:00.000000','2025-12-02 10:00:00.000000',NULL,'2025-02-21 14:00:00.000000','2025-02-23 12:00:00.000000',2,NULL,NULL,1,'Suite','COMPLETED','Anniversary setup','CHECKED_OUT',980000,720000,'DAILY','CUS0412250002',NULL),
('B2503031013','2025-03-15 13:40:00.000000','2025-03-17 12:05:00.000000','2025-12-03 08:30:00.000000',NULL,'2025-03-15 14:00:00.000000','2025-03-17 12:00:00.000000',2,NULL,NULL,2,'Deluxe','COMPLETED','Extra towels','CHECKED_OUT',760000,560000,'DAILY','CUS0412250003',NULL),
('B2504041014','2025-04-05 14:10:00.000000','2025-04-08 12:00:00.000000','2025-12-01 11:00:00.000000',NULL,'2025-04-05 14:00:00.000000','2025-04-08 12:00:00.000000',3,NULL,NULL,3,'Deluxe','COMPLETED','High floor','CHECKED_OUT',1350000,980000,'DAILY','CUS0412250004',NULL),
('B2505051015','2025-05-09 14:12:00.000000','2025-05-11 12:00:00.000000','2025-12-05 09:30:00.000000',NULL,'2025-05-09 14:00:00.000000','2025-05-11 12:00:00.000000',2,NULL,NULL,1,'Standard','COMPLETED','Late arrival','CHECKED_OUT',320000,240000,'DAILY','CUS0412250001',NULL),
('B2506061016','2025-06-18 13:55:00.000000','2025-06-21 12:10:00.000000','2025-12-06 10:10:00.000000',NULL,'2025-06-18 14:00:00.000000','2025-06-21 12:00:00.000000',3,NULL,NULL,1,'Suite','COMPLETED','Complimentary breakfast','CHECKED_OUT',1200000,880000,'DAILY','CUS0412250002',NULL),
('B2507071017','2025-07-24 16:10:00.000000','2025-07-26 11:50:00.000000','2025-12-07 08:20:00.000000',NULL,'2025-07-24 14:00:00.000000','2025-07-26 12:00:00.000000',2,NULL,NULL,2,'Standard','COMPLETED','Early check-in','CHECKED_OUT',480000,350000,'DAILY','CUS0412250003',NULL),
('B2508081018','2025-08-11 14:40:00.000000','2025-08-15 12:15:00.000000','2025-12-08 10:00:00.000000',NULL,'2025-08-11 14:00:00.000000','2025-08-15 12:00:00.000000',4,NULL,NULL,2,'Deluxe','COMPLETED','Birthday setup','CHECKED_OUT',1250000,900000,'DAILY','CUS0412250004',NULL),
('B2509091019','2025-09-02 15:20:00.000000','2025-09-04 11:30:00.000000','2025-12-01 09:30:00.000000',NULL,'2025-09-02 14:00:00.000000','2025-09-04 12:00:00.000000',2,NULL,NULL,2,'Deluxe','COMPLETED','Ocean view','CHECKED_OUT',840000,620000,'DAILY','CUS0412250002',NULL),
('B2510101020','2025-10-12 13:55:00.000000','2025-10-14 12:10:00.000000','2025-12-01 11:45:00.000000',NULL,'2025-10-12 14:00:00.000000','2025-10-14 12:00:00.000000',2,NULL,NULL,1,'Suite','COMPLETED','','CHECKED_OUT',960000,680000,'DAILY','CUS0412250003',NULL),
('B2511111021','2025-11-18 16:10:00.000000','2025-11-19 11:50:00.000000','2025-12-05 08:20:00.000000',NULL,'2025-11-18 14:00:00.000000','2025-11-19 12:00:00.000000',1,NULL,NULL,1,'Standard','COMPLETED','Anniversary setup','CHECKED_OUT',320000,250000,'DAILY','CUS0412250004',NULL),
('B2512121022','2025-12-22 14:40:00.000000','2025-12-25 12:15:00.000000','2025-12-01 10:00:00.000000',NULL,'2025-12-22 14:00:00.000000','2025-12-25 12:00:00.000000',3,NULL,NULL,2,'Deluxe','COMPLETED','Christmas decoration','CHECKED_OUT',1450000,1050000,'DAILY','CUS0412250002',NULL),
('B2501181023','2025-01-18 14:05:00.000000','2025-01-19 12:00:00.000000','2025-12-05 10:12:00.000000',NULL,'2025-01-18 14:00:00.000000','2025-01-19 12:00:00.000000',1,NULL,NULL,2,'Standard','COMPLETED','Near elevator','CHECKED_OUT',240000,180000,'DAILY','CUS0412250001',NULL),
('B2502241024','2025-02-24 15:00:00.000000','2025-02-26 11:50:00.000000','2025-12-02 09:00:00.000000',NULL,'2025-02-24 14:00:00.000000','2025-02-26 12:00:00.000000',2,NULL,NULL,3,'Deluxe','COMPLETED','High floor requested','CHECKED_OUT',560000,400000,'DAILY','CUS0412250004',NULL),
('B2503301025','2025-03-30 13:40:00.000000','2025-04-02 12:05:00.000000','2025-12-03 08:30:00.000000',NULL,'2025-03-30 14:00:00.000000','2025-04-02 12:00:00.000000',3,NULL,NULL,2,'Standard','COMPLETED','Quiet room','CHECKED_OUT',900000,650000,'DAILY','CUS0412250003',NULL),
('B2504161026','2025-04-16 14:10:00.000000','2025-04-17 12:00:00.000000','2025-12-04 11:00:00.000000',NULL,'2025-04-16 14:00:00.000000','2025-04-17 12:00:00.000000',1,NULL,NULL,1,'Suite','COMPLETED','Extra pillows','CHECKED_OUT',480000,350000,'DAILY','CUS0412250001',NULL),
('B2505281027','2025-05-28 14:12:00.000000','2025-05-30 12:00:00.000000','2025-12-05 09:30:00.000000',NULL,'2025-05-28 14:00:00.000000','2025-05-30 12:00:00.000000',2,NULL,NULL,2,'Deluxe','COMPLETED','Near elevator','CHECKED_OUT',680000,500000,'DAILY','CUS0412250002',NULL),
('B2506161028','2025-06-16 13:55:00.000000','2025-06-19 12:10:00.000000','2025-12-06 10:10:00.000000',NULL,'2025-06-16 14:00:00.000000','2025-06-19 12:00:00.000000',3,NULL,NULL,2,'Standard','COMPLETED','Late arrival','CHECKED_OUT',1150000,820000,'DAILY','CUS0412250004',NULL),
('B2507231029','2025-07-23 16:10:00.000000','2025-07-25 11:50:00.000000','2025-12-07 08:20:00.000000',NULL,'2025-07-23 14:00:00.000000','2025-07-25 12:00:00.000000',2,NULL,NULL,1,'Suite','COMPLETED','Anniversary setup','CHECKED_OUT',760000,560000,'DAILY','CUS0412250003',NULL),
('B2508311030','2025-08-31 14:40:00.000000','2025-09-03 12:15:00.000000','2025-12-01 10:00:00.000000',NULL,'2025-08-31 14:00:00.000000','2025-09-03 12:00:00.000000',3,NULL,NULL,2,'Deluxe','COMPLETED','Birthday setup','CHECKED_OUT',1280000,960000,'DAILY','CUS0412250002',NULL);

INSERT INTO room_change_requests (request_id, booking_id, current_room_id, new_room_id, reason, request_date, status, response_note, response_date, processed_by)
VALUES
('RC001', 'B2411250022', 'DLX201', 'DLX203', 'Phòng hiện tại ồn ào, muốn chuyển sang phòng yên tĩnh hơn', '2024-06-16 10:30:00', 'COMPLETED', 'Đã chuyển phòng thành công', '2024-06-16 11:00:00', 'EMP001'),
('RC002', 'B3207250030', 'STD101', 'STD102', 'Muốn chuyển sang phòng có view đẹp hơn', '2024-06-11 09:00:00', 'FAILED', 'Phòng yêu cầu đang được sử dụng', '2024-06-11 09:30:00', 'EMP001'),
('RC003', 'B3005250028', 'STE301', 'STE302', 'Điều hòa không hoạt động tốt', '2024-06-20 15:00:00', 'PENDING', NULL, NULL, NULL);


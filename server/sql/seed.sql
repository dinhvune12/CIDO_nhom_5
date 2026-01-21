-- Seed data for restaurants (Week 4)
-- Run: mysql -u root -p foodfinder < server/sql/seed.sql

INSERT INTO restaurants (name, type, area, price_range, address, image_url)
VALUES
('Bún bò Huế O Xuân', 'Vietnamese', 'Hải Châu', '30k-60k', '12 Trần Phú, Đà Nẵng', NULL),
('Mì Quảng Bà Mua', 'Vietnamese', 'Sơn Trà', '35k-70k', '19-21 Trần Bình Trọng, Đà Nẵng', NULL),
('Bánh xèo Bà Dưỡng', 'Vietnamese', 'Liên Chiểu', '25k-60k', 'K280/23 Hoàng Diệu, Đà Nẵng', NULL),
('Hải sản Bé Mặn', 'Seafood', 'Ngũ Hành Sơn', '100k-300k', 'Lô 9 Võ Nguyên Giáp, Đà Nẵng', NULL),
('Pizza 4P\'s', 'Italian', 'Hải Châu', '150k-400k', '8 Hoàng Văn Thụ, Đà Nẵng', NULL),
('Gogi House', 'Korean', 'Hải Châu', '120k-350k', 'Vincom Đà Nẵng, Ngô Quyền', NULL),
('The Coffee House', 'Cafe', 'Hải Châu', '35k-85k', '87 Nguyễn Văn Linh, Đà Nẵng', NULL),
('Highlands Coffee', 'Cafe', 'Sơn Trà', '30k-75k', '42 Ngô Quyền, Đà Nẵng', NULL),
('Bánh mì Bà Lan', 'Vietnamese', 'Thanh Khê', '15k-35k', '120 Điện Biên Phủ, Đà Nẵng', NULL),
('Cơm gà A Hải', 'Vietnamese', 'Hải Châu', '35k-80k', '100 Thái Phiên, Đà Nẵng', NULL),
('Sushi World', 'Japanese', 'Sơn Trà', '150k-500k', '15 Phạm Văn Đồng, Đà Nẵng', NULL),
('Lẩu nướng Hàn Quốc 88', 'Korean', 'Cẩm Lệ', '120k-300k', '88 Cách Mạng Tháng 8, Đà Nẵng', NULL);

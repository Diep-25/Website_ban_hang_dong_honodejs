/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 100425
 Source Host           : localhost:3306
 Source Schema         : node_website_ban_hang_dev

 Target Server Type    : MySQL
 Target Server Version : 100425
 File Encoding         : 65001

 Date: 21/12/2023 23:44:28
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for addresses
-- ----------------------------
DROP TABLE IF EXISTS `addresses`;
CREATE TABLE `addresses`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `city` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `zip_code` int NOT NULL,
  `id_user` int NULL DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `id_user`(`id_user` ASC) USING BTREE,
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of addresses
-- ----------------------------
INSERT INTO `addresses` VALUES (1, 'Ngô Văn Điệp', '80 đỗ quỳ - Hòa Xuân - Cẩm lệ', '0965840200', 'Đà nẵng', 50000, 1, '2023-10-29 15:15:25', '2023-10-29 15:15:25');
INSERT INTO `addresses` VALUES (6, 'Ngô Văn Điệp ', '80 đỗ quỳ', '0965840200', 'Đà nẵng', 50000, 20, '2023-12-05 17:28:33', '2023-12-05 17:28:33');

-- ----------------------------
-- Table structure for detail_orders
-- ----------------------------
DROP TABLE IF EXISTS `detail_orders`;
CREATE TABLE `detail_orders`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_order` int NULL DEFAULT NULL,
  `quantity` int NOT NULL,
  `id_product` int NOT NULL,
  `createdAt` datetime NULL DEFAULT NULL,
  `updatedAt` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `id_product`(`id_product` ASC) USING BTREE,
  INDEX `id_order`(`id_order` ASC) USING BTREE,
  CONSTRAINT `detail_orders_ibfk_1` FOREIGN KEY (`id_product`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `detail_orders_ibfk_2` FOREIGN KEY (`id_order`) REFERENCES `oders` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 23 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of detail_orders
-- ----------------------------
INSERT INTO `detail_orders` VALUES (21, 22, 1, 18, '2023-12-14 15:46:24', '2023-12-14 15:46:24');
INSERT INTO `detail_orders` VALUES (22, 22, 1, 19, '2023-12-14 15:46:24', '2023-12-14 15:46:24');

-- ----------------------------
-- Table structure for discounts
-- ----------------------------
DROP TABLE IF EXISTS `discounts`;
CREATE TABLE `discounts`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `discount` int NOT NULL,
  `status` int NOT NULL,
  `id_user` int NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `updatedAt` datetime NULL DEFAULT NULL,
  `createdAt` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `id_user`(`id_user` ASC) USING BTREE,
  CONSTRAINT `discounts_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of discounts
-- ----------------------------
INSERT INTO `discounts` VALUES (5, 'xpaGvAHr', 30, 0, 1, '2023-12-04', '2023-12-22', '2023-12-14 15:46:30', '2023-12-04 13:35:06');
INSERT INTO `discounts` VALUES (6, 'xpaGvAHb', 30, 1, 1, '2023-12-04', '2023-12-27', '2023-12-04 13:35:06', '2023-12-04 13:35:06');

-- ----------------------------
-- Table structure for oders
-- ----------------------------
DROP TABLE IF EXISTS `oders`;
CREATE TABLE `oders`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` int NULL DEFAULT NULL,
  `payment` int NOT NULL,
  `id_user` int NULL DEFAULT NULL,
  `id_address` int NULL DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `id_user`(`id_user` ASC) USING BTREE,
  INDEX `id_address`(`id_address` ASC) USING BTREE,
  CONSTRAINT `oders_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `oders_ibfk_3` FOREIGN KEY (`id_address`) REFERENCES `addresses` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 23 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of oders
-- ----------------------------
INSERT INTO `oders` VALUES (22, 474527, 1, 1, 1, 'Đã phê duyệt', '2023-12-14 15:46:24', '2023-12-21 15:02:27');

-- ----------------------------
-- Table structure for product_images
-- ----------------------------
DROP TABLE IF EXISTS `product_images`;
CREATE TABLE `product_images`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `id_product` int NULL DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `id_product`(`id_product` ASC) USING BTREE,
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`id_product`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of product_images
-- ----------------------------
INSERT INTO `product_images` VALUES (6, 'web/images/products/Dong-ho-Nam-Thomas-Earnshaw-ES-8807-04-2-1.jpg', 'Đồng hồ Nam Thomas Earnshaw ES-8807-04', 18, '2023-12-08 16:55:57', '2023-12-08 16:55:57');
INSERT INTO `product_images` VALUES (7, 'web/images/products/Dong-ho-Nam-Thomas-Earnshaw-ES-8807-04-3-1.jpg', 'Đồng hồ Nam Thomas Earnshaw ES-8807-04', 18, '2023-12-08 16:55:57', '2023-12-08 16:55:57');
INSERT INTO `product_images` VALUES (8, 'web/images/products/Dong-ho-Nam-Thomas-Earnshaw-ES-8807-04-4-1.jpg', 'Đồng hồ Nam Thomas Earnshaw ES-8807-04', 18, '2023-12-08 16:55:57', '2023-12-08 16:55:57');
INSERT INTO `product_images` VALUES (9, 'web/images/products/Dong-ho-Nam-Thomas-Earnshaw-ES-8807-04-5-1.jpg', 'Đồng hồ Nam Thomas Earnshaw ES-8807-04', 18, '2023-12-08 16:55:57', '2023-12-08 16:55:57');
INSERT INTO `product_images` VALUES (10, 'web/images/products/Dong-ho-Nam-Tsar-Bomba-TB8206A-BOLIVE-1.jpg', 'Đồng hồ Nam Tsar Bomba TB8206A-BOLIVE', 19, '2023-12-08 17:15:24', '2023-12-08 17:15:24');
INSERT INTO `product_images` VALUES (11, 'web/images/products/Dong-ho-Nam-Tsar-Bomba-TB8206A-BOLIVE-2.jpg', 'Đồng hồ Nam Tsar Bomba TB8206A-BOLIVE', 19, '2023-12-08 17:15:24', '2023-12-08 17:15:24');
INSERT INTO `product_images` VALUES (12, 'web/images/products/Dong-ho-Nam-Tsar-Bomba-TB8206A-BOLIVE-3.jpg', 'Đồng hồ Nam Tsar Bomba TB8206A-BOLIVE', 19, '2023-12-08 17:15:24', '2023-12-08 17:15:24');

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `price` int NULL DEFAULT NULL,
  `detail` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `quantity` int NULL DEFAULT NULL,
  `status` int NULL DEFAULT NULL,
  `id_user` int NULL DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `id_user`(`id_user` ASC) USING BTREE,
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of products
-- ----------------------------
INSERT INTO `products` VALUES (18, 'Đồng hồ Nam Thomas Earnshaw ES-8807-04', NULL, 710000, 'Hãng Thomas Earnshaw được thành lập vào năm năm 1972 tại số 119 High Hoblborn bởi một công dân nước Anh tên là Mr. Thomas Earnshaw. Thương hiệu này đã đi qua 200 năm với nhiều giai đoạn suy thịnh nhưng vẫn duy trì tiêu chuẩn cao về chất lượng và thiết kế của các mẫu đồng hồ. Các đồng hồ Thomas Earnshaw vừa mang trong mình tinh thần của thời đại cổ điển và kỹ thuật đồng hồ truyền thống vừa đáp ứng được sự đa dạng và thị hiếu của người tiêu dùng hiện đại. Trong đó có mẫu Đồng hồ Nam Thomas Earnshaw ES-8807-04 là một trong những mẫu đồng hồ nam sang trọng và đẳng cấp của thương hiệu,  được thiết kế sang trọng và thanh lịch mà những người yêu thích đồng hồ không thể bỏ qua.', 12, 1, 1, '2023-12-08 16:55:57', '2023-12-08 16:55:57');
INSERT INTO `products` VALUES (19, 'Đồng hồ Nam Tsar Bomba TB8206A-BOLIVE', NULL, 10584000, 'Nét đặc biệt của Đồng hồ Tsar Bomba nằm ở thiết kế độc đáo của nó. Mặt số và vỏ được chế tác cẩn thận, tái hiện hình ảnh và ý nghĩa của bom Tsar Bomba một cách tinh tế. Sự kết hợp giữa nghệ thuật và kỹ thuật không chỉ tạo nên một tác phẩm nghệ thuật đẹp mắt mà còn là một biểu tượng của sự tinh tế trong công nghệ đồng hồ.\r\n\r\nĐồng hồ Tsar Bomba không chỉ là một chiếc đồng hồ đẹp mắt, mà còn là một công cụ đo thời gian đáng tin cậy với bộ máy Nhật độ chính xác cao. Được trang bị các tính năng hiện đại như khả năng chống nước, kính Sapphire chống xước, và dây đeo Silicon siêu bền, nó là một biểu tượng của sự hoàn thiện trong cả thiết kế và chất lượng.', 23, 2, 1, '2023-12-08 17:15:24', '2023-12-08 17:15:24');

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of roles
-- ----------------------------
INSERT INTO `roles` VALUES (1, 'Admin', '2023-10-27 16:38:14', '2023-10-27 16:38:14');
INSERT INTO `roles` VALUES (2, 'User', '2023-10-27 16:38:14', '2023-10-27 16:38:14');

-- ----------------------------
-- Table structure for sliders
-- ----------------------------
DROP TABLE IF EXISTS `sliders`;
CREATE TABLE `sliders`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `attribute` int NULL DEFAULT NULL,
  `status` int NULL DEFAULT NULL,
  `id_user` int NULL DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `id_user`(`id_user` ASC) USING BTREE,
  CONSTRAINT `sliders_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sliders
-- ----------------------------
INSERT INTO `sliders` VALUES (1, 'Slider 1', 'New', 'web/images/slider/banner-1.jpg', '/', 1, 1, 1, '2023-10-31 12:36:09', '2023-10-31 12:36:09');
INSERT INTO `sliders` VALUES (2, 'Slider 2', 'New', 'web/images/slider/banner-2.jpg', '/', 2, 1, 1, '2023-10-31 12:36:31', '2023-10-31 12:36:31');
INSERT INTO `sliders` VALUES (3, 'Slider 3', 'New', 'web/images/slider/banner-3.jpg', '/', 3, 1, 1, '2023-10-31 12:36:46', '2023-10-31 12:36:46');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `lastname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `status` int NULL DEFAULT 1,
  `id_role` int NULL DEFAULT 0,
  `code` int NULL DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `id_role`(`id_role` ASC) USING BTREE,
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 26 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'Diep', 'NV', 'ngoquangdiep2001@gmail.com', '$2b$10$5wH8flE3zY4SuRPiZU.mIOTedALNCIt9djRqd7XEcNXgW5BFvZJ9a', NULL, 1, 1, NULL, '2023-10-27 16:38:36', '2023-10-27 16:38:36');
INSERT INTO `users` VALUES (2, 'ABC', 'd', 'user@gmail.com', '$2b$10$X27GgiAFhdNxC0SPQ12J6ekQcscUIFJONQWeS13ZdqhftSefANEFW', NULL, 0, 2, NULL, '2023-10-27 15:15:51', '2023-10-27 15:15:51');
INSERT INTO `users` VALUES (3, 'ewewewe', 'wewe', 'user1@gmail.com', '$2b$10$M1NXFKYdPh2kwAZquL/p2u8L2NYO3LRut6gPqbutyuzicYenrdOie', NULL, 1, 2, NULL, '2023-10-27 15:16:51', '2023-10-27 15:16:51');
INSERT INTO `users` VALUES (4, 'user 111', 'user 111', 'user2@gmail.com', '$2b$10$TsG2QpQRDRmjpGb24HMj8.O9qLoUtSDOshtvpPauUcwJy56xQCImS', NULL, 1, 2, NULL, '2023-10-27 15:18:07', '2023-12-21 16:09:03');
INSERT INTO `users` VALUES (20, 'Diep', 'ngo', 'diep_1951220125@dau.edu.vn', '$2b$10$sUro5Hj7Qzirb258Ik8BWO7Cl6cqrW/bqEHj8IoM6pHU802VgaKX2', NULL, 1, 2, NULL, '2023-12-05 17:25:02', '2023-12-05 17:25:24');

SET FOREIGN_KEY_CHECKS = 1;

-- YeahYak initial database schema
-- Applied to MYSQL_DATABASE by the MySQL Docker entrypoint on first startup.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `employee_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department` enum('MANAGEMENT','PHARMACY','LOGISTICS','FINANCE','IT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_admins_user_id` (`user_id`),
  UNIQUE KEY `uk_admins_employee_id` (`employee_id`),
  CONSTRAINT `fk_admins_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `attachments`
--

CREATE TABLE `attachments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `notice_id` bigint NOT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_size` bigint NOT NULL,
  `file_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_attachments_notice_id` (`notice_id`),
  CONSTRAINT `fk_attachments_notice_id` FOREIGN KEY (`notice_id`) REFERENCES `notices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `hq_stock_tx`
--

CREATE TABLE `hq_stock_tx` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `hq_stock_id` bigint NOT NULL,
  `event` enum('ORDER_OUT','CANCEL_IN','RETURN_ORDER_IN','ADJUST') COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `stock_before` int NOT NULL,
  `stock_after` int NOT NULL,
  `created_at` datetime NOT NULL,
  `order_item_id` bigint DEFAULT NULL,
  `return_order_item_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_hq_stock_tx_hq_stock_id` (`hq_stock_id`),
  KEY `idx_hq_stock_tx_order_item_id` (`order_item_id`),
  KEY `idx_hq_stock_tx_return_order_item_id` (`return_order_item_id`),
  CONSTRAINT `fk_hq_stock_tx_hq_stock_id` FOREIGN KEY (`hq_stock_id`) REFERENCES `hq_stocks` (`id`),
  CONSTRAINT `fk_hq_stock_tx_order_item_id` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`),
  CONSTRAINT `fk_hq_stock_tx_return_order_item_id` FOREIGN KEY (`return_order_item_id`) REFERENCES `return_order_items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `hq_stocks`
--

CREATE TABLE `hq_stocks` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint NOT NULL,
  `stock` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_hq_stocks_product_id` (`product_id`),
  CONSTRAINT `fk_hq_stocks_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `invitations`
--

CREATE TABLE `invitations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('ADMIN','PHARMACY') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PENDING','USED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `expires_at` datetime NOT NULL,
  `admin_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_invitations_token` (`token`),
  KEY `idx_invitations_admin_id` (`admin_id`),
  CONSTRAINT `fk_invitations_admin_id` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `notices`
--

CREATE TABLE `notices` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category` enum('GENERAL','PRODUCT','REGULATION','EPIDEMIC') COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `admin_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_notices_category` (`category`),
  KEY `idx_notices_admin_id` (`admin_id`),
  CONSTRAINT `fk_notices_admin_id` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `type` enum('ORDER','RETURN_ORDER','WALLET') COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_notifications_user_id` (`user_id`),
  KEY `idx_notifications_is_read` (`is_read`),
  CONSTRAINT `fk_notifications_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `price` int NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_order_items_order_id` (`order_id`),
  KEY `idx_order_items_product_id` (`product_id`),
  CONSTRAINT `fk_order_items_order_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `fk_order_items_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `status` enum('PENDING','PROCESSING','COMPLETED','CANCELED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `canceled_by` enum('HQ','PHARMACY') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `pharmacy_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_orders_pharmacy_id` (`pharmacy_id`),
  KEY `idx_orders_status` (`status`),
  CONSTRAINT `fk_orders_pharmacy_id` FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `pharmacies`
--

CREATE TABLE `pharmacies` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `brn` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `representative` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `postcode` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_details` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `region` enum('SEOUL','GYEONGGI','INCHEON','GANGWON','CHUNGBUK','SEJONG','CHUNGNAM','DAEJEON','GYEONGBUK','DAEGU','ULSAN','BUSAN','GYEONGNAM','JEONBUK','JEONNAM','GWANGJU','JEJU') COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_pharmacies_user_id` (`user_id`),
  UNIQUE KEY `uk_pharmacies_brn` (`brn`),
  CONSTRAINT `fk_pharmacies_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `pharmacy_stock_tx`
--

CREATE TABLE `pharmacy_stock_tx` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `pharmacy_stock_id` bigint NOT NULL,
  `event` enum('ORDER_IN','RETURN_ORDER_OUT','SALE_OUT','ADJUST') COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `stock_before` int NOT NULL,
  `stock_after` int NOT NULL,
  `sale_date` date DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `order_item_id` bigint DEFAULT NULL,
  `return_order_item_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_pharmacy_stock_tx_pharmacy_stock_id` (`pharmacy_stock_id`),
  KEY `idx_pharmacy_stock_tx_order_item_id` (`order_item_id`),
  KEY `idx_pharmacy_stock_tx_return_order_item_id` (`return_order_item_id`),
  CONSTRAINT `fk_pharmacy_stock_tx_pharmacy_stock_id` FOREIGN KEY (`pharmacy_stock_id`) REFERENCES `pharmacy_stocks` (`id`),
  CONSTRAINT `fk_pharmacy_stock_tx_order_item_id` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`),
  CONSTRAINT `fk_pharmacy_stock_tx_return_order_item_id` FOREIGN KEY (`return_order_item_id`) REFERENCES `return_order_items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `pharmacy_stocks`
--

CREATE TABLE `pharmacy_stocks` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `pharmacy_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `stock` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_pharmacy_stocks_pharmacy_id_product_id` (`pharmacy_id`,`product_id`),
  KEY `idx_pharmacy_stocks_product_id` (`product_id`),
  CONSTRAINT `fk_pharmacy_stocks_pharmacy_id` FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacies` (`id`),
  CONSTRAINT `fk_pharmacy_stocks_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kd_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `main_category` enum('ETC','OTC','MEDICAL_GOODS') COLLATE utf8mb4_unicode_ci NOT NULL,
  `sub_category` enum('ETC_A','ETC_B','ETC_C','ETC_D','ETC_G','ETC_H','ETC_J','ETC_L','ETC_M','ETC_N','ETC_P','ETC_R','ETC_S','ETC_V','OTC_A','OTC_B','OTC_C','OTC_D','OTC_G','OTC_H','OTC_J','OTC_L','OTC_M','OTC_N','OTC_P','OTC_R','OTC_S','OTC_V','QUASI_DRUG','MEDICAL_DEVICE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `manufacturer` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` int NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image_url` text COLLATE utf8mb4_unicode_ci,
  `image_key` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_products_kd_code` (`kd_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `return_order_items`
--

CREATE TABLE `return_order_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `return_order_id` bigint NOT NULL,
  `order_item_id` bigint NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_return_order_items_return_order_id` (`return_order_id`),
  KEY `idx_return_order_items_order_item_id` (`order_item_id`),
  CONSTRAINT `fk_return_order_items_return_order_id` FOREIGN KEY (`return_order_id`) REFERENCES `return_orders` (`id`),
  CONSTRAINT `fk_return_order_items_order_item_id` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `return_orders`
--

CREATE TABLE `return_orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint NOT NULL,
  `return_reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('PENDING','APPROVED','REJECTED','PROCESSING','COMPLETED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `reject_reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `pharmacy_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_return_orders_pharmacy_id` (`pharmacy_id`),
  KEY `idx_return_orders_status` (`status`),
  KEY `idx_return_orders_order_id` (`order_id`),
  CONSTRAINT `fk_return_orders_pharmacy_id` FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacies` (`id`),
  CONSTRAINT `fk_return_orders_order_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('ADMIN','PHARMACY') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `invitation_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_email` (`email`),
  UNIQUE KEY `uk_users_invitation_id` (`invitation_id`),
  CONSTRAINT `fk_users_invitation_id` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `wallet_tx`
--

CREATE TABLE `wallet_tx` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `wallet_id` bigint NOT NULL,
  `event` enum('DEDUCT','REFUND','CANCEL','SETTLE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` int NOT NULL,
  `balance_before` int NOT NULL,
  `balance_after` int NOT NULL,
  `created_at` datetime NOT NULL,
  `order_id` bigint DEFAULT NULL,
  `return_order_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_wallet_tx_wallet_id` (`wallet_id`),
  KEY `idx_wallet_tx_order_id` (`order_id`),
  KEY `idx_wallet_tx_return_order_id` (`return_order_id`),
  CONSTRAINT `fk_wallet_tx_wallet_id` FOREIGN KEY (`wallet_id`) REFERENCES `wallets` (`id`),
  CONSTRAINT `fk_wallet_tx_order_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `fk_wallet_tx_return_order_id` FOREIGN KEY (`return_order_id`) REFERENCES `return_orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `wallets`
--

CREATE TABLE `wallets` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `pharmacy_id` bigint NOT NULL,
  `balance` int NOT NULL DEFAULT '0',
  `quota` int NOT NULL DEFAULT '0',
  `last_settled_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_wallets_pharmacy_id` (`pharmacy_id`),
  CONSTRAINT `fk_wallets_pharmacy_id` FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

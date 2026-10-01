CREATE TABLE IF NOT EXISTS `PurchaseOrders` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firm_id` INT NOT NULL,
  
  `po_number` VARCHAR(100) NOT NULL,
  `po_date` DATE NOT NULL,
  `vendor_id` INT NOT NULL,
  
  `status` ENUM('Pending', 'Approved', 'Partially Fulfilled', 'Fulfilled', 'Cancelled') DEFAULT 'Pending',
  `approval_status` ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  `approved_by_user_id` INT NULL,
  
  `total_quantity` INT DEFAULT 0,
  `fulfilled_quantity` INT DEFAULT 0,
  `total_amount` DECIMAL(15,2) DEFAULT 0,
  
  `delivery_date` DATE NULL,
  `shipping_address` TEXT NULL,
  `remark` TEXT NULL,
  
  `created_by_user_id` INT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_firm_po_number` (`firm_id`, `po_number`),
  KEY `idx_firm_vendor` (`firm_id`, `vendor_id`),
  CONSTRAINT `fk_po_firm` FOREIGN KEY (`firm_id`) REFERENCES `Firms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `PurchaseOrderItems` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firm_id` INT NOT NULL,
  `purchase_order_id` INT NOT NULL,
  
  `item_id` INT NULL, 
  `item_name` VARCHAR(300) NOT NULL,
  
  `order_quantity` INT NOT NULL,
  `fulfilled_quantity` INT DEFAULT 0,
  
  `rate` DECIMAL(15,2) NOT NULL,
  `tax_percent` DECIMAL(5,2) DEFAULT 0,
  `total_amount` DECIMAL(15,2) NOT NULL,
  
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_poi_po` FOREIGN KEY (`purchase_order_id`) REFERENCES `PurchaseOrders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

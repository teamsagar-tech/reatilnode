-- Updated Returns Schema based on full legacy verification
CREATE TABLE IF NOT EXISTS `SalesReturns` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firm_id` INT NOT NULL,
  
  `return_no` VARCHAR(100) NOT NULL,
  `date` DATE NOT NULL DEFAULT (CURRENT_DATE),
  
  `sales_bill_id` INT NULL,
  `original_bill_no` VARCHAR(100) NULL,
  `customer_id` INT NULL,
  `location_id` INT NULL,
  `created_by_user_id` INT NULL,
  
  `total_refund_amount` DECIMAL(15,2) DEFAULT 0,
  
  -- Reversals Tracking
  `total_coupon_discount_reversed` DECIMAL(15,2) DEFAULT 0,
  `total_commission_reversed` DECIMAL(15,2) DEFAULT 0,
  `loyalty_points_debited` DECIMAL(15,2) DEFAULT 0,
  
  `payment_type` ENUM('cash', 'credit') DEFAULT 'cash',
  `remark` TEXT NULL,
  
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_firm_return_no` (`firm_id`, `return_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `SalesReturnItems` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firm_id` INT NOT NULL,
  `sales_return_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  
  `barcode` VARCHAR(255) NOT NULL,
  `refund_amount` DECIMAL(15,2) DEFAULT 0,
  `returned_commission` DECIMAL(15,2) DEFAULT 0,
  `coupon_discount_applied` DECIMAL(15,2) DEFAULT 0,
  
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_sri_return` FOREIGN KEY (`sales_return_id`) REFERENCES `SalesReturns` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `PurchaseReturns` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firm_id` INT NOT NULL,
  
  `debit_note_no` VARCHAR(100) NOT NULL,
  `date` DATE NOT NULL DEFAULT (CURRENT_DATE),
  
  `purchase_invoice_id` INT NULL,
  `grn` VARCHAR(100) NULL,
  `party_id` INT NULL,
  `created_by_user_id` INT NULL,
  
  `total_debit_amount` DECIMAL(15,2) DEFAULT 0,
  `return_type` ENUM('defective', 'short', 'manual') DEFAULT 'manual',
  `remark` TEXT NULL,
  
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_firm_debit_no` (`firm_id`, `debit_note_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `PurchaseReturnItems` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firm_id` INT NOT NULL,
  `purchase_return_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  
  `barcode` VARCHAR(255) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  
  `purchase_rate` DECIMAL(15,2) DEFAULT 0,
  `net_rate` DECIMAL(15,2) DEFAULT 0,
  `gst_percent` DECIMAL(5,2) DEFAULT 0,
  `debit_amount` DECIMAL(15,2) DEFAULT 0,
  
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_pri_return` FOREIGN KEY (`purchase_return_id`) REFERENCES `PurchaseReturns` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

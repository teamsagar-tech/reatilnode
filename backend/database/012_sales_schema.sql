CREATE TABLE IF NOT EXISTS `SalesBills` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firm_id` INT NOT NULL,
  
  `bill_no` VARCHAR(100) NOT NULL,
  `date` DATE NULL,
  
  `customer_id` INT NULL,
  `salesman_id` INT NULL,
  `location_id` INT NULL,
  `created_by_user_id` INT NULL,
  
  `total_quantity` INT NULL,
  `mrp_total` DECIMAL(15,2) NULL,
  `discount_on_sales` DECIMAL(15,2) NULL,
  `bill_amount` DECIMAL(15,2) NULL,
  `additional_charges` DECIMAL(15,2) NULL,
  `final_amount` DECIMAL(15,2) NULL,
  
  `cash_amount` DECIMAL(15,2) DEFAULT 0,
  `upi_amount` DECIMAL(15,2) DEFAULT 0,
  `card_amount` DECIMAL(15,2) DEFAULT 0,
  
  `is_credit_sale` BOOLEAN DEFAULT FALSE,
  `credit_amount` DECIMAL(15,2) DEFAULT 0,
  `credit_approval_id` INT NULL,
  
  `coupon_id` INT NULL,
  `loyalty_redeem_value` DECIMAL(15,2) DEFAULT 0,
  
  `remark` TEXT NULL,
  
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_firm_bill_no` (`firm_id`, `bill_no`),
  KEY `idx_firm_date` (`firm_id`, `date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS `SaleLineItems` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firm_id` INT NOT NULL,
  `sales_bill_id` INT NOT NULL,
  
  `product_id` INT NOT NULL,
  `brand_id` INT NULL,
  `hsnsac_code_id` INT NULL,
  
  `batch` VARCHAR(255) NULL,
  `barcode` VARCHAR(255) NULL,
  
  `quantity` INT NOT NULL DEFAULT 1,
  
  `vrp_rate` DECIMAL(15,2) NULL,
  `sale_rate` DECIMAL(15,2) NULL,
  
  `discount_percent` DECIMAL(5,2) DEFAULT 0,
  `discount_amount` DECIMAL(15,2) DEFAULT 0,
  
  `taxable_amount` DECIMAL(15,2) NULL,
  `gst_percent` DECIMAL(5,2) DEFAULT 0,
  `total_tax_amount` DECIMAL(15,2) NULL,
  
  `final_amount` DECIMAL(15,2) NULL,
  
  `salesman_id` INT NULL,
  `commission_amount` DECIMAL(15,2) DEFAULT 0,
  `mr_commission_amount` DECIMAL(15,2) DEFAULT 0,
  
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_sale_line_bill` FOREIGN KEY (`sales_bill_id`) REFERENCES `SalesBills` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

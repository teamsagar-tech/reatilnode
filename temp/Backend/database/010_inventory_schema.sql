CREATE TABLE IF NOT EXISTS `Products` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firm_id` INT NOT NULL,
  `sold_bill_id` INT NULL,
  `created_by_user_id` INT NULL,
  `invoice_id` INT NULL,
  `party_id` INT NULL,
  `invoice_product_id` INT NULL,
  
  `barcode` VARCHAR(255) NOT NULL,
  `barcode_type` ENUM('Universal', 'Batch', 'Unique') DEFAULT 'Unique',
  `barcode_sequence` INT NULL,
  `batch` VARCHAR(255) NULL,
  `use_barcode` VARCHAR(255) NULL,
  
  `brand_id` INT NULL,
  `category_id` INT NULL,
  `hsnsac_code_id` INT NULL,
  `color_id` INT NULL,
  `department_id` INT NULL,
  `material_id` INT NULL,
  `size_id` INT NULL,
  `style_id` INT NULL,
  `sub_category_id` INT NULL,
  `sub_style_id` INT NULL,
  `section_id` INT NULL,
  
  `product_name` VARCHAR(300) NULL,
  `attribute` TEXT NULL,
  
  `mrp` DECIMAL(15,2) NULL,
  `solid_mrp` DECIMAL(15,2) NULL,
  `vrp_rate` DECIMAL(15,2) NULL,
  `solid_vrp_rate` DECIMAL(15,2) NULL,
  `purchase_rate` DECIMAL(15,2) NULL,
  `net_rate` DECIMAL(15,2) NULL,
  `work_cost` DECIMAL(15,2) NULL,
  
  `discount` DECIMAL(15,2) NULL,
  `lock_discount` TINYINT(1) DEFAULT 0,
  `gst` DECIMAL(5,2) NULL,
  
  `commission_type` ENUM('flat', 'percentage') NULL,
  `commission_value` DECIMAL(15,2) NULL,
  `mr_commission_type` ENUM('flat', 'percentage') NULL,
  `mr_commission_value` DECIMAL(15,2) NULL,
  
  `can_salesman_give_discount` TINYINT(1) NULL,
  `is_lock_sale_rate` TINYINT(1) NULL,
  
  `unit_type` VARCHAR(50) NULL,
  `unit_per_product` INT NULL,
  `solid_unit_per_product` INT NULL,
  
  `quantity` INT DEFAULT 1,
  `current_stock` INT DEFAULT 0,
  
  `is_returned` TINYINT(1) DEFAULT 0,
  `is_sold` TINYINT(1) DEFAULT 0,
  
  `location_id` INT NULL,
  `current_location_id` INT NULL,
  
  `box_id` VARCHAR(100) NULL,
  `transition_status` ENUM('idle', 'requested', 'approved', 'in-transit', 'delivered') DEFAULT 'idle',
  
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_firm_barcode` (`firm_id`, `barcode`),
  KEY `idx_firm_is_sold` (`firm_id`, `is_sold`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `InvoiceProducts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firm_id` INT NOT NULL,
  `invoice_id` INT NOT NULL,
  
  `hsnsac_code_id` INT NULL,
  `brand_id` INT NULL,
  `size_id` INT NULL,
  
  `item_name` VARCHAR(300) NOT NULL,
  `design_no` VARCHAR(100) NULL,
  `colour_no` VARCHAR(100) NULL,
  `unit_type` VARCHAR(50) NULL,
  
  `quantity` INT NOT NULL,
  `opened_quantity` INT DEFAULT 0,
  `remaining_quantity` INT DEFAULT 0,
  `is_opened` TINYINT(1) DEFAULT 0,
  
  `purchase_rate` DECIMAL(15,2) NULL,
  `purchase_rate_discount_percent` DECIMAL(5,2) NULL,
  `gst_percent` DECIMAL(5,2) NULL,
  
  `net_rate` DECIMAL(15,2) NULL,
  `effective_net_rate` DECIMAL(15,2) NULL,
  
  `total_amount` DECIMAL(15,2) NULL,
  `taxable_amount` DECIMAL(15,2) NULL,
  `total_tax_amount` DECIMAL(15,2) NULL,
  
  `sequence` INT NULL,
  `barcode_sequence` INT NULL,
  `use_barcode` VARCHAR(255) NULL,
  
  `is_customized_color_and_size` TINYINT(1) DEFAULT 0,
  `is_location_distributed` TINYINT(1) DEFAULT 0,
  
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  KEY `idx_firm_invoice` (`firm_id`, `invoice_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `InvoiceProduct_Rows` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firm_id` INT NOT NULL,
  `invoice_product_id` INT NOT NULL,
  
  `size_id` INT NULL,
  `color_id` INT NULL,
  `design_no` VARCHAR(100) NULL,
  
  `purchase_rate` DECIMAL(15,2) NULL,
  `mrp` DECIMAL(15,2) NULL,
  
  `quantity` INT NOT NULL,
  `short_quantity` INT DEFAULT 0,
  `defective_quantity` INT DEFAULT 0,
  
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_ip_rows_product` FOREIGN KEY (`invoice_product_id`) REFERENCES `InvoiceProducts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `InvoiceProduct_LocationRows` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firm_id` INT NOT NULL,
  `invoice_product_id` INT NOT NULL,
  
  `location_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_ip_loc_rows_product` FOREIGN KEY (`invoice_product_id`) REFERENCES `InvoiceProducts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

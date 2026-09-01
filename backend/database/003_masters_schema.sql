USE retailnode_db;

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS `Categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firm_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `parent_id` INT NULL,
  `description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_categories_firm` FOREIGN KEY (`firm_id`) REFERENCES `Firms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_categories_parent` FOREIGN KEY (`parent_id`) REFERENCES `Categories` (`id`) ON DELETE SET NULL
);

-- 2. Brands Table
CREATE TABLE IF NOT EXISTS `Brands` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firm_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_brands_firm` FOREIGN KEY (`firm_id`) REFERENCES `Firms` (`id`) ON DELETE CASCADE
);

-- 3. Customers Table
CREATE TABLE IF NOT EXISTS `Customers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firm_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `mobile` VARCHAR(20) NULL,
  `email` VARCHAR(255) NULL,
  `gst_no` VARCHAR(50) NULL,
  `billing_address` TEXT NULL,
  `opening_balance` DECIMAL(15, 2) DEFAULT 0.00,
  `tally_guid` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_customers_firm` FOREIGN KEY (`firm_id`) REFERENCES `Firms` (`id`) ON DELETE CASCADE
);

-- 4. Vendors Table
CREATE TABLE IF NOT EXISTS `Vendors` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firm_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `mobile` VARCHAR(20) NULL,
  `email` VARCHAR(255) NULL,
  `gst_no` VARCHAR(50) NULL,
  `billing_address` TEXT NULL,
  `opening_balance` DECIMAL(15, 2) DEFAULT 0.00,
  `tally_guid` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_vendors_firm` FOREIGN KEY (`firm_id`) REFERENCES `Firms` (`id`) ON DELETE CASCADE
);

-- 5. Items Table
CREATE TABLE IF NOT EXISTS `Items` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firm_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `sku` VARCHAR(100) NULL,
  `barcode` VARCHAR(100) NULL,
  `category_id` INT NULL,
  `brand_id` INT NULL,
  `hsn_code` VARCHAR(20) NULL,
  `tax_percent` DECIMAL(5, 2) DEFAULT 0.00,
  `cost_price` DECIMAL(15, 2) DEFAULT 0.00,
  `selling_price` DECIMAL(15, 2) DEFAULT 0.00,
  `mrp` DECIMAL(15, 2) DEFAULT 0.00,
  `batch_tracking` BOOLEAN DEFAULT FALSE,
  `current_stock` DECIMAL(15, 2) DEFAULT 0.00,
  `min_stock_level` DECIMAL(15, 2) DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_items_firm` FOREIGN KEY (`firm_id`) REFERENCES `Firms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_items_category` FOREIGN KEY (`category_id`) REFERENCES `Categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_items_brand` FOREIGN KEY (`brand_id`) REFERENCES `Brands` (`id`) ON DELETE SET NULL
);

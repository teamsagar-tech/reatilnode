CREATE TABLE IF NOT EXISTS `Transporters` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firm_id` INT NOT NULL,
  `transporter_name` VARCHAR(300) NOT NULL,
  `mobile` VARCHAR(15) NULL,
  `email` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_firm_mobile` (`firm_id`, `mobile`),
  UNIQUE KEY `idx_firm_email` (`firm_id`, `email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Hundekari` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firm_id` INT NOT NULL,
  `hundekari_name` VARCHAR(300) NOT NULL,
  `mobile` VARCHAR(15) NULL,
  `email` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_firm_mobile_h` (`firm_id`, `mobile`),
  UNIQUE KEY `idx_firm_email_h` (`firm_id`, `email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Unlinked_LRs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firm_id` INT NOT NULL,
  `vendor_id` INT NULL,
  `transporter_id` INT NOT NULL,
  `hundekari_id` INT NOT NULL,
  `lr_no` VARCHAR(100) NOT NULL,
  `bale` INT NOT NULL,
  `received_bale` INT DEFAULT 0,
  `inward_at_location_id` INT NOT NULL,
  `lr_inward_date` DATE NOT NULL,
  `inwarded_by_user_id` INT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_firm_lrno` (`firm_id`, `lr_no`),
  CONSTRAINT `fk_lr_transporter` FOREIGN KEY (`transporter_id`) REFERENCES `Transporters` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_lr_hundekari` FOREIGN KEY (`hundekari_id`) REFERENCES `Hundekaris` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_lr_vendor` FOREIGN KEY (`vendor_id`) REFERENCES `Vendors` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Hundekari_Payments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firm_id` INT NOT NULL,
  `payment_no` VARCHAR(50) NOT NULL,
  `payment_date` DATE NOT NULL,
  `hundekari_id` INT NOT NULL,
  `payment_mode` VARCHAR(50) NOT NULL,
  `ledger_id` INT NULL,
  `amount` DECIMAL(15, 2) NOT NULL,
  `ref_no` VARCHAR(100) NULL,
  `remarks` TEXT NULL,
  `created_by` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_hk_payment_hk` FOREIGN KEY (`hundekari_id`) REFERENCES `Hundekari` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add tracking columns for Hundekari Payment to Unlinked_LRs safely
SET @dbname = DATABASE();
SET @tablename = 'Unlinked_LRs';
SET @columnname = 'hundekari_payment_status';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 1",
  "ALTER TABLE Unlinked_LRs ADD COLUMN hundekari_payment_status ENUM('PENDING', 'PAID') DEFAULT 'PENDING', ADD COLUMN hundekari_payment_id INT NULL, ADD CONSTRAINT fk_unlinked_lr_hk_payment FOREIGN KEY (hundekari_payment_id) REFERENCES Hundekari_Payments(id) ON DELETE SET NULL;"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

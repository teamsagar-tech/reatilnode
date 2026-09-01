CREATE TABLE IF NOT EXISTS `Parties` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firm_id` INT NOT NULL,
  `party_type` ENUM('Sundry Creditor (Vendor)', 'Sundry Debtor (Customer)', 'Other') DEFAULT 'Sundry Debtor (Customer)',
  `gstin` VARCHAR(15) NULL,
  `pan_number` VARCHAR(10) NULL,
  `state` VARCHAR(100) NULL,
  `state_code` VARCHAR(2) NULL,
  `party_name` VARCHAR(255) NOT NULL,
  `short_name` VARCHAR(100) NULL,
  
  `line1` TEXT NULL,
  `line2` TEXT NULL,
  `line3` TEXT NULL,
  `pincode` VARCHAR(10) NULL,
  `city` VARCHAR(100) NULL,
  `taluka` VARCHAR(100) NULL,
  `district` VARCHAR(100) NULL,
  
  `contact_person` VARCHAR(100) NULL,
  `email` VARCHAR(255) NULL,
  `mobile_number1` VARCHAR(20) NULL,
  `mobile_number2` VARCHAR(20) NULL,
  `mobile_number3` VARCHAR(20) NULL,
  `contact_number2` VARCHAR(20) NULL,
  `contact_number3` VARCHAR(20) NULL,
  
  `account_name` VARCHAR(255) NULL,
  `bank_name` VARCHAR(255) NULL,
  `account_number` VARCHAR(50) NULL,
  `ifsc` VARCHAR(20) NULL,
  `branch` VARCHAR(100) NULL,
  `bank_account_type` VARCHAR(50) NULL,
  
  `opening_balance` DECIMAL(15, 2) DEFAULT 0.00,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_parties_firm` FOREIGN KEY (`firm_id`) REFERENCES `Firms` (`id`) ON DELETE CASCADE
);

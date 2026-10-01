CREATE TABLE IF NOT EXISTS `PartyLedgers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firm_id` INT NOT NULL,
  `party_id` INT NOT NULL,
  `party_type` ENUM('Vendor', 'Customer') NOT NULL,
  
  `transaction_date` DATE NOT NULL,
  `voucher_type` ENUM('Purchase Invoice', 'Purchase Return', 'Sales Bill', 'Sales Return', 'Payment In', 'Payment Out', 'Journal') NOT NULL,
  `voucher_no` VARCHAR(100) NOT NULL,
  
  `debit_amount` DECIMAL(15,2) DEFAULT 0,
  `credit_amount` DECIMAL(15,2) DEFAULT 0,
  
  `running_balance` DECIMAL(15,2) DEFAULT 0,
  
  `narration` TEXT NULL,
  
  `created_by_user_id` INT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  KEY `idx_firm_party_date` (`firm_id`, `party_type`, `party_id`, `transaction_date`),
  CONSTRAINT `fk_ledger_firm` FOREIGN KEY (`firm_id`) REFERENCES `Firms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

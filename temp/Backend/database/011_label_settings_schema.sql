CREATE TABLE IF NOT EXISTS `LabelPrintSettings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firm_id` INT NOT NULL,
  
  `round` TINYINT(1) DEFAULT 0,
  `add_disc` TINYINT(1) DEFAULT 0,
  `lock_mrp` TINYINT(1) DEFAULT 0,
  `lock_sale_rate` TINYINT(1) DEFAULT 0,
  `is_multi_sequence` TINYINT(1) DEFAULT 0,
  
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_firm_settings` (`firm_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

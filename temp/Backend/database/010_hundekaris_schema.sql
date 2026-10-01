CREATE TABLE IF NOT EXISTS `Hundekaris` (
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

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
  CONSTRAINT `fk_lr_hundekari` FOREIGN KEY (`hundekari_id`) REFERENCES `Hundekari` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

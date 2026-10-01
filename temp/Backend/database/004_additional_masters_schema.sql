USE retailnode_db;

-- A macro-like approach isn't directly possible in standard MySQL without dynamic SQL in stored procedures, 
-- but we can write them out clearly. They share the same structure.

-- 1. Hundekaris
CREATE TABLE IF NOT EXISTS `Hundekaris` (
  `id` INT NOT NULL AUTO_INCREMENT, `firm_id` INT NOT NULL, `name` VARCHAR(100) NOT NULL, `description` TEXT NULL, `is_active` BOOLEAN DEFAULT TRUE, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`), CONSTRAINT `fk_hund_firm` FOREIGN KEY (`firm_id`) REFERENCES `Firms` (`id`) ON DELETE CASCADE
);

-- 2. Transporters
CREATE TABLE IF NOT EXISTS `Transporters` (
  `id` INT NOT NULL AUTO_INCREMENT, `firm_id` INT NOT NULL, `name` VARCHAR(100) NOT NULL, `description` TEXT NULL, `is_active` BOOLEAN DEFAULT TRUE, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`), CONSTRAINT `fk_trans_firm` FOREIGN KEY (`firm_id`) REFERENCES `Firms` (`id`) ON DELETE CASCADE
);

-- 3. Commissions
CREATE TABLE IF NOT EXISTS `Commissions` (
  `id` INT NOT NULL AUTO_INCREMENT, `firm_id` INT NOT NULL, `name` VARCHAR(100) NOT NULL, `description` TEXT NULL, `is_active` BOOLEAN DEFAULT TRUE, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`), CONSTRAINT `fk_comm_firm` FOREIGN KEY (`firm_id`) REFERENCES `Firms` (`id`) ON DELETE CASCADE
);

-- 4. ItemPercentages
CREATE TABLE IF NOT EXISTS `ItemPercentages` (
  `id` INT NOT NULL AUTO_INCREMENT, `firm_id` INT NOT NULL, `name` VARCHAR(100) NOT NULL, `description` TEXT NULL, `is_active` BOOLEAN DEFAULT TRUE, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`), CONSTRAINT `fk_itemperc_firm` FOREIGN KEY (`firm_id`) REFERENCES `Firms` (`id`) ON DELETE CASCADE
);

-- 5. ChargesTypes
CREATE TABLE IF NOT EXISTS `ChargesTypes` (
  `id` INT NOT NULL AUTO_INCREMENT, `firm_id` INT NOT NULL, `name` VARCHAR(100) NOT NULL, `description` TEXT NULL, `is_active` BOOLEAN DEFAULT TRUE, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`), CONSTRAINT `fk_chargestypes_firm` FOREIGN KEY (`firm_id`) REFERENCES `Firms` (`id`) ON DELETE CASCADE
);

-- 6. Locations
CREATE TABLE IF NOT EXISTS `Locations` (
  `id` INT NOT NULL AUTO_INCREMENT, `firm_id` INT NOT NULL, `name` VARCHAR(100) NOT NULL, `description` TEXT NULL, `is_active` BOOLEAN DEFAULT TRUE, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`), CONSTRAINT `fk_loc_firm` FOREIGN KEY (`firm_id`) REFERENCES `Firms` (`id`) ON DELETE CASCADE
);

-- 7. Departments
CREATE TABLE IF NOT EXISTS `Departments` (
  `id` INT NOT NULL AUTO_INCREMENT, `firm_id` INT NOT NULL, `name` VARCHAR(100) NOT NULL, `description` TEXT NULL, `is_active` BOOLEAN DEFAULT TRUE, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`), CONSTRAINT `fk_dept_firm` FOREIGN KEY (`firm_id`) REFERENCES `Firms` (`id`) ON DELETE CASCADE
);

-- 8. Sizes
CREATE TABLE IF NOT EXISTS `Sizes` (
  `id` INT NOT NULL AUTO_INCREMENT, `firm_id` INT NOT NULL, `name` VARCHAR(100) NOT NULL, `description` TEXT NULL, `is_active` BOOLEAN DEFAULT TRUE, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`), CONSTRAINT `fk_sizes_firm` FOREIGN KEY (`firm_id`) REFERENCES `Firms` (`id`) ON DELETE CASCADE
);

-- 9. Colors
CREATE TABLE IF NOT EXISTS `Colors` (
  `id` INT NOT NULL AUTO_INCREMENT, `firm_id` INT NOT NULL, `name` VARCHAR(100) NOT NULL, `description` TEXT NULL, `is_active` BOOLEAN DEFAULT TRUE, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`), CONSTRAINT `fk_colors_firm` FOREIGN KEY (`firm_id`) REFERENCES `Firms` (`id`) ON DELETE CASCADE
);

-- 10. Materials
CREATE TABLE IF NOT EXISTS `Materials` (
  `id` INT NOT NULL AUTO_INCREMENT, `firm_id` INT NOT NULL, `name` VARCHAR(100) NOT NULL, `description` TEXT NULL, `is_active` BOOLEAN DEFAULT TRUE, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`), CONSTRAINT `fk_mat_firm` FOREIGN KEY (`firm_id`) REFERENCES `Firms` (`id`) ON DELETE CASCADE
);

-- 11. Styles
CREATE TABLE IF NOT EXISTS `Styles` (
  `id` INT NOT NULL AUTO_INCREMENT, `firm_id` INT NOT NULL, `name` VARCHAR(100) NOT NULL, `description` TEXT NULL, `is_active` BOOLEAN DEFAULT TRUE, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`), CONSTRAINT `fk_styles_firm` FOREIGN KEY (`firm_id`) REFERENCES `Firms` (`id`) ON DELETE CASCADE
);

-- 12. Sections
CREATE TABLE IF NOT EXISTS `Sections` (
  `id` INT NOT NULL AUTO_INCREMENT, `firm_id` INT NOT NULL, `name` VARCHAR(100) NOT NULL, `description` TEXT NULL, `is_active` BOOLEAN DEFAULT TRUE, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`), CONSTRAINT `fk_sec_firm` FOREIGN KEY (`firm_id`) REFERENCES `Firms` (`id`) ON DELETE CASCADE
);

-- 13. SubCategories
CREATE TABLE IF NOT EXISTS `SubCategories` (
  `id` INT NOT NULL AUTO_INCREMENT, `firm_id` INT NOT NULL, `name` VARCHAR(100) NOT NULL, `description` TEXT NULL, `is_active` BOOLEAN DEFAULT TRUE, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`), CONSTRAINT `fk_subcat_firm` FOREIGN KEY (`firm_id`) REFERENCES `Firms` (`id`) ON DELETE CASCADE
);

-- 14. SubStyles
CREATE TABLE IF NOT EXISTS `SubStyles` (
  `id` INT NOT NULL AUTO_INCREMENT, `firm_id` INT NOT NULL, `name` VARCHAR(100) NOT NULL, `description` TEXT NULL, `is_active` BOOLEAN DEFAULT TRUE, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`), CONSTRAINT `fk_substyles_firm` FOREIGN KEY (`firm_id`) REFERENCES `Firms` (`id`) ON DELETE CASCADE
);

-- 15. HSNSACs
CREATE TABLE IF NOT EXISTS `HSNSACs` (
  `id` INT NOT NULL AUTO_INCREMENT, `firm_id` INT NOT NULL, `name` VARCHAR(100) NOT NULL, `description` TEXT NULL, `is_active` BOOLEAN DEFAULT TRUE, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`), CONSTRAINT `fk_hsnsacs_firm` FOREIGN KEY (`firm_id`) REFERENCES `Firms` (`id`) ON DELETE CASCADE
);

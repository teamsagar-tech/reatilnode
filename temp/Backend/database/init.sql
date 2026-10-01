CREATE DATABASE IF NOT EXISTS retailnode_db;
USE retailnode_db;

-- -----------------------------------------------------
-- Table `Firms`
-- Represents the Tenant/Company in the SaaS architecture.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Firms` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `valid_till` DATE NULL,
  `max_firms` INT DEFAULT 1,
  `is_active` BOOLEAN DEFAULT TRUE,
  `modules` JSON NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- -----------------------------------------------------
-- Table `Roles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Roles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firm_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `permissions` JSON NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- -----------------------------------------------------
-- Table `Users`
-- Global user table. Users belong to a specific firm.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firm_id` INT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'user',
  `role_id` INT NULL,
  `permissions_override` JSON NULL,
  `override_expires_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  CONSTRAINT `fk_users_firm`
    FOREIGN KEY (`firm_id`)
    REFERENCES `Firms` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

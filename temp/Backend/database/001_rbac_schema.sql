USE retailnode_db;

-- -----------------------------------------------------
-- Table `Roles`
-- Custom roles created by each firm.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Roles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firm_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_roles_firm`
    FOREIGN KEY (`firm_id`)
    REFERENCES `Firms` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  -- A firm cannot have two roles with the exact same name
  UNIQUE INDEX `unique_firm_role` (`firm_id`, `name`)
);

-- -----------------------------------------------------
-- Table `RolePermissions`
-- Maps what a specific role is allowed to do in a module.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RolePermissions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `role_id` INT NOT NULL,
  `module_name` VARCHAR(100) NOT NULL,
  `can_read` BOOLEAN DEFAULT FALSE,
  `can_write` BOOLEAN DEFAULT FALSE,
  `can_delete` BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_permissions_role`
    FOREIGN KEY (`role_id`)
    REFERENCES `Roles` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  UNIQUE INDEX `unique_role_module` (`role_id`, `module_name`)
);

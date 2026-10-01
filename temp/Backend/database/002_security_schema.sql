USE retailnode_db;

-- 1. Modify Users Table
ALTER TABLE `Users` 
ADD COLUMN `mobile_no` VARCHAR(20) NULL AFTER `email`,
ADD COLUMN `auth_provider` ENUM('local', 'mobile') DEFAULT 'local' AFTER `mobile_no`,
ADD COLUMN `totp_secret` VARCHAR(255) NULL AFTER `auth_provider`,
ADD COLUMN `is_totp_enabled` BOOLEAN DEFAULT FALSE AFTER `totp_secret`,
ADD COLUMN `failed_login_attempts` INT DEFAULT 0 AFTER `is_totp_enabled`,
ADD COLUMN `locked_until` TIMESTAMP NULL AFTER `failed_login_attempts`;

-- 2. OtpVerification Table
CREATE TABLE IF NOT EXISTS `OtpVerification` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `mobile_no` VARCHAR(20) NOT NULL,
  `otp` VARCHAR(10) NOT NULL,
  `expires_at` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- 3. UserDevices Table
CREATE TABLE IF NOT EXISTS `UserDevices` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `device_token` VARCHAR(255) NOT NULL,
  `user_agent` VARCHAR(255) NULL,
  `ip_address` VARCHAR(45) NULL,
  `is_trusted` BOOLEAN DEFAULT TRUE,
  `last_login` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `unique_device_token` (`device_token`),
  CONSTRAINT `fk_devices_user`
    FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE
);

-- 4. ApiAuditLogs Table
CREATE TABLE IF NOT EXISTS `ApiAuditLogs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firm_id` INT NULL,
  `user_id` INT NULL,
  `method` VARCHAR(10) NOT NULL,
  `endpoint` VARCHAR(255) NOT NULL,
  `request_payload` TEXT NULL,
  `ip_address` VARCHAR(45) NULL,
  `user_agent` VARCHAR(255) NULL,
  `status_code` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_audit_firm` FOREIGN KEY (`firm_id`) REFERENCES `Firms` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE SET NULL
);

-- 5. Notification Groups
CREATE TABLE IF NOT EXISTS `NotificationGroups` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(255) NULL,
  PRIMARY KEY (`id`)
);

-- Insert Default Groups
INSERT IGNORE INTO `NotificationGroups` (`name`, `description`) VALUES 
('Security Alerts', 'Alerts for new logins or failed login attempts'),
('Daily Reports', 'Daily summary of sales and operations'),
('Inventory Alerts', 'Low stock and reorder notifications');

-- 6. UserNotificationPreferences
CREATE TABLE IF NOT EXISTS `UserNotificationPreferences` (
  `user_id` INT NOT NULL,
  `group_id` INT NOT NULL,
  `is_subscribed` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`user_id`, `group_id`),
  CONSTRAINT `fk_pref_user` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pref_group` FOREIGN KEY (`group_id`) REFERENCES `NotificationGroups` (`id`) ON DELETE CASCADE
);

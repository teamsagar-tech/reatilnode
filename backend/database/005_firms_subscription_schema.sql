USE retailnode_db;

-- Add subscription and ownership fields to Firms table
ALTER TABLE `Firms`
ADD COLUMN `email` VARCHAR(255) DEFAULT NULL,
ADD COLUMN `mobile` VARCHAR(50) DEFAULT NULL,
ADD COLUMN `max_users` INT DEFAULT 1,
ADD COLUMN `valid_till` DATE DEFAULT NULL,
ADD COLUMN `max_firms` INT DEFAULT 1;

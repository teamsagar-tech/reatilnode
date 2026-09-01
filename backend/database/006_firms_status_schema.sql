USE retailnode_db;

-- Add active status column for Suspend functionality
ALTER TABLE `Firms`
ADD COLUMN `is_active` TINYINT(1) DEFAULT 1;

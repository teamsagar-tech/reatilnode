
CREATE TABLE IF NOT EXISTS PartyCategories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firm_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_firm_cat (firm_id, name)
);

CREATE TABLE IF NOT EXISTS PartySubCategories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firm_id INT NOT NULL,
  category_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_firm_sub (firm_id, category_id, name)
);

-- 007_tickets_schema.sql

CREATE TABLE IF NOT EXISTS Tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firm_id INT NOT NULL,
    ticket_type ENUM('SaaS_Support', 'Internal_Support', 'Customer_Support') NOT NULL DEFAULT 'SaaS_Support',
    created_by INT NOT NULL,
    on_behalf_of_user_id INT NULL,
    on_behalf_of_customer_id INT NULL,
    subject VARCHAR(255) NOT NULL,
    status ENUM('Open', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Open',
    priority ENUM('Low', 'Medium', 'High', 'Urgent') DEFAULT 'Medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (firm_id) REFERENCES Firms(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (on_behalf_of_user_id) REFERENCES Users(id) ON DELETE SET NULL
    -- Assuming a Customers table exists, if so: FOREIGN KEY (on_behalf_of_customer_id) REFERENCES Customers(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS TicketMessages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    sender_id INT NULL, -- NULL implies system generated message
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES Tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES Users(id) ON DELETE SET NULL
);


USE beauty_bliss;

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    order_id VARCHAR(40) NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_method VARCHAR(50) NOT NULL DEFAULT 'Standard Delivery',
    order_status VARCHAR(30) NOT NULL DEFAULT 'Processing',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_orders_order_id (order_id),
    KEY idx_orders_user_id (user_id),

    CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE RESTRICT
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    order_pk BIGINT UNSIGNED NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_image TEXT,
    quantity INT UNSIGNED NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    line_total DECIMAL(10,2) NOT NULL,

    PRIMARY KEY (id),
    KEY idx_order_items_order_pk (order_pk),

    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_pk)
        REFERENCES orders(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;


const express = require('express');
const crypto = require('crypto');
const { getPool } = require('../config/database');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();

const allowedPaymentMethods = [
    'UPI',
    'Google Pay',
    'PhonePe',
    'Credit Card',
    'Debit Card',
    'Net Banking',
    'Cash on Delivery'
];

// Generate a unique customer-facing Order ID
function generateOrderId() {
    const date = new Date();

    const datePart = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0')
    ].join('');

    const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();

    return `BB${datePart}${randomPart}`;
}

// PLACE ORDER
router.post('/', requireAuth, async (req, res, next) => {
    const { paymentMethod, items } = req.body;

    if (!allowedPaymentMethods.includes(paymentMethod)) {
        return res.status(400).json({
            success: false,
            error: 'Please select a valid payment method.'
        });
    }

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Your cart is empty.'
        });
    }

    if (items.length > 100) {
        return res.status(400).json({
            success: false,
            error: 'Too many products in one order.'
        });
    }

    let totalAmount = 0;
    const preparedItems = [];

    for (const item of items) {
        const name = String(item.name || '').trim();
        const price = Number(item.price);
        const quantity = Number(item.quantity || 1);

        if (
            !name ||
            name.length > 255 ||
            !Number.isFinite(price) ||
            price < 0 ||
            !Number.isInteger(quantity) ||
            quantity < 1 ||
            quantity > 1000
        ) {
            return res.status(400).json({
                success: false,
                error: 'Invalid product details in your cart.'
            });
        }

        const lineTotal = Math.round(price * quantity * 100) / 100;

        totalAmount += lineTotal;

        preparedItems.push({
            name,
            image: typeof item.image === 'string'
                ? item.image.slice(0, 2000)
                : null,
            price,
            quantity,
            lineTotal
        });
    }

    totalAmount = Math.round(totalAmount * 100) / 100;

    const connection = await getPool().getConnection();
    let transactionStarted = false;

    try {
        await connection.beginTransaction();
        transactionStarted = true;

        const orderId = generateOrderId();

        // Calculate estimated delivery date (5 days)
        const estimatedDelivery = new Date();
        estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

        const estimatedDeliveryDate =
            estimatedDelivery.toISOString().split('T')[0];

        const [orderResult] = await connection.execute(
            `INSERT INTO orders
            (order_id, user_id, payment_method, total_amount,
             delivery_method, order_status, estimated_delivery)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                orderId,
                req.user.userId,
                paymentMethod,
                totalAmount,
                'Standard Delivery',
                'Processing',
                estimatedDeliveryDate
            ]
        );

        // Save order products
        for (const item of preparedItems) {
            await connection.execute(
                `INSERT INTO order_items
                (order_pk, product_name, product_image,
                 quantity, unit_price, line_total)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    orderResult.insertId,
                    item.name,
                    item.image,
                    item.quantity,
                    item.price,
                    item.lineTotal
                ]
            );
        }

        await connection.commit();

        return res.status(201).json({
            success: true,
            message: 'Your order has been placed successfully!',
            order: {
                orderId,
                paymentMethod,
                totalAmount,
                deliveryMethod: 'Standard Delivery',
                orderStatus: 'Processing',
                estimatedDelivery: estimatedDeliveryDate
            }
        });

    } catch (error) {
        if (transactionStarted) {
            await connection.rollback();
        }

        return next(error);

    } finally {
        connection.release();
    }
});

// CANCEL ORDER
router.patch('/:orderId/cancel', requireAuth, async (req, res, next) => {
    const { orderId } = req.params;

    try {
        const [result] = await getPool().execute(
            `UPDATE orders
             SET order_status = 'Cancelled'
             WHERE order_id = ?
             AND user_id = ?
             AND order_status = 'Processing'`,
            [orderId, req.user.userId]
        );

        if (result.affectedRows === 0) {
            const [orders] = await getPool().execute(
                `SELECT order_status
                 FROM orders
                 WHERE order_id = ?
                 AND user_id = ?
                 LIMIT 1`,
                [orderId, req.user.userId]
            );

            if (orders.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Order not found.'
                });
            }

            return res.status(400).json({
                success: false,
                error: 'This order cannot be cancelled because it is no longer processing.'
            });
        }

        return res.json({
            success: true,
            message: 'Your order has been cancelled successfully!',
            orderId,
            orderStatus: 'Cancelled'
        });

    } catch (error) {
        return next(error);
    }
});

// GET LOGGED-IN USER'S ORDERS
router.get('/', requireAuth, async (req, res, next) => {
    try {
        const [orders] = await getPool().execute(
            `SELECT id, order_id, payment_method, total_amount,
                    delivery_method, order_status, created_at,
                    estimated_delivery
             FROM orders
             WHERE user_id = ?
             ORDER BY created_at DESC`,
            [req.user.userId]
        );

        if (orders.length === 0) {
            return res.json({
                success: true,
                orders: []
            });
        }

        const orderIds = orders.map(order => order.id);
        const placeholders = orderIds.map(() => '?').join(',');

        const [items] = await getPool().execute(
            `SELECT order_pk, product_name, product_image,
                    quantity, unit_price, line_total
             FROM order_items
             WHERE order_pk IN (${placeholders})
             ORDER BY id ASC`,
            orderIds
        );

        const itemsByOrder = {};

        for (const item of items) {
            if (!itemsByOrder[item.order_pk]) {
                itemsByOrder[item.order_pk] = [];
            }

            itemsByOrder[item.order_pk].push(item);
        }

        const result = orders.map(order => ({
            ...order,
            items: itemsByOrder[order.id] || []
        }));

        return res.json({
            success: true,
            orders: result
        });

    } catch (error) {
        return next(error);
    }
});

module.exports = router;

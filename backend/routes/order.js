// routes/order.js
const express = require('express');
const pool = require('../config/db');
const auth = require('../middleware/auth');
const router = express.Router();

// Place a Single Order
router.post('/single', auth, async (req, res) => {
  if (req.user.role !== 'user') return res.status(403).json({ message: 'Forbidden' });

  const { productName, quantity } = req.body;

  try {
    // Check if product exists in inventory
    const inventoryResult = await pool.query(
      'SELECT * FROM inventory WHERE product_name = $1',
      [productName]
    );

    const product = inventoryResult.rows[0];
    if (!product || product.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient inventory' });
    }

    // Deduct quantity from inventory
    await pool.query(
      'UPDATE inventory SET quantity = quantity - $1 WHERE product_name = $2',
      [quantity, productName]
    );

    // Create order
    const orderResult = await pool.query(
      'INSERT INTO orders (user_id, product_name, quantity, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, productName, quantity, 'pending']
    );

    res.status(201).json(orderResult.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error placing order', error });
  }
});

// Place Bulk Orders
router.post('/bulk', auth, async (req, res) => {
  if (req.user.role !== 'user') return res.status(403).json({ message: 'Forbidden' });

  const { orders } = req.body; // Expect an array of orders

  try {
    const results = [];

    for (const order of orders) {
      const { productName, quantity } = order;

      // Check if product exists in inventory
      const inventoryResult = await pool.query(
        'SELECT * FROM inventory WHERE product_name = $1',
        [productName]
      );

      const product = inventoryResult.rows[0];
      if (!product || product.quantity < quantity) {
        return res.status(400).json({ message: `Insufficient inventory for ${productName}` });
      }

      // Deduct quantity from inventory
      await pool.query(
        'UPDATE inventory SET quantity = quantity - $1 WHERE product_name = $2',
        [quantity, productName]
      );

      // Create order
      const orderResult = await pool.query(
        'INSERT INTO orders (user_id, product_name, quantity, status) VALUES ($1, $2, $3, $4) RETURNING *',
        [req.user.id, productName, quantity, 'pending']
      );

      results.push(orderResult.rows[0]);
    }

    res.status(201).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error placing bulk orders', error });
  }
});

module.exports = router;
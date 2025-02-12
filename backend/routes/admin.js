// routes/admin.js
const express = require('express');
const pool = require('../config/db');
const auth = require('../middleware/auth');
const router = express.Router();


//register admin
router.post('/register-admin', async (req, res) => {
    const { secretKey, username, email, password } = req.body;
  
    // Verify the secret key
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ message: 'Forbidden: Invalid secret key' });
    }
  
    try {
      // Check if an admin already exists
      const adminResult = await pool.query('SELECT * FROM users WHERE role = $1', ['admin']);
      if (adminResult.rows.length > 0) {
        return res.status(400).json({ message: 'An admin already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert the admin user
      const result = await pool.query(
        'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [username, email, hashedPassword, 'admin']
      );
  
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: 'Error creating admin', error });
    }
  });


  //Login Admin
  router.post('/login-admin', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
        res.json({ token });
        } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
        }
    });


// Add Inventory (Bulk or Single)
router.post('/inventory', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  const { products } = req.body; // Expect an array of products

  try {
    const values = products.map(product => [
      product.productName,
      product.quantity,
    ]);

    const result = await pool.query(
      'INSERT INTO inventory (product_name, quantity) VALUES ($1, $2) RETURNING *',
      values.flat()
    );

    res.status(201).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error adding inventory', error });
  }
});

// Get Inventory
router.get('/inventory', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  try {
    const result = await pool.query('SELECT * FROM inventory');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory', error });
  }
});

module.exports = router;
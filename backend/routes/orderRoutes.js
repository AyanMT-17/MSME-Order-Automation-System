import express from "express";
import pool from "../db.js"; // PostgreSQL connection
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to verify user or admin
const verifyUserOrAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract the token

    if (!token) {
        return res.status(403).json({ message: "Access denied, no token provided" });
    }

    try {
        const decoded = jwt.verify(token, "your_secret_key"); // Replace with your environment variable
        req.user = decoded; // Attach decoded token data (e.g., userId, role) to the request object
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// Place an order (User only)
router.post("/", verifyUserOrAdmin, async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // Get user ID from decoded token

    try {
        // Check product availability
        const product = await pool.query("SELECT * FROM products WHERE id = $1", [productId]);
        if (product.rows.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        const availableQuantity = product.rows[0].quantity;
        if (availableQuantity < quantity) {
            return res.status(400).json({ message: "Insufficient stock available" });
        }

        // Deduct quantity from inventory
        await pool.query("UPDATE products SET quantity = quantity - $1 WHERE id = $2", [quantity, productId]);

        // Create the order
        const newOrder = await pool.query(
            "INSERT INTO orders (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
            [userId, productId, quantity]
        );

        res.status(201).json({ message: "Order placed successfully", order: newOrder.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all orders for a user (User only)
router.get("/my-orders", verifyUserOrAdmin, async (req, res) => {
    const userId = req.user.id; // Get user ID from decoded token

    try {
        const userOrders = await pool.query(
            "SELECT o.id, p.name AS product_name, o.quantity, o.created_at FROM orders o JOIN products p ON o.product_id = p.id WHERE o.user_id = $1",
            [userId]
        );

        res.status(200).json({ orders: userOrders.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all orders (Admin only)
router.get("/", verifyUserOrAdmin, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied, admin only" });
    }

    try {
        const allOrders = await pool.query(
            "SELECT o.id, u.username AS user_name, p.name AS product_name, o.quantity, o.created_at FROM orders o JOIN users u ON o.user_id = u.id JOIN products p ON o.product_id = p.id"
        );

        res.status(200).json({ orders: allOrders.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;

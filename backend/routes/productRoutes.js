import express from "express";
import pool from "../db.js"; // PostgreSQL connection
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to verify admin role
const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract the token

    if (!token) {
        return res.status(403).json({ message: "Access denied, no token provided" });
    }

    try {
        const decoded = jwt.verify(token, "your_secret_key"); // Replace with your environment variable
        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Access denied, admin only" });
        }
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// Add a new product (Admin only)
router.post("/", verifyAdmin, async (req, res) => {
    const { name, description, price, quantity } = req.body;

    try {
        const newProduct = await pool.query(
            "INSERT INTO products (name, description, price, quantity) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, description, price, quantity]
        );

        res.status(201).json({ message: "Product added successfully", product: newProduct.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Update a product (Admin only)
router.put("/:id", verifyAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, description, price, quantity } = req.body;

    try {
        const updatedProduct = await pool.query(
            "UPDATE products SET name = $1, description = $2, price = $3, quantity = $4 WHERE id = $5 RETURNING *",
            [name, description, price, quantity, id]
        );

        if (updatedProduct.rows.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product updated successfully", product: updatedProduct.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Delete a product (Admin only)
router.delete("/:id", verifyAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);

        if (deletedProduct.rows.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully", product: deletedProduct.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Fetch all products (Available to all users)
router.get("/", async (req, res) => {
    try {
        const products = await pool.query("SELECT * FROM products");
        res.status(200).json({ products: products.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;

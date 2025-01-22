import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js"; // Import your PostgreSQL connection

const router = express.Router();

// SECRET KEY for JWT
const SECRET_KEY = "your_secret_key"; // Replace with an environment variable

// Register API
router.post("/register", async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if email already exists
        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        const newUser = await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, email, hashedPassword, role || "customer"]
        );

        res.status(201).json({ message: "User registered successfully", user: newUser.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Login API
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare passwords
        const isValidPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!isValidPassword) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const expirationTime = Math.floor(Date.now() / 1000) + (10 * 24 * 60 * 60);
        // Generate JWT token
        const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role }, SECRET_KEY, {
            expiresIn: expirationTime,
        }); // Expires in 10 days

        res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;

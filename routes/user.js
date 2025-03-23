const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = require("../config/db.js");
const user = db.user;

const JWT_SECRET = "paas";

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

// Mendapatkan semua user (Protected Route)
router.get("/", authenticateToken, async (req, res) => {
  try {
      const alluser = await user.findAll();
      res.json({ result: alluser });
  } catch (error) {
      res.status(500).json({ message: 'Error fetching users' });
  }
});

// Menambahkan user baru dengan password hash
router.post("/", async (req, res) => {
  try {
    const { nama, email, password } = req.body;

    // Hash password dengan bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await user.create({
      nama,
      email,
      password: hashedPassword
    });

    // Generate JWT token
    const token = jwt.sign(
      { email: newUser.email, id_user: newUser.id_user },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      user: newUser,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', details: error.message });
  }
});

// Mengupdate data user
router.patch("/:id_user", async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Jika password di-update, hash password baru
    if (req.body.password) {
      updateData.password = await bcrypt.hash(req.body.password, 10);
    }

    const result = await user.update(updateData, {
      where: { id_user: req.params.id_user }
    });

    if (result[0] === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", details: error.message });
  }
});

// Menghapus user
router.delete("/:id_user", async (req, res) => {
  try {
    const result = await user.destroy({ where: { id_user: req.params.id_user } });

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", details: error.message });
  }
});

// Login dengan password hash
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari user berdasarkan email
    const foundUser = await user.findOne({ where: { email }, raw: true });

    if (!foundUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Bandingkan password dengan hash di database
    const passwordMatch = await bcrypt.compare(password, foundUser.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token JWT
    const token = jwt.sign(
      { id_user: foundUser.id_user, email: foundUser.email, nama: foundUser.nama },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: "Login successful",
      user: {
        id: foundUser.id_user,
        email: foundUser.email,
        nama: foundUser.nama
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login", details: error.message });
  }
});

module.exports = router;

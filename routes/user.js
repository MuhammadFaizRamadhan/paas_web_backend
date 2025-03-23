const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const db = require("../config/db.js");
const user = db.user;

// ✅ Mendapatkan semua user (Public API, tidak butuh token)
router.get("/", async (req, res) => {
  try {
    const allUsers = await user.findAll({
      attributes: ['id_user', 'nama', 'email'] // Hindari mengirimkan password
    });
    res.json({ users: allUsers });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', details: error.message });
  }
});

// ✅ Mendapatkan user berdasarkan ID (Public API)
router.get("/:id_user", async (req, res) => {
  try {
    const foundUser = await user.findByPk(req.params.id_user, {
      attributes: ['id_user', 'nama', 'email']
    });

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: foundUser });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", details: error.message });
  }
});

// ✅ Menambahkan user baru dengan password hash (Public API)
router.post("/", async (req, res) => {
  try {
    const { nama, email, password } = req.body;

    if (!nama || !email || !password) {
      return res.status(400).json({ message: "Nama, email, dan password diperlukan" });
    }

    const existingUser = await user.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await user.create({
      nama,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", details: error.message });
  }
});

// ✅ Mengupdate data user
router.patch("/:id_user", async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.body.password) {
      updateData.password = await bcrypt.hash(req.body.password, 10);
    }

    const result = await user.update(updateData, {
      where: { id_user: req.params.id_user }
    });

    if (result[0] === 0) {
      return res.status(404).json({ message: "User not found or no changes made" });
    }

    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", details: error.message });
  }
});

// ✅ Menghapus user
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

// ✅ Login dengan password hash (Public API)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const foundUser = await user.findOne({ where: { email }, raw: true });

    if (!foundUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, foundUser.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: foundUser.id_user,
        email: foundUser.email,
        nama: foundUser.nama
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login", details: error.message });
  }
});

module.exports = router;

const express = require("express");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
    getAllUsers
} = require("../controllers/adminController");

const router = express.Router();

// ADMIN: view all users
router.get("/users", protect, adminOnly, getAllUsers);

module.exports = router;
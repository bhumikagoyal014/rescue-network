const express = require("express");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
    getAllUsers,
    getAllDonations,
    getAllRequests,
    getAllPickups
} = require("../controllers/adminController");

const router = express.Router();

// All routes here require valid JWT + ADMIN role
router.use(protect, adminOnly);

// ADMIN: view all users
router.get("/users", getAllUsers);

// ADMIN: view all donations
router.get("/donations", getAllDonations);

// ADMIN: view all requests
router.get("/requests", getAllRequests);

// ADMIN: view all pickups
router.get("/pickups", getAllPickups);

module.exports = router;
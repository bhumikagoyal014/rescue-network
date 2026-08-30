const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
    createDonation,
    getAvailableDonations,
    getMyDonations
} = require("../controllers/donationController");

const router = express.Router();

// Public / Authenticated: View all available donations
router.get("/available", getAvailableDonations);

// DONOR: View my created donations
router.get("/my-donations", protect, getMyDonations);

// DONOR: Create new donation
router.post("/", protect, createDonation);

module.exports = router;
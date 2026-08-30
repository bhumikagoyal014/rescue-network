const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    schedulePickup,
    getMyPickups,
    updatePickupStatus,
    getAvailableDeliveries,
    acceptDelivery,
    getMyDeliveries
} = require("../controllers/pickupController");
const router = express.Router();


// NGO: schedule pickup
router.post("/", protect, schedulePickup);


// NGO: view my pickups
router.get("/ngo-pickups", protect, getMyPickups);


// NGO: update pickup/delivery status
router.put("/:id/status", protect, updatePickupStatus);
// DELIVERY: view available delivery jobs
router.get("/available-deliveries", protect, getAvailableDeliveries);


// DELIVERY: accept a delivery job
router.put("/:id/accept-delivery", protect, acceptDelivery);


// DELIVERY: view my assigned deliveries
router.get("/my-deliveries", protect, getMyDeliveries);


module.exports = router;
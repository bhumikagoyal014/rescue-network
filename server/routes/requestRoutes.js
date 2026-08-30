const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    createRequest,
    getMyRequests,
    getDonationRequests,
    acceptRequest,
    rejectRequest
} = require("../controllers/requestController");

const router = express.Router();


// NGO: create request
router.post("/", protect, createRequest);


// NGO: view requests made by the NGO
router.get("/ngo-requests", protect, getMyRequests);


// DONOR: view requests received for their donations
router.get("/donor-requests", protect, getDonationRequests);


// DONOR: accept request
router.put("/:id/accept", protect, acceptRequest);


// DONOR: reject request
router.put("/:id/reject", protect, rejectRequest);


module.exports = router;
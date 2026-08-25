    const express = require("express");

    const protect = require("../middleware/authMiddleware");
    const { createDonation } = require("../controllers/donationController");

    const router = express.Router();

    router.post("/", protect, createDonation);

    module.exports = router;
    // Request a donation
    router.post("/:id/request", protect, async (req, res) => {
        try {
            const donation = await Donation.findById(req.params.id);

            if (!donation) {
                return res.status(404).json({
                    message: "Donation not found"
                });
            }

            // Donation must be available
            if (donation.status !== "AVAILABLE") {
                return res.status(400).json({
                    message: "Donation is not available for request"
                });
            }

            // Donor cannot request their own donation
            if (donation.donor.toString() === req.user.id) {
                return res.status(400).json({
                    message: "You cannot request your own donation"
                });
            }

            // Save receiver
            donation.receiver = req.user.id;

            // Change status
            donation.status = "REQUESTED";

            await donation.save();

            res.status(200).json({
                message: "Donation requested successfully",
                donation
            });

        } catch (error) {
            res.status(500).json({
                message: "Server error",
                error: error.message
            });
        }
    });
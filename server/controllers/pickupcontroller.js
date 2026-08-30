const Pickup = require("../models/Pickup");
const Request = require("../models/Request");


// NGO: Schedule a pickup
const schedulePickup = async (req, res) => {
    try {
        const {
            requestId,
            pickupMethod,
            pickupAddress,
            scheduledDate,
            deliveryFee,
            notes
        } = req.body;

        // Check required fields
        if (
            !requestId ||
            !pickupMethod ||
            !pickupAddress ||
            !scheduledDate
        ) {
            return res.status(400).json({
                message: "Request ID, pickup method, address and scheduled date are required"
            });
        }

        // Check request exists
        const request = await Request.findById(requestId);

        if (!request) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        // Only the NGO who made the request can schedule pickup
        if (request.ngo.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You are not allowed to schedule pickup for this request"
            });
        }

        // Request must be accepted
        if (request.status !== "ACCEPTED") {
            return res.status(400).json({
                message: "Pickup can only be scheduled after the request is accepted"
            });
        }

        // Check if pickup already exists
        const existingPickup = await Pickup.findOne({
            request: requestId
        });

        if (existingPickup) {
            return res.status(400).json({
                message: "Pickup has already been scheduled for this request"
            });
        }

        // Delivery fee should be zero for self pickup
        let finalDeliveryFee = deliveryFee || 0;

        if (pickupMethod === "SELF_PICKUP") {
            finalDeliveryFee = 0;
        }

        // Create pickup
        const pickup = await Pickup.create({
            request: requestId,
            pickupMethod,
            pickupAddress,
            scheduledDate,
            deliveryFee: finalDeliveryFee,
            notes: notes || "",
            deliveryStatus: "PENDING"
        });

        res.status(201).json({
            message: "Pickup scheduled successfully",
            pickup
        });

    } catch (error) {
        console.error("Schedule pickup error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    schedulePickup
};
const Request = require("../models/Request");
const Donation = require("../models/Donation");


// Create a donation request
const createRequest = async (req, res) => {
    try {
        const { donationId, message } = req.body;

        if (!donationId) {
            return res.status(400).json({
                message: "Donation ID is required"
            });
        }

        // Check whether donation exists
        const donation = await Donation.findById(donationId);

        if (!donation) {
            return res.status(404).json({
                message: "Donation not found"
            });
        }

        // Donation must be available
        if (donation.status !== "AVAILABLE") {
            return res.status(400).json({
                message: "This donation is no longer available"
            });
        }

        // Only NGOs can request donations
        if (req.user.role !== "NGO") {
            return res.status(403).json({
                message: "Only NGOs can request donations"
            });
        }

        // Donor cannot request their own donation
        if (donation.donor.toString() === req.user.userId) {
            return res.status(400).json({
                message: "You cannot request your own donation"
            });
        }

        // Check if this NGO already requested this donation
        const existingRequest = await Request.findOne({
            donation: donationId,
            ngo: req.user.userId,
            status: "PENDING"
        });

        if (existingRequest) {
            return res.status(400).json({
                message: "You have already requested this donation"
            });
        }

        // Create request
        const request = await Request.create({
            donation: donationId,
            ngo: req.user.userId,
            message: message || ""
        });

        // Change donation status
        donation.status = "REQUESTED";
        await donation.save();

        res.status(201).json({
            message: "Donation request created successfully",
            request
        });

    } catch (error) {
        console.error("Create request error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// NGO: View my requests
const getMyRequests = async (req, res) => {
    try {
        const requests = await Request.find({
            ngo: req.user.userId
        })
        .populate("donation")
        .populate("ngo", "name email phone");

        res.status(200).json({
            count: requests.length,
            requests
        });

    } catch (error) {
        console.error("Get my requests error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// DONOR: View requests for my donations
const getDonationRequests = async (req, res) => {
    try {
        // Find donations belonging to this donor
        const donations = await Donation.find({
            donor: req.user.userId
        });

        const donationIds = donations.map(donation => donation._id);

        // Find requests for those donations
        const requests = await Request.find({
            donation: { $in: donationIds }
        })
        .populate("donation")
        .populate("ngo", "name email phone");

        res.status(200).json({
            count: requests.length,
            requests
        });

    } catch (error) {
        console.error("Get donation requests error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// DONOR: Accept a request
const acceptRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id)
            .populate("donation");

        if (!request) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        // Make sure this donation belongs to the logged-in donor
        if (request.donation.donor.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You are not allowed to accept this request"
            });
        }

        // Request must still be pending
        if (request.status !== "PENDING") {
            return res.status(400).json({
                message: "This request has already been processed"
            });
        }

        request.status = "ACCEPTED";
        await request.save();

        res.status(200).json({
            message: "Request accepted successfully",
            request
        });

    } catch (error) {
        console.error("Accept request error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// DONOR: Reject a request
const rejectRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id)
            .populate("donation");

        if (!request) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        // Make sure this donation belongs to the logged-in donor
        if (request.donation.donor.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You are not allowed to reject this request"
            });
        }

        if (request.status !== "PENDING") {
            return res.status(400).json({
                message: "This request has already been processed"
            });
        }

        request.status = "REJECTED";
        await request.save();

        res.status(200).json({
            message: "Request rejected successfully",
            request
        });

    } catch (error) {
        console.error("Reject request error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};
module.exports = {
    createRequest,
    getMyRequests,
    getDonationRequests,
    acceptRequest,
    rejectRequest
};
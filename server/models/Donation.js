const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
    {
        donor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
},

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            enum: [
                "FOOD",
                "CLOTHES",
                "FURNITURE",
                "BOOKS",
                "ELECTRONICS",
                "OTHER"
            ],
            required: true
        },

        quantity: {
            type: String,
            required: true
        },

        condition: {
            type: String,
            enum: ["NEW", "GOOD", "USED"],
            default: "GOOD"
        },

        pickupAddress: {
            type: String,
            required: true
        },

        availableUntil: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: [
                "AVAILABLE",
                "REQUESTED",
                "PICKUP_SCHEDULED",
                "IN_TRANSIT",
                "COMPLETED",
                "CANCELLED"
            ],
            default: "AVAILABLE"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Donation", donationSchema);
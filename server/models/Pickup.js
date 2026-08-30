const mongoose = require("mongoose");

const pickupSchema = new mongoose.Schema(
    {
        request: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Request",
            required: true,
            unique: true
        },

        pickupMethod: {
            type: String,
            enum: ["SELF_PICKUP", "DELIVERY"],
            required: true
        },

        pickupAddress: {
            type: String,
            required: true,
            trim: true
        },

        scheduledDate: {
            type: Date,
            required: true
        },

        deliveryStatus: {
            type: String,
            enum: [
                "PENDING",
                "SCHEDULED",
                "PICKED_UP",
                "DELIVERED",
                "CANCELLED"
            ],
            default: "PENDING"
        },

        deliveryPartner: {
            type: String,
            default: ""
        },

        deliveryFee: {
            type: Number,
            default: 0
        },

        notes: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Pickup", pickupSchema);
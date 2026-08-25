const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["DONOR", "NGO", "DELIVERY", "ADMIN"],
            default: "DONOR"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);
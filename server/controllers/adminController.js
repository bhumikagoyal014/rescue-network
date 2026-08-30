const User = require("../models/User");

// Admin: view all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: users.length,
            users
        });

    } catch (error) {
        console.error("Get all users error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getAllUsers
};
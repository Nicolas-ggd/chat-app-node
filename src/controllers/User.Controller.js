const User = require('../models/User');

const GetAllUser = async (req, res) => {
    try {
        const findAll = await User.find({})

        return res.status(200).json(findAll);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Can't get users information" });
    }
};

const SearchUser = async (req, res) => {
    const searchValue = req.query.query;
    console.log(searchValue);

    try {
        const searchUsers = await User.find({ name: { $regex: searchValue, $options: "i" } })
            .select("-password -refresh_token -ResetPasswordHash -verificationCode")
            .exec();

        if (searchUsers.length > 0) {
            return res.status(200).json(searchUsers);
        } else {
            return res.status(404).json({ message: "Users not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const GetOneUser = async (req, res) => {
    const _id = req.query.query;

    try {
        const user = await User.findById({ _id })
            .select("-password -refresh_token -ResetPasswordHash -verificationCode")
            .exec();

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Can't get user list" });
    }
};

module.exports = {
    GetAllUser,
    SearchUser,
    GetOneUser
};
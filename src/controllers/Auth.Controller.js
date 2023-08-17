const User = require('../models/User');
const generateToken = require('../configs/GenerateToken');

const userAuth = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const authUser = await User.findOne({ email });

        if (!authUser) return res.status(401).json({ message: "Unauthorized" });

        if (authUser && (await authUser.matchPassword(password))) {
            const access_token = generateToken(
                {
                    UserInfo: {
                        _id: authUser._id,
                    },
                },
                "access_token",
                "30d"
            );

            const refresh_token = generateToken(
                {
                    UserInfo: {
                        _id: authUser._id,
                    },
                },
                "refresh_token",
                "30d"
            );

            await User.updateOne(
                { email: authUser.email },
                {
                    $set: {
                        refresh_token: refresh_token,
                        online: true
                    }
                }
            );

            res.cookie("jwt", refresh_token, {
                httpOnly: true,
                sameSite: "None",
                secure: true,
                maxAge: 24 * 60 * 60 * 1000,
            });

            res.json({
                _id: authUser._id,
                access_token: access_token,
                name: authUser.name,
                email: authUser.email,
            });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
};

module.exports = {
    userAuth
}
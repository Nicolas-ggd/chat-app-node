const User = require('../models/User');

const userRegister = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existedUser = await User.findOne({ email });

        if (existedUser) {
            res.status(400).json({
                message: "Player already exists!"
            });
        }

        const userCreate = await User.create({
            name,
            email,
            password,
        });

        return res.status(200).json(userCreate);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
};

module.exports = {
    userRegister
}
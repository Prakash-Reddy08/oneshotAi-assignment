const jwt = require('jsonwebtoken')
const User = require('../database/models/User')
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
    const { cookies } = req;
    if (!cookies?.jwt) {
        res.sendStatus(401);
        return;
    }
    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken })
    if (!foundUser) return res.sendStatus(403);

    jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser._id.toString() !== decoded.id) {
                return res.sendStatus(403)
            };
            const accessToken = jwt.sign(
                { id: decoded.id },
                process.env.JWT_ACCESS_TOKEN_SECRET,
                { expiresIn: "1h" }
            );
            res.json({ accessToken })
        }
    )

}

module.exports = handleRefreshToken;
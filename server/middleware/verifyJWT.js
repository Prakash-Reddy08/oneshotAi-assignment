const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (!authHeader) return res.sendStatus(401)
    const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.JWT_ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                return res.sendStatus(403);
            }//invalid token
            if (!decoded.id) {
                return res.sendStatus(403)
            }
            req.user = { id: decoded.id };
            next();
        }
    )
}

module.exports = verifyJWT;
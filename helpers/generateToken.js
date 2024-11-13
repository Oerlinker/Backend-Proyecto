const jwt = require('jsonwebtoken');


const tokenSing = (payload, expiresIn = '1h') => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const verifyToken = async (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Token no válido');
    }
};

const decodeToken = (token) => {
    return jwt.decode(token);
};

module.exports = { tokenSing, verifyToken, decodeToken };

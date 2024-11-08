const jwt = require('jsonwebtoken');


const secretKey = 'secretKey';

const tokenSing = (payload, expiresIn = '1h') => {
    return jwt.sign(payload, secretKey, {expiresIn});
};

const verifyToken = async (token) => {
    try {
        return jwt.verify(token,proccess.env.JWT_SECRET);
    } catch (error) {
        throw new Error('token no valido');
    }
};

const decodeToken = (token) => {
    return jwt.decode(token);
};

module.exports = {tokenSing, verifyToken, decodeToken};
const jwt = require('jsonwebtoken');

const secretKey = 'secretKey';

const tokenSing = (payload, expiresIn = '1h') => {
    return jwt.sign(payload, secretKey, {expiresIn});
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        throw new Error('token no valido');
    }
};

const decodeToken = (token) => {
    return jwt.decode(token);
};

module.exports = {tokenSing, verifyToken, decodeToken};
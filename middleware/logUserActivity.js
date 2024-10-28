const pool = require('../db');

const logUserActivity = (action) => {
    return async (req, res, next) => {
        const userId = req.user ? req.user.id : null;
        const userIp = req.ip;

        if (userId) {
            try {
                await pool.query(
                    'INSERT INTO useractivitylog (userid, action, timestamp, ip) VALUES ($1, $2, NOW(), $3)',
                    [userId, action, userIp]
                );
            } catch (error) {
                console.error('Error logging user activity:', error);
            }
        }

        next();
    };
};

module.exports = logUserActivity;
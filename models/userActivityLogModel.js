const pool = require('../db');
const logUserActivity = async (userId, action,userIp) => {
    try {
        await pool.query(
            'INSERT INTO useractivitylog (userid, action, timestamp) VALUES ($1, $2, NOW(), $3)',
            [userId, action,userIp]
        );
    } catch (error) {
        console.error('Error logging user activity', error);
        throw error;
    }
};

module.exports = {
    logUserActivity
};
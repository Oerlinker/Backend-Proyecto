const pool = require('../db');

const logUserActivity = async (userId, action, userIp) => {
    try {
        // Combina la acción con la IP en formato JSON
        const actionWithIp = JSON.stringify({ action, ip: userIp });
        
        await pool.query(
            'INSERT INTO useractivitylog (userid, action, timestamp) VALUES ($1, $2, NOW())',
            [userId, actionWithIp]
        );
    } catch (error) {
        console.error('Error logging user activity', error);
        throw error;
    }
};

module.exports = {
    logUserActivity
};
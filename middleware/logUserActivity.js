const pool = require('../db');

const logUserActivity = (action) => {
    return async (req, res, next) => {
        const userId = req.user ? req.user.id : null; // Asegúrate de tener el userId disponible en req.user

        if (userId) {
            try {
                await pool.query(
                    'INSERT INTO useractivitylog (userid, action) VALUES ($1, $2)',
                    [userId, action]
                );
            } catch (error) {
                console.error('Error logging user activity:', error);
            }
        }

        next();
    };
};

module.exports = logUserActivity;
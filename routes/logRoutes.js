const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/activity-log', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM useractivitylog ORDER BY timestamp DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching activity log:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
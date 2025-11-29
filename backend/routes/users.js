const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { authenticateToken } = require('../middleware/auth');

// GET /users/me - profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const q = 'SELECT user_id, name, contact_number, email, dob, adhar_number, gender, is_active, created_at FROM users WHERE user_id = $1';
    const { rows } = await db.query(q, [req.user.user_id]);
    if (!rows[0]) return res.status(404).json({ error: 'User not found' });
    res.json({ user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /users/me - update profile
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const { name, contact_number, dob, gender } = req.body;
    const q = `UPDATE users SET name = $1, contact_number = $2, dob = $3, gender = $4, updated_at = now() WHERE user_id = $5 RETURNING user_id, name, contact_number, email, dob, gender`;
    const values = [name, contact_number, dob, gender, req.user.user_id];
    const { rows } = await db.query(q, values);
    res.json({ user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { jwtSecret } = require('../middleware/auth');

// POST /auth/signup
router.post('/signup',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, contact_number, dob, adhar_number, gender } = req.body;
    try {
      const hash = await bcrypt.hash(password, 10);
      const insert = `INSERT INTO users (name, contact_number, email, dob, adhar_number, gender, password_hash)
        VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING user_id, email, name`;
      const values = [name, contact_number, email, dob, adhar_number, gender, hash];
      const result = await db.query(insert, values);
      const user = result.rows[0];
      res.status(201).json({ message: 'User created', user });
    } catch (err) {
      console.error(err);
      if (err.code === '23505') return res.status(409).json({ error: 'Email or identifier already exists' });
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// POST /auth/signin
router.post('/signin',
  body('email').isEmail(),
  body('password').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
      const q = 'SELECT user_id, email, password_hash, name FROM users WHERE email = $1';
      const { rows } = await db.query(q, [email]);
      if (!rows[0]) return res.status(401).json({ error: 'Invalid credentials' });
      const user = rows[0];
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) return res.status(401).json({ error: 'Invalid credentials' });

      const payload = { user_id: user.user_id, email: user.email, name: user.name };
      const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
      res.json({ token, user: payload });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

module.exports = router;

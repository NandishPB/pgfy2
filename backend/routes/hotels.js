const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET /hotels  -> list all or filter by city
router.get('/', async (req, res) => {
  const { city, q } = req.query;
  try {
    let base = 'SELECT hotel_id, name, address, state, city, available_rooms, price_per_night, phone, email, average_rating, total_reviews FROM hotels WHERE is_active = true';
    const params = [];
    if (city) {
      params.push(city);
      base += ` AND city ILIKE $${params.length}`;
    }
    if (q) {
      params.push(`%${q}%`);
      base += ` AND (name ILIKE $${params.length} OR address ILIKE $${params.length})`;
    }
    base += ' ORDER BY average_rating DESC NULLS LAST, price_per_night ASC LIMIT 100';
    const { rows } = await db.query(base, params);
    res.json({ hotels: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /hotels/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const q = 'SELECT * FROM hotels WHERE hotel_id = $1 AND is_active = true';
    const { rows } = await db.query(q, [id]);
    if (!rows[0]) return res.status(404).json({ error: 'Hotel not found' });
    res.json({ hotel: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

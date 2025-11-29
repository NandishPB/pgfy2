const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { authenticateToken } = require('../middleware/auth');
const PDFDocument = require('pdfkit');

// POST /bookings  -> create a booking (protected)
router.post('/', authenticateToken, async (req, res) => {
  const {
    hotel_id,
    check_in_date,
    check_out_date,
    number_of_guests = 1,
    number_of_rooms = 1,
    room_price = 0.0,
    nights = 1,
    total_amount = 0.0
  } = req.body;

  try {
    const insert = `INSERT INTO bookings (user_id, hotel_id, check_in_date, check_out_date, number_of_guests, number_of_rooms, room_price, nights, total_amount)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING booking_id, booking_reference`;
    const values = [req.user.user_id, hotel_id, check_in_date, check_out_date, number_of_guests, number_of_rooms, room_price, nights, total_amount];
    const { rows } = await db.query(insert, values);
    res.status(201).json({ message: 'Booking created', booking: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /bookings/my -> list bookings for current user
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const q = `SELECT b.*, h.name as hotel_name, h.address as hotel_address FROM bookings b JOIN hotels h ON b.hotel_id = h.hotel_id WHERE b.user_id = $1 ORDER BY b.created_at DESC`;
    const { rows } = await db.query(q, [req.user.user_id]);
    res.json({ bookings: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /bookings/:id/receipt -> returns PDF receipt (protected)
router.get('/:id/receipt', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const q = `SELECT b.*, u.name as user_name, u.email as user_email, h.name as hotel_name, h.address as hotel_address FROM bookings b
      JOIN users u ON b.user_id = u.user_id
      JOIN hotels h ON b.hotel_id = h.hotel_id
      WHERE b.booking_id = $1`;
    const { rows } = await db.query(q, [id]);
    if (!rows[0]) return res.status(404).json({ error: 'Booking not found' });
    const booking = rows[0];

    // verify ownership
    if (booking.user_id !== req.user.user_id) return res.status(403).json({ error: 'Forbidden' });

    // generate PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt_${booking.booking_reference || booking.booking_id}.pdf`);
    doc.pipe(res);
    doc.fontSize(20).text('PGfy - Booking Receipt', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Booking Reference: ${booking.booking_reference || booking.booking_id}`);
    doc.text(`Name: ${booking.user_name}`);
    doc.text(`Email: ${booking.user_email}`);
    doc.moveDown();
    doc.text(`Hotel: ${booking.hotel_name}`);
    doc.text(`Address: ${booking.hotel_address}`);
    doc.text(`Check-in: ${booking.check_in_date}`);
    doc.text(`Check-out: ${booking.check_out_date}`);
    doc.text(`Nights: ${booking.nights}`);
    doc.text(`Guests: ${booking.number_of_guests}`);
    doc.moveDown();
    doc.text(`Total Amount: ${booking.total_amount}`);
    doc.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

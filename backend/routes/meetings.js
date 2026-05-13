const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/meetings - Get all meetings with attendees
router.get('/', async (req, res) => {
  try {
    const meetingsResult = await pool.query(
      'SELECT * FROM meetings ORDER BY date DESC, time DESC'
    );

    const meetings = [];
    for (const meeting of meetingsResult.rows) {
      const attendeesResult = await pool.query(
        'SELECT employee_name FROM meeting_attendees WHERE meeting_id = $1',
        [meeting.id]
      );

      meetings.push({
        id: meeting.id,
        title: meeting.title,
        date: meeting.date?.toISOString().split('T')[0],
        time: meeting.time,
        attendees: attendeesResult.rows.map((a) => a.employee_name),
        createdAt: meeting.created_at?.toISOString().split('T')[0],
      });
    }

    res.json(meetings);
  } catch (err) {
    console.error('Get meetings error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/meetings - Create a new meeting
router.post('/', async (req, res) => {
  try {
    const { title, date, time, attendees } = req.body;

    if (!title || !date || !time || !attendees || attendees.length === 0) {
      return res.status(400).json({ error: 'Champs obligatoires manquants' });
    }

    // Insert meeting
    const meetingResult = await pool.query(
      `INSERT INTO meetings (title, date, time) VALUES ($1, $2, $3) RETURNING *`,
      [title, date, time]
    );

    const meeting = meetingResult.rows[0];

    // Insert attendees
    for (const name of attendees) {
      await pool.query(
        'INSERT INTO meeting_attendees (meeting_id, employee_name) VALUES ($1, $2)',
        [meeting.id, name]
      );
    }

    res.status(201).json({
      id: meeting.id,
      title: meeting.title,
      date: meeting.date?.toISOString().split('T')[0],
      time: meeting.time,
      attendees,
      createdAt: meeting.created_at?.toISOString().split('T')[0],
    });
  } catch (err) {
    console.error('Create meeting error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;

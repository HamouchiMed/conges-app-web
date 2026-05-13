const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/leaves - Get all leave requests (optionally filter by employee_name)
router.get('/', async (req, res) => {
  try {
    const { employee_name } = req.query;
    let result;

    if (employee_name) {
      result = await pool.query(
        'SELECT * FROM leave_requests WHERE employee_name = $1 ORDER BY created_at DESC',
        [employee_name]
      );
    } else {
      result = await pool.query(
        'SELECT * FROM leave_requests ORDER BY created_at DESC'
      );
    }

    // Format dates to YYYY-MM-DD strings for frontend compatibility
    const leaves = result.rows.map((row) => ({
      ...row,
      startDate: row.start_date?.toISOString().split('T')[0],
      endDate: row.end_date?.toISOString().split('T')[0],
      employeeName: row.employee_name,
      createdAt: row.created_at?.toISOString().split('T')[0],
    }));

    res.json(leaves);
  } catch (err) {
    console.error('Get leaves error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/leaves - Create a new leave request
router.post('/', async (req, res) => {
  try {
    const { employeeName, startDate, endDate, type, motif } = req.body;

    if (!employeeName || !startDate || !endDate || !type) {
      return res.status(400).json({ error: 'Champs obligatoires manquants' });
    }

    const result = await pool.query(
      `INSERT INTO leave_requests (employee_name, start_date, end_date, type, motif, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING *`,
      [employeeName, startDate, endDate, type, motif || '']
    );

    const row = result.rows[0];
    const leave = {
      ...row,
      startDate: row.start_date?.toISOString().split('T')[0],
      endDate: row.end_date?.toISOString().split('T')[0],
      employeeName: row.employee_name,
      createdAt: row.created_at?.toISOString().split('T')[0],
    };

    res.status(201).json(leave);
  } catch (err) {
    console.error('Create leave error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PATCH /api/leaves/:id/status - Update leave status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    const result = await pool.query(
      'UPDATE leave_requests SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Demande non trouvée' });
    }

    const row = result.rows[0];
    const leave = {
      ...row,
      startDate: row.start_date?.toISOString().split('T')[0],
      endDate: row.end_date?.toISOString().split('T')[0],
      employeeName: row.employee_name,
      createdAt: row.created_at?.toISOString().split('T')[0],
    };

    res.json(leave);
  } catch (err) {
    console.error('Update leave status error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;

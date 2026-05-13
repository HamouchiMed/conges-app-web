const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { name, role } = req.body;

    if (!name || !role) {
      return res.status(400).json({ error: 'Nom et rôle requis' });
    }

    // Check if employee exists
    const result = await pool.query(
      'SELECT id, name, role FROM employees WHERE name = $1',
      [name]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const user = result.rows[0];
    res.json({ user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;

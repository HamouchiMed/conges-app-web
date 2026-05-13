const pool = require('./db');

async function migrate() {
  try {
    console.log('🔄 Clearing old data...');

    // Clear all existing data
    await pool.query('DELETE FROM meeting_attendees');
    await pool.query('DELETE FROM meetings');
    await pool.query('DELETE FROM leave_requests');
    await pool.query('DELETE FROM employees');

    console.log('🔄 Inserting new employees...');

    const employees = [
      { name: 'El Alaoui Essalek', role: 'employee' },
      { name: 'Magboula El Khattat', role: 'employee' },
      { name: 'Sallay Ahmed', role: 'employee' },
      { name: 'El Ghaylany Machnane', role: 'employee' },
      { name: 'Ahl Hmeida Sid Ahmed', role: 'employee' },
      { name: 'El Akhiar Abdellah', role: 'employee' },
      { name: 'Dris El Abassi', role: 'employee' },
      { name: 'Brahim Ahl-Boubakre', role: 'employee' },
      { name: 'Wenati Khtour', role: 'employee' },
      { name: 'Mohamed Salem Bahia', role: 'employee' },
      { name: 'Mohamed Laghdaf Ahl Sidi Mouloud', role: 'employee' },
      { name: 'Oubaha Hafid', role: 'employee' },
      { name: 'Daoudi Mohamed Mouloud', role: 'employee' },
      { name: 'Admin Directeur', role: 'director' },
    ];

    for (const emp of employees) {
      await pool.query(
        'INSERT INTO employees (name, role) VALUES ($1, $2)',
        [emp.name, emp.role]
      );
      console.log(`  ✅ ${emp.name} (${emp.role})`);
    }

    console.log(`\n✅ Done! ${employees.length} employees inserted.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

migrate();

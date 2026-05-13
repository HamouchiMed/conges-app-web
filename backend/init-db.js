const pool = require('./db');

async function initDatabase() {
  try {
    console.log('🔄 Creating tables...');

    // Create employees table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        role VARCHAR(20) NOT NULL DEFAULT 'employee' CHECK (role IN ('employee', 'director')),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create leave_requests table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leave_requests (
        id SERIAL PRIMARY KEY,
        employee_name VARCHAR(100) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        type VARCHAR(30) NOT NULL,
        motif TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create meetings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS meetings (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        date DATE NOT NULL,
        time VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create meeting_attendees table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS meeting_attendees (
        id SERIAL PRIMARY KEY,
        meeting_id INTEGER REFERENCES meetings(id) ON DELETE CASCADE,
        employee_name VARCHAR(100) NOT NULL
      );
    `);

    console.log('✅ Tables created successfully!');

    // Seed employees
    console.log('🔄 Seeding employees...');
    const employees = [
      { name: 'Hamza Choukri', role: 'employee' },
      { name: 'Youssef Amrani', role: 'employee' },
      { name: 'Fatima Zahra', role: 'employee' },
      { name: 'Ahmed Bennani', role: 'employee' },
      { name: 'Sara Idrissi', role: 'employee' },
      { name: 'Karim Tazi', role: 'employee' },
      { name: 'Nadia Ouazzani', role: 'employee' },
      { name: 'Omar Fassi', role: 'employee' },
      { name: 'Admin Directeur', role: 'director' },
    ];

    for (const emp of employees) {
      await pool.query(
        `INSERT INTO employees (name, role)
         VALUES ($1, $2)
         ON CONFLICT (name) DO NOTHING`,
        [emp.name, emp.role]
      );
    }

    // Seed leave requests
    console.log('🔄 Seeding leave requests...');
    const leaves = [
      {
        employee_name: 'Youssef Amrani',
        start_date: '2026-05-12',
        end_date: '2026-05-16',
        type: 'annuel',
        motif: 'Vacances familiales',
        status: 'approved',
      },
      {
        employee_name: 'Fatima Zahra',
        start_date: '2026-05-14',
        end_date: '2026-05-15',
        type: 'personnel',
        motif: 'Rendez-vous administratif',
        status: 'pending',
      },
      {
        employee_name: 'Sara Idrissi',
        start_date: '2026-05-10',
        end_date: '2026-05-20',
        type: 'maladie',
        motif: 'Certificat médical fourni',
        status: 'approved',
      },
    ];

    // Only seed if no leave requests exist
    const existingLeaves = await pool.query('SELECT COUNT(*) FROM leave_requests');
    if (parseInt(existingLeaves.rows[0].count) === 0) {
      for (const leave of leaves) {
        await pool.query(
          `INSERT INTO leave_requests (employee_name, start_date, end_date, type, motif, status)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [leave.employee_name, leave.start_date, leave.end_date, leave.type, leave.motif, leave.status]
        );
      }
    }

    // Seed meetings
    console.log('🔄 Seeding meetings...');
    const existingMeetings = await pool.query('SELECT COUNT(*) FROM meetings');
    if (parseInt(existingMeetings.rows[0].count) === 0) {
      const meetingResult = await pool.query(
        `INSERT INTO meetings (title, date, time) VALUES ($1, $2, $3) RETURNING id`,
        ['Réunion de projet Q2', '2026-05-13', '10:00']
      );
      const meetingId = meetingResult.rows[0].id;

      const attendees = ['Hamza Choukri', 'Ahmed Bennani', 'Karim Tazi'];
      for (const name of attendees) {
        await pool.query(
          `INSERT INTO meeting_attendees (meeting_id, employee_name) VALUES ($1, $2)`,
          [meetingId, name]
        );
      }
    }

    console.log('✅ Database initialized successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error initializing database:', err);
    process.exit(1);
  }
}

initDatabase();

import db from '../database.js';

export async function getAcademicYears(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM academicyear Where IsCurrent=1');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err });
  }
}

export async function addAcademicYear(req, res) {
  const { YearLabel, StartDate, EndDate } = req.body;

  let conn;
  try {
    conn = await db.getConnection(); 
    await conn.beginTransaction();   

    // Step 3: Insert new academic year
    const [insertResult] = await conn.query(
      `INSERT INTO AcademicYear (YearLabel, StartDate, EndDate, IsCurrent)
       VALUES (?, ?, ?, ?)`,
      [YearLabel, StartDate, EndDate, true]
    );

    
    await conn.query(
      `UPDATE approved_vehicles
       SET Status = 'expired'`
    );

    await conn.commit(); // ✅ Step 5: Commit transaction
    res.status(200).json({ message: "Academic year added successfully" });

  } catch (err) {
    if (conn) await conn.rollback(); // ✅ Rollback if error
    console.error(err);
    res.status(500).json({ error: "Failed to add academic year" });

  } finally {
    if (conn) conn.release(); // ✅ Always release the connection
  }
}


import db from "../database.js";

export async function GetVehicleLogs(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT 
        Vehicle_ID,
        Plate_Nb,
        Session_ID,
         DATE_FORMAT(Entry_Time, '%d-%m-%y') AS EntryDate,
         TIME(Entry_Time) AS EntryTime,
         DATE_FORMAT(Exit_Time, '%d-%m-%y') AS ExitDate,
         TIME(Exit_Time) AS ExitTime
      FROM vehicleaccessdetails
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
}

export async function GetVehicleEntryLogs(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT 
        Vehicle_ID,
        Plate_Nb,
        Session_ID,
       DATE_FORMAT(Entry_Time, '%d-%m-%y') AS EntryDate,
         TIME(Entry_Time) AS EntryTime,
         DATE_FORMAT(Exit_Time, '%d-%m-%y') AS ExitDate,
         TIME(Exit_Time) AS ExitTime
      FROM vehicleaccessdetails
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching entry logs:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
}

export async function GetVehicleExitLogs(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT 
        Vehicle_ID,
        Plate_Nb,
        Session_ID,
      DATE_FORMAT(Entry_Time, '%d-%m-%y') AS EntryDate,
         TIME(Entry_Time) AS EntryTime,
         DATE_FORMAT(Exit_Time, '%d-%m-%y') AS ExitDate,
         TIME(Exit_Time) AS ExitTime
      FROM vehicleaccessdetails
      WHERE Exit_Time IS NOT NULL
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching exit logs:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
}

export async function GetDashboardStats(req, res) {
  try {
    const [enteredToday] = await db.query(`
      SELECT COUNT(*) AS count 
      FROM vehicleaccesssession 
      WHERE DATE(Entry_Time) = CURDATE()
    `);

    const [exitedToday] = await db.query(`
      SELECT COUNT(*) AS count 
      FROM vehicleaccesssession 
      WHERE DATE(Exit_Time) = CURDATE()
    `);

    const [currentlyInside] = await db.query(`
      SELECT COUNT(*) AS count 
      FROM vehicleaccesssession 
      WHERE Exit_Time IS NULL
    `);

    res.json({
      enteredToday: enteredToday[0].count,
      exitedToday: exitedToday[0].count,
      currentlyInside: currentlyInside[0].count,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
}

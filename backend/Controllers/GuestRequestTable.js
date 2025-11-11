import db from "../database.js";

export async function GetGuestsRequests(req, res) {
  try {
    const [rows] = await db.query(
      "SELECT * FROM guestrequestvehicleview WHERE Status = 'approvedByManager' "
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
}

export async function DeclineRequest(req, res) {
  const { RequestId } = req.body;

  if (!RequestId) {
    return res.status(400).json({ msg: "Request ID is required" });
  }

  try {
    const [requestRows] = await db.query(
      "SELECT * FROM guestrequest WHERE RequestId = ?",
      [RequestId]
    );

    if (requestRows.length === 0) {
      return res.status(404).json({ msg: "Guest Request not found" });
    }

    await db.query(
      `UPDATE guestrequest SET Status = 'declined'  WHERE RequestId= ?`,
      [RequestId]
    );

    res.status(200).json({ msg: "Request denied by security" });
  } catch (error) {
    console.error("Error denying request", error);
    res.status(500).json({ msg: "Server error" });
  }
}

export async function AcceptRequest(req, res) {
  const { RequestId } = req.body;
  console.log(RequestId);

  if (!RequestId) {
    return res.status(400).json({ msg: "Request ID is required" });
  }

  try {
    const [requestRows] = await db.query(
      "SELECT Vehicle_ID FROM guestrequest WHERE RequestId = ?",
      [RequestId]
    );

    const { Vehicle_ID } = requestRows[0];
    if (requestRows.length === 0) {
      return res.status(404).json({ msg: "Guest Request not found" });
    }

    await db.query(
      `UPDATE guestrequest SET Status = 'approvedBySecurity'  WHERE RequestId= ?`,
      [RequestId]
    );

    await db.query(
      `INSERT INTO approved_vehicles (Vehicle_ID, GuestRequest_ID , Status) VALUES (?, ?, ?)`,
      [Vehicle_ID, RequestId, "enabled"]
    );

    res.status(200).json({ msg: "Request accepted by security" });
  } catch (error) {
    console.error("Error accepting request", error);
    res.status(500).json({ msg: "Server error" });
  }
}

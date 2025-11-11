import db from "../database.js";
import nodemailer from 'nodemailer';


export async function GetUniversityRequests(req, res) {
  try {
    const [rows] = await db.query(
      'SELECT * FROM uservehiclerequestview WHERE Status = "approvedByManager"'
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
}



export async function AcceptRequest(req, res) {
  const { Req_ID } = req.body;

  if (!Req_ID) {
    return res.status(400).json({ msg: "Request ID is required" });
  }

  try {


    const [requestRows] = await db.query(
      "SELECT Sender_ID,Manager_ID,Vehicle_ID FROM request WHERE Req_ID = ?",
      [Req_ID]
    );

    if (requestRows.length === 0) {
      return res.status(404).json({ msg: "Request not found" });
    }
    
    const { Sender_ID, Manager_ID, Vehicle_ID } = requestRows[0];
   

    await db.query(
      `INSERT INTO requesthistory (Req_ID ,Sender_ID, Manager_ID, Vehicle_ID, Status, Comment)
         VALUES ( ?,?, ?, ?, 'approvedBySecurity', NULL)`,
      [Req_ID,Sender_ID, Manager_ID, Vehicle_ID]
    );

    await db.query(
      `INSERT INTO approved_vehicles (Vehicle_ID ,Request_ID, GuestRequest_ID , Status)
        VALUES (?,?,NULL,'enabled')`,
      [Vehicle_ID,Req_ID]
    );

    
       await db.query(
      `UPDATE request SET Status = 'approvedBySecurity' WHERE Req_ID = ?`,
      [ Req_ID]
    );

 const [senderEmail] = await db.query(
      "SELECT Email FROM uservehiclerequestview WHERE Req_ID = ?",
      [Req_ID]
    );

    const { Email } = senderEmail[0];

res.status(200).json({
      msg: "Request approved by the military",
      email: Email
    });
  } catch (error) {
    console.error("Error inserting into history or updating request:", error);
    res.status(500).json({ msg: "Server error" });
  }
}

export async function DeclineRequest(req, res) {
  const { Req_ID } = req.body;

  if (!Req_ID) {
    return res.status(400).json({ msg: "Request ID is required" });
  }

  try {
 const [requestRows] = await db.query(
      "SELECT Sender_ID,Manager_ID,Vehicle_ID FROM request WHERE Req_ID = ?",
      [Req_ID]
    );

    if (requestRows.length === 0) {
      return res.status(404).json({ msg: "Request not found" });
    }
    console.log(requestRows[0]);
    const { Sender_ID, Manager_ID, Vehicle_ID } = requestRows[0];

    await db.query(
      `INSERT INTO requesthistory ( Req_ID ,Sender_ID, Manager_ID, Vehicle_ID, Status, Comment)
         VALUES (?,?, ?, ?, 'declined', NULL)`,
      [Req_ID,Sender_ID, Manager_ID, Vehicle_ID]
    );

      await db.query(
      `UPDATE request SET Status = 'declined' WHERE Req_ID = ?`,
      [ Req_ID]
    );

 const [senderEmail] = await db.query(
      "SELECT Email FROM uservehiclerequestview WHERE Req_ID = ?",
      [Req_ID]
    );

    const { Email } = senderEmail[0];

res.status(200).json({
      msg: "Request denied by the military",
      email: Email
    });
  } catch (error) {
    console.error("Error inserting into history or updating request:", error);
    res.status(500).json({ msg: "Server error" });
  }
}



export const  sendEmail = async(req,res)=> {
   const { to, subject, text } = req.body;
  console.log("Email Params →", { to, subject, text });
 let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.email,      // Replace with your Gmail address
      pass: process.env.App_Password // Use app password or real password
    },
    tls: {
    rejectUnauthorized: false, // Allow self-signed cert
  },
  });

 try {
    let info = await transporter.sendMail({
      from: `"Lebanese University Vehivcle Access " <${process.env.email}>`, // sender address
      to,
      subject,  // Subject line
      text      // plain text body
    });

    console.log('Message sent: %s', info.messageId);
    res.status(200).json({ message: 'Email sent', info });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send email' });
  }
 } 

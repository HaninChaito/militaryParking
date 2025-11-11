import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import RequestsTableRoute from "./Routes/RequestsTableRoute.js"
import GuestRequestTable from "./Routes/GuestRequestTableRoute.js"
import Logs from "./Routes/VehicleLogsRoutes.js"
import academicYearRoutes from "./Routes/AcademicYearRoute.js"

dotenv.config();



const app = express();
const PORT = process.env.PORT ;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5175", // Frontend URL
    credentials: true,
  })
);



app.use(express.json()); // Parse JSON bodies

app.use('/Requests' , RequestsTableRoute);
app.use('/GuestRequests' , GuestRequestTable);
app.use('/logs',Logs);
app.use('/api/academic-years', academicYearRoutes);



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

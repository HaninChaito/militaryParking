import express from "express";
import { GetDashboardStats, GetVehicleEntryLogs, GetVehicleExitLogs, GetVehicleLogs } from "../Controllers/VehicleLogs.js";


const router = express.Router();

router.get("/GetVehicleLogs" , GetVehicleLogs);
router.get("/GetEntryLogs" , GetVehicleEntryLogs);
router.get("/GetExitLogs",GetVehicleExitLogs);
router.get("/GetStats" , GetDashboardStats);


export default router;

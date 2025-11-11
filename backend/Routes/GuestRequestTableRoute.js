import express from "express";
import { AcceptRequest, DeclineRequest, GetGuestsRequests } from "../Controllers/GuestRequestTable.js";

const router = express.Router();

router.get("/GuestRequests", GetGuestsRequests);
router.post("/DeclineGuestRequest" , DeclineRequest);
router.post("/AcceptGuestRequest",AcceptRequest);




export default router;

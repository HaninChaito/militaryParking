import express from "express";
import { AcceptRequest, DeclineRequest, GetUniversityRequests, sendEmail } from "../Controllers/RequestsTable.js";

const router = express.Router();

router.get("/UniversityRequests", GetUniversityRequests);
router.post("/AcceptRequest", AcceptRequest);
router.post("/DeclineRequest",DeclineRequest);
router.post("/send-email", sendEmail);

export default router;

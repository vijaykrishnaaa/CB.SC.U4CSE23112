import { Router } from "express";
import { getPriorityNotifications } from "../controller/notificationController";

const router = Router();

router.get("/notifications", getPriorityNotifications);

export default router;
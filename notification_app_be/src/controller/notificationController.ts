import { Request, Response } from "express";
import { fetchAllNotifications, getTopN } from "../service/notificationService";
import { Log } from "../middleware/logger";

export async function getPriorityNotifications(req: Request, res: Response) {
    try {
        const n = parseInt(req.query.n as string) || 10;
        await Log("backend", "info", "controller", `Priority inbox requested for top ${n} notifications`);

        const all = await fetchAllNotifications();
        const top = getTopN(all, n);

        await Log("backend", "info", "controller", `Returning top ${top.length} priority notifications`);
        res.json({ count: top.length, notifications: top });
    } catch (err: any) {
        await Log("backend", "error", "controller", `Failed to fetch notifications: ${err.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}
import axios from "axios";
import { AUTH_TOKEN, BASE_URL } from "../config/auth";
import { Log } from "../middleware/logger";

export interface Notification {
    ID: string;
    Type: "Placement" | "Result" | "Event";
    Message: string;
    Timestamp: string;
}

const WEIGHT: Record<string, number> = {
    Placement: 3,
    Result: 2,
    Event: 1,
};

export async function fetchAllNotifications(): Promise<Notification[]> {
    await Log("backend", "info", "service", "Fetching all notifications from evaluation API");
    const res = await axios.get(`${BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
    });
    await Log("backend", "info", "service", `Fetched ${res.data.notifications.length} notifications`);
    return res.data.notifications;
}

export function getTopN(notifications: Notification[], n: number): Notification[] {
    return [...notifications]
        .sort((a, b) => {
            const weightDiff = WEIGHT[b.Type] - WEIGHT[a.Type];
            if (weightDiff !== 0) return weightDiff;
            return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
        })
        .slice(0, n);
}
import axios from "axios";

type Stack = "backend" | "frontend";
type Level = "debug" | "info" | "warn" | "error" | "fatal";
type Package =
    | "cache" | "controller" | "cron_job" | "db" | "domain"
    | "handler" | "repository" | "route" | "service"


const LOG_API_URL = "http://20.207.122.201/evaluation-service/logs";

let authToken: string = "";

export function initLogger(token: string): void {
    authToken = token;
}

export async function Log(
    stack: Stack,
    level: Level,
    pkg: Package,
    message: string
): Promise<void> {
    if (!authToken) {
        console.error("[Logger] Auth token not initialized. Call initLogger() first.");
        return;
    }

    try {
        const response = await axios.post(
            LOG_API_URL,
            {
                stack,
                level,
                package: pkg,
                message,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log(`[Logger] Log sent successfully | logID: ${(response.data as any).logID}`);
    } catch (error: any) {
        console.error("[Logger] Failed to send log:", error?.response?.data || error.message);
    }
}
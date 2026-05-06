import axios from "axios";

// Valid enum values as per Affordmed spec
type Stack = "backend" | "frontend";
type Level = "debug" | "info" | "warn" | "error" | "fatal";
type Package =
    | "cache" | "controller" | "cron_job" | "db" | "domain"
    | "handler" | "repository" | "route" | "service"   // backend only


const LOG_API_URL = "http://20.207.122.201/evaluation-service/logs";

let authToken: string = "";

// Call this once at app startup with your Bearer token
export function initLogger(token: string): void {
    authToken = token;
}

// The reusable Log function matching: Log(stack, level, package, message)
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

        console.log(`[Logger] Log sent successfully | logID: ${response.data.logID}`);
    } catch (error: any) {
        console.error("[Logger] Failed to send log:", error?.response?.data || error.message);
    }
}
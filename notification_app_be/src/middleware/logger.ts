import axios from "axios";
import { AUTH_TOKEN, BASE_URL } from "../config/auth";

type Stack = "backend" | "frontend";
type Level = "debug" | "info" | "warn" | "error" | "fatal";
type Pkg = "cache" | "controller" | "cron_job" | "db" | "domain" | "handler" | "repository" | "route" | "service" | "auth" | "config" | "middleware" | "utils";

export async function Log(stack: Stack, level: Level, pkg: Pkg, message: string) {
    try {
        await axios.post(
            `${BASE_URL}/logs`,
            { stack, level, package: pkg, message },
            { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } }
        );
    } catch (e: any) {
        console.error("[Logger Error]", e?.response?.data || e.message);
    }
}
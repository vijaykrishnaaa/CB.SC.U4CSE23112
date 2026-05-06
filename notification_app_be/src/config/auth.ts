import path from "path";
import fs from "fs";

const envPath = path.resolve(__dirname, "../../.env");
if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
        const [key, ...rest] = line.split("=");
        if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
    }
}

export const AUTH_TOKEN = process.env.AUTH_TOKEN || "";
export const BASE_URL = "http://20.207.122.201/evaluation-service";
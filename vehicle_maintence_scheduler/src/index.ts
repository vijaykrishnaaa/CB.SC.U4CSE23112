import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = "http://20.207.122.201/evaluation-service";
const TOKEN = process.env.AUTH_TOKEN || "";
const headers = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

interface Depot { ID: number; MechanicHours: number; }
interface Vehicle { TaskID: string; Duration: number; Impact: number; }

async function fetchDepots(): Promise<Depot[]> {
    const res = await axios.get(`${BASE_URL}/depots`, { headers });
    return res.data.depots;
}

async function fetchVehicles(): Promise<Vehicle[]> {
    const res = await axios.get(`${BASE_URL}/vehicles`, { headers });
    return res.data.vehicles;
}

function knapsack(vehicles: Vehicle[], capacity: number) {
    const n = vehicles.length;
    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        const { Duration, Impact } = vehicles[i - 1];
        for (let w = 0; w <= capacity; w++) {
            dp[i][w] = dp[i - 1][w];
            if (w >= Duration) {
                dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - Duration] + Impact);
            }
        }
    }

    const selected: Vehicle[] = [];
    let w = capacity;
    for (let i = n; i >= 1; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
            selected.push(vehicles[i - 1]);
            w -= vehicles[i - 1].Duration;
        }
    }

    const totalDuration = capacity - w;
    return { selected, totalImpact: dp[n][capacity], totalDuration };
}

async function main() {
    console.log("Fetching depots and vehicles...\n");
    const [depots, vehicles] = await Promise.all([fetchDepots(), fetchVehicles()]);
    console.log(`Total Depots: ${depots.length}`);
    console.log(`Total Vehicles/Tasks: ${vehicles.length}\n`);

    for (const depot of depots) {
        console.log(`\n===== Depot ${depot.ID} | Budget: ${depot.MechanicHours} hours =====`);
        const result = knapsack(vehicles, depot.MechanicHours);
        console.log(`Optimal Total Impact : ${result.totalImpact}`);
        console.log(`Total Hours Used     : ${result.totalDuration} / ${depot.MechanicHours}`);
        console.log(`Tasks Selected       : ${result.selected.length}`);
        result.selected.forEach(v => {
            console.log(`  - TaskID: ${v.TaskID} | Duration: ${v.Duration}h | Impact: ${v.Impact}`);
        });
    }
}

main().catch(console.error);
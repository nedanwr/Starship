import "dotenv/config";
import { Starship } from "./struct/Client";
import { loadEvents } from "./utils/loadEvents";
import { loadCommands } from "./utils/loadCommands";
import { startUptimeCounter } from "./uptime";

const client: Starship = new Starship({
    token: process.env.TOKEN!,
    prefix: process.env.PREFIX!
});

// Load Events
loadEvents(client);

// Load Commands
loadCommands(client);

// Start uptime counter once ready
client.once("ready", () => {
    startUptimeCounter();
});

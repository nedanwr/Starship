import "dotenv/config";
import { Starship } from "./struct/Client";
import { loadEvents } from "./utils/loadEvents";
import { loadCommands } from "./utils/loadCommands";

const client:Starship = new Starship({
    token: process.env.TOKEN!,
    prefix: process.env.PREFIX!,
});

// Load Events
loadEvents(client);

// Load Commands
loadCommands(client);
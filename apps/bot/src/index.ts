import "dotenv/config";
import { Starship } from "./struct/Client";

// @ts-ignore
const client:Starship = new Starship({
    token: process.env.TOKEN!,
    prefix: process.env.PREFIX!,
});
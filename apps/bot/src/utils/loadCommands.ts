import { Starship } from "../struct/Client";
import { readdirSync } from "fs";
import { join } from "path";
import { logger } from "../logger";

// If in prod, use .js else .ts
const ENV_MODE_FILE_EXT: string =
    process.env.NODE_ENV === "production" ? ".js" : ".ts";

export const loadCommands = (client: Starship) => {
    // Read categories
    readdirSync(join(__dirname, "../commands")).forEach((dir) => {
        // Read commands from categories
        const commandFiles = readdirSync(
            join(__dirname, "../commands", dir)
        ).filter((file) => file.endsWith(ENV_MODE_FILE_EXT));
        for (const file of commandFiles) {
            const command = require(`../commands/${dir}/${file}`);
            if (command.default.trigger) {
                client.commands.set(command.default.trigger, command.default);
            }
            logger.info(`[${dir}] ${file.split(".").shift()} command loaded`);
        }
    });
};

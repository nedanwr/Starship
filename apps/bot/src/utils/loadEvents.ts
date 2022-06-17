import { Starship } from "../struct/Client";
import { readdirSync } from "fs";
import { join } from "path";
import { logger } from "../logger";

// If in prod, use .js else .ts
const ENV_MODE_FILE_EXT: string =
    process.env.NODE_ENV === "production" ? ".js" : ".ts";

export const loadEvents = (client: Starship) => {
    const eventFiles = readdirSync(join(__dirname, "../events")).filter(
        (file) => file.endsWith(ENV_MODE_FILE_EXT)
    );
    for (const file of eventFiles) {
        const event = require(`../events/${file}`);
        const eventName: string | undefined = file.split(".").shift();
        client.on(eventName!, event.bind(null, client));
        delete require.cache[require.resolve(`../events/${file}`)];
        logger.info(`${eventName} event loaded`);
    }
};

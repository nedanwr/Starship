import { Starship } from "../struct/Client";
import { logger } from "../logger";

module.exports = async (client: Starship) => {
    // Log when bot is ready
    logger.info(`${client.user?.username} is ready for lift-off!`);

    // Set startup presence
    try {
        void client.user?.setPresence({
            status: "online",
            activities: [
                {
                    name: "The Stars!",
                    type: "WATCHING"
                }
            ]
        });
    } catch (err: any | unknown) {
        logger.error(`Failed to set startup presence: ${err.message}`);
    }
};

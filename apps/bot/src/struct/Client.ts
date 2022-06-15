import { Client, Collection, Intents } from "discord.js";
import { logger } from "../logger";

type ClientOptions = {
    token: string,
    prefix: string,
}

export class Starship extends Client {
    public prefix: string;
    commands = new Collection<string, any>();
    events = new Collection<string, any>();

    public constructor(options: ClientOptions) {
        super({
            partials: ["USER", "MESSAGE", "CHANNEL", "GUILD_MEMBER", "REACTION"],
            // Disable mentions by default
            allowedMentions: {
                parse: [],
                users: [],
                roles: [],
                repliedUser: false,
            },
            // Intents
            intents: [
                // Privileged Intents
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_MESSAGE_TYPING,

                // Regular Intents
                Intents.FLAGS.DIRECT_MESSAGES,
                Intents.FLAGS.GUILD_BANS,
                Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
                Intents.FLAGS.GUILD_INVITES,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_VOICE_STATES,
            ],
        });
        this.prefix = options.prefix;
        this.commands = new Collection();
        this.login(options.token)
            .catch((err: any | unknown) => {
                logger.error(err.message);
                process.exit(1);
            });
    }
}
import "dotenv/config";
import { Client, Intents } from "discord.js";

const client:Client = new Client({
    partials: ["USER", "MESSAGE", "CHANNEL", "GUILD_MEMBER", "REACTION"],

    restGlobalRateLimit: 50,

    // Disable mentions by default
    allowedMentions: {
        parse: [],
        users: [],
        roles: [],
        repliedUser: false,
    },
    intents: [
        // Privileged
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,

        // Regular
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ],
});
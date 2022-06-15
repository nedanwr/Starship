import {
    Client,
    DiscordAPIError,
    MessageEmbedOptions
} from "discord.js";

// https://discord.com/developers/docs/reference#snowflakes
export const MIN_SNOWFLAKE: 135169 = 0b000000000000000000000000000000000000000000_00001_00001_000000000001;
// 0b111111111111111111111111111111111111111111_11111_11111_111111111111 without _ which BigInt doesn't support
export const MAX_SNOWFLAKE: bigint = BigInt("0b1111111111111111111111111111111111111111111111111111111111111111");

const snowflakePattern: RegExp = /^[1-9]\d+$/;
export const isValidSnowflake = (str: string) => {
    if (!str.match(snowflakePattern)) return false;
    if (parseInt(str, 10) < MIN_SNOWFLAKE) return false;
    if (BigInt(str) > MAX_SNOWFLAKE) return false;
    return true;
}

export const DISCORD_HTTP_ERROR_NAME = "DiscordHTTPError";

export const isDiscordHTTPError = (err: Error | string) => {
    return typeof err === "object" && err.constructor?.name === DISCORD_HTTP_ERROR_NAME;
}

export const isDiscordAPIError = (err: Error | string): err is DiscordAPIError => {
    return err instanceof DiscordAPIError;
}

export type EmbedWith<T extends keyof MessageEmbedOptions> = MessageEmbedOptions &
    Pick<Required<MessageEmbedOptions>, T>;

export const resolveUserId = (bot: Client, value: string) => {
    if (value === null) {
        return null;
    }

    // If value is a user ID, return it
    if (isValidSnowflake(value)) {
        return value;
    }

    // If value is a user mention, return the user ID
    const mentionMatch = value.match(/^<@!?(\d+)>$/);
    if (mentionMatch) {
        return mentionMatch[1];
    }

    // If value is a full username, return the user ID
    const usernameMatch = value.match(/^@?([^#]+)#(\d{4})$/);
    if (usernameMatch) {
        const user = bot.users.cache.find((u) => u.username === usernameMatch[1] && u.discriminator === usernameMatch[2]);
        if (user) {
            return user.id;
        }
    }

    return null;
};
import {
    Client,
    DiscordAPIError,
    Guild,
    GuildMember,
    Message,
    MessageEmbedOptions,
    MessageMentionOptions,
    MessageOptions,
    Snowflake,
    TextChannel,
    User
} from "discord.js";
import { logger } from "./logger";

// https://discord.com/developers/docs/reference#snowflakes
export const MIN_SNOWFLAKE: 135169 = 0b000000000000000000000000000000000000000000_00001_00001_000000000001;
// 0b111111111111111111111111111111111111111111_11111_11111_111111111111 without _ which BigInt doesn't support
export const MAX_SNOWFLAKE: bigint = BigInt(
    "0b1111111111111111111111111111111111111111111111111111111111111111"
);

const snowflakePattern: RegExp = /^[1-9]\d+$/;
export const isValidSnowflake = (str: string) => {
    if (!str.match(snowflakePattern)) return false;
    if (parseInt(str, 10) < MIN_SNOWFLAKE) return false;
    if (BigInt(str) > MAX_SNOWFLAKE) return false;
    return true;
};

export const DISCORD_HTTP_ERROR_NAME = "DiscordHTTPError";

export const isDiscordHTTPError = (err: Error | string) => {
    return (
        typeof err === "object" &&
        err.constructor?.name === DISCORD_HTTP_ERROR_NAME
    );
};

export const isDiscordAPIError = (
    err: Error | string
): err is DiscordAPIError => {
    return err instanceof DiscordAPIError;
};

export type EmbedWith<T extends keyof MessageEmbedOptions> =
    MessageEmbedOptions & Pick<Required<MessageEmbedOptions>, T>;

export const successMessage = (str: string, emoji: string = "✔️") => {
    return emoji ? `${emoji} ${str}` : str;
};

export const errorMessage = (str: string, emoji: string = "⚠") => {
    return emoji ? `${emoji} ${str}` : str;
};

export const sendSuccessMessage = (
    channel: TextChannel,
    body: string,
    allowedMentions?: MessageMentionOptions
): Promise<Message | undefined> => {
    const formattedBody: string = successMessage(body);
    const content: MessageOptions = allowedMentions
        ? { content: formattedBody, allowedMentions }
        : { content: formattedBody };

    return channel.send({ ...content }).catch((err: any | unknown) => {
        const channelInfo = channel.guild
            ? `${channel.id} (${channel.guild.id})`
            : channel.id;
        logger.warn(
            `Failed to send message to channel ${channelInfo}: ${err.code} ${err.message}`
        );
        return undefined;
    });
};

export const sendErrorMessage = (
    channel: TextChannel,
    body: string,
    allowedMentions?: MessageMentionOptions
): Promise<Message | undefined> => {
    const formattedBody: string = errorMessage(body);
    const content: MessageOptions = allowedMentions
        ? { content: formattedBody, allowedMentions }
        : { content: formattedBody };

    return channel.send({ ...content }).catch((err: any | unknown) => {
        const channelInfo = channel.guild
            ? `${channel.id} (${channel.guild.id})`
            : channel.id;
        logger.warn(
            `Failed to send message to channel ${channelInfo}: ${err.code} ${err.message}`
        );
        return undefined;
    });
};

export const isOwner = (userId: string) => {
    const owner = process.env.OWNER_ID;

    if (!owner) {
        return;
    }

    return owner.includes(userId);
};

const unknownMembers = new Set();

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
        const user = bot.users.cache.find(
            (u: User) =>
                u.username === usernameMatch[1] &&
                u.discriminator === usernameMatch[2]
        );
        if (user) {
            return user.id;
        }
    }

    return null;
};

/**
 * Resolves a guild member from passed user id.
 * If the member is not found in cache, it's fetched from the API.
 */
export const resolveMember = async (
    bot: Client,
    guild: Guild,
    value: string,
    fresh: boolean = false
): Promise<GuildMember | null> => {
    const userId: string | null = resolveUserId(bot, value);
    if (!userId) return null;

    // If the member is in the cache, return it
    if (guild.members.cache.has(userId as Snowflake) && !fresh) {
        return guild.members.cache.get(userId as Snowflake) || null;
    }

    // Cache user as unknown instead of making multiple unknown user requests
    const unknownKey: string = `${guild.id}-${userId}`;
    if (unknownMembers.has(unknownKey)) {
        return null;
    }

    const freshMember: GuildMember = await guild.members.fetch({
        user: userId as Snowflake,
        force: true
    });
    if (freshMember) {
        return freshMember;
    }

    unknownMembers.add(unknownKey);
    setTimeout(() => unknownMembers.delete(unknownKey), 15 * 1000);

    return null;
};

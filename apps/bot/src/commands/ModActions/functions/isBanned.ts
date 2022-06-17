import {
    Client,
    Guild,
    GuildMember,
    Message,
    Permissions,
    Snowflake,
    TextChannel
} from "discord.js";
import {
    isDiscordAPIError,
    isDiscordHTTPError,
    SECONDS,
    sendErrorMessage,
    sleep
} from "../../../utils";
import { hasDiscordPermissions } from "../../../utils/hasDiscordPermissions";

export const isBanned = async (
    client: Client,
    guild: Guild,
    msg: Message,
    userId: string,
    timeout: number = 5 * SECONDS,
): Promise<boolean> => {
    const botMember: GuildMember = guild.members.cache.get(client.user!.id);
    if (botMember && !hasDiscordPermissions(botMember.permissions, Permissions.FLAGS.BAN_MEMBERS)) {
        await sendErrorMessage(msg.channel as TextChannel, "Missing `Ban Members` permission to check for existing bans");
        return false;
    }

    try {
        const potentialBan = await Promise.race([
            guild.bans.fetch({
                user: userId as Snowflake
            })
                .catch(() => null),
            sleep(timeout),
        ]);
        return potentialBan != null;
    }
    catch (err: any | unknown) {
        // Unknown ban
        if (isDiscordAPIError(err) && err.code === 10026) {
            return false;
        }

        // Internal server error
        if (isDiscordHTTPError(err) && err.code === 500) {
            return false;
        }

        if (isDiscordAPIError(err)) {
            await sendErrorMessage(msg.channel as TextChannel, "Missing `Ban Members` permission to check for existing bans");
        }

        throw err;
    }
}
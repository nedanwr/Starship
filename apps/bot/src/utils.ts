import {
    DiscordAPIError,
    MessageEmbedOptions
} from "discord.js";

export const DISCORD_HTTP_ERROR_NAME = "DiscordHTTPError";

export const isDiscordHTTPError = (err: Error | string) => {
    return typeof err === "object" && err.constructor?.name === DISCORD_HTTP_ERROR_NAME;
}

export const isDiscordAPIError = (err: Error | string): err is DiscordAPIError => {
    return err instanceof DiscordAPIError;
}

export type EmbedWith<T extends keyof MessageEmbedOptions> = MessageEmbedOptions &
    Pick<Required<MessageEmbedOptions>, T>
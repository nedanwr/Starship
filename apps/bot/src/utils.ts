import { MessageEmbedOptions } from "discord.js";

export type EmbedWith<T extends keyof MessageEmbedOptions> = MessageEmbedOptions &
    Pick<Required<MessageEmbedOptions>, T>
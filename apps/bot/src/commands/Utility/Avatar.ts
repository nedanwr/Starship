import { Client, Message, User, MessageEmbedOptions } from "discord.js";

export default {
    trigger: "avatar",
    description: "Retrieves a user's profile picture",
    permission: "can_avatar",
    aliases: "av",

    async run(client: Client, msg: Message, args: string[]) {
        const user: Client | User = await client.users.fetch(args[0]) || msg.author;
        const embed: MessageEmbedOptions = {
            image: {
                url: user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }),
            },
            title: `Avatar of ${user.tag}:`,
        };
        msg.channel.send({ embeds: [embed] });
    }
}
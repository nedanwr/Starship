import {
    Client,
    Message,
    TextChannel
} from "discord.js";
import { prisma } from "@prisma";
import { sendErrorMessage, sendSuccessMessage } from "../../utils";

export default {
    trigger: "removeserver",
    description: "Removes a server from the list of allowed servers",
    aliases: ["disallow_server", "disallowserver", "remove_server"],

    async run(client: Client, msg: Message, args: string[]) {
        if (msg.author.id !== process.env.OWNER_ID) {
            return sendErrorMessage(msg.channel as TextChannel, "You are not the owner of this bot");
        }

        const exists = await prisma.allowedGuilds.findFirst({
            where: {
                id: parseInt(args[0]),
            }
        });
        if (!exists) {
            return sendErrorMessage(msg.channel as TextChannel, "The server is not allowed in the first place!");
        }

        await prisma.allowedGuilds.delete({
            where: {
                id: parseInt(args[0]),
            }
        })
            .finally(() => {
                prisma.$disconnect();
            });
        await client.guilds.cache.get(args[0])?.leave();
        await sendSuccessMessage(msg.channel as TextChannel, "Server removed from the list of allowed servers!");
    }
}
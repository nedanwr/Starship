import {
    Client,
    Guild,
    Message,
    TextChannel
} from "discord.js";
import { prisma } from "@prisma";
import { sendErrorMessage, sendSuccessMessage } from "../../utils";

export default {
    trigger: "addserver",
    description: "Add a server to the list of allowed servers",
    aliases: ["allow_server", "allow_server", "add_server"],

    async run(client: Client, msg: Message, args: string[]) {
        const exists = await prisma.allowedGuilds.findFirst({
            where: {
                id: parseInt(args[0]),
            }
        });
        if (exists) {
            return sendErrorMessage(msg.channel as TextChannel, "Server is already allowed");
        }

        await client.guilds.fetch(args[0]).then(async (guild: Guild) => {
            await prisma.allowedGuilds.create({
                data: {
                    id: parseInt(guild.id),
                    name: guild.name,
                    icon: guild.iconURL(),
                    owner_id: parseInt(guild.ownerId),
                }
            });

            await sendSuccessMessage(msg.channel as TextChannel, "Server allowed to use Starship");
        });
    }
}
import { Message, Role } from "discord.js";
import { getRoleInfoEmbed } from "./functions/getRoleInfoEmbed";

export default {
    trigger: "roleinfo",
    description: "Show information about a role",
    permission: "can_roleinfo",

    async run(message: Message, args: string[]) {
        const role: Role | undefined = message.guild?.roles.cache.get(args[0]);
        const embed = await getRoleInfoEmbed(role);
        message.channel.send({ embeds: [embed] });
    }
}
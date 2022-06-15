import { Starship } from "../struct/Client";
import { Message } from "discord.js";
import { logger } from "../logger";

module.exports = async (client:Starship, message:Message) => {
    if (!message.content.startsWith(client.prefix) || message.author.bot) return;
    const args: string[] = message.content.slice(client.prefix.length).trim().split(/ +/g);
    const commandName: string | undefined = args.shift()?.toLowerCase();
    const command = client.commands.get(commandName!) || client.commands.find((cmd: { aliases: (string | undefined)[]; }) => cmd.aliases && cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    try {
        command.run(message, args);
    }
    catch (err: any | unknown) {
        logger.error(`Error executing command ${command.name}`, err.message);
    }

}
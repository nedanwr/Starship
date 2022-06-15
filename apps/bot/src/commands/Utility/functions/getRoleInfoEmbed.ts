import { MessageEmbedOptions, Role } from "discord.js";
import humanizeDuration from "humanize-duration";
import moment, { Moment } from "moment-timezone";
import { EmbedWith } from "../../../utils";

export const getRoleInfoEmbed = async (
    role: Role | undefined,
    // requestMemberId?: string,
): Promise<MessageEmbedOptions> => {
    const embed: EmbedWith<"fields"> = {
        fields: [],
    }

    embed.author = {
        name: `Role: ${role?.name}`,
        icon_url: role?.guild?.iconURL()!,
    }

    embed.color = role?.color;

    const createdAt: Moment = moment.utc(role?.createdAt, "x");
    const roleAge: string = humanizeDuration(Date.now() - role?.createdTimestamp!, {
        largest: 2,
        round: true,
    });

    const totalGuildRoles: number = role?.guild.roles.cache.size! -1;

    embed.fields.push({
        name: "Role Information",
        value: `
            Name: **${role?.name}**
            ID: \`${role?.id}\`
            Created: **${roleAge} ago (\`${createdAt}\`)**
            Position: **${role?.position} / ${totalGuildRoles}**
            Color: **${role?.color.toString(16).toUpperCase().padStart(6, "0")}**
            Mentionable: **${role?.mentionable ? "Yes" : "No"}**
            Hoisted: **${role?.hoist ? "Yes" : "No"}**
            Mention: <@&${role?.id}> (\`<@&${role?.id}>\`)
        `
    });

    return embed;
}
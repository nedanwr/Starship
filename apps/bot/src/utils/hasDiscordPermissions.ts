import { Permissions } from "discord.js";

export const hasDiscordPermissions = (
    resolvedPermissions: Permissions | Readonly<Permissions> | null,
    requiredPermissions: number | bigint
) => {
    if (resolvedPermissions === null) {
        return false;
    }

    if (resolvedPermissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        return true;
    }

    const nRequiredPermissions = BigInt(requiredPermissions);
    return Boolean((resolvedPermissions?.bitfield & nRequiredPermissions) === nRequiredPermissions);
}
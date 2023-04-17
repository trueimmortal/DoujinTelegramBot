import { updateSettings } from "../../backend/settings.requests.ts";
import { Composer } from "../../libs/deps.ts";
import { BotContext } from "../../bot/types.ts";

const composer = new Composer<BotContext>();

/**
 * Add a group to the whitelist
 */
composer.command("addGroup", async (ctx) => {
    if (ctx.from?.id !== ctx.config.ownerId) {
        ctx.reply("Only the owner can use this command.");
        return;
    }
    const groupId = Number.parseInt(ctx.match);
    if (Number.isNaN(groupId)) {
        ctx.reply("Send me a valid group id!");
        return;
    }
    if (ctx.config.whitelistGroups.includes(groupId)) {
        ctx.reply("Group already in whitelist!");
        return;
    }
    ctx.config.whitelistGroups.push(groupId);
    ctx.reply("Group added to whitelist!");
    await updateSettings(ctx.config);
});

/**
 * Remove a group from the whitelist
 */
composer.command("removeGroup", async (ctx) => {
    if (ctx.from?.id !== ctx.config.ownerId) {
        ctx.reply("Only the owner can use this command.");
        return;
    }
    const groupId = Number.parseInt(ctx.match);
    if (Number.isNaN(groupId)) {
        ctx.reply("Send me a valid group id!");
        return;
    }
    if (ctx.config.whitelistGroups.includes(groupId)) {
        ctx.config.whitelistGroups = ctx.config.whitelistGroups.filter(
            (id) => id !== groupId
        );
        ctx.reply("Group removed from whitelist!");
        await updateSettings(ctx.config);
        return;
    }
    ctx.reply("Group not in whitelist!");
});

export default composer;

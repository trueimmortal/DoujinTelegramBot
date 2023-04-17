import { updateSettings } from "../../backend/settings.requests.ts";
import { Composer } from "../../libs/deps.ts";
import { BotContext } from "../../bot/types.ts";

const composer = new Composer<BotContext>();

/**
 * Add a user to the whitelist
 */
composer.command("addUser", async (ctx) => {
    if (ctx.from?.id !== ctx.config.ownerId) {
        ctx.reply("Only the owner can use this command.");
        return;
    }
    const userId = Number.parseInt(ctx.match);
    if (Number.isNaN(userId)) {
        ctx.reply("Send me a valid user id!");
        return;
    }
    if (ctx.config.whitelistUsers.includes(userId)) {
        ctx.reply("User already in whitelist!");
        return;
    }
    ctx.config.whitelistUsers.push(userId);
    ctx.reply("User added to whitelist!");
    await updateSettings(ctx.config);
});

/**
 * Remove a user from the whitelist
 */
composer.command("removeUser", async (ctx) => {
    if (ctx.from?.id !== ctx.config.ownerId) {
        ctx.reply("Only the owner can use this command.");
        return;
    }
    const userId = Number.parseInt(ctx.match);
    if (Number.isNaN(userId)) {
        ctx.reply("Send me a valid user id!");
        return;
    }
    if (userId === ctx.config.ownerId) {
        ctx.reply("You can't remove the owner!");
        return;
    }
    if (ctx.config.whitelistUsers.includes(userId)) {
        ctx.config.whitelistUsers = ctx.config.whitelistUsers.filter(
            (id) => id !== userId
        );
        ctx.reply("User removed from whitelist!");
        await updateSettings(ctx.config);
        return;
    }
    ctx.reply("User not in whitelist!");
});

export default composer;

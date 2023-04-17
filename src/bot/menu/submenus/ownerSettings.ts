import { updateSettings } from "../../../backend/settings.requests.ts";
import { MenuTemplate, createBackMainMenuButtons } from "../../../libs/deps.ts";
import { BotContext } from "../../../bot/types.ts";

const subMenuOwnerSettings = new MenuTemplate<BotContext>(
    (_) => `Please choose an option : `
);

subMenuOwnerSettings.interact("🫵 Set yourself as owner", "setCurrentOwner", {
    do: async (ctx) => {
        if (ctx.config.ownerId != 0) {
            await ctx.reply(
                "Ownership is already set, revoke it before continuing..."
            );
            return false;
        }
        ctx.config.ownerId = ctx.from?.id!;
        await ctx.reply("You are now set as the owner.");
        await updateSettings(ctx.config);

        return "..";
    },
});
subMenuOwnerSettings.interact("⛔️ Revoke ownership", "revokeCurrentOwner", {
    joinLastRow: true,
    do: async (ctx) => {
        if (ctx.config.ownerId === 0) {
            await ctx.reply("The bot already has no owner...");
            return false;
        }
        ctx.config.ownerId = 0;
        await ctx.reply("You are no longer the bot owner.");
        await updateSettings(ctx.config);
        return "..";
    },
});
subMenuOwnerSettings.manualRow(createBackMainMenuButtons());

export default subMenuOwnerSettings;

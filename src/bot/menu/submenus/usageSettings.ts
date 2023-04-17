import { MenuTemplate, createBackMainMenuButtons } from "../../../libs/deps.ts";
import { BotContext } from "../../../bot/types.ts";

const subMenuUsageSettings = new MenuTemplate<BotContext>(
    (_) => `Bot usage configuration :`
);

subMenuUsageSettings.interact("📂 Max n# of files", "maxFilesSettings", {
    do: async (ctx) => {
        await ctx.reply(
            `Current max number of files is ${ctx.config.maxFiles}.`
        );
        await ctx.reply("Send the new max files number", {
            reply_markup: {
                force_reply: true,
            },
        });
        return true;
    },
});
subMenuUsageSettings.interact("📅 Max daily usage", "maxDailyUse", {
    joinLastRow: true,
    do: async (ctx) => {
        await ctx.reply(
            `Current max daily usage for non whitelisted users is ${ctx.config.maxDailyUse}.`
        );
        await ctx.reply("Send the new max daily use number", {
            reply_markup: {
                force_reply: true,
            },
        });
        return true;
    },
});
subMenuUsageSettings.interact("✅ Whitelisted users", "allowedUsersSettings", {
    do: async (ctx) => {
        const users = ctx.config.whitelistUsers.map((user) => {
            return `User id : ${user}`;
        });
        await ctx.reply(
            "Here are the users that can use the bot without limit :"
        );
        users.length === 0
            ? await ctx.reply("No users are whitelisted.")
            : await ctx.reply(users.join("\n"));
        await ctx.reply(
            "Use the /addUser command to add a user to the whitelist and the /removeUser command to remove a user from the whitelist."
        );
        return true;
    },
});
subMenuUsageSettings.interact("💬 Whitelisted groups", "allowedGroupsSettings", {
    joinLastRow: true,
    do: async (ctx) => {
        // make a list of all the groups the bot is in as a string
        const groups = ctx.config.whitelistGroups.map((group) => {
            return `Group id : ${group}`;
        });
        await ctx.reply("Here are the groups the bot is allowed in :");
        groups.length === 0
            ? await ctx.reply("No groups are whitelisted.")
            : await ctx.reply(groups.join("\n"));
        await ctx.reply(
            "Use the /addGroup command to add a group to the whitelist and the /removeGroup command to remove a group from the whitelist."
        );
        return true;
    },
});
subMenuUsageSettings.manualRow(createBackMainMenuButtons());

export default subMenuUsageSettings;

import { MenuTemplate, createBackMainMenuButtons } from "../../../libs/deps.ts";
import { BotContext } from "../../../bot/types.ts";

const subMenuCookiesSettings = new MenuTemplate<BotContext>(
    (_) => `🍪 Select a source to set cookies for :`
);

subMenuCookiesSettings.interact(" Exhentai", "ExCookies", {
    do: async (ctx) => {
        await ctx.reply("Please send the exhentai cookies string : ", {
            reply_markup: {
                force_reply: true,
            },
        });
        return false;
    },
});
subMenuCookiesSettings.manualRow(createBackMainMenuButtons());

export default subMenuCookiesSettings;

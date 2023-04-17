import { VERSION } from "../../libs/constants.ts";
import { Composer } from "../../libs/deps.ts";
import { BotContext } from "../../bot/types.ts";

const composer = new Composer<BotContext>();

/** Handle the /info command. */
composer.command("info", async (ctx) => {
    await ctx.reply(
        `This bot is made by @trueimmortal.\n` +
            `*Version* : ${VERSION}\n` +
            `Email : TelegramBotContact@proton.me\n` +
            `Max files : ${ctx.config.maxFiles}\n` +
            `Max daily use : ${ctx.config.maxDailyUse}\n`,
        { parse_mode: "Markdown", disable_web_page_preview: true }
    );
});

export default composer;

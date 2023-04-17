import { createLog } from "../../backend/logs.requests.ts";
import { updateSettings } from "../../backend/settings.requests.ts";
import { LogLevel } from "../../backend/types.ts";
import { Composer } from "../../libs/deps.ts";
import { BotContext } from "../../bot/types.ts";
import {
    settingsFilter,
    settingsMenuMiddleware,
} from "../menu/SettingsMenu.ts";

const composer = new Composer<BotContext>();

composer.filter(settingsFilter).on("msg", async (ctx) => {
    switch (true) {
        case ctx.msg.reply_to_message!.text?.includes("exhentai cookie"):
            const cookie = ctx.msg.text;
            if (cookie) {
                ctx.config.cookies["Exhentai"] = cookie;
                await createLog(
                    LogLevel.Info,
                    `Exhentai cookie updated by @${ctx.from?.username}`
                );
                await ctx.reply("Exhentai cookie updated!");
                await updateSettings(ctx.config);
            } else {
                await ctx.reply("Invalid cookie!");
            }
            return;
        case ctx.msg.reply_to_message!.text?.includes("max files"):
            const maxFiles = Number.parseInt(ctx.msg.text!);
            if (Number.isNaN(maxFiles)) {
                await ctx.reply("Invalid number!");
            } else {
                ctx.config.maxFiles = maxFiles;
                await createLog(
                    LogLevel.Info,
                    `Max files updated by @${ctx.from?.username}`
                );
                await ctx.reply("Max files updated!");
                await updateSettings(ctx.config);
            }
            return;
        case ctx.msg.reply_to_message!.text?.includes("max daily"):
            const maxDaily = Number.parseInt(ctx.msg.text!);
            if (Number.isNaN(maxDaily)) {
                await ctx.reply("Invalid number!");
            } else {
                ctx.config.maxDailyUse = maxDaily;
                await createLog(
                    LogLevel.Info,
                    `Max daily use updated by @${ctx.from?.username}`
                );
                await ctx.reply("Max daily use updated!");
                await updateSettings(ctx.config);
            }
            return;
        default:
            ctx.reply("no clue");
    }
});

composer.command(
    "settings", //@ts-ignore
    async (ctx) => await settingsMenuMiddleware.replyToContext(ctx)
);

export default composer;

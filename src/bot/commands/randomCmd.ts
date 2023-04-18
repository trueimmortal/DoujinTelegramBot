import { getRandDoujin } from "../../backend/doujins.requests.ts";
import { getUser, updateDailyUsage } from "../../backend/users.requests.ts";
import { ERROR_GIF } from "../../libs/constants.ts";
import { Composer, InputFile } from "../../libs/deps.ts";
import {
    InvalidTagFormatError,
    NoDoujinFoundError,
    NoExhentaiCookieError,
} from "../../libs/errors.ts";
import { BotContext } from "../../bot/types.ts";
import { validateTags } from "../../libs/utils.ts";
import { sendDoujin, sendLoadingAnim } from "../utils.ts";
import { removeJobFromQueue } from "../middlewares/jobQueue.ts";

const composer = new Composer<BotContext>();

// // /** Handle the /random command. */
composer.command("random", async (ctx) => {
    await getUser(ctx.from);
    const loadingMessage = await sendLoadingAnim(ctx);
    try {
        if (!validateTags(ctx.match)) {
            await ctx.api.deleteMessage(
                loadingMessage.chat.id,
                loadingMessage.message_id
            );
            await ctx.replyWithPhoto(new InputFile("./assets/taginfo.png"), {
                caption:
                    "Wrong tag format!, please refer to the image above for more info",
            });
        }
        const doujin = await getRandDoujin(ctx.match);
        await updateDailyUsage(ctx.from);
        await sendDoujin(ctx, doujin, loadingMessage);
        removeJobFromQueue(ctx.from?.id!);
    } catch (error) {
        if (error instanceof InvalidTagFormatError) {
        } else if (error instanceof NoDoujinFoundError) {
            await ctx.api.deleteMessage(
                loadingMessage.chat.id,
                loadingMessage.message_id
            );
            await ctx.replyWithAnimation(ERROR_GIF, {
                caption: `No results found with the tags ${ctx.match}`,
            });
        } else if (error instanceof NoExhentaiCookieError) {
            await ctx.api.deleteMessage(
                loadingMessage.chat.id,
                loadingMessage.message_id
            );
            await ctx.replyWithAnimation(ERROR_GIF, {
                caption: "Bad exhentai cookies!",
            });
        } else {
            throw new Error(error.message);
        }
        removeJobFromQueue(ctx.from?.id!);
    }
});

export default composer;

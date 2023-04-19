import { fetchDoujin } from "../../backend/doujins.requests.ts";
import { updateDailyUsage, getUser } from "../../backend/users.requests.ts";
import { LOG_LEVELS, ERROR_GIF } from "../../libs/constants.ts";
import { Composer } from "../../libs/deps.ts";
import {
    NoResultsError,
    NoExhentaiCookieError,
    BadRequestError,
} from "../../libs/errors.ts";
import { BotContext } from "../../bot/types.ts";
import { verifyUrl } from "../../libs/utils.ts";
import { sendLoadingAnim, sendDoujin } from "../utils.ts";
import { removeJobFromQueue } from "../middlewares/jobQueue.ts";

const composer = new Composer<BotContext>();

/** Handle the /fetch command. */
composer.command("fetch", async (ctx) => {
    await getUser(ctx.from);
    if (verifyUrl(ctx.match)) {
        const loadingMessage = await sendLoadingAnim(ctx);
        try {
            await updateDailyUsage(ctx.from);
            const doujin = await fetchDoujin(ctx.match);
            await sendDoujin(ctx, doujin, loadingMessage);
            removeJobFromQueue(ctx.from?.id!);
        } catch (error) {
            console.error(LOG_LEVELS.ERROR, error.message);
            if (error instanceof NoResultsError) {
                await ctx.api.deleteMessage(
                    loadingMessage.chat.id,
                    loadingMessage.message_id
                );
                await ctx.replyWithAnimation(ERROR_GIF, {
                    caption: "No results found at that URL!",
                });
            } else if (error instanceof NoExhentaiCookieError) {
                await ctx.api.deleteMessage(
                    loadingMessage.chat.id,
                    loadingMessage.message_id
                );
                await ctx.replyWithAnimation(ERROR_GIF, {
                    caption: error.caption,
                });
            } else if (error instanceof BadRequestError) {
                await ctx.api.deleteMessage(
                    loadingMessage.chat.id,
                    loadingMessage.message_id
                );
                await ctx.replyWithAnimation(ERROR_GIF, {
                    caption: "That url is not valid!",
                });
            }else{
                await ctx.api.deleteMessage(
                    loadingMessage.chat.id,
                    loadingMessage.message_id
                );
                await ctx.replyWithAnimation(ERROR_GIF, {
                    caption: `An error occured : ${error.message} `,
                });
            }
            removeJobFromQueue(ctx.from?.id!);
        }
    } else {
        await ctx.reply("Please pass a valid E-Hentai or ExHentai url!");
    }
});

export default composer;

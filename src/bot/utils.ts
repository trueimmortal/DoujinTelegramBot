import { getDoujin, getDoujinZip } from "../backend/doujins.requests.ts";
import { createLog } from "../backend/logs.requests.ts";
import { Doujin, LogLevel } from "../backend/types.ts";
import { addDoujin } from "../backend/users.requests.ts";
import {
    LOG_LEVELS,
    TELEGRAPH_AUTHOR_URL,
    TELEGRAPH_USERNAME,
} from "../libs/constants.ts";
import {
    GrammyError,
    InlineKeyboard,
    InputFile,
    Message,
} from "../libs/deps.ts";
import { BotContext } from "../bot/types.ts";

/**
 * Sends the doujin to the chat
 * @param ctx : The context of the message
 * @param doujin : The doujin to be sent
 * @param loadingMessage : The loading message to be deleted
 */
const sendDoujin = async (
    ctx: BotContext,
    doujin: Doujin,
    loadingMessage: Message.AnimationMessage
): Promise<void> => {
    const { maxFiles } = ctx.config;
    let inlineKeyboard;
    if (ctx.chat!.type === "private") {
        inlineKeyboard = new InlineKeyboard()
            .text("Post images", `post ${doujin.doujinId}`)
            .text("Zip", `zip ${doujin.doujinId}`)
            .row()
            .text("Dismiss", "none");
    } else {
        inlineKeyboard = new InlineKeyboard();
    }
    if (doujin.fileCount > maxFiles) {
        await ctx.reply(
            `This doujin has more files than the maximum allowed ${maxFiles}, only the first ${maxFiles} will be posted/uploaded`
        );
    }
    const message = doujinMessage(doujin);
    await ctx.api.deleteMessage(
        loadingMessage.chat.id,
        loadingMessage.message_id
    );
    await ctx.reply(message, {
        reply_markup: inlineKeyboard,
        parse_mode: "HTML",
    });
    await addDoujin(ctx.from, parseInt(doujin.doujinId));
};

/**
 * Send the loading animation to the chat
 * @param ctx : The context of the message
 * @returns The loading message
 */
const sendLoadingAnim = async (
    ctx: BotContext
): Promise<Message.AnimationMessage> => {
    const { loadingMessages, loadingGifs } = ctx.config;
    const randomGif =
        loadingGifs[Math.floor(Math.random() * loadingGifs.length)];
    const randomMessage =
        loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    return await ctx.api.sendAnimation(ctx.chat!.id, randomGif, {
        caption: randomMessage,
    });
};

/**
 * Post the gallery to the chat
 * @param ctx : The context of the message
 * @param doujinId : The id of the doujin to be posted
 */
const postingGallery = async (
    ctx: BotContext,
    doujinId: string
): Promise<void> => {
    const doujin = (await getDoujin(doujinId)) as Doujin;

    // send images in batches of 10
    const imageUrls = doujin.imageUrls;
    const imageBatches = [];
    while (imageUrls.length > 0) {
        imageBatches.push(imageUrls.splice(0, 10));
    }
    // if 429 error, wait 15 second and try again
    while (imageBatches.length > 0) {
        try {
            await ctx.replyWithMediaGroup(
                imageBatches[0].map((url) => ({ type: "photo", media: url }))
            );
            imageBatches.shift();
            await new Promise((r) => setTimeout(r, 3500));
        } catch (error) {
            if (error instanceof GrammyError) {
                if (error.error_code == 429) {
                    createLog(
                        LogLevel.Info,
                        "(BOT) 429 error, waiting 15 seconds"
                    );
                    console.log(
                        LOG_LEVELS.INFO,
                        "429 error, waiting 15 seconds"
                    );
                    await new Promise((r) => setTimeout(r, 15000));
                }
            }
        }
    }
};

/**
 * Post the zip file to the chat
 * @param ctx : The context of the message
 * @param doujinId the id of the doujin to be zipped
 */
const postingZip = async (ctx: BotContext, doujinId: string) => {
    const doujin = (await getDoujin(doujinId)) as Doujin;
    const zipfile = await getDoujinZip(doujin.id!);
    await ctx.replyWithDocument(
        new InputFile(zipfile, `${doujin.doujinId}.zip`)
    );
};

/**
 * Returns a string reprensenting the doujin for a message
 * @param doujin : Doujin
 * @returns The string for the message
 */
const doujinMessage = (doujin: Doujin): string => {
    const postedDate = new Date(doujin.posted * 1000).toLocaleDateString(
        "en-US"
    );
    return (
        `<strong>Title :</strong> \n<a href="${doujin.telegraphUrl}">${doujin.title}</a>` +
        `\n<strong>Category :</strong> \n#${doujin.category}\n` +
        `<strong>Posted :</strong> \n${postedDate}\n` +
        `<strong>Pages :</strong> \n${doujin.fileCount}\n` +
        `<strong>Rating :</strong> \n${doujin.rating} 🌟\n` +
        `<strong>Tags :</strong> \n${doujin.tags.join(" ")}\n` +
        `<strong>Link :</strong> \n<a href="${doujin.url}">Exhentai</a>\n` +
        `<strong>Channel :</strong> \n<a href="${TELEGRAPH_AUTHOR_URL}">${TELEGRAPH_USERNAME}</a>`
    );
};

export { sendDoujin, sendLoadingAnim, postingGallery, postingZip };

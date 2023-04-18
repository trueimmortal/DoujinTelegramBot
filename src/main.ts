import { createLog } from "./backend/logs.requests.ts";
import { getSettings, updateSettings } from "./backend/settings.requests.ts";
import { LogLevel } from "./backend/types.ts";
import { newUser } from "./backend/users.requests.ts";
import { ERROR_GIF, LOG_LEVELS } from "./libs/constants.ts";
import { Bot, run } from "./libs/deps.ts";
import { BotError } from "./libs/errors.ts";
import { settingsMenuMiddleware } from "./bot/menu/SettingsMenu.ts";
import {
    checkDailyUsageMiddleware,
    protectCommandsMiddleware,
} from "./bot/middlewares/index.ts";
import {
    addRemoveGroupCmd,
    statsCmd,
    addRemoveUserCmd,
    randomCmd,
    settingsCmd,
    fetchCmd,
    infoCmd,
} from "./bot/commands/index.ts";
import { BotContext } from "./bot/types.ts";
import { postingGallery, postingZip } from "./bot/utils.ts";

const bot = new Bot<BotContext>(Deno.env.get("TELEGRAM_BOT_TOKEN_TEST")!);

let settings = await getSettings();

bot.use(async (ctx, next) => {
    ctx.config = settings;
    ctx.middleWares = {
        dailyLimitMw: true,
        allowedGroupsMw: true,
    };
    await next();
});

// @ts-ignore
bot.use(settingsMenuMiddleware);
bot.use(protectCommandsMiddleware);
bot.use(checkDailyUsageMiddleware);
// Commands
bot.use(addRemoveGroupCmd);
bot.use(addRemoveUserCmd);
bot.use(settingsCmd);
bot.use(randomCmd);
bot.use(fetchCmd);
bot.use(statsCmd);
bot.use(infoCmd);

/** Handle the /start command. */
bot.command("start", async (ctx) => {
    if (ctx.config.ownerId === 0) {
        ctx.reply(
            "This is the first start of the bot! You will be set as the owner of the bot."
        );
        ctx.config.ownerId = ctx.from?.id!;
        await updateSettings(ctx.config);
        await createLog(
            LogLevel.Info,
            `The owner of the bot is now @${ctx.from?.username}`
        );
    }
    await ctx.replyWithAnimation(
        "https://i.pinimg.com/originals/e5/ac/48/e5ac4837d9f8623076f51aadb9997df9.gif",
        {
            caption: `Hello there! *@${ctx.from?.username}*,\nI am a bot that can get you doujins from Ex-Hentai and E-hentai.\n*There is a ${ctx.config.maxDailyUse} doujins a day limit!* `,
            parse_mode: "Markdown",
        }
    );
    await newUser(ctx.from);
});

/** Handle the callback queries */
bot.on("callback_query:data", async (ctx) => {
    if (ctx.callbackQuery.data == "none") {
        await ctx.answerCallbackQuery("Dismissing...");
        await ctx.editMessageReplyMarkup({});
    } else if (ctx.callbackQuery.data.includes("post")) {
        await ctx.answerCallbackQuery("Posting gallery...");
        const doujinId = ctx.callbackQuery.data.split(" ")[1];
        await postingGallery(ctx, doujinId);
        await ctx.editMessageReplyMarkup({});
    } else if (ctx.callbackQuery.data.includes("zip")) {
        await ctx.answerCallbackQuery("Posting zip file...");
        const doujinId = ctx.callbackQuery.data.split(" ")[1];
        await postingZip(ctx, doujinId);
        await ctx.editMessageReplyMarkup({});
    }
});

/** Error handler */
bot.catch(async (err) => {
    const ctx = err.ctx;
    console.error(
        LOG_LEVELS.ERROR,
        `Error while handling update ${ctx.update.update_id}: ${err}`
    );
    // deno-lint-ignore no-explicit-any
    const e: any = err.error;

    if (e instanceof BotError) {
        createLog(LogLevel.Error, `(BOT) ${e.name}: ${e.message}`);
        await ctx.replyWithAnimation(ERROR_GIF, {
            caption:
                e.caption ||
                "Something went wrong! If this keeps happening please contact @trueimmortal",
        });
    } else {
        createLog(LogLevel.Error, `(BOT) ${err.name}: ${err.message}`);
        await ctx.replyWithAnimation(ERROR_GIF, {
            caption:
                "Something went wrong! If this keeps happening please contact @trueimmortal",
        });
    }
});

const handle = run(bot, {
    runner: {
        fetch: {
            allowed_updates: [
                "chat_member",
                "callback_query",
                "message",
                "my_chat_member",
            ],
        },
    },
});

Deno.addSignalListener("SIGINT", () => {
    handle.stop();
});
Deno.addSignalListener("SIGTERM", () => handle.stop());

handle.task()?.then(() => console.log("Bot done running"));

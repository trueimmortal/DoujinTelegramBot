import { createLog } from "./backend/logs.requests.ts";
import { getSettings, updateSettings } from "./backend/settings.requests.ts";
import { LogLevel } from "./backend/types.ts";
import { newUser } from "./backend/users.requests.ts";
import { ERROR_GIF, LOG_LEVELS } from "./libs/constants.ts";
import { Bot, run } from "./libs/deps.ts";
import { BotError } from "./libs/errors.ts";
import { settingsMenuMiddleware } from "./bot/menu/SettingsMenu.ts";
import {
allowedGroupsCheck,
    checkDailyUsage,
    jobQueueMiddleware,
    onlyUsersInGroups,
    protectCommands,
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
import { removeJobFromQueue } from "./bot/middlewares/jobQueue.ts";

const bot = new Bot<BotContext>(Deno.env.get("TELEGRAM_BOT_TOKEN")!);
let settings = await getSettings();
bot.use(async (ctx, next) => {
    ctx.config = settings;
    await next();
});

// @ts-ignore
bot.use(settingsMenuMiddleware);
// Middlewares, order matters.
bot.use(allowedGroupsCheck); // Check if the group that added the bot is in the allowed groups list.
bot.use(onlyUsersInGroups) // Check if the user is in a group that is allowed to use the bot.
bot.use(protectCommands); // Protect the settings command from non-owners.
bot.use(checkDailyUsage); // Check if the user has reached the daily limit.
bot.use(jobQueueMiddleware)
// Commands, I wouldn't remove the settings, settings related commands.
bot.use(addRemoveGroupCmd); // Add/remove group command
bot.use(addRemoveUserCmd); // Add/remove user command
bot.use(settingsCmd); // Settings command

// These you can remove the ones you don't want.
bot.use(randomCmd); // Random command
bot.use(fetchCmd); // Fetch command
bot.use(statsCmd); // Stats command
bot.use(infoCmd); // Info command

bot.api.setMyCommands([
    {command:"start",description:"▶️ Start the bot."},
    {command:"info",description:"ℹ️ Get info on the bot."},
    {command:"stats",description: "📊 Get your user stats."},
    {command:"fetch",description:"🔎 Fetch a doujin with it's url."},
    {command:"random", description:"🎲 Get a random doujin by optionaly giving tags."},
    {command:"settings",description:"🛠️ Set the bot settings."}
])

/** Handle the /start command. */
bot.command("start", async (ctx) => {
    if (ctx.config.ownerId === 0) {
        ctx.reply(
            "This is the first start of the bot! You will be set as the owner of the bot."
        );
        ctx.config.ownerId = ctx.from?.id!;
        ctx.config.whitelistUsers.push(ctx.from?.id!);
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
    removeJobFromQueue(ctx.from?.id!);
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

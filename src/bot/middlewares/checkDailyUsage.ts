import { checkDailyUsage } from "../../backend/users.requests.ts";
import { DAILY_LIMIT_REACHED_GIF } from "../../libs/constants.ts";
import { NextFunction } from "../../libs/deps.ts";
import { BotContext } from "../../bot/types.ts";

/**
 * This middleware checks the daily usage of a user and if it exceeds the max daily usage it will block the user from using the bot. (except if the user is whitelisted)
 * By default the commands "fetch" and "random" are limited.
 * @param ctx The bot context
 * @param next  The next function
 */
const CheckUserWhitelist = async (ctx: BotContext, next: NextFunction) => {
    if (ctx.from?.id && !ctx.from.is_bot) {
        const commands = ctx.msg?.entities?.filter(
            (entity) => entity.type === "bot_command"
        );
        if (commands) {
            const limitedCommands = ["fetch", "random"];
            if (
                !ctx.config.whitelistUsers.includes(ctx.from?.id) &&
                limitedCommands.includes(
                    ctx.msg?.text?.slice(
                        commands[0].offset + 1,
                        commands[0].offset + commands[0].length
                    )!
                )
            ) {
                if (await checkDailyUsage(ctx.from)) {
                    await ctx.replyWithAnimation(DAILY_LIMIT_REACHED_GIF, {
                        caption:
                            ctx.from.username != undefined
                                ? `Daily limit reached for @${ctx.from?.username}! Wait 24H...`
                                : "Daily limit reached! Wait 24H...",
                    });
                    return;
                }
            }
        }
    }
    await next();
};

export default CheckUserWhitelist;

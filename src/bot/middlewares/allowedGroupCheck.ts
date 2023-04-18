import { NextFunction } from "../../libs/deps.ts";
import { BotContext } from "../types.ts";

/**
 * This middleware is used to check whether the group is allowed to use the bot or not. (Whitelist). If the whitelist is empty then all groups are allowed.
 * @param ctx The bot context
 * @param next The next function
 */
const allowedGroupsCheck = async (ctx : BotContext, next : NextFunction) =>{
    if(ctx.config.whitelistGroups.length > 0)
    {
        if(ctx.chat?.type !== "private" && !ctx.config.whitelistGroups.includes(ctx.chat?.id!) && ctx.message?.new_chat_members)
        {
            await ctx.reply("This group is not allowed to use this bot!");
            await ctx.leaveChat();
            return;
        }
    }
    await next();
}

export default allowedGroupsCheck;
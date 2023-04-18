import { NextFunction } from "../../libs/deps.ts";
import { BotContext } from "../types.ts";


/**
 * This middleware is used to check whether the user is in the group or not and prevent that user from using the bot if he is not in the group.
 * @warning To use this middleware the bot must be an admin in the group and the group id must be inside the whitelist for groups.
 * @param ctx The context of the message
 * @param next The next function
 */
const onlyUsersInGroup = async (ctx: BotContext, next: NextFunction) => {
    if(ctx.chat?.type === "private" && ctx.config.whitelistGroups.length > 0 && !ctx.config.whitelistUsers.includes(ctx.from?.id!)) {
        let chatMember;
        for (const group of ctx.config.whitelistGroups) {
            try {
                chatMember = await ctx.api.getChatMember(group, ctx.from?.id!);
            } catch (err : any) {
            }
        }
        if (!chatMember) {
            await ctx.reply("You aren't allowed to use this bot!");
            return;
        }
    }
    await next();
};

export default onlyUsersInGroup;
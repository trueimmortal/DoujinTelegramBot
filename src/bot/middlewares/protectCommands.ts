import { NextFunction } from "../../libs/deps.ts";
import { BotContext } from "../../bot/types.ts";

/**
 * This middleware protects some commands from being used by non-owners by default the commands are:
 * addGroup, removeGroup, addUser, removeUser, settings
 * @param ctx The bot context
 * @param next The next function
 */
const protectCommands = async (ctx: BotContext, next: NextFunction) => {
    const protectedCommands = [
        "addGroup",
        "removeGroup",
        "addUser",
        "removeUser",
        "settings",
    ];
    const commands = ctx.msg?.entities?.filter(
        (entity) => entity.type === "bot_command"
    );
    if (commands) {
        for (const command of commands) {
            const commandName = ctx.msg?.text?.slice(
                command.offset + 1,
                command.offset + command.length
            );
            if (protectedCommands.includes(commandName!)) {
                if (ctx.from?.id !== ctx.config.ownerId) {
                    ctx.reply("Only the owner can use this command.");
                    return;
                }
            }
        }
    }
    await next();
};

export default protectCommands;

import { NextFunction } from "../../libs/deps.ts";
import { BotContext } from "../types.ts";



const jobQueue = new Map<number, number>();



const jobQueueMiddleware = async (ctx : BotContext, next : NextFunction) =>{
   
   // only random and fetch commands are queued
   if(!ctx.message?.from.is_bot && ctx.message?.from.id)
   {
        const queuableCommands = ["random", "fetch"];
        const commands = ctx.message?.entities?.filter(
            (entity) => entity.type === "bot_command"
        );
        if (commands && commands.length > 0) {
            const commandName = ctx.message?.text?.slice(
                commands[0].offset + 1,
                commands[0].offset + commands[0].length
            );
            if (queuableCommands.includes(commandName!)) {
                if (jobQueue.has(ctx.message?.from.id)) {
                    ctx.reply("You already have a job in the queue!");
                    return;
                }
                jobQueue.set(ctx.message?.from.id, ctx.message?.message_id);
            }
        }
   }
    await next();
}

export default jobQueueMiddleware;

export const removeJobFromQueue = (userId : number) =>{
    jobQueue.delete(userId);
}
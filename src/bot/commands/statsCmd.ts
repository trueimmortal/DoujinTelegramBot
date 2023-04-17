import { getUser } from "../../backend/users.requests.ts";
import { Composer } from "../../libs/deps.ts";
import { BotContext } from "../../bot/types.ts";

const composer = new Composer<BotContext>();

composer.command("stats", async (ctx) => {
    const user = await getUser(ctx.from);
    ctx.reply(
        `Stats for @${user.username}\n\n` +
            `Total doujins fetched : *${user.doujins.length}*\n` +
            `Total times this bot was used : *${user.usage}*\n` +
            `Daily usage for ${new Date(user.dailyUseDate).toDateString()} : *${
                user.dailyUse
            }*`,
        { parse_mode: "Markdown" }
    );
});

export default composer;

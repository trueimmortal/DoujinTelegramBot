import { Settings } from "../backend/types.ts";
import { Context } from "../libs/deps.ts";

export type BotContext = Context & {
    config: Settings;
    middleWares: {
        dailyLimitMw: boolean;
        allowedGroupsMw: boolean;
    };
};


export type GrammyUser = BotContext["from"]


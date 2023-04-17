import { MenuTemplate, MenuMiddleware, createBackMainMenuButtons, deleteMenuFromContext } from "../../libs/deps.ts";
import { BotContext } from "../../bot/types.ts";
import subMenuCookiesSettings from "./submenus/cookiesSettings.ts";
import subMenuOwnerSettings from "./submenus/ownerSettings.ts";
import subMenuUsageSettings from "./submenus/usageSettings.ts";

export const settingsMenu = new MenuTemplate<BotContext>(
    (_) => `🛠️ Settings Menu`
);

/**
 * Filters messages that are replies to bot messages (used for settings menu)
 * @param ctx The bot context
 * @returns  true if the message is a reply to a bot message, false otherwise.
 */
export const settingsFilter = async (ctx: BotContext) => {
    if (ctx.msg?.reply_to_message?.from?.is_bot) {
        return true;
    }
    return false;
};

settingsMenu.chooseIntoSubmenu(
    "ownerSettings",
    ["🔒 Owner settings"],
    subMenuOwnerSettings
);
settingsMenu.chooseIntoSubmenu(
    "cookiesSettings",
    ["🍪 Cookies settings"],
    subMenuCookiesSettings
);
settingsMenu.chooseIntoSubmenu(
    "usageSettings",
    ["🤖 Usage settings"],
    subMenuUsageSettings
);

settingsMenu.interact("❌ Exit", "exit", {
    do: async context => {
        // @ts-ignore
        await deleteMenuFromContext(context);
        return false;
    },
}) 

/**
 * The settings menu middleware
 */
// @ts-ignore // For some reason typescript is not able to infer the types correctly for middleware.
export const settingsMenuMiddleware = new MenuMiddleware("/", settingsMenu);

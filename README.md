# Telegram Bot

This telegram bot that requests doujins or random doujins from [exhentai](https://exhentai.org/) or [e-hentai](https://e-hentai.org). This bot is useless without it's API.

This bot was made for personal use to avoid copy pasting entire galleries into telegram. For the moment it only handles ExHentai/E-Hentai galleries, but I might add support for other sites in the future as I have built the backend with that in mind.

## Features

- [x] Get random doujin w/ tags or without
- [x] Get doujin by URL
- [x] Send doujin as a zip file
- [x] Send doujin as a telegraph page
- [x] Send doujin as a telegram album
- [x] Customizable settings via the /settings command
- [x] Whitelist users (No rate limit for whitelisted users)
- [x] Whitelisted groups (Only whitelisted groups can use the bot)

## Dependencies

if you want to run this bot outside of docker, you need to install the following dependencies (UNIX/Linux, windows user use [WSL](https://learn.microsoft.com/en-us/windows/wsl/install)):

- [deno](https://deno.land/)

## Settings

To change the settings, you can either use raw API calls or the bot. To change the settings via the bot use the `/settings` command. This will show you the current settings and allow you to modify them. Follow the instructions, this feature was added in a hurry so it might be a bit confusing.

**NOTE**: To manage allowed groups and whitelisted users, you will need their IDs, groups usually starts with a `-`.

## Advanced settings/configuration

The bot was remade to be more modular and allow for more customization. You can tweak what the bot is able to do by removing or adding middlewares. By default, I use all of them, but I encourage you to take out the ones you don't need. The commands can also be poped in and out of the bot with a single line.

### Middlewares

- **`allowedGroupsCheck`** - This middleware checks if the group that added the bot is allowed to do so, what determines this is the `whitelistGroups` setting. The bot will leave the group if it is not allowed.

- **`onlyUsersInGroups`** - This middleware checks if the user is in the group that added the bot. If the user is not in the group, the bot will not allow the user to execute the commands. This ofcourse doesn't apply to whitelisted users (see `whitelistUsers` setting).

- **`protectCommands`** - This middleware protects commands that shouldn't be touched by non-owners. By default : `/settings`,`/addGroup`,`/removeGroup`,`/addUser` and `/removeUser` are protected. You can add/remove commands if you desire. Inside the middleware there's an array of commands you can tweak.

```ts
const protectedCommands = [
        "addGroup",
        "removeGroup",
        "addUser",
        "removeUser",
        "settings",
    ];
```

- **`checkDailyUsage`** - This middleware checks if the user has reached the daily usage limit. The daily usage limit is set in the `maxDailyUse` setting. If the user has reached the limit, the bot will not allow the user to execute the commands (by default only `/fetch` & `/random`). Doesn't apply to whitelisted users (see `whitelistUsers` setting). In this case you can also add/remove commands (inside the middleware).

```ts
const limitedCommands = ["fetch", "random"];
```

## Commands

These are the commands you can use with the bot.

- `/start` - start the bot 
- `/info` - show info about the bot
- `/random` - get random doujin
- `/fetch` - get doujin by URL
- `/stats` - show usage stats
- `/settings` - show settings
- `/addGroup` - add group to whitelist EX : `/addGroup -123456789`
- `/removeGroup` - remove group from whitelist EX : `/removeGroup -123456789`
- `/addUser` - add user to whitelist EX : `/addUser 123456789`
- `/removeUser` - remove user from whitelist EX : `/removeUser 123456789`

*Note: You can also remove the commands you don't need from the bot, in the `main.ts` file I have anoted the commands you can remove.

## Random command

The random command will get a random doujin from [exhentai](https://exhentai.org/) or [e-hentai](https://e-hentai.org) and send it to you. You can also specify tags to get a random doujin with those tags.

### Examples random

`/random` - get random doujin

`/random #tag1 #tag_2` - get random doujin with tags `tag1` and `tag_2` (use `_` instead of spaces and `#` before the tag)

`/random #tag1 #tag_2 (#tag3)` - get random doujin with tags `tag1` and `tag_2` but without `tag3` (the tags in brackets are excluded)

## Fetch command

The fetch command will get a doujin from [exhentai](https://exhentai.org/) or [e-hentai](https://e-hentai.org) from the URL you provide and send it to you.

### Examples fetch

`/fetch https://exhentai.org/g/1234567/84fe951716` - get doujin with URL `https://exhentai.org/g/1234567/84fe951716`

## Docker

You can run this bot in docker. You need to have [docker](https://www.docker.com/).

```bash
docker build -t telegram-bot .
docker run -d --name telegram-bot telegram-bot
```

## Run

You can run this bot outside of docker. You need to have [deno](https://deno.land/) installed. You need to have a .env file in the src folder with the environment variables (see below).

```bash
cd src
deno run --allow-env --allow-write --allow-read --allow-net main.ts
```

## Environment variables

These are the environment variables you need to set either in the .env file inside the src folder or in the docker-compose.yml file from the parent directory.

- `TELEGRAM_BOT_TOKEN` - telegram bot token
- `API_KEY` - api key for the API
- `API_BASE_URL` - base url for the API (if not using docker/docker-compose)

## Disclaimer

This code comes with no warranty, use at your own risk. I am not responsible for any damage caused by this code (not that it would do anything bad, but still).

This code is provided as is, without any support. If you have any questions, feel free to open an issue.

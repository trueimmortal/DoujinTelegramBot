/**
 * Represent a doujin in the collection Doujins
 */
type Doujin = {
    id?: string;
    doujinId: string;
    rating: string;
    url: string;
    posted: number;
    category: string;
    title: string;
    fileCount: number;
    fileName: string;
    imageUrls: Array<string>;
    thumbnail: string;
    telegraphUrl: string;
    tags: Array<string>;
    source: Source;
};

/**
 * Represent a user in the collection Users
 */
type User = {
    id?: string;
    name: {
        first: string | undefined;
        last: string | undefined;
    };
    userId: number;
    username: string | undefined;
    doujins: Array<number>;
    favorites: Array<number>;
    usage: number;
    dailyUse: number;
    dailyUseDate: Date;
};

/**
 * Represent the settings for the bot.
 */
type Settings = {
    id?: string;
    name: "settings";
    ownerId: number;
    whitelistUsers: Array<number>;
    whitelistGroups: Array<number>;
    loadingMessages: Array<string>;
    loadingGifs: Array<string>;
    maxFiles: number;
    maxDailyUse: number;
    allowedCommandsGroups: {
        [key: string]: Array<string>;
    };
    cookies: {
        [key: string]: string;
    };
};

/*
 * The stats for the bot
 * */
type Stats = {
    id?: string;
    name: string;
    tags: Tags;
    usePerSource: Record<Source, number>;
    totalUse: number;
    randomUse: number;
    fetchUse: number;
};

/**
 * Represent a log in the collection Logs
 * @field timestamp : is unix timestamp
 */
type Log = {
    id?: string;
    level: LogLevel;
    message: string;
    timestamp: number;
};

/**
 * A doujin's source
 */
enum Source {
    Exhentai,
}

/**
 * Represent the doujinshi tags in the collection Doujins
 */
type Tags = {
    positive: Record<string, number>;
    negative: Record<string, number>;
};

/*
 * Log Levels
 * */
enum LogLevel {
    NotSet,
    Debug,
    Info,
    Warning,
    Error,
    Critical,
    None,
}

/**
 * Represent an error from the api
 */
type ApiError = {
    type?: string;
    title: string;
    status: number;
    detail?: string;
    traceId?: string;
    instance?: string;
    errors?: {
        [key: string]: Array<string>;
    };
};

export { Source, LogLevel };

export type { Doujin, User, Tags, Log, ApiError, Settings, Stats };

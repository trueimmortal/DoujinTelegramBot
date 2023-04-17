/**
 * Base class for all errors thrown by the bot
 */
export class BotError extends Error {
    caption?: string;
    doujin_id?: string;
    constructor(message: string, caption?: string, doujin_id?: string) {
        super(message);
        this.caption = caption;
        this.doujin_id = doujin_id;
        this.name = "BotError";
    }
}

/**
 * Error thrown when the url is good but there is no results
 */
export class NoResultsError extends BotError {
    constructor(message: string) {
        super(message);
        this.name = "NoResultsError";
        this.caption = "No results found!";
    }
}
/**
 * Error thrown when the url passed validation but is malformed
 */
export class BadRequestError extends BotError {
    constructor(message: string) {
        super(message);
        this.name = "BadRequestError";
        this.caption =
            "There was an error with your request to the ExHentai/E-hentai API";
    }
}

export class NoExhentaiCookieError extends BotError {
    constructor(message: string) {
        super(message);
        this.name = "NoExhentaiCookieError";
        this.caption =
            "Please set your exhentai cookie with the /settings command!";
    }
}

/**
 * Error thrown when a image url is bad
 */
export class BadImageUrlError extends BotError {
    constructor(message: string) {
        super(message);
        this.name = "BadImageUrlError";
        this.caption =
            "There was an error with one of the image url. Please try again later";
    }
}
/**
 * Error thrown when a doujin is not found on ExHentai with the given tags
 */
export class NoDoujinFoundError extends BotError {
    constructor(message: string) {
        super(message);
        this.name = "NoDoujinFoundError";
        this.caption = "No doujin found with the given tags.";
    }
}
/**
 * Error thrown when the given tags are not valid
 */
export class InvalidTagFormatError extends BotError {
    tags: string;
    constructor(message: string, tags: string) {
        super(message);
        this.name = "InvalidTagFormatError";
        this.caption = "Invalid tag format. ";
        this.tags = tags;
    }
}
/**
 * Error thrown when an error occurs whilst fetching the gallery urls
 */
export class GalleryUrlsFetchError extends BotError {
    constructor(message: string) {
        super(message);
        this.name = "GalleryUrlsFetchError";
        this.caption =
            "There was an error while fetching the gallery urls. Please try again later";
    }
}
/**
 * Error thrown when an image or multiple images cannot be downloaded
 */
export class ImageDownloadError extends BotError {
    constructor(message: string) {
        super(message);
        this.name = "ImageDownloadError";
        this.caption =
            "There was an error while downloading the images. Please try again later";
    }
}

/**
 * Error thrown when the doujin couldn't be posted to telegraph
 */
export class TelegraphPostError extends BotError {
    constructor(message: string) {
        super(message);
        this.name = "TelegraphPostError";
        this.caption =
            "There was an error while posting the doujin to telegraph. Please try again later";
    }
}

/**
 * Error thrown when an error occurs whilst creating the user
 */
export class UserCreationError extends BotError {
    constructor(message: string) {
        super(message);
        this.name = "UserCreationError";
        this.caption =
            "There was an error while creating your account. Please try again later";
    }
}

/**
 * Error thrown when an error occurs whilst updating the user
 */
export class UserUpdateError extends BotError {
    userId: number;

    constructor(message: string, userId: number) {
        super(message);
        this.name = "UserUpdateError";
        this.caption =
            "There was an error while updating your account. Please try again later";
        this.userId = userId;
    }
}

/**
 * Error thrown when an error occurs whilst  deleting the user
 */
export class UserDeleteError extends BotError {
    userId: number;

    constructor(message: string, userId: number) {
        super(message);
        this.name = "UserDeleteError";
        this.caption =
            "There was an error while deleting your account. Please try again later";
        this.userId = userId;
    }
}

/**
 * Error thrown when an error occurs whilst finding the user
 */
export class UserNotFoundError extends BotError {
    userId: number;

    constructor(message: string, userId: number) {
        super(message);
        this.name = "UserNotFoundError";
        this.caption =
            "There was an error while finding your account. Please try again later";
        this.userId = userId;
    }
}

/**
 * Error thrown when an error occurs whilst fetching the settings
 */
export class FetchSettingsError extends BotError {
    constructor(message: string) {
        super(message);
        this.name = "FetchSettingsError";
        this.caption =
            "There was an error while fetching the settings. Please try again later";
    }
}

/**
 * Error thrown when an error occurs when saving the doujin to the database
 */
export class DoujinDatabaseSaveError extends BotError {
    doujin_id: string;
    caption: string;

    constructor(message: string, doujin_id: string) {
        super(message);
        this.name = "DoujinDatabaseSaveError";
        this.caption =
            "There was an error while saving the doujin to the database. Please try again later";
        this.doujin_id = doujin_id;
    }
}

/**
 * Error thrown when zip file creation fails
 */
export class ZipError extends BotError {
    doujin_id: string;
    constructor(message: string, doujin_id: string) {
        super(message);
        this.name = "ZipError";
        this.doujin_id = doujin_id;
        this.caption =
            "There was an error while creating the zip file. Please try again later";
    }
}

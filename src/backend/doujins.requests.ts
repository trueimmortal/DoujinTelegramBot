import { API_REQUEST_HEADERS, API_URL, LOG_LEVELS } from "../libs/constants.ts";
import type { ApiError, Doujin } from "./types.ts";
import {
    BadRequestError,
    NoDoujinFoundError,
    NoExhentaiCookieError,
    NoResultsError,
} from "../libs/errors.ts";

/**
 * Get doujin by id
 * @param {number} id - Doujin id
 * @returns A doujin if found.
 */
const getDoujin = async (id: string): Promise<Doujin> => {
    const res = await fetch(`${API_URL}/doujins/doujinId/${id}`, {
        headers: API_REQUEST_HEADERS,
    });
    if (res.status != 200) {
        console.error(LOG_LEVELS.ERROR, "Error while getting doujin");
        const err = (await res.json()) as ApiError;
        switch (err.status) {
            case 404:
                throw new NoDoujinFoundError(err.title);
            case 400:
                if (err.title === "NoExhentaiCookies")
                    throw new NoExhentaiCookieError(err.title);
                throw new BadRequestError(err.title);
            default:
                throw new Error(err.title);
        }
    }
    const doujin = (await res.json()) as Doujin;
    return doujin;
};

/**
 * Get random doujin by tags (optional)
 * @param tags - Tags to search for
 * @returns A doujin if found
 */
const getRandDoujin = async (tags?: string) => {
    const query = tags ? tags : "";

    const res = await fetch(`${API_URL}/doujins/random`, {
        headers: API_REQUEST_HEADERS,
        method: "POST",
        body: JSON.stringify(query),
    });

    if (res.status != 200 && res.status != 201) {
        var err = (await res.json()) as ApiError;
        switch (err.status) {
            case 404:
                throw new NoResultsError(err.detail!);
            case 400:
                if (err.title === "NoExhentaiCookies")
                    throw new NoExhentaiCookieError(err.title);
                throw new BadRequestError(err.detail!);
            case 500:
                throw new Error(err.detail)
            default:
                throw new Error("Error while getting doujin");
        }
    }

    const doujin = await res.json();
    return doujin as Doujin;
};

const getDoujinZip = async (id: string) => {
    const res = await fetch(`${API_URL}/doujins/zip/${id}`, {
        headers: API_REQUEST_HEADERS,
    });
    if (res.status != 200) {
        console.error(LOG_LEVELS.ERROR, "Error while getting doujin");
        const err = (await res.json()) as ApiError;
        switch (err.status) {
            case 404:
                throw new NoDoujinFoundError(err.title);
            case 400:
                throw new BadRequestError(err.title);
            case 500:
                throw new Error(err.detail)
            default:
                throw new Error(err.title);
        }
    }
    const zipFile = await res.blob();
    return zipFile;
};

/**
 * Get new doujin by url
 * @param url the url of the doujin to get
 * @returns the doujin object
 */
const fetchDoujin = async (url: string) => {
    const res = await fetch(`${API_URL}/doujins/fetch`, {
        headers: API_REQUEST_HEADERS,
        method: "POST",
        body: JSON.stringify(url),
    });
    if (res.status != 200 && res.status != 201) {
        var err = (await res.json()) as ApiError;
        switch (err.status) {
            case 404:
                throw new NoResultsError(err.detail!);
            case 400:
                throw new BadRequestError("Request error, bad url?");
            default:
                throw new Error("Error while getting doujin");
        }
    }
    const doujin = await res.json();
    return doujin as Doujin;
};

export { getDoujin, fetchDoujin, getRandDoujin, getDoujinZip };

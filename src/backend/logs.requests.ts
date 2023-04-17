import { API_REQUEST_HEADERS, API_URL, LOG_LEVELS } from "../libs/constants.ts";
import { Log, LogLevel } from "./types.ts";

/**
 * Create a log in the database
 * @param level The log level
 * @param message The log message
 */
const createLog = async (level: LogLevel, message: string): Promise<void> => {
    const timestamp = Math.floor(Date.now() / 1000);
    const log: Log = {
        level: level,
        message: message,
        timestamp: timestamp,
    };
    const res = await fetch(`${API_URL}/logs`, {
        method: "POST",
        headers: API_REQUEST_HEADERS,
        body: JSON.stringify(log),
    });
    if (res.status != 201) {
        console.error(LOG_LEVELS.ERROR, log);
    }
};

export { createLog };

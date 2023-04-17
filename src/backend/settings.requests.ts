import { API_REQUEST_HEADERS, API_URL } from "../libs/constants.ts";
import { FetchSettingsError } from "../libs/errors.ts";
import { Settings } from "./types.ts";

/**
 * Fetch the latest settings from the database
 * @returns Settings object
 */
const getSettings = async (): Promise<Settings> => {
    const res = await fetch(`${API_URL}/settings`, {
        headers: API_REQUEST_HEADERS,
    });
    const settings = await res.json();
    if (res.status != 200) {
        throw new FetchSettingsError("Error fetching settings");
    }
    return settings as Settings;
};

/**
 * Update the settings in the database
 * @param settings The settings object to update
 */
const updateSettings = async (settings: Settings): Promise<void> => {
    const res = await fetch(`${API_URL}/settings`, {
        method: "PUT",
        headers: API_REQUEST_HEADERS,
        body: JSON.stringify(settings),
    });
    if (res.status != 200) {
        throw new FetchSettingsError("Error updating settings");
    }
};

export { getSettings, updateSettings };

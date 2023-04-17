import { API_REQUEST_HEADERS, API_URL, LOG_LEVELS } from "../libs/constants.ts";
import type { User } from "./types.ts";
import {
    UserCreationError,
    UserDeleteError,
    UserNotFoundError,
    UserUpdateError,
} from "../libs/errors.ts";
import { getSettings } from "./settings.requests.ts";
import { GrammyUser } from "../bot/types.ts";

/**
 * Get user from the Users collection in the db
 * @param id : user id
 * @returns : User object
 */
const getUser = async (msgUser: GrammyUser): Promise<User> => {
    if (msgUser === undefined) throw new UserNotFoundError("User not found", 0);
    const res = await fetch(`${API_URL}/users/userId/${msgUser.id}`, {
        headers: API_REQUEST_HEADERS,
    });
    if (res.status != 200) {
        switch (res.status) {
            case 404:
                return await newUser(msgUser);
            default:
                throw new UserNotFoundError("User not found", 0);
        }
    }
    const user = (await res.json()) as User;
    return user;
};

/**
 * check if user exists in the Users collection in the db
 * @param id : user id
 * @returns true if user exists, false otherwise
 */
const userExists = async (id: number): Promise<boolean> => {
    if (id === undefined) throw new UserNotFoundError("User not found", 0);
    const res = await fetch(`${API_URL}/users/userId/${id}`, {
        headers: API_REQUEST_HEADERS,
    });
    if (res.status != 200) {
        return false;
    }
    return true;
};

/**
 * Insert a new user in the Users collection in the db
 * @param id : user id
 * @param username : username
 */
const newUser = async (msgUser: GrammyUser): Promise<User> => {
    if (msgUser === undefined) throw new UserNotFoundError("User not found", 0);
    const today = new Date(Date.now());
    const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: API_REQUEST_HEADERS,
        body: JSON.stringify({
            name: {
                first: msgUser.first_name ?? "",
                last: msgUser.last_name ?? "",
            },
            userId: msgUser.id,
            username: msgUser.username ?? "Anonymous",
            doujins: [],
            favorites: [],
            usage: 0,
            dailyUse: 0,
            dailyUseDate: today,
        }),
    });
    if (res.status != 201) {
        switch (res.status) {
            case 409:
                console.error(LOG_LEVELS.INFO, "User already exists");
                break;
            default:
                console.error(LOG_LEVELS.ERROR, "Error while creating user");
                throw new UserCreationError("Error while creating user");
        }
    }
    const user = (await res.json()) as User;
    return user;
};

const deleteUser = async (msgUser: GrammyUser): Promise<void> => {
    if (msgUser === undefined) throw new UserNotFoundError("User not found", 0);
    const user = await getUser(msgUser);
    const res = await fetch(`${API_URL}/users/${user.id}`, {
        method: "DELETE",
        headers: API_REQUEST_HEADERS,
    });
    if (res.status != 204) {
        console.error(LOG_LEVELS.ERROR, "Error while deleting user");
        throw new UserDeleteError("Error while deleting user", msgUser.id);
    }
};

/**
 * Update the usage count of the user
 * @param msgUser : The user who sent the message
 */
const updateTotalUsage = async (msgUser: GrammyUser): Promise<void> => {
    if (msgUser === undefined) throw new UserNotFoundError("User not found", 0);
    const user = await getUser(msgUser);
    user.usage++;
    await updateUser(user);
};

/**
 * Update the daily usage of the user unless whitelisted
 * @param msgUser : The user who sent the message
 */
const updateDailyUsage = async (msgUser: GrammyUser): Promise<void> => {
    if (msgUser === undefined) throw new UserNotFoundError("User not found", 0);
    const user = await getUser(msgUser);
    const daily_use_date = new Date(user.dailyUseDate);
    const today = new Date(Date.now());

    if (daily_use_date.toLocaleDateString() == today.toLocaleDateString()) {
        user.dailyUse++;
    } else {
        user.dailyUse = 1;
        user.dailyUseDate = today;
    }
    user.usage++;
    await updateUser(user);
};

/**
 * Get the daily usage of the user
 * @param msgUser : The user who sent the message
 * @returns daily usage and date of the user
 */
const getDailyUsage = async (
    msgUser: GrammyUser
): Promise<{ dailyUse: number; dailyUseDate: Date }> => {
    if (msgUser === undefined) throw new UserNotFoundError("User not found", 0);
    const user = await getUser(msgUser);
    const { dailyUse, dailyUseDate } = user!;
    return { dailyUse: dailyUse, dailyUseDate: new Date(dailyUseDate) };
};

/**
 * Checks the daily usage of the user
 * @param msgUser : The user who sent the message
 * @returns True if the daily usage is reached, false otherwise
 */
const checkDailyUsage = async (msgUser: GrammyUser): Promise<boolean> => {
    if (msgUser === undefined) throw new UserNotFoundError("User not found", 0);
    const { dailyUse, dailyUseDate } = await getDailyUsage(msgUser);
    const { whitelistUsers, maxDailyUse } = await getSettings();
    const today = new Date(Date.now());
    if (whitelistUsers.includes(msgUser.id)) {
        return false;
    }
    if (
        dailyUseDate.toLocaleDateString() == today.toLocaleDateString() &&
        dailyUse >= maxDailyUse
    ) {
        return true;
    }
    return false;
};

/**
 * Add a doujin to the user's doujins
 * @param msgUser : The user who sent the message
 * @param doujinId : doujin id
 */
const addDoujin = async (
    msgUser: GrammyUser,
    doujinId: number
): Promise<void> => {
    if (msgUser === undefined) throw new UserNotFoundError("User not found", 0);
    const user = await getUser(msgUser);
    user.doujins.push(doujinId);
    await updateUser(user);
};

/**
 * Update the user
 * @param user : user object
 */
const updateUser = async (user: User): Promise<void> => {
    if (user === undefined) throw new UserNotFoundError("User not found", 0);

    const res = await fetch(`${API_URL}/users/${user.id}`, {
        method: "PUT",
        headers: API_REQUEST_HEADERS,
        body: JSON.stringify(user),
    });
    if (res.status != 200) {
        console.error(LOG_LEVELS.ERROR, "Error while updating user");
        throw new UserUpdateError("Error while updating user", user.userId);
    }
};

export {
    getUser,
    newUser,
    updateTotalUsage,
    updateDailyUsage,
    getDailyUsage,
    checkDailyUsage,
    deleteUser,
    addDoujin,
    userExists,
};

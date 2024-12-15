/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/";

export const isDev = process.env.NODE_ENV === "development";

console.log("redisUrl🤔", process.env.REDIS_URL);
export const redisUrl = process.env.REDIS_URL || "";

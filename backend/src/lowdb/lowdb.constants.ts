import { DataBaseStructure } from "./lowdb.interface";

export const defaultData: DataBaseStructure = { users: [], servers: [] };
export const ERROR_USER_EXISTS = 'User already exists!'
export const WARN_SAVING_DB_SHUTDOWN = 'Saving databases on shutdown!'
export const WARN_SAVING_DB_SHUTDOWN_COMPLETE = 'Saving databases on shutdown complete!'
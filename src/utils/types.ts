import { UserDetails } from "src/lowdb/lowdb.interface.js";

export type Done = (err: Error, user: UserDetails, accessToken?: string, refreshToken?: string) => void;

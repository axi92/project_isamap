import { UserDetails } from "src/user/user.interface";

export type Done = (err: Error, user: UserDetails, accessToken?: string, refreshToken?: string) => void;

import { UserCreatDto } from "src/user/dto/userCreate.dto";

export type Done = (err: Error, user: UserCreatDto, accessToken?: string, refreshToken?: string) => void;

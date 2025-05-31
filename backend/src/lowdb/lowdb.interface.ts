import { ServerEntry } from "src/server/server.interface";
import { UserDetails } from "../user/user.interface";

export interface DataBaseStructure {
  servers: ServerEntry[];
  users: UserDetails[];
}



export interface DataBaseStructure {
  servers: ServerEntry[];
  users: UserDetails[];
}

export interface ServerEntry {
  owner: number;
  privateId: string;
  publicId: string;
  description: string;
}

// https://discord.com/developers/docs/resources/user#user-object
export interface UserDetails {
  discordId: number;
  username: string;
  avatar: string | null;
  verified: boolean;
}
// Avatar url can be optained like this:
// https://cdn.discordapp.com/avatars/358154856046788609/d4c868f13345db8c809bcfbe786aec94
// https://cdn.discordapp.com/avatars/<      userid    >/<avatar hashe in UserDetails   >

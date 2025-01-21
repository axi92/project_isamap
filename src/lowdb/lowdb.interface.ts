export interface DataBaseStructure {
  servers: ServerEntry[];
  users: UserDetails[];
}

export interface ServerEntry {
  owner: number;
  privateId: string;
  publicId: string;
  notes?: string;
}

// https://discord.com/developers/docs/resources/user#user-object
export interface UserDetails {
  discordId: number;
  username: string;
  discriminator: string;
  global_name: string;
  bot: boolean;
  locale: string;
  verified: boolean;
  level: number;
}

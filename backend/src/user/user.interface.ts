// https://discord.com/developers/docs/resources/user#user-object

export interface UserDetails {
  discordId: number;
  username: string;
  avatar?: string;
  verified: boolean;
}

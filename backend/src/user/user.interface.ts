// https://discord.com/developers/docs/resources/user#user-object

export interface UserDetails {
  userId: string;
  username: string;
  avatar?: string;
  verified: boolean;
}

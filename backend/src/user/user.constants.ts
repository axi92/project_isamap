import { UserCreatDto } from './dto/userCreate.dto';

export const testDiscordID1 = '123456789012345678';
export const testDiscordID2 = testDiscordID1.split('').reverse().join('');
export const userTestTemplate: UserCreatDto = {
  userId: testDiscordID1,
  username: 'testuser',
  avatar: 'testAvatarString',
  verified: true,
};

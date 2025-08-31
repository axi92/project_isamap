import { v4 } from 'uuid';
import { LiveMapDTO } from './dto/server.dto';
import { ServerCreateDto } from './dto/serverCreate.dto';
import { testDiscordID1 } from '@/user/user.constants';

export const exampleServerData: LiveMapDTO = {
  map: 'TheIsland',
  servername: 'Test Server',
  privateid: v4(),
  players: [
    {
      steamid: '12345678901234567',
      playername: 'Player1',
      x_pos: 100,
      y_pos: 200,
      x_ue4: 300,
      y_ue4: 400,
      z_ue4: 500,
      tribename: 'Tribe1',
    },
  ],
  tribes: [
    {
      decayDestructionTime: 6678,
      elapsedTime: 567,
      lastInAllyRangeTime: 56,
      tribeid: 98767654,
      x_pos: 100,
      y_pos: 200,
      x_ue4: 300,
      y_ue4: 400,
      z_ue4: 500,
      tribename: 'Tribe1',
    },
  ],
  dinos: [
    {
      class: 'Dinoclass',
      id: 1,
      level: 1,
      x_pos: 1,
      y_pos: 1,
      x_ue4: 1,
      y_ue4: 1,
      z_ue4: 1,
    },
  ],
  serverclock: '00:00',
};

export const serverCreateTestData: ServerCreateDto = {
  owner: testDiscordID1,
  description: 'serverDescription',
};

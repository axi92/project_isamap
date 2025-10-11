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

const calibrationServerData: LiveMapDTO = {
  map: 'TheIsland_WP',
  servername: 'Calibration Server',
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
      tribeid: 10,
      x_pos: 10,
      y_pos: 10,
      x_ue4: 10,
      y_ue4: 10,
      z_ue4: 10,
      tribename: 'Tribe 10x10',
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

// Fill calibrationServerData

// X direction
for (let indexX = 0; indexX <= 100; indexX = indexX + 10) {
  // Y direction
  for (let indexY = 0; indexY <= 100; indexY = indexY + 10) {
    const copy = structuredClone(calibrationServerData.tribes[0]);
    copy.tribeid = Number(`1${indexX}${indexY}`);
    copy.tribename = `Tribe X:${indexX} Y:${indexY}`;
    copy.x_pos = indexX;
    copy.y_pos = indexY;
    calibrationServerData.tribes.push(copy);
  }
}
export { calibrationServerData };

export const serverCreateTestData: ServerCreateDto = {
  owner: testDiscordID1,
  description: 'serverDescription',
};

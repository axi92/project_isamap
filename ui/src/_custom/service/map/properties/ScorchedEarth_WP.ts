import type { MapProperty } from '../map.interface';

export const ScorchedEarth_WP: MapProperty = {
  name: 'ScorchedEarth_WP',
  displayName: 'Scorched Earth',
  bounds: [
    [-1, -1],
    [101, 101],
  ],
  mapSrc: '/images/maps/ScorchedEarth_WP.jpg',
  imageLogo: '/images/logo/scorched.png',
  obelisks: [
    {
      description: 'Blue Obelisk',
      color: 'blue',
      src: '/images/maps/obelisk_blue.png',
      x: 21.5,
      y: 33.5,
    },
    {
      description: 'Green Obelisk',
      color: 'green',
      src: '/images/maps/obelisk_green.png',
      x: 53,
      y: 74.3,
    },
    {
      description: 'Red Obelisk',
      color: 'red',
      src: '/images/maps/obelisk_red.png',
      x: 74,
      y: 40.5,
    },
  ],
};

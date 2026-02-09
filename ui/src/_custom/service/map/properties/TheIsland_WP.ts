import type { MapProperty } from '../map.interface';

export const TheIsland_WP: MapProperty = {
  name: 'TheIsland_WP',
  displayName: 'The Island',
  bounds: [
    [0, 0],
    [100, 100],
  ],
  mapSrc: '/images/maps/TheIsland_WP.jpg',
  imageLogo: '/images/logo/ASA_Logo_transparent.png',
  obelisks: [
    {
      description: 'Blue Obelisk',
      color: 'blue',
      src: '/images/maps/obelisk_blue.png',
      x: 25.5,
      y: 25.6,
    },
    {
      description: 'Green Obelisk',
      color: 'green',
      src: '/images/maps/obelisk_green.png',
      x: 59,
      y: 72.3,
    },
    {
      description: 'Red Obelisk',
      color: 'red',
      src: '/images/maps/obelisk_red.png',
      x: 79.8,
      y: 17.4,
    },
  ],
};

import type { MapProperty } from '../map.interface';

export const TheCenter_WP: MapProperty = {
  name: 'TheCenter_WP',
  displayName: 'The Center',
  bounds: [
    [0, 0],
    [100, 100],
  ],
  mapSrc: '/images/maps/TheCenter_WP.jpg',
  imageLogo: '/images/logo/center.png',
  obelisks: [
    {
      description: 'Blue Obelisk',
      color: 'blue',
      src: '/images/maps/obelisk_blue.png',
      x: 50.3,
      y: 81,
    },
    {
      description: 'Green Obelisk',
      color: 'green',
      src: '/images/maps/obelisk_green.png',
      x: 35.6,
      y: 15.3,
    },
    {
      description: 'Red Obelisk',
      color: 'red',
      src: '/images/maps/obelisk_red.png',
      x: 8.2,
      y: 57.4,
    },
  ],
};

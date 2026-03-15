import type { MapProperty } from '../map.interface';

export const Ragnarok_WP: MapProperty = {
  name: 'Ragnarok_WP',
  displayName: 'Ragnarok',
  bounds: [
    [-1, -1],
    [101, 101],
  ],
  mapSrc: '/images/maps/Ragnarok_WP.jpg',
  imageLogo: '/images/logo/ragna.png',
  obelisks: [
    {
      description: 'Blue Obelisk',
      color: 'blue',
      src: '/images/maps/obelisk_blue.png',
      x: 18.1,
      y: 17.3,
    },
    {
      description: 'Green Obelisk',
      color: 'green',
      src: '/images/maps/obelisk_green.png',
      x: 57.0,
      y: 38.01,
    },
    {
      description: 'Red Obelisk',
      color: 'red',
      src: '/images/maps/obelisk_red.png',
      x: 35,
      y: 85.7,
    },
  ],
};

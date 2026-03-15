import type { MapProperty } from '../map.interface';

export const Extinction_WP: MapProperty = {
  name: 'Extinction_WP',
  displayName: 'Extinction',
  bounds: [
    [-1, -1],
    [101, 101],
  ],
  mapSrc: '/images/maps/Extinction_WP.jpg',
  imageLogo: '/images/logo/extinction.png',
  obelisks: [
    {
      description: 'Blue Obelisk',
      color: 'blue',
      src: '/images/maps/obelisk_blue.png',
      x: 21.8,
      y: 78.2,
    },
    {
      description: 'Green Obelisk',
      color: 'green',
      src: '/images/maps/obelisk_green.png',
      x: 50.6,
      y: 29.7,
    },
    {
      description: 'Red Obelisk',
      color: 'red',
      src: '/images/maps/obelisk_red.png',
      x: 77.6,
      y: 76.9,
    },
  ],
};

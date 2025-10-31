import type { MapProperty } from '../map.interface';

export const Valguero_WP: MapProperty = {
  name: 'Valguero_WP',
  displayName: 'Valguero',
  bounds: [
    [0, 0],
    [100, 100],
  ],
  mapSrc: '/images/maps/Valguero_WP.jpg',
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

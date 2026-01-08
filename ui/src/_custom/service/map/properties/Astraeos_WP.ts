import type { MapProperty } from '../map.interface';

export const Astraeos_WP: MapProperty = {
  name: 'Astraeos_WP',
  displayName: 'Astraeos',
  bounds: [
    [0, 0],
    [100, 100],
  ],
  mapSrc: '/images/maps/Astraeos_WP.jpg',
  imageLogo: '/images/logo/astraeos.png',
  obelisks: [
    {
      description: 'Blue Obelisk',
      color: 'blue',
      src: '/images/maps/obelisk_blue.png',
      x: 18.9,
      y: 16.1,
    },
    {
      description: 'Green Obelisk',
      color: 'green',
      src: '/images/maps/obelisk_green.png',
      x: 22.5,
      y: 77.8,
    },
    {
      description: 'Red Obelisk',
      color: 'red',
      src: '/images/maps/obelisk_red.png',
      x: 80.8,
      y: 20.3,
    },
  ],
};

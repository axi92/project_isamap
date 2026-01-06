import type { MapProperty } from '../map.interface';

export const Aberration_WP: MapProperty = {
  name: 'Aberration_WP',
  displayName: 'Aberration',
  bounds: [
    [0, 0],
    [100, 100],
  ],
  mapSrc: '/images/maps/Aberration_WP.jpg',
  imageLogo: '/images/logo/aberration.png',
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

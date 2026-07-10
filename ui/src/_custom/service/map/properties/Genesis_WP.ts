import type { MapProperty } from '../map.interface';

export const Genesis_WP: MapProperty = {
  name: 'Genesis_WP',
  displayName: 'Genesis',
  bounds: [
    [0, 0],
    [100, 100],
  ],
  mapSrc: '/images/maps/Genesis1_WP_Land.jpg',
  imageLogo: '/images/logo/Genesis_WP.png',
  obelisks: [],
  layers: [
    {
      id: 'land',
      displayName: 'Land',
      mapSrc: '/images/maps/Genesis1_WP_Land.jpg',
      filter: (entity) => {
        return (entity.z_ue4 ?? 0) < 200000;
      },
    },
    {
      id: 'ocean',
      displayName: 'Ocean / Space',
      mapSrc: '/images/maps/Genesis1_WP_Ocean.jpg',
      filter: (entity) => {
        return (entity.z_ue4 ?? 0) >= 200000;
      },
    },
  ],
};

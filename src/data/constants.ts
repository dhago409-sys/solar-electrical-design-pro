export const CABLE_SIZES = [
  { size: '1.5', ampacity: 10, material: 'copper' },
  { size: '2.5', ampacity: 16, material: 'copper' },
  { size: '4', ampacity: 20, material: 'copper' },
  { size: '6', ampacity: 25, material: 'copper' },
  { size: '10', ampacity: 35, material: 'copper' },
  { size: '16', ampacity: 50, material: 'copper' },
  { size: '25', ampacity: 70, material: 'copper' },
  { size: '35', ampacity: 85, material: 'copper' },
  { size: '50', ampacity: 110, material: 'copper' },
  { size: '70', ampacity: 150, material: 'copper' },
  { size: '95', ampacity: 190, material: 'copper' },
  { size: '120', ampacity: 230, material: 'copper' },
];

export const CABLE_RESISTIVITY = {
  copper: 0.0175,
  aluminum: 0.0280
};

export const FUSE_RATINGS = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200];

export const BREAKER_RATINGS = [10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160];

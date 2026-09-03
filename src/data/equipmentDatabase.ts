export const EQUIPMENT_DATABASE = {
  SOLAR_PANELS: [
    {
      id: 'panel-ja-550',
      brand: 'JA Solar',
      model: 'JAM72S20-550',
      power: 550,
      voc: 48.5,
      vmp: 42,
      isc: 14,
      imp: 13.1,
      efficiency: 0.215,
      dimensions: '2256x1133x35',
      price: 150
    },
    {
      id: 'panel-canadian-400',
      brand: 'Canadian Solar',
      model: 'CS6L-400',
      power: 400,
      voc: 48.5,
      vmp: 42,
      isc: 10.4,
      imp: 9.5,
      efficiency: 0.195,
      dimensions: '2000x1000x40',
      price: 120
    },
    {
      id: 'panel-trina-360',
      brand: 'Trina',
      model: 'TSM-360',
      power: 360,
      voc: 48.2,
      vmp: 42,
      isc: 9.2,
      imp: 8.5,
      efficiency: 0.175,
      dimensions: '1956x992x40',
      price: 100
    }
  ],
  INVERTERS: [
    {
      id: 'inv-victron-5',
      brand: 'Victron',
      model: 'Multiplus 5000/48',
      power: 5000,
      dcMin: 40,
      dcMax: 65,
      mpptMin: 150,
      mpptMax: 600,
      maxPVCurrent: 150,
      acVoltage: 230,
      phase: 1,
      efficiency: 0.95,
      price: 2500
    },
    {
      id: 'inv-growatt-10',
      brand: 'Growatt',
      model: 'SPH10000TL3-BH-48',
      power: 10000,
      dcMin: 40,
      dcMax: 90,
      mpptMin: 150,
      mpptMax: 700,
      maxPVCurrent: 200,
      acVoltage: 230,
      phase: 1,
      efficiency: 0.96,
      price: 4500
    },
    {
      id: 'inv-huawei-6',
      brand: 'Huawei',
      model: 'SUN2000-6KTL-L1',
      power: 6000,
      dcMin: 200,
      dcMax: 1000,
      mpptMin: 200,
      mpptMax: 1000,
      maxPVCurrent: 50,
      acVoltage: 380,
      phase: 3,
      efficiency: 0.98,
      price: 3000
    }
  ],
  BATTERIES: [
    {
      id: 'bat-lg-10.2',
      brand: 'LG',
      model: 'RESU10.2',
      voltage: 48,
      ah: 213,
      kwh: 10.24,
      maxChargeCurrent: 50,
      maxDischargeCurrent: 50,
      dod: 0.95,
      cycleLife: 6000,
      type: 'LiFePO4',
      price: 5000
    },
    {
      id: 'bat-byd-5.12',
      brand: 'BYD',
      model: 'Battery Box Premium HV',
      voltage: 48,
      ah: 106.7,
      kwh: 5.12,
      maxChargeCurrent: 40,
      maxDischargeCurrent: 40,
      dod: 0.9,
      cycleLife: 6000,
      type: 'LiFePO4',
      price: 2500
    },
    {
      id: 'bat-catl-5.12',
      brand: 'CATL',
      model: 'H48050',
      voltage: 48,
      ah: 106.7,
      kwh: 5.12,
      maxChargeCurrent: 50,
      maxDischargeCurrent: 50,
      dod: 0.9,
      cycleLife: 5000,
      type: 'LiFePO4',
      price: 2400
    }
  ],
  CABLES: [
    { size: '1.5', ampacity: 10, voltage: 1000, type: 'DC', price: 2 },
    { size: '2.5', ampacity: 16, voltage: 1000, type: 'DC', price: 3 },
    { size: '4', ampacity: 20, voltage: 1000, type: 'DC', price: 5 },
    { size: '6', ampacity: 25, voltage: 1000, type: 'DC', price: 6 },
    { size: '10', ampacity: 35, voltage: 1000, type: 'DC', price: 8 },
    { size: '16', ampacity: 50, voltage: 1000, type: 'DC', price: 12 },
    { size: '2.5', ampacity: 16, voltage: 380, type: 'AC', price: 3 },
    { size: '6', ampacity: 25, voltage: 380, type: 'AC', price: 6 },
    { size: '10', ampacity: 35, voltage: 380, type: 'AC', price: 8 }
  ],
  PROTECTION: [
    { id: 'br-dc-63', name: 'DC Breaker 63A', category: 'Breaker', voltage: 1000, current: 63, price: 80 },
    { id: 'br-dc-100', name: 'DC Breaker 100A', category: 'Breaker', voltage: 1000, current: 100, price: 120 },
    { id: 'br-ac-63', name: 'AC Breaker 63A', category: 'Breaker', voltage: 380, current: 63, price: 60 },
    { id: 'br-ac-100', name: 'AC Breaker 100A', category: 'Breaker', voltage: 380, current: 100, price: 80 },
    { id: 'fuse-100', name: 'DC Fuse 100A gPV', category: 'Fuse', voltage: 1000, current: 100, price: 40 },
    { id: 'fuse-125', name: 'DC Fuse 125A gPV', category: 'Fuse', voltage: 1000, current: 125, price: 45 },
    { id: 'iso-63', name: 'DC Isolator 63A', category: 'Isolator', voltage: 1000, current: 63, price: 70 },
    { id: 'iso-100', name: 'DC Isolator 100A', category: 'Isolator', voltage: 1000, current: 100, price: 100 },
    { id: 'spd-dc', name: 'SPD Type 2 (DC)', category: 'SPD', voltage: 1000, current: 40, price: 150 },
    { id: 'spd-ac', name: 'SPD Type 3 (AC)', category: 'SPD', voltage: 380, current: 40, price: 120 },
    { id: 'rcd-30', name: 'RCD 30mA Type A', category: 'RCD', voltage: 230, current: 40, price: 60 },
    { id: 'earth-rod', name: 'Earthing Rod 1.5m', category: 'Earthing', voltage: 0, current: 0, price: 30 }
  ]
};

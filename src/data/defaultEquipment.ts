import { Equipment } from '../types';

export const defaultEquipment: Equipment[] = [
  // SOLAR PANELS
  { id: '1', category: 'SOLAR', subcategory: 'Solar panels', name: 'Monocrystalline 550W', brand: 'JA Solar', model: 'JAM72S20-550', voltage: 48, current: 11.5, power: 550 },
  { id: '2', category: 'SOLAR', subcategory: 'Solar panels', name: 'Monocrystalline 400W', brand: 'Canadian Solar', model: 'CS6L-400', voltage: 48, current: 8.3, power: 400 },
  { id: '3', category: 'SOLAR', subcategory: 'Solar panels', name: 'Polycrystalline 360W', brand: 'Trina', model: 'TSM-360', voltage: 48, current: 7.5, power: 360 },
  
  // INVERTERS
  { id: '4', category: 'INVERTERS', subcategory: 'Hybrid inverter', name: 'Hybrid 5kW 48V', brand: 'Victron', model: 'Multiplus 5000/48', voltage: 48, power: 5000 },
  { id: '5', category: 'INVERTERS', subcategory: 'Hybrid inverter', name: 'Hybrid 10kW 48V', brand: 'Growatt', model: 'SPH10000TL3-BH-48', voltage: 48, power: 10000 },
  { id: '6', category: 'INVERTERS', subcategory: 'On-grid inverter', name: 'On-grid 6kW', brand: 'Huawei', model: 'SUN2000-6KTL-L1', voltage: 380, power: 6000 },
  { id: '7', category: 'INVERTERS', subcategory: 'Off-grid inverter', name: 'Off-grid 3kW 48V', brand: 'Luminous', model: 'Eco Watt Plus 3kW', voltage: 48, power: 3000 },
  { id: '8', category: 'INVERTERS', subcategory: 'Microinverter', name: 'Microinverter 400W', brand: 'Enphase', model: 'IQ7', power: 400 },
  
  // BATTERIES
  { id: '9', category: 'BATTERIES', subcategory: 'LiFePO4', name: 'LiFePO4 10.24kWh 48V', brand: 'LG', model: 'RESU10.2', voltage: 48, power: 10240 },
  { id: '10', category: 'BATTERIES', subcategory: 'LiFePO4', name: 'LiFePO4 5.12kWh 48V', brand: 'CATL', model: 'H48050', voltage: 48, power: 5120 },
  { id: '11', category: 'BATTERIES', subcategory: 'Lithium', name: 'Lithium 10kWh 48V', brand: 'BYD', model: 'Cube', voltage: 48, power: 10000 },
  { id: '12', category: 'BATTERIES', subcategory: 'AGM', name: 'AGM 200Ah 48V', brand: 'Victron', model: 'AGM 12V', voltage: 12, current: 200, power: 2400 },
  { id: '13', category: 'BATTERIES', subcategory: 'Lead acid', name: 'Lead Acid 250Ah 48V', brand: 'Exide', model: 'LS Plus', voltage: 12, current: 250, power: 3000 },
  
  // ELECTRICAL COMPONENTS
  { id: '14', category: 'ELECTRICAL', subcategory: 'DC breaker', name: 'DC Breaker 125A', brand: 'ABB', model: 'S801S', current: 125, voltage: 1000 },
  { id: '15', category: 'ELECTRICAL', subcategory: 'AC breaker', name: 'AC Breaker 63A', brand: 'Siemens', model: '5SL6363-7', current: 63, voltage: 380 },
  { id: '16', category: 'ELECTRICAL', subcategory: 'Fuse', name: 'DC Fuse 100A', brand: 'Littelfuse', model: 'MEGA-Fuse', current: 100 },
  { id: '17', category: 'ELECTRICAL', subcategory: 'Isolator', name: 'DC Isolator', brand: 'Schneider', model: 'TeSys', current: 63 },
  { id: '18', category: 'ELECTRICAL', subcategory: 'SPD', name: 'AC Surge Protector', brand: 'Phoenix', model: 'PT-IQ', voltage: 380 },
  { id: '19', category: 'ELECTRICAL', subcategory: 'RCD', name: 'RCD 30mA Type A', brand: 'Legrand', model: 'DX', current: 40 },
  { id: '20', category: 'ELECTRICAL', subcategory: 'DB', name: 'Distribution Board 12P', brand: 'Havells', model: 'Standard', },
  { id: '21', category: 'ELECTRICAL', subcategory: 'Combiner box', name: 'DC Combiner 4 input', brand: 'Huawei', model: 'SUN2000-LC', },
  { id: '22', category: 'ELECTRICAL', subcategory: 'Meter', name: 'Energy Meter 3-phase', brand: 'Eastron', model: 'SDM630-MODBUS', voltage: 380 },
  { id: '23', category: 'ELECTRICAL', subcategory: 'ATS', name: 'Automatic Transfer Switch 63A', brand: 'Schneider', model: 'ATSE', current: 63 },
  { id: '24', category: 'ELECTRICAL', subcategory: 'Transformer', name: 'Step-down 10kVA', brand: 'Siemens', model: '4AV3112-2ED', power: 10000 },
  { id: '25', category: 'ELECTRICAL', subcategory: 'Generator', name: 'Diesel Generator 10kW', brand: 'Cummins', model: 'C10D', power: 10000 },
  
  // LOADS
  { id: '26', category: 'LOADS', subcategory: 'Lamp', name: 'LED Bulb 9W', power: 9, voltage: 230 },
  { id: '27', category: 'LOADS', subcategory: 'TV', name: 'LED TV 55inch', power: 100, voltage: 230 },
  { id: '28', category: 'LOADS', subcategory: 'Refrigerator', name: 'Refrigerator 300L', power: 150, voltage: 230 },
  { id: '29', category: 'LOADS', subcategory: 'Fan', name: 'Ceiling Fan', power: 75, voltage: 230 },
  { id: '30', category: 'LOADS', subcategory: 'Air conditioner', name: 'AC 1.5 Ton', power: 1200, voltage: 230 },
  { id: '31', category: 'LOADS', subcategory: 'Water pump', name: '1 HP Water Pump', power: 750, voltage: 230 },
  { id: '32', category: 'LOADS', subcategory: 'Washing machine', name: 'Washing Machine', power: 500, voltage: 230 },
  { id: '33', category: 'LOADS', subcategory: 'Computer', name: 'Desktop Computer', power: 300, voltage: 230 },
  { id: '34', category: 'LOADS', subcategory: 'Cooker', name: 'Electric Cooker', power: 2000, voltage: 230 },
  { id: '35', category: 'LOADS', subcategory: 'Heater', name: 'Water Heater', power: 3000, voltage: 230 },
  
  // CABLES
  { id: '36', category: 'CABLES', subcategory: 'DC cable', name: 'DC Cable 6mm²', power: 50 },
  { id: '37', category: 'CABLES', subcategory: 'DC cable', name: 'DC Cable 10mm²', power: 100 },
  { id: '38', category: 'CABLES', subcategory: 'DC cable', name: 'DC Cable 16mm²', power: 150 },
  { id: '39', category: 'CABLES', subcategory: 'AC cable', name: 'AC Cable 2.5mm²', power: 50 },
  { id: '40', category: 'CABLES', subcategory: 'AC cable', name: 'AC Cable 6mm²', power: 100 },
  { id: '41', category: 'CABLES', subcategory: 'AC cable', name: 'AC Cable 10mm²', power: 200 },
];

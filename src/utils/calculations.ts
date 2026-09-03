// PV Calculator
export const calculatePVSize = (dailyEnergy: number, peakSunHours: number, efficiency: number = 0.8) => {
  return (dailyEnergy * 1000) / (peakSunHours * efficiency);
};

export const calculateNumPanels = (requiredPower: number, panelWattage: number) => {
  return Math.ceil(requiredPower / panelWattage);
};

export const calculatePVVoltage = (numSeries: number, vmp: number) => {
  return numSeries * vmp;
};

export const calculatePVCurrent = (numParallel: number, imp: number) => {
  return numParallel * imp;
};

// Inverter Calculator
export const calculateInverterSize = (totalLoad: number, surgeMultiplier: number = 1.5) => {
  return totalLoad * surgeMultiplier;
};

export const checkMPPTCompatibility = (pvVoltage: number, mpptMin: number, mpptMax: number) => {
  return pvVoltage >= mpptMin && pvVoltage <= mpptMax;
};

// Battery Calculator
export const calculateBatteryCapacity = (dailyEnergy: number, dod: number, efficiency: number = 0.9) => {
  return (dailyEnergy * 1000) / (dod * efficiency);
};

export const calculateBatteryAh = (batteryCapacityWh: number, voltage: number) => {
  return batteryCapacityWh / voltage;
};

export const calculateNumBatteries = (requiredAh: number, batteryAh: number) => {
  return Math.ceil(requiredAh / batteryAh);
};

export const calculateBackupTime = (usableCapacity: number, averageLoad: number) => {
  return (usableCapacity * 1000) / averageLoad;
};

// Cable Calculator
export const calculateVoltageDrop = (current: number, length: number, cableSize: number, resistivity: number = 0.0175) => {
  return (2 * resistivity * length * current) / (cableSize);
};

export const calculateVoltageDropPercentage = (voltageDrop: number, voltage: number) => {
  return (voltageDrop / voltage) * 100;
};

export const calculateRequiredCableSize = (current: number, maxVoltageDrop: number, voltage: number, length: number, resistivity: number = 0.0175) => {
  const requiredSize = (2 * resistivity * length * current) / maxVoltageDrop;
  return requiredSize;
};

// Protection Calculations
export const calculateFuseRating = (current: number, safetyFactor: number = 1.25) => {
  return current * safetyFactor;
};

export const calculateBreakerRating = (current: number, safetyFactor: number = 1.25) => {
  return current * safetyFactor;
};

// Load Calculations
export const calculateDailyEnergy = (loads: Array<{ watts: number; hoursPerDay: number }>) => {
  return loads.reduce((total, load) => total + (load.watts * load.hoursPerDay), 0) / 1000;
};

export const calculateConnectedLoad = (loads: Array<{ watts: number }>) => {
  return loads.reduce((total, load) => total + load.watts, 0);
};

export const calculatePeakLoad = (loads: Array<{ watts: number }>) => {
  return Math.max(...loads.map(l => l.watts));
};

export interface Project {
  id: string;
  customerName: string;
  projectName: string;
  location: string;
  phone: string;
  email: string;
  designer: string;
  date: string;
  systemType: 'off-grid' | 'on-grid' | 'hybrid' | 'commercial' | 'residential' | 'industrial' | 'solar-pump';
  createdAt: string;
  updatedAt: string;
  data?: ProjectData;
}

export interface ProjectData {
  equipment: CanvasElement[];
  connections: Connection[];
  loads: LoadItem[];
  calculations: Calculations;
  bom: BOMItem[];
  costEstimate: CostEstimate;
  notes: string;
}

export interface CanvasElement {
  id: string;
  type: string;
  equipmentId: string;
  name: string;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  properties: Record<string, any>;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  type: 'DC' | 'AC' | 'Signal';
  cableSize?: string;
}

export interface Equipment {
  id: string;
  category: string;
  subcategory: string;
  name: string;
  brand?: string;
  model?: string;
  voltage?: number;
  current?: number;
  power?: number;
  specs?: Record<string, any>;
  icon?: string;
}

export interface LoadItem {
  id: string;
  equipment: string;
  quantity: number;
  watts: number;
  hoursPerDay: number;
  voltage?: number;
}

export interface Calculations {
  pvSize?: number;
  numPanels?: number;
  seriesPanels?: number;
  parallelStrings?: number;
  pvVoltage?: number;
  pvCurrent?: number;
  inverterSize?: number;
  batteryCapacity?: number;
  batteryAh?: number;
  numBatteries?: number;
  backupHours?: number;
  dailyEnergy?: number;
}

export interface BOMItem {
  id: string;
  category: string;
  equipment: string;
  specification: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface CostEstimate {
  equipment: number;
  labor: number;
  transportation: number;
  installation: number;
  engineering: number;
  other: number;
  subtotal: number;
  profit: number;
  total: number;
  currency: string;
}

export interface TestResult {
  category: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
  details?: string;
  recommendation?: string;
}
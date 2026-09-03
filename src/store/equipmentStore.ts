import { create } from 'zustand';
import { Equipment } from '../types';
import { defaultEquipment } from '../data/defaultEquipment';

interface EquipmentState {
  equipment: Equipment[];
  addEquipment: (equipment: Equipment) => void;
  updateEquipment: (id: string, updates: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  getByCategory: (category: string) => Equipment[];
}

const loadEquipmentFromStorage = (): Equipment[] => {
  try {
    const stored = localStorage.getItem('sedp_equipment');
    return stored ? JSON.parse(stored) : defaultEquipment;
  } catch {
    return defaultEquipment;
  }
};

const saveEquipmentToStorage = (equipment: Equipment[]) => {
  localStorage.setItem('sedp_equipment', JSON.stringify(equipment));
};

export const useEquipmentStore = create<EquipmentState>((set, get) => ({
  equipment: loadEquipmentFromStorage(),
  
  addEquipment: (equipment) => {
    set(state => {
      const updated = [...state.equipment, { ...equipment, id: Date.now().toString() }];
      saveEquipmentToStorage(updated);
      return { equipment: updated };
    });
  },
  
  updateEquipment: (id, updates) => {
    set(state => {
      const updated = state.equipment.map(e => e.id === id ? { ...e, ...updates } : e);
      saveEquipmentToStorage(updated);
      return { equipment: updated };
    });
  },
  
  deleteEquipment: (id) => {
    set(state => {
      const updated = state.equipment.filter(e => e.id !== id);
      saveEquipmentToStorage(updated);
      return { equipment: updated };
    });
  },
  
  getByCategory: (category) => {
    return get().equipment.filter(e => e.category === category);
  }
}));
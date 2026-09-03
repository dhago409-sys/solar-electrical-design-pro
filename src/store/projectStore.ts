import { create } from 'zustand';
import { Project, ProjectData, CanvasElement, Connection, LoadItem, Calculations, BOMItem, CostEstimate } from '../types';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  currentProjectData: ProjectData | null;
  
  // Project management
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'data'>) => void;
  loadProject: (id: string) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  saveCurrentProject: () => void;
  
  // Canvas operations
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  addConnection: (connection: Connection) => void;
  deleteConnection: (id: string) => void;
  
  // Loads
  addLoad: (load: LoadItem) => void;
  updateLoad: (id: string, updates: Partial<LoadItem>) => void;
  deleteLoad: (id: string) => void;
  
  // Calculations
  updateCalculations: (calcs: Partial<Calculations>) => void;
  
  // BOM
  updateBOM: (bom: BOMItem[]) => void;
  
  // Cost Estimate
  updateCostEstimate: (estimate: CostEstimate) => void;
  
  // Notes
  updateNotes: (notes: string) => void;
}

const loadProjectsFromStorage = (): Project[] => {
  try {
    const stored = localStorage.getItem('sedp_projects');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveProjectsToStorage = (projects: Project[]) => {
  localStorage.setItem('sedp_projects', JSON.stringify(projects));
};

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: loadProjectsFromStorage(),
  currentProject: null,
  currentProjectData: null,
  
  createProject: (project) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: {
        equipment: [],
        connections: [],
        loads: [],
        calculations: {},
        bom: [],
        costEstimate: {
          equipment: 0,
          labor: 0,
          transportation: 0,
          installation: 0,
          engineering: 0,
          other: 0,
          subtotal: 0,
          profit: 0,
          total: 0,
          currency: 'USD'
        },
        notes: ''
      }
    };
    
    set(state => {
      const updated = [...state.projects, newProject];
      saveProjectsToStorage(updated);
      return { projects: updated, currentProject: newProject, currentProjectData: newProject.data };
    });
  },
  
  loadProject: (id) => {
    set(state => {
      const project = state.projects.find(p => p.id === id);
      if (project) {
        return { currentProject: project, currentProjectData: project.data };
      }
      return {};
    });
  },
  
  updateProject: (id, updates) => {
    set(state => {
      const updated = state.projects.map(p => 
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      );
      saveProjectsToStorage(updated);
      return { projects: updated };
    });
  },
  
  deleteProject: (id) => {
    set(state => {
      const updated = state.projects.filter(p => p.id !== id);
      saveProjectsToStorage(updated);
      return { projects: updated, currentProject: null, currentProjectData: null };
    });
  },
  
  duplicateProject: (id) => {
    set(state => {
      const original = state.projects.find(p => p.id === id);
      if (!original) return {};
      
      const duplicate: Project = {
        ...original,
        id: Date.now().toString(),
        projectName: `${original.projectName} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: original.data ? JSON.parse(JSON.stringify(original.data)) : undefined
      };
      
      const updated = [...state.projects, duplicate];
      saveProjectsToStorage(updated);
      return { projects: updated };
    });
  },
  
  saveCurrentProject: () => {
    set(state => {
      if (state.currentProject && state.currentProjectData) {
        const updated = state.projects.map(p => 
          p.id === state.currentProject!.id 
            ? { ...p, data: state.currentProjectData, updatedAt: new Date().toISOString() } 
            : p
        );
        saveProjectsToStorage(updated);
        return { projects: updated };
      }
      return {};
    });
  },
  
  addElement: (element) => {
    set(state => {
      if (!state.currentProjectData) return {};
      const updated = { ...state.currentProjectData, equipment: [...state.currentProjectData.equipment, element] };
      return { currentProjectData: updated };
    });
  },
  
  updateElement: (id, updates) => {
    set(state => {
      if (!state.currentProjectData) return {};
      const updated = { 
        ...state.currentProjectData, 
        equipment: state.currentProjectData.equipment.map(e => e.id === id ? { ...e, ...updates } : e)
      };
      return { currentProjectData: updated };
    });
  },
  
  deleteElement: (id) => {
    set(state => {
      if (!state.currentProjectData) return {};
      const updated = { 
        ...state.currentProjectData, 
        equipment: state.currentProjectData.equipment.filter(e => e.id !== id),
        connections: state.currentProjectData.connections.filter(c => c.from !== id && c.to !== id)
      };
      return { currentProjectData: updated };
    });
  },
  
  addConnection: (connection) => {
    set(state => {
      if (!state.currentProjectData) return {};
      const updated = { ...state.currentProjectData, connections: [...state.currentProjectData.connections, connection] };
      return { currentProjectData: updated };
    });
  },
  
  deleteConnection: (id) => {
    set(state => {
      if (!state.currentProjectData) return {};
      const updated = { 
        ...state.currentProjectData, 
        connections: state.currentProjectData.connections.filter(c => c.id !== id)
      };
      return { currentProjectData: updated };
    });
  },
  
  addLoad: (load) => {
    set(state => {
      if (!state.currentProjectData) return {};
      const updated = { ...state.currentProjectData, loads: [...state.currentProjectData.loads, load] };
      return { currentProjectData: updated };
    });
  },
  
  updateLoad: (id, updates) => {
    set(state => {
      if (!state.currentProjectData) return {};
      const updated = { 
        ...state.currentProjectData, 
        loads: state.currentProjectData.loads.map(l => l.id === id ? { ...l, ...updates } : l)
      };
      return { currentProjectData: updated };
    });
  },
  
  deleteLoad: (id) => {
    set(state => {
      if (!state.currentProjectData) return {};
      const updated = { 
        ...state.currentProjectData, 
        loads: state.currentProjectData.loads.filter(l => l.id !== id)
      };
      return { currentProjectData: updated };
    });
  },
  
  updateCalculations: (calcs) => {
    set(state => {
      if (!state.currentProjectData) return {};
      const updated = { ...state.currentProjectData, calculations: { ...state.currentProjectData.calculations, ...calcs } };
      return { currentProjectData: updated };
    });
  },
  
  updateBOM: (bom) => {
    set(state => {
      if (!state.currentProjectData) return {};
      const updated = { ...state.currentProjectData, bom };
      return { currentProjectData: updated };
    });
  },
  
  updateCostEstimate: (estimate) => {
    set(state => {
      if (!state.currentProjectData) return {};
      const updated = { ...state.currentProjectData, costEstimate: estimate };
      return { currentProjectData: updated };
    });
  },
  
  updateNotes: (notes) => {
    set(state => {
      if (!state.currentProjectData) return {};
      const updated = { ...state.currentProjectData, notes };
      return { currentProjectData: updated };
    });
  }
}));
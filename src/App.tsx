import React, { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { PlusCircle, FolderOpen, Settings, Calculator, Layout, Zap, Battery, Shield, Users, FileText, Trash2, Copy } from 'lucide-react';
import Dashboard from './Dashboard';
import ProjectForm from './ProjectForm';
import DesignCanvas from './DesignCanvas';
import EquipmentLibrary from './EquipmentLibrary';
import PVCalculator from './calculators/PVCalculator';
import InverterCalculator from './calculators/InverterCalculator';
import BatteryCalculator from './calculators/BatteryCalculator';
import CableCalculator from './calculators/CableCalculator';
import ProtectionDesign from './calculators/ProtectionDesign';
import LoadCalculator from './calculators/LoadCalculator';
import SystemTest from './SystemTest';
import CustomerView from './CustomerView';
import './App.css';

type AppView = 'dashboard' | 'projects' | 'new-project' | 'design-canvas' | 'equipment' | 'pv-calc' | 'inverter-calc' | 'battery-calc' | 'cable-calc' | 'protection' | 'loads' | 'system-test' | 'customer-view';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const { projects, currentProject, createProject, deleteProject, duplicateProject, loadProject } = useProjectStore();

  const handleCreateProject = (projectData: any) => {
    createProject(projectData);
    setCurrentView('dashboard');
  };

  const handleOpenProject = (id: string) => {
    loadProject(id);
    setCurrentView('design-canvas');
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
    }
  };

  const handleDuplicateProject = (id: string) => {
    duplicateProject(id);
    alert('Project duplicated successfully!');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            onNewProject={() => setCurrentView('new-project')}
            onMyProjects={() => setCurrentView('projects')}
            onEquipmentLibrary={() => setCurrentView('equipment')}
            onPVDesign={() => setCurrentView('pv-calc')}
            onInverterDesign={() => setCurrentView('inverter-calc')}
            onBatteryDesign={() => setCurrentView('battery-calc')}
            onCableDesign={() => setCurrentView('cable-calc')}
            onProtectionDesign={() => setCurrentView('protection')}
            onLoadCalc={() => setCurrentView('loads')}
            onSystemTest={() => setCurrentView('system-test')}
            onCustomerView={() => setCurrentView('customer-view')}
          />
        );

      case 'new-project':
        return (
          <ProjectForm
            onSubmit={handleCreateProject}
            onCancel={() => setCurrentView('dashboard')}
          />
        );

      case 'projects':
        return (
          <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-4xl font-bold mb-8 flex items-center gap-2">
                <FolderOpen className="text-solar-600" size={40} />
                My Projects
              </h1>

              {projects.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-600 mb-4">No projects yet. Create your first project!</p>
                  <button
                    onClick={() => setCurrentView('new-project')}
                    className="bg-solar-600 text-white px-6 py-2 rounded-lg hover:bg-solar-700 transition-colors"
                  >
                    Create Project
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map(project => (
                    <div key={project.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                      <div className="bg-solar-500 h-32 flex items-center justify-center">
                        <Zap size={64} className="text-white opacity-30" />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2">{project.projectName}</h3>
                        <p className="text-gray-600 mb-1"><span className="font-semibold">Customer:</span> {project.customerName}</p>
                        <p className="text-gray-600 mb-1"><span className="font-semibold">Location:</span> {project.location}</p>
                        <p className="text-gray-600 mb-4"><span className="font-semibold">System:</span> {project.systemType}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenProject(project.id)}
                            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors text-sm font-semibold"
                          >
                            Open
                          </button>
                          <button
                            onClick={() => handleDuplicateProject(project.id)}
                            className="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 transition-colors"
                            title="Duplicate"
                          >
                            <Copy size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => setCurrentView('dashboard')}
                className="mt-8 bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );

      case 'design-canvas':
        return currentProject ? (
          <DesignCanvas
            project={currentProject}
            onBack={() => setCurrentView('dashboard')}
            onEquipment={() => setCurrentView('equipment')}
            onPVCalc={() => setCurrentView('pv-calc')}
            onInverterCalc={() => setCurrentView('inverter-calc')}
            onBatteryCalc={() => setCurrentView('battery-calc')}
            onCableCalc={() => setCurrentView('cable-calc')}
            onLoadCalc={() => setCurrentView('loads')}
            onSystemTest={() => setCurrentView('system-test')}
            onCustomerView={() => setCurrentView('customer-view')}
          />
        ) : (
          <div className="p-8"><p>No project selected</p></div>
        );

      case 'equipment':
        return (
          <EquipmentLibrary
            onBack={() => setCurrentView(currentProject ? 'design-canvas' : 'dashboard')}
          />
        );

      case 'pv-calc':
        return (
          <PVCalculator
            onBack={() => setCurrentView('design-canvas')}
            onSave={(calcs) => {
              // Save calculations to current project
              setCurrentView('design-canvas');
            }}
          />
        );

      case 'inverter-calc':
        return <InverterCalculator onBack={() => setCurrentView('design-canvas')} />;

      case 'battery-calc':
        return <BatteryCalculator onBack={() => setCurrentView('design-canvas')} />;

      case 'cable-calc':
        return <CableCalculator onBack={() => setCurrentView('design-canvas')} />;

      case 'protection':
        return <ProtectionDesign onBack={() => setCurrentView('design-canvas')} />;

      case 'loads':
        return <LoadCalculator onBack={() => setCurrentView('design-canvas')} />;

      case 'system-test':
        return currentProject ? (
          <SystemTest
            project={currentProject}
            onBack={() => setCurrentView('design-canvas')}
          />
        ) : null;

      case 'customer-view':
        return currentProject ? (
          <CustomerView
            project={currentProject}
            onBack={() => setCurrentView('design-canvas')}
          />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {renderView()}
    </div>
  );
}

export default App;
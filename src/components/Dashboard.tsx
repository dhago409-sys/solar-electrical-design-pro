import React from 'react';
import { Zap, Plus, FolderOpen, Wrench, Calculator, Lightbulb, Battery, Shield, Users, BarChart3, FileText, CheckCircle } from 'lucide-react';

interface DashboardProps {
  onNewProject: () => void;
  onMyProjects: () => void;
  onEquipmentLibrary: () => void;
  onPVDesign: () => void;
  onInverterDesign: () => void;
  onBatteryDesign: () => void;
  onCableDesign: () => void;
  onProtectionDesign: () => void;
  onLoadCalc: () => void;
  onSystemTest: () => void;
  onCustomerView: () => void;
}

function Dashboard({
  onNewProject,
  onMyProjects,
  onEquipmentLibrary,
  onPVDesign,
  onInverterDesign,
  onBatteryDesign,
  onCableDesign,
  onProtectionDesign,
  onLoadCalc,
  onSystemTest,
  onCustomerView
}: DashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Header */}
      <div className="bg-black bg-opacity-50 border-b border-solar-500 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Zap size={48} className="text-solar-500" />
            <h1 className="text-5xl font-bold">SOLAR & ELECTRICAL DESIGN PRO</h1>
          </div>
          <p className="text-gray-300 text-lg">Professional solar installation design software for engineers and installers</p>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="max-w-7xl mx-auto p-8">
        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Zap className="text-solar-500" size={32} />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={onNewProject}
              className="bg-gradient-to-br from-solar-500 to-solar-600 hover:from-solar-600 hover:to-solar-700 p-6 rounded-lg shadow-lg transition-all transform hover:scale-105"
            >
              <Plus size={32} className="mx-auto mb-3" />
              <div className="font-bold text-lg">New Project</div>
            </button>
            <button
              onClick={onMyProjects}
              className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 p-6 rounded-lg shadow-lg transition-all transform hover:scale-105"
            >
              <FolderOpen size={32} className="mx-auto mb-3" />
              <div className="font-bold text-lg">My Projects</div>
            </button>
            <button
              onClick={onEquipmentLibrary}
              className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 p-6 rounded-lg shadow-lg transition-all transform hover:scale-105"
            >
              <Wrench size={32} className="mx-auto mb-3" />
              <div className="font-bold text-lg">Equipment</div>
            </button>
            <button
              onClick={onSystemTest}
              className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 p-6 rounded-lg shadow-lg transition-all transform hover:scale-105"
            >
              <CheckCircle size={32} className="mx-auto mb-3" />
              <div className="font-bold text-lg">System Test</div>
            </button>
          </div>
        </div>

        {/* Calculators */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Calculator className="text-solar-500" size={32} />
            Engineering Calculators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-solar-500 transition-colors cursor-pointer" onClick={onLoadCalc}>
              <Lightbulb size={32} className="text-yellow-400 mb-3" />
              <h3 className="font-bold text-lg mb-2">Load Calculator</h3>
              <p className="text-gray-400 text-sm">Calculate connected load and daily energy</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-solar-500 transition-colors cursor-pointer" onClick={onPVDesign}>
              <Zap size={32} className="text-solar-500 mb-3" />
              <h3 className="font-bold text-lg mb-2">PV Design</h3>
              <p className="text-gray-400 text-sm">Size solar panels and optimize configuration</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-solar-500 transition-colors cursor-pointer" onClick={onInverterDesign}>
              <Zap size={32} className="text-blue-400 mb-3" />
              <h3 className="font-bold text-lg mb-2">Inverter Size</h3>
              <p className="text-gray-400 text-sm">Calculate inverter capacity and check compatibility</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-solar-500 transition-colors cursor-pointer" onClick={onBatteryDesign}>
              <Battery size={32} className="text-green-400 mb-3" />
              <h3 className="font-bold text-lg mb-2">Battery Size</h3>
              <p className="text-gray-400 text-sm">Size battery bank for required backup hours</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-solar-500 transition-colors cursor-pointer" onClick={onCableDesign}>
              <Shield size={32} className="text-red-400 mb-3" />
              <h3 className="font-bold text-lg mb-2">Cable Sizing</h3>
              <p className="text-gray-400 text-sm">Calculate wire sizes and voltage drop</p>
            </div>
          </div>
        </div>

        {/* Design Tools */}
        <div>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <BarChart3 className="text-solar-500" size={32} />
            Design & Reports
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-solar-500 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Protection Design</h3>
                <Shield className="text-orange-400" size={24} />
              </div>
              <p className="text-gray-400 text-sm mb-4">Design DC/AC protection and earthing</p>
              <button
                onClick={onProtectionDesign}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded transition-colors font-semibold"
              >
                Open
              </button>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-solar-500 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Customer View</h3>
                <Users className="text-blue-400" size={24} />
              </div>
              <p className="text-gray-400 text-sm mb-4">Generate professional customer summary</p>
              <button
                onClick={onCustomerView}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors font-semibold"
              >
                Open
              </button>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-solar-500 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">PDF Report</h3>
                <FileText className="text-red-400" size={24} />
              </div>
              <p className="text-gray-400 text-sm mb-4">Export complete engineering report</p>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors font-semibold">
                Generate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
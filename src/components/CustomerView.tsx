import React from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { Project } from '../types';
import { generateProjectPDF, downloadPDF } from '../utils/pdfExport';
import { useProjectStore } from '../store/projectStore';

interface CustomerViewProps {
  project: Project;
  onBack: () => void;
}

function CustomerView({ project, onBack }: CustomerViewProps) {
  const { currentProjectData } = useProjectStore();
  const calculations = currentProjectData?.calculations || {};

  const handleGeneratePDF = async () => {
    const pdf = await generateProjectPDF({
      customerName: project.customerName,
      projectName: project.projectName,
      location: project.location,
      systemType: project.systemType,
      companyName: 'Solar & Electrical Design Pro',
      designerName: project.designer,
      data: currentProjectData || { equipment: [], connections: [], loads: [], calculations: {}, bom: [], costEstimate: { equipment: 0, labor: 0, transportation: 0, installation: 0, engineering: 0, other: 0, subtotal: 0, profit: 0, total: 0, currency: 'USD' }, notes: '' },
      notes: 'Professional solar installation system design'
    });
    downloadPDF(pdf, `${project.projectName}-report.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-4xl mx-auto p-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-8 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Design
        </button>

        {/* Customer Summary */}
        <div className="bg-gradient-to-r from-solar-500 to-solar-600 rounded-lg shadow-2xl p-12 mb-8 text-center">
          <p className="text-lg text-gray-100 mb-2">CUSTOMER SOLAR SYSTEM</p>
          <h1 className="text-5xl font-bold mb-4">{(calculations.pvSize || 0) / 1000} kWp</h1>
          <p className="text-gray-100">{project.customerName} • {project.location}</p>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Solar Panels */}
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <div className="text-yellow-400 text-4xl mb-3">☀️</div>
            <h2 className="text-2xl font-bold mb-2">Solar Panels</h2>
            <p className="text-4xl font-bold text-yellow-400">{calculations.numPanels || 0}</p>
            <p className="text-gray-400 mt-2">× {calculations.pvSize && calculations.numPanels ? Math.round(calculations.pvSize / calculations.numPanels) : 0} W</p>
          </div>

          {/* Inverter */}
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <div className="text-blue-400 text-4xl mb-3">📦</div>
            <h2 className="text-2xl font-bold mb-2">Inverter</h2>
            <p className="text-4xl font-bold text-blue-400">{(calculations.inverterSize || 0) / 1000} kW</p>
            <p className="text-gray-400 mt-2">Hybrid Inverter</p>
          </div>

          {/* Battery Storage */}
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <div className="text-green-400 text-4xl mb-3">🔋</div>
            <h2 className="text-2xl font-bold mb-2">Battery Storage</h2>
            <p className="text-4xl font-bold text-green-400">{(calculations.batteryCapacity || 0) / 1000} kWh</p>
            <p className="text-gray-400 mt-2">Backup: {calculations.backupHours ? calculations.backupHours.toFixed(1) : 'N/A'} hours</p>
          </div>

          {/* Daily Energy */}
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <div className="text-purple-400 text-4xl mb-3">⚡</div>
            <h2 className="text-2xl font-bold mb-2">Daily Energy</h2>
            <p className="text-4xl font-bold text-purple-400">{(calculations.dailyEnergy || 0).toFixed(1)} kWh</p>
            <p className="text-gray-400 mt-2">Average per day</p>
          </div>
        </div>

        {/* System Diagram */}
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">System Configuration</h3>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="bg-yellow-50 text-gray-900 px-4 py-2 rounded font-bold">☀️ PV Array</div>
            <div className="text-white text-2xl">→</div>
            <div className="bg-red-50 text-gray-900 px-4 py-2 rounded font-bold">⚡ Combiner</div>
            <div className="text-white text-2xl">→</div>
            <div className="bg-blue-50 text-gray-900 px-4 py-2 rounded font-bold">📦 Inverter</div>
            <div className="text-white text-2xl">↔</div>
            <div className="bg-green-50 text-gray-900 px-4 py-2 rounded font-bold">🔋 Battery</div>
            <div className="text-white text-2xl">→</div>
            <div className="bg-orange-50 text-gray-900 px-4 py-2 rounded font-bold">📊 Distribution</div>
            <div className="text-white text-2xl">→</div>
            <div className="bg-purple-50 text-gray-900 px-4 py-2 rounded font-bold">💡 Loads</div>
          </div>
        </div>

        {/* Project Info */}
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 mb-8">
          <h3 className="text-xl font-bold mb-4">Project Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Customer</p>
              <p className="font-bold text-lg">{project.customerName}</p>
            </div>
            <div>
              <p className="text-gray-400">Project Name</p>
              <p className="font-bold text-lg">{project.projectName}</p>
            </div>
            <div>
              <p className="text-gray-400">Location</p>
              <p className="font-bold text-lg">{project.location}</p>
            </div>
            <div>
              <p className="text-gray-400">System Type</p>
              <p className="font-bold text-lg uppercase">{project.systemType.replace('-', ' ')}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleGeneratePDF}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
          >
            <Download size={20} />
            Generate PDF Report
          </button>
          <button
            onClick={onBack}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Back to Design
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomerView;
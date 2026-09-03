import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { LoadItem } from '../types';
import { calculateDailyEnergy, calculateConnectedLoad, calculatePeakLoad } from '../utils/calculations';

interface LoadCalculatorProps {
  onBack: () => void;
}

function LoadCalculator({ onBack }: LoadCalculatorProps) {
  const { currentProjectData, addLoad, updateLoad, deleteLoad, updateCalculations } = useProjectStore();
  const [newLoad, setNewLoad] = useState<Partial<LoadItem>>({
    equipment: '',
    quantity: 1,
    watts: 0,
    hoursPerDay: 0,
    voltage: 230
  });

  const loads = currentProjectData?.loads || [];
  const connectedLoad = calculateConnectedLoad(loads);
  const peakLoad = loads.length > 0 ? calculatePeakLoad(loads) : 0;
  const dailyEnergy = calculateDailyEnergy(loads);

  const handleAddLoad = () => {
    if (newLoad.equipment && newLoad.watts && newLoad.quantity) {
      addLoad({
        id: Date.now().toString(),
        equipment: newLoad.equipment,
        quantity: newLoad.quantity || 1,
        watts: newLoad.watts || 0,
        hoursPerDay: newLoad.hoursPerDay || 0,
        voltage: newLoad.voltage || 230
      });
      setNewLoad({ equipment: '', quantity: 1, watts: 0, hoursPerDay: 0, voltage: 230 });
    }
  };

  const handleSave = () => {
    updateCalculations({
      dailyEnergy: dailyEnergy
    });
    onBack();
  };

  const commonLoads = [
    { name: 'LED Bulb 9W', watts: 9, hours: 8 },
    { name: 'Ceiling Fan 75W', watts: 75, hours: 8 },
    { name: 'TV 100W', watts: 100, hours: 6 },
    { name: 'Refrigerator 150W', watts: 150, hours: 24 },
    { name: 'Water Pump 750W', watts: 750, hours: 2 },
    { name: 'AC 1200W', watts: 1200, hours: 4 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-8 text-blue-600 hover:text-blue-800 transition-colors font-semibold"
        >
          <ArrowLeft size={20} />
          Back to Design Canvas
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">Electrical Load Calculator</h1>
          <p className="text-gray-600 mb-6">Calculate total system load and daily energy consumption</p>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 p-6 rounded">
              <p className="text-gray-600 text-sm font-semibold">Connected Load</p>
              <p className="text-3xl font-bold text-yellow-700">{connectedLoad}</p>
              <p className="text-xs text-gray-500 mt-1">W</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 p-6 rounded">
              <p className="text-gray-600 text-sm font-semibold">Peak Load</p>
              <p className="text-3xl font-bold text-blue-700">{peakLoad}</p>
              <p className="text-xs text-gray-500 mt-1">W</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500 p-6 rounded">
              <p className="text-gray-600 text-sm font-semibold">Daily Energy</p>
              <p className="text-3xl font-bold text-green-700">{dailyEnergy.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">kWh/day</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500 p-6 rounded">
              <p className="text-gray-600 text-sm font-semibold">Total Items</p>
              <p className="text-3xl font-bold text-purple-700">{loads.length}</p>
              <p className="text-xs text-gray-500 mt-1">Loads</p>
            </div>
          </div>

          {/* Add New Load */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Add New Load</h2>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Equipment</label>
                <input
                  type="text"
                  value={newLoad.equipment || ''}
                  onChange={(e) => setNewLoad({ ...newLoad, equipment: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Light bulb"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Quantity</label>
                <input
                  type="number"
                  value={newLoad.quantity || 1}
                  onChange={(e) => setNewLoad({ ...newLoad, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Watts</label>
                <input
                  type="number"
                  value={newLoad.watts || 0}
                  onChange={(e) => setNewLoad({ ...newLoad, watts: parseFloat(e.target.value) || 0 })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Hours/Day</label>
                <input
                  type="number"
                  value={newLoad.hoursPerDay || 0}
                  onChange={(e) => setNewLoad({ ...newLoad, hoursPerDay: parseFloat(e.target.value) || 0 })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Voltage</label>
                <input
                  type="number"
                  value={newLoad.voltage || 230}
                  onChange={(e) => setNewLoad({ ...newLoad, voltage: parseFloat(e.target.value) || 230 })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAddLoad}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Add
                </button>
              </div>
            </div>

            {/* Quick Load Presets */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              {commonLoads.map((load, idx) => (
                <button
                  key={idx}
                  onClick={() => setNewLoad({ equipment: load.name, quantity: 1, watts: load.watts, hoursPerDay: load.hours, voltage: 230 })}
                  className="text-xs bg-white border border-blue-300 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded transition-colors"
                >
                  {load.name}
                </button>
              ))}
            </div>
          </div>

          {/* Load Table */}
          {loads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="text-left px-4 py-3 font-bold">Equipment</th>
                    <th className="text-center px-4 py-3 font-bold">Qty</th>
                    <th className="text-right px-4 py-3 font-bold">Watts</th>
                    <th className="text-right px-4 py-3 font-bold">Hours/Day</th>
                    <th className="text-right px-4 py-3 font-bold">Wh/Day</th>
                    <th className="text-right px-4 py-3 font-bold">Total W</th>
                    <th className="text-center px-4 py-3 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loads.map((load) => (
                    <tr key={load.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{load.equipment}</td>
                      <td className="text-center px-4 py-3">{load.quantity}</td>
                      <td className="text-right px-4 py-3">{load.watts} W</td>
                      <td className="text-right px-4 py-3">{load.hoursPerDay} h</td>
                      <td className="text-right px-4 py-3 font-semibold text-green-600">{(load.watts * load.hoursPerDay).toFixed(0)} Wh</td>
                      <td className="text-right px-4 py-3 font-semibold text-blue-600">{load.watts * load.quantity} W</td>
                      <td className="text-center px-4 py-3">
                        <button
                          onClick={() => deleteLoad(load.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">No loads added yet. Add your first load above.</p>
            </div>
          )}

          {/* Save Button */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
            >
              Save and Continue
            </button>
            <button
              onClick={onBack}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadCalculator;
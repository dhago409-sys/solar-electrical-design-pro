import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { calculateBatteryCapacity, calculateBatteryAh, calculateNumBatteries, calculateBackupTime } from '../utils/calculations';

interface BatteryCalculatorProps {
  onBack: () => void;
}

function BatteryCalculator({ onBack }: BatteryCalculatorProps) {
  const { currentProjectData, updateCalculations } = useProjectStore();
  const dailyEnergy = currentProjectData?.calculations?.dailyEnergy || 0;
  const loads = currentProjectData?.loads || [];
  const peakLoad = loads.length > 0 ? Math.max(...loads.map(l => l.watts * l.quantity)) : 0;

  const [inputs, setInputs] = useState({
    dailyEnergy: dailyEnergy || 5,
    backupHours: 8,
    batteryVoltage: 48,
    batteryAh: 200,
    depthOfDischarge: 0.8,
    efficiency: 0.9,
    selectedBattery: '5120' // Wh
  });

  const [results, setResults] = useState<any>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(() => {
    calculateBattery();
  }, [inputs, dailyEnergy]);

  const calculateBattery = () => {
    const requiredCapacity = calculateBatteryCapacity(inputs.dailyEnergy, inputs.depthOfDischarge, inputs.efficiency);
    const requiredAh = calculateBatteryAh(requiredCapacity, inputs.batteryVoltage);
    const numBatteries = calculateNumBatteries(requiredAh, inputs.batteryAh);
    
    const totalCapacity = numBatteries * inputs.batteryAh * inputs.batteryVoltage;
    const usableCapacity = totalCapacity * inputs.depthOfDischarge * inputs.efficiency;
    const backupTime = calculateBackupTime(usableCapacity, peakLoad);

    const warnings: string[] = [];
    if (requiredCapacity < inputs.batteryVoltage * inputs.batteryAh) {
      warnings.push('ℹ️ Battery capacity exceeds requirement (safety margin included)');
    }
    if (backupTime < inputs.backupHours) {
      warnings.push(`⚠️ Backup time (${backupTime.toFixed(1)}h) is less than target (${inputs.backupHours}h)`);
    }
    if (inputs.depthOfDischarge > 0.8) {
      warnings.push('⚠️ High DoD reduces battery lifespan');
    }

    const calcs = {
      requiredCapacity: Math.ceil(requiredCapacity),
      requiredAh: Math.ceil(requiredAh),
      numBatteries: numBatteries,
      totalCapacity: totalCapacity,
      usableCapacity: Math.round(usableCapacity),
      backupHours: backupTime
    };

    setResults(calcs);
    setWarnings(warnings);
    updateCalculations({ 
      batteryCapacity: Math.ceil(requiredCapacity),
      batteryAh: Math.ceil(requiredAh),
      numBatteries: numBatteries,
      backupHours: backupTime
    });
  };

  const batteryOptions = [
    { value: '2400', label: '2.4 kWh (48V 50Ah)' },
    { value: '4800', label: '4.8 kWh (48V 100Ah)' },
    { value: '5120', label: '5.12 kWh (48V 106Ah LiFePO4)' },
    { value: '9600', label: '9.6 kWh (48V 200Ah)' },
    { value: '10240', label: '10.24 kWh (48V 213Ah LiFePO4)' },
    { value: '15360', label: '15.36 kWh (48V 320Ah)' },
    { value: '20480', label: '20.48 kWh (48V 426Ah LiFePO4)' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 mb-8 text-blue-600 hover:text-blue-800 font-semibold">
          <ArrowLeft size={20} />
          Back to Design
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Battery Bank Sizing Calculator</h1>

            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <p className="text-sm font-bold text-gray-700">Daily Energy Consumption</p>
                <p className="text-2xl font-bold text-green-700 mt-2">{inputs.dailyEnergy} kWh</p>
                <p className="text-xs text-gray-600 mt-1">From load calculator</p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Backup Hours Required *</label>
                <input
                  type="number"
                  value={inputs.backupHours}
                  onChange={(e) => setInputs({ ...inputs, backupHours: parseFloat(e.target.value) })}
                  className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500 text-lg"
                  step="1"
                  min="1"
                />
                <p className="text-xs text-gray-500 mt-1">Night hours or cloudy day duration</p>
              </div>

              <div className="border-t-2 border-gray-200 pt-6">
                <h3 className="font-bold text-lg mb-4">Battery Specifications</h3>
                
                <div>
                  <label className="block text-sm font-bold mb-2">Battery Voltage (V) *</label>
                  <select
                    value={inputs.batteryVoltage}
                    onChange={(e) => setInputs({ ...inputs, batteryVoltage: parseInt(e.target.value) })}
                    className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                  >
                    <option value="12">12V</option>
                    <option value="24">24V</option>
                    <option value="48">48V</option>
                    <option value="96">96V</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-bold mb-2">Single Battery Capacity (Ah) *</label>
                  <input
                    type="number"
                    value={inputs.batteryAh}
                    onChange={(e) => setInputs({ ...inputs, batteryAh: parseInt(e.target.value) })}
                    className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                    step="50"
                    min="50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Depth of Discharge (%)</label>
                  <input
                    type="number"
                    value={(inputs.depthOfDischarge * 100).toFixed(0)}
                    onChange={(e) => setInputs({ ...inputs, depthOfDischarge: parseInt(e.target.value) / 100 })}
                    className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                    min="50"
                    max="100"
                  />
                  <p className="text-xs text-gray-500 mt-1">LiFePO4: 80-100%, Lead-acid: 50-60%</p>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Efficiency (%)</label>
                  <input
                    type="number"
                    value={(inputs.efficiency * 100).toFixed(0)}
                    onChange={(e) => setInputs({ ...inputs, efficiency: parseInt(e.target.value) / 100 })}
                    className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                    min="80"
                    max="98"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {results && (
              <>
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">Battery Requirements</h2>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 p-4 rounded">
                      <p className="text-gray-600 text-sm font-bold">Required Capacity</p>
                      <p className="text-3xl font-bold text-green-700">{(results.requiredCapacity / 1000).toFixed(2)} kWh</p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-4 rounded">
                      <p className="text-gray-600 text-sm font-bold">Required Ah @ {inputs.batteryVoltage}V</p>
                      <p className="text-3xl font-bold text-blue-700">{results.requiredAh} Ah</p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500 p-4 rounded">
                      <p className="text-gray-600 text-sm font-bold">Number of Batteries</p>
                      <p className="text-3xl font-bold text-purple-700">{results.numBatteries}</p>
                      <p className="text-sm text-gray-600 mt-1">{inputs.batteryAh} Ah each @ {inputs.batteryVoltage}V</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded border-l-4 border-gray-400">
                        <p className="text-gray-600 text-sm font-bold">Total Capacity</p>
                        <p className="text-2xl font-bold text-gray-700">{(results.totalCapacity / 1000).toFixed(1)} kWh</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded border-l-4 border-gray-400">
                        <p className="text-gray-600 text-sm font-bold">Usable Capacity</p>
                        <p className="text-2xl font-bold text-gray-700">{(results.usableCapacity / 1000).toFixed(1)} kWh</p>
                      </div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded border-l-4 border-orange-500">
                      <p className="text-gray-600 text-sm font-bold">Backup Duration</p>
                      <p className="text-3xl font-bold text-orange-700">{results.backupHours.toFixed(1)} hours</p>
                    </div>
                  </div>
                </div>

                {warnings.length > 0 && (
                  <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-6">
                    <h3 className="font-bold text-orange-800 mb-3">⚠️ Warnings</h3>
                    <ul className="space-y-2">
                      {warnings.map((w, i) => (
                        <li key={i} className="text-orange-700 text-sm">{w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={onBack}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-lg transition-all"
                >
                  Save and Continue
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BatteryCalculator;
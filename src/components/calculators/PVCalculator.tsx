import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { calculatePVSize, calculateNumPanels, calculatePVVoltage, calculatePVCurrent } from '../utils/calculations';

interface PVCalculatorProps {
  onBack: () => void;
  onSave?: (calcs: any) => void;
}

function PVCalculator({ onBack, onSave }: PVCalculatorProps) {
  const { currentProjectData, updateCalculations } = useProjectStore();
  const dailyEnergy = currentProjectData?.calculations?.dailyEnergy || 0;

  const [inputs, setInputs] = useState({
    dailyEnergy: dailyEnergy || 5,
    peakSunHours: 5,
    systemEfficiency: 0.75,
    panelWattage: 550,
    vmp: 42,
    voc: 48,
    imp: 13.1,
    isc: 14
  });

  const [results, setResults] = useState<any>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(() => {
    calculatePV();
  }, [inputs]);

  const calculatePV = () => {
    const requiredPower = calculatePVSize(inputs.dailyEnergy * 1000, inputs.peakSunHours, inputs.systemEfficiency);
    const numPanels = calculateNumPanels(requiredPower, inputs.panelWattage);
    
    // Optimize series/parallel
    let seriesPanels = Math.ceil(Math.sqrt(numPanels));
    let parallelStrings = Math.ceil(numPanels / seriesPanels);
    
    // Adjust for optimal voltage
    const targetVoltage = 384; // 8 * 48V batteries typical
    const optimalSeries = Math.round(targetVoltage / inputs.vmp);
    if (optimalSeries > 0) {
      seriesPanels = optimalSeries;
      parallelStrings = Math.ceil(numPanels / seriesPanels);
    }
    
    const pvVoltage = seriesPanels * inputs.vmp;
    const pvCurrent = parallelStrings * inputs.imp;
    const actualPower = seriesPanels * parallelStrings * inputs.panelWattage;

    const calcs = {
      requiredPower: Math.round(requiredPower),
      numPanels: seriesPanels * parallelStrings,
      seriesPanels,
      parallelStrings,
      pvVoltage: Math.round(pvVoltage),
      pvCurrent: pvCurrent.toFixed(1),
      actualPower: actualPower,
      totalPVPower: (actualPower / 1000).toFixed(2)
    };

    const newWarnings: string[] = [];
    if (pvVoltage < 200) newWarnings.push('⚠️ PV voltage is low. Consider more series panels.');
    if (pvVoltage > 600) newWarnings.push('⚠️ PV voltage is very high. Safety concerns.');
    if (pvCurrent > 200) newWarnings.push('⚠️ High PV current. Use larger cables.');
    if (actualPower < requiredPower * 0.9) newWarnings.push('⚠️ Actual PV power is below required.');
    if (actualPower > requiredPower * 1.3) newWarnings.push('ℹ️ Actual PV power exceeds requirement by >30%.');

    setResults(calcs);
    setWarnings(newWarnings);
    updateCalculations(calcs);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-8 text-blue-600 hover:text-blue-800 font-semibold"
        >
          <ArrowLeft size={20} />
          Back to Design
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Solar PV Design Calculator</h1>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">Daily Energy Consumption (kWh/day) *</label>
                <input
                  type="number"
                  value={inputs.dailyEnergy}
                  onChange={(e) => setInputs({ ...inputs, dailyEnergy: parseFloat(e.target.value) || 0 })}
                  className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500 text-lg"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Peak Sun Hours (avg per day) *</label>
                <input
                  type="number"
                  value={inputs.peakSunHours}
                  onChange={(e) => setInputs({ ...inputs, peakSunHours: parseFloat(e.target.value) || 0 })}
                  className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500 text-lg"
                  step="0.1"
                />
                <p className="text-xs text-gray-500 mt-1">Typical values: 3-6 (based on location and season)</p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">System Efficiency %</label>
                <input
                  type="number"
                  value={(inputs.systemEfficiency * 100).toFixed(1)}
                  onChange={(e) => setInputs({ ...inputs, systemEfficiency: parseFloat(e.target.value) / 100 })}
                  className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500 text-lg"
                  step="1"
                  min="50"
                  max="95"
                />
                <p className="text-xs text-gray-500 mt-1">Inverter, cable, and battery losses (75% typical)</p>
              </div>

              <div className="border-t-2 border-gray-200 pt-6 mt-6">
                <h3 className="font-bold text-lg mb-4">Panel Specifications</h3>
                
                <div>
                  <label className="block text-sm font-bold mb-2">Panel Wattage (W)</label>
                  <input
                    type="number"
                    value={inputs.panelWattage}
                    onChange={(e) => setInputs({ ...inputs, panelWattage: parseFloat(e.target.value) || 0 })}
                    className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Vmp (V)</label>
                    <input type="number" value={inputs.vmp} onChange={(e) => setInputs({ ...inputs, vmp: parseFloat(e.target.value) })} className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500" step="0.1" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Voc (V)</label>
                    <input type="number" value={inputs.voc} onChange={(e) => setInputs({ ...inputs, voc: parseFloat(e.target.value) })} className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500" step="0.1" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Imp (A)</label>
                    <input type="number" value={inputs.imp} onChange={(e) => setInputs({ ...inputs, imp: parseFloat(e.target.value) })} className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500" step="0.1" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Isc (A)</label>
                    <input type="number" value={inputs.isc} onChange={(e) => setInputs({ ...inputs, isc: parseFloat(e.target.value) })} className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500" step="0.1" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {results && (
              <>
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">Calculated Results</h2>
                  
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-4 rounded">
                      <p className="text-gray-600 text-sm font-bold">Required PV Capacity</p>
                      <p className="text-3xl font-bold text-blue-700">{(results.requiredPower / 1000).toFixed(2)} kW</p>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
                      <p className="text-gray-600 text-sm font-bold">Number of Panels</p>
                      <p className="text-3xl font-bold text-yellow-700">{results.numPanels}</p>
                      <p className="text-sm text-gray-600 mt-1">{results.seriesPanels} series × {results.parallelStrings} parallel</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500 p-4 rounded">
                        <p className="text-gray-600 text-sm font-bold">PV Voltage</p>
                        <p className="text-2xl font-bold text-purple-700">{results.pvVoltage} V</p>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 p-4 rounded">
                        <p className="text-gray-600 text-sm font-bold">PV Current</p>
                        <p className="text-2xl font-bold text-green-700">{results.pvCurrent} A</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-l-4 border-indigo-500 p-4 rounded">
                      <p className="text-gray-600 text-sm font-bold">Actual PV Array Size</p>
                      <p className="text-3xl font-bold text-indigo-700">{results.totalPVPower} kW</p>
                    </div>
                  </div>
                </div>

                {warnings.length > 0 && (
                  <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-6">
                    <h3 className="font-bold text-orange-800 mb-3">⚠️ Design Warnings</h3>
                    <ul className="space-y-2">
                      {warnings.map((w, i) => (
                        <li key={i} className="text-orange-700 text-sm">{w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
                  <h3 className="font-bold text-blue-800 mb-3">📋 Formula Used</h3>
                  <p className="text-blue-700 text-sm font-mono bg-white p-3 rounded">Required PV = (Daily Energy × 1000) / (Peak Sun Hours × Efficiency)</p>
                </div>
              </>
            )}

            <button
              onClick={onBack}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-lg transition-all"
            >
              Save and Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PVCalculator;
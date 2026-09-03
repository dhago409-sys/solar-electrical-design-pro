import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { calculateInverterSize, checkMPPTCompatibility } from '../utils/calculations';

interface InverterCalculatorProps {
  onBack: () => void;
}

function InverterCalculator({ onBack }: InverterCalculatorProps) {
  const { currentProjectData, updateCalculations } = useProjectStore();
  const loads = currentProjectData?.loads || [];
  const pvData = currentProjectData?.calculations || {};

  const totalLoad = loads.reduce((sum, l) => sum + l.watts * l.quantity, 0);
  const peakLoad = loads.length > 0 ? Math.max(...loads.map(l => l.watts * l.quantity)) : 0;

  const [inputs, setInputs] = useState({
    surgeMultiplier: 1.5,
    continuousPower: totalLoad,
    surgeLoad: peakLoad * 2,
    mpptMin: 150,
    mpptMax: 600,
    selectedInverter: '5000' // W
  });

  const [results, setResults] = useState<any>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(() => {
    calculateInverter();
  }, [inputs, loads, pvData]);

  const calculateInverter = () => {
    const requiredSize = calculateInverterSize(totalLoad, inputs.surgeMultiplier);
    const selectedSize = parseInt(inputs.selectedInverter);

    const warnings: string[] = [];
    let mpptOk = true;

    if (pvData.pvVoltage) {
      mpptOk = checkMPPTCompatibility(pvData.pvVoltage, inputs.mpptMin, inputs.mpptMax);
      if (!mpptOk) {
        warnings.push(`⚠️ PV voltage ${pvData.pvVoltage}V is outside MPPT range (${inputs.mpptMin}-${inputs.mpptMax}V)`);
      }
    }

    if (selectedSize < requiredSize) {
      warnings.push(`⚠️ Selected inverter ${selectedSize}W is undersized. Minimum: ${Math.ceil(requiredSize)}W`);
    }

    if (selectedSize < totalLoad) {
      warnings.push(`❌ CRITICAL: Inverter cannot handle peak load of ${totalLoad}W`);
    }

    if (pvData.pvCurrent && pvData.pvCurrent > 150) {
      warnings.push(`⚠️ High PV current ${pvData.pvCurrent}A requires oversized cables and breakers`);
    }

    const calcs = {
      requiredSize: Math.ceil(requiredSize),
      selectedSize: selectedSize,
      totalLoad: totalLoad,
      peakLoad: peakLoad,
      surgeLoad: peakLoad * inputs.surgeMultiplier,
      inverterSize: selectedSize,
      mpptCompatible: mpptOk
    };

    setResults(calcs);
    setWarnings(warnings);
    updateCalculations({ inverterSize: selectedSize });
  };

  const inverterOptions = [
    { value: '2000', label: '2 kW' },
    { value: '3000', label: '3 kW' },
    { value: '5000', label: '5 kW' },
    { value: '6000', label: '6 kW' },
    { value: '8000', label: '8 kW' },
    { value: '10000', label: '10 kW' },
    { value: '15000', label: '15 kW' },
    { value: '20000', label: '20 kW' }
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
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Inverter Sizing Calculator</h1>

            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm font-bold text-gray-700">Load Summary</p>
                <p className="text-2xl font-bold text-blue-700 mt-2">{totalLoad} W</p>
                <p className="text-xs text-gray-600 mt-1">Total connected load</p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Surge Multiplier</label>
                <input
                  type="number"
                  value={inputs.surgeMultiplier}
                  onChange={(e) => setInputs({ ...inputs, surgeMultiplier: parseFloat(e.target.value) })}
                  className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                  step="0.1"
                  min="1"
                />
                <p className="text-xs text-gray-500 mt-1">Typical: 1.3-2.0 (motors and AC units need higher)</p>
              </div>

              <div className="border-t-2 border-gray-200 pt-6">
                <h3 className="font-bold text-lg mb-4">MPPT Compatibility</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">MPPT Min (V)</label>
                    <input
                      type="number"
                      value={inputs.mpptMin}
                      onChange={(e) => setInputs({ ...inputs, mpptMin: parseInt(e.target.value) })}
                      className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">MPPT Max (V)</label>
                    <input
                      type="number"
                      value={inputs.mpptMax}
                      onChange={(e) => setInputs({ ...inputs, mpptMax: parseInt(e.target.value) })}
                      className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                {pvData.pvVoltage && (
                  <div className="mt-3 p-3 bg-gray-100 rounded">
                    <p className="text-sm">PV Voltage: <span className="font-bold text-blue-600">{pvData.pvVoltage}V</span></p>
                  </div>
                )}
              </div>

              <div className="border-t-2 border-gray-200 pt-6">
                <label className="block text-sm font-bold mb-3">Select Inverter Size *</label>
                <select
                  value={inputs.selectedInverter}
                  onChange={(e) => setInputs({ ...inputs, selectedInverter: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500 text-lg font-semibold"
                >
                  {inverterOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {results && (
              <>
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">Inverter Specifications</h2>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-4 rounded">
                      <p className="text-gray-600 text-sm font-bold">Selected Inverter Size</p>
                      <p className="text-3xl font-bold text-blue-700">{(results.selectedSize / 1000).toFixed(1)} kW</p>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 p-4 rounded">
                      <p className="text-gray-600 text-sm font-bold">Minimum Required Size</p>
                      <p className="text-2xl font-bold text-green-700">{(results.requiredSize / 1000).toFixed(1)} kW</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded border-l-4 border-gray-400">
                        <p className="text-gray-600 text-sm font-bold">Continuous Power</p>
                        <p className="text-2xl font-bold text-gray-700">{results.totalLoad} W</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded border-l-4 border-gray-400">
                        <p className="text-gray-600 text-sm font-bold">Peak Load</p>
                        <p className="text-2xl font-bold text-gray-700">{results.peakLoad} W</p>
                      </div>
                    </div>

                    {results.mpptCompatible !== undefined && (
                      <div className={`p-4 rounded border-l-4 ${results.mpptCompatible ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                        <p className="font-bold">{results.mpptCompatible ? '✅ MPPT Compatible' : '❌ MPPT Incompatible'}</p>
                        {pvData.pvVoltage && (
                          <p className="text-sm mt-1">PV: {pvData.pvVoltage}V, MPPT: {inputs.mpptMin}-{inputs.mpptMax}V</p>
                        )}
                      </div>
                    )}
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

export default InverterCalculator;
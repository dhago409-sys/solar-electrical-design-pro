import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { CABLE_SIZES, CABLE_RESISTIVITY, FUSE_RATINGS, BREAKER_RATINGS } from '../../data/constants';
import { calculateVoltageDrop, calculateVoltageDropPercentage } from '../../utils/calculations';

interface CableCalculatorProps {
  onBack: () => void;
}

function CableCalculator({ onBack }: CableCalculatorProps) {
  const [inputs, setInputs] = useState({
    current: 50,
    voltage: 48,
    cableLength: 10,
    cableType: 'DC', // DC or AC
    maxVoltageDrop: 3, // percent
    material: 'copper'
  });

  const [results, setResults] = useState<any>(null);
  const [cableStatus, setCableStatus] = useState<'pass' | 'warning' | 'fail'>('pass');

  useEffect(() => {
    calculateCable();
  }, [inputs]);

  const calculateCable = () => {
    const resistivity = CABLE_RESISTIVITY[inputs.material as keyof typeof CABLE_RESISTIVITY] || 0.0175;
    const maxVoltageDrop = (inputs.voltage * inputs.maxVoltageDrop) / 100;

    // Find suitable cable size
    let suitableCable = null;
    for (const cable of CABLE_SIZES) {
      const drop = calculateVoltageDrop(
        inputs.current,
        inputs.cableLength,
        parseFloat(cable.size),
        resistivity
      );
      if (drop <= maxVoltageDrop) {
        suitableCable = cable;
        break;
      }
    }

    if (!suitableCable) {
      suitableCable = CABLE_SIZES[CABLE_SIZES.length - 1];
    }

    const actualDrop = calculateVoltageDrop(
      inputs.current,
      inputs.cableLength,
      parseFloat(suitableCable.size),
      resistivity
    );
    const dropPercentage = calculateVoltageDropPercentage(actualDrop, inputs.voltage);

    let status: 'pass' | 'warning' | 'fail' = 'pass';
    if (suitableCable.ampacity < inputs.current) status = 'fail';
    else if (dropPercentage > inputs.maxVoltageDrop * 0.8) status = 'warning';

    const breakerRating = Math.ceil(inputs.current * 1.25);
    const fuseRating = Math.ceil(inputs.current * 1.5);

    setResults({
      cableSize: suitableCable.size,
      cableAmpacity: suitableCable.ampacity,
      voltageDrop: actualDrop.toFixed(2),
      dropPercentage: dropPercentage.toFixed(2),
      status: status,
      breaker: Math.ceil(breakerRating / 5) * 5, // Round to nearest 5A
      fuse: Math.ceil(fuseRating / 5) * 5
    });
    setCableStatus(status);
  };

  const getStatusColor = () => {
    if (cableStatus === 'pass') return 'green';
    if (cableStatus === 'warning') return 'yellow';
    return 'red';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 mb-8 text-blue-600 hover:text-blue-800 font-semibold">
          <ArrowLeft size={20} />
          Back to Design
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Cable Sizing Calculator</h1>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">Current (A) *</label>
                <input
                  type="number"
                  value={inputs.current}
                  onChange={(e) => setInputs({ ...inputs, current: parseFloat(e.target.value) })}
                  className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500 text-lg"
                  step="1"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Voltage (V) *</label>
                <input
                  type="number"
                  value={inputs.voltage}
                  onChange={(e) => setInputs({ ...inputs, voltage: parseFloat(e.target.value) })}
                  className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500 text-lg"
                  step="1"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Cable Length (m) *</label>
                <input
                  type="number"
                  value={inputs.cableLength}
                  onChange={(e) => setInputs({ ...inputs, cableLength: parseFloat(e.target.value) })}
                  className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500 text-lg"
                  step="0.5"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Cable Type</label>
                <select
                  value={inputs.cableType}
                  onChange={(e) => setInputs({ ...inputs, cableType: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="DC">DC Cable</option>
                  <option value="AC">AC Cable</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Material</label>
                <select
                  value={inputs.material}
                  onChange={(e) => setInputs({ ...inputs, material: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="copper">Copper</option>
                  <option value="aluminum">Aluminum</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Max Voltage Drop (%)</label>
                <input
                  type="number"
                  value={inputs.maxVoltageDrop}
                  onChange={(e) => setInputs({ ...inputs, maxVoltageDrop: parseFloat(e.target.value) })}
                  className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                  step="0.1"
                  min="1"
                  max="5"
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: DC 2-3%, AC 3-5%</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {results && (
              <>
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">Cable Recommendation</h2>

                  <div className={`border-l-4 p-4 rounded mb-6 ${getStatusColor() === 'green' ? 'bg-green-50 border-green-500' : getStatusColor() === 'yellow' ? 'bg-yellow-50 border-yellow-500' : 'bg-red-50 border-red-500'}`}>
                    <p className={`text-sm font-bold ${getStatusColor() === 'green' ? 'text-green-700' : getStatusColor() === 'yellow' ? 'text-yellow-700' : 'text-red-700'}`}>
                      {results.status === 'pass' ? '✅ SUITABLE' : results.status === 'warning' ? '⚠️ WARNING' : '❌ UNDERSIZED'}
                    </p>
                    <p className={`text-4xl font-bold mt-2 ${getStatusColor() === 'green' ? 'text-green-700' : getStatusColor() === 'yellow' ? 'text-yellow-700' : 'text-red-700'}`}>
                      {results.cableSize} mm²
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded border-l-4 border-gray-400">
                      <p className="text-gray-600 text-sm font-bold">Cable Ampacity</p>
                      <p className="text-2xl font-bold text-gray-700">{results.cableAmpacity} A</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded border-l-4 border-gray-400">
                      <p className="text-gray-600 text-sm font-bold">Actual Voltage Drop</p>
                      <p className="text-2xl font-bold text-gray-700">{results.voltageDrop} V</p>
                      <p className="text-sm text-gray-600 mt-1">({results.dropPercentage}%)</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
                        <p className="text-gray-600 text-sm font-bold">Breaker Rating</p>
                        <p className="text-2xl font-bold text-blue-700">{results.breaker} A</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded border-l-4 border-red-500">
                        <p className="text-gray-600 text-sm font-bold">Fuse Rating</p>
                        <p className="text-2xl font-bold text-red-700">{results.fuse} A</p>
                      </div>
                    </div>
                  </div>
                </div>

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

export default CableCalculator;
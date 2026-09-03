import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ProtectionDesignProps {
  onBack: () => void;
}

function ProtectionDesign({ onBack }: ProtectionDesignProps) {
  const [inputs, setInputs] = React.useState({
    pvCurrent: 100,
    pvVoltage: 400,
    acCurrent: 50,
    acVoltage: 230,
    systemType: 'hybrid' as const
  });

  const calculateProtection = () => {
    const dcFuse = Math.ceil(inputs.pvCurrent * 1.25 / 5) * 5;
    const dcBreaker = Math.ceil(inputs.pvCurrent * 1.25 / 5) * 5;
    const acBreaker = Math.ceil(inputs.acCurrent * 1.25 / 5) * 5;

    return { dcFuse, dcBreaker, acBreaker };
  };

  const protection = calculateProtection();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 mb-8 text-blue-600 hover:text-blue-800 font-semibold">
          <ArrowLeft size={20} />
          Back to Design
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">Protection Design</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-700">DC Circuit Protection</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
                  <p className="text-sm font-bold text-gray-700">PV Current (A)</p>
                  <input
                    type="number"
                    value={inputs.pvCurrent}
                    onChange={(e) => setInputs({ ...inputs, pvCurrent: parseFloat(e.target.value) })}
                    className="w-full mt-2 border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
                  <p className="text-sm font-bold text-gray-700">PV Voltage (V)</p>
                  <input
                    type="number"
                    value={inputs.pvVoltage}
                    onChange={(e) => setInputs({ ...inputs, pvVoltage: parseFloat(e.target.value) })}
                    className="w-full mt-2 border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-700">AC Circuit Protection</h2>
              <div className="space-y-4">
                <div className="bg-orange-50 p-4 rounded border-l-4 border-orange-500">
                  <p className="text-sm font-bold text-gray-700">AC Current (A)</p>
                  <input
                    type="number"
                    value={inputs.acCurrent}
                    onChange={(e) => setInputs({ ...inputs, acCurrent: parseFloat(e.target.value) })}
                    className="w-full mt-2 border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="bg-orange-50 p-4 rounded border-l-4 border-orange-500">
                  <p className="text-sm font-bold text-gray-700">AC Voltage (V)</p>
                  <input
                    type="number"
                    value={inputs.acVoltage}
                    onChange={(e) => setInputs({ ...inputs, acVoltage: parseFloat(e.target.value) })}
                    className="w-full mt-2 border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-500 p-6 rounded-lg">
              <p className="text-gray-600 text-sm font-bold">DC Fuse Rating</p>
              <p className="text-4xl font-bold text-red-700 mt-3">{protection.dcFuse} A</p>
              <p className="text-xs text-gray-600 mt-2">DC main fuse</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 p-6 rounded-lg">
              <p className="text-gray-600 text-sm font-bold">DC Breaker Rating</p>
              <p className="text-4xl font-bold text-blue-700 mt-3">{protection.dcBreaker} A</p>
              <p className="text-xs text-gray-600 mt-2">DC main breaker</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-orange-500 p-6 rounded-lg">
              <p className="text-gray-600 text-sm font-bold">AC Breaker Rating</p>
              <p className="text-4xl font-bold text-orange-700 mt-3">{protection.acBreaker} A</p>
              <p className="text-xs text-gray-600 mt-2">AC main breaker</p>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 p-6 rounded-lg border-l-4 border-gray-400">
            <h3 className="font-bold text-gray-800 mb-3">Recommended Protection Devices</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• <span className="font-bold">DC PV Fuse:</span> {protection.dcFuse}A gPV rated</li>
              <li>• <span className="font-bold">DC Main Breaker:</span> {protection.dcBreaker}A DC 1000V</li>
              <li>• <span className="font-bold">AC Main Breaker:</span> {protection.acBreaker}A AC 230/400V</li>
              <li>• <span className="font-bold">SPD Type 2:</span> At inverter DC input</li>
              <li>• <span className="font-bold">SPD Type 3:</span> At AC output</li>
              <li>• <span className="font-bold">RCD/RCBO:</span> 30mA Type A (if battery)</li>
              <li>• <span className="font-bold">Isolator:</span> DC and AC main isolator switches</li>
              <li>• <span className="font-bold">Earthing:</span> TT or TN-S per local standards</li>
            </ul>
          </div>

          <button
            onClick={onBack}
            className="w-full mt-8 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-lg transition-all"
          >
            Save and Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProtectionDesign;
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Copy, ZoomIn, ZoomOut, RotateCcw, Download } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { useEquipmentStore } from '../store/equipmentStore';
import { Project } from '../types';
import html2canvas from 'html2canvas';

interface DesignCanvasProps {
  project: Project;
  onBack: () => void;
  onEquipment: () => void;
  onPVCalc: () => void;
  onInverterCalc: () => void;
  onBatteryCalc: () => void;
  onCableCalc: () => void;
  onLoadCalc: () => void;
  onSystemTest: () => void;
  onCustomerView: () => void;
}

function DesignCanvas({
  project,
  onBack,
  onEquipment,
  onPVCalc,
  onInverterCalc,
  onBatteryCalc,
  onCableCalc,
  onLoadCalc,
  onSystemTest,
  onCustomerView
}: DesignCanvasProps) {
  const { currentProjectData, addElement, updateElement, deleteElement, saveCurrentProject } = useProjectStore();
  const canvasRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showElementPanel, setShowElementPanel] = useState(false);
  const [draggedItem, setDraggedItem] = useState<any>(null);

  const equipment = currentProjectData?.equipment || [];
  const calculations = currentProjectData?.calculations || {};

  const componentLibrary = [
    { id: 'pv-panel', name: 'Solar Panel', icon: '☀️', color: '#FFB81C' },
    { id: 'combiner', name: 'Combiner Box', icon: '⚡', color: '#FF6B6B' },
    { id: 'dc-isolator', name: 'DC Isolator', icon: '🔌', color: '#4ECDC4' },
    { id: 'mppt', name: 'MPPT Charge Controller', icon: '⚙️', color: '#95E1D3' },
    { id: 'inverter', name: 'Inverter', icon: '📦', color: '#0066CC' },
    { id: 'battery', name: 'Battery Bank', icon: '🔋', color: '#00CC44' },
    { id: 'ac-board', name: 'AC Distribution Board', icon: '📊', color: '#FF9800' },
    { id: 'breaker', name: 'Breaker', icon: '🛡️', color: '#DD5E89' },
    { id: 'spd', name: 'Surge Protector', icon: '⚡', color: '#F7DC6F' },
    { id: 'load', name: 'Load', icon: '💡', color: '#BB86FC' },
  ];

  const handleDragStart = (component: any) => {
    setDraggedItem(component);
  };

  const handleCanvasDrop = (e: React.DragEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (!draggedItem || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    addElement({
      id: Date.now().toString(),
      type: draggedItem.id,
      equipmentId: draggedItem.id,
      name: draggedItem.name,
      x,
      y,
      rotation: 0,
      width: 80,
      height: 60,
      properties: {
        voltage: draggedItem.voltage || 48,
        current: draggedItem.current || 0,
        power: draggedItem.power || 0,
        model: draggedItem.model || ''
      }
    });

    setDraggedItem(null);
  };

  const handleElementClick = (elementId: string) => {
    setSelectedElement(elementId);
    setShowElementPanel(true);
  };

  const handleDeleteElement = (id: string) => {
    deleteElement(id);
    if (selectedElement === id) {
      setSelectedElement(null);
      setShowElementPanel(false);
    }
  };

  const handleExportPNG = async () => {
    if (!canvasRef.current) return;
    const canvas = await html2canvas(canvasRef.current, { scale: 2 });
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = `${project.projectName}-design.png`;
    link.click();
  };

  const handleSaveDesign = () => {
    saveCurrentProject();
    alert('Design saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Left Sidebar - Component Library */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold mb-2">Project: {project.projectName}</h2>
          <p className="text-xs text-gray-400">{project.customerName}</p>
        </div>

        <div className="p-4">
          <h3 className="text-sm font-bold mb-3 text-solar-500">Components</h3>
          <div className="space-y-2">
            {componentLibrary.map(comp => (
              <div
                key={comp.id}
                draggable
                onDragStart={() => handleDragStart(comp)}
                className="bg-gray-700 hover:bg-gray-600 p-3 rounded cursor-move transition-colors flex items-center gap-2"
              >
                <span className="text-xl">{comp.icon}</span>
                <span className="text-sm font-semibold">{comp.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-700 p-4">
          <h3 className="text-sm font-bold mb-3">Quick Actions</h3>
          <div className="space-y-2 text-xs">
            <button onClick={onLoadCalc} className="w-full bg-yellow-600 hover:bg-yellow-700 p-2 rounded transition-colors">
              📊 Load Calc
            </button>
            <button onClick={onPVCalc} className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded transition-colors">
              ☀️ PV Sizing
            </button>
            <button onClick={onInverterCalc} className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded transition-colors">
              ⚡ Inverter
            </button>
            <button onClick={onBatteryCalc} className="w-full bg-green-600 hover:bg-green-700 p-2 rounded transition-colors">
              🔋 Battery
            </button>
            <button onClick={onCableCalc} className="w-full bg-red-600 hover:bg-red-700 p-2 rounded transition-colors">
              📏 Cable Size
            </button>
            <button onClick={onSystemTest} className="w-full bg-emerald-600 hover:bg-emerald-700 p-2 rounded transition-colors">
              ✅ System Test
            </button>
          </div>
        </div>
      </div>

      {/* Center - Canvas */}
      <div className="flex-1 flex flex-col bg-gray-900">
        {/* Top Toolbar */}
        <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded">
              <ArrowLeft size={18} />
              Back
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Zoom:</span>
            <button onClick={() => setZoom(z => z - 0.1)} className="p-2 bg-gray-700 hover:bg-gray-600 rounded">
              <ZoomOut size={16} />
            </button>
            <span className="w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => z + 0.1)} className="p-2 bg-gray-700 hover:bg-gray-600 rounded">
              <ZoomIn size={16} />
            </button>
            <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="p-2 bg-gray-700 hover:bg-gray-600 rounded">
              <RotateCcw size={16} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSaveDesign} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded">
              <Plus size={18} />
              Save
            </button>
            <button onClick={handleExportPNG} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 relative">
          <svg
            ref={canvasRef}
            className="w-full h-full"
            onDrop={handleCanvasDrop}
            onDragOver={(e) => e.preventDefault()}
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
              cursor: draggedItem ? 'copy' : 'default'
            }}
          >
            {/* Grid Background */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#444" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="2000" height="2000" fill="url(#grid)" />

            {/* Equipment Elements */}
            {equipment.map((elem) => (
              <g
                key={elem.id}
                transform={`translate(${elem.x}, ${elem.y}) rotate(${elem.rotation})`}
                onClick={() => handleElementClick(elem.id)}
                className="cursor-pointer"
              >
                {/* Component Box */}
                <rect
                  width={elem.width}
                  height={elem.height}
                  fill={componentLibrary.find(c => c.id === elem.type)?.color || '#666'}
                  stroke={selectedElement === elem.id ? '#FFD700' : '#FFF'}
                  strokeWidth="2"
                  rx="4"
                />

                {/* Component Label */}
                <text
                  x={elem.width / 2}
                  y={elem.height / 2 + 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="11"
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {elem.name}
                </text>

                {/* Connection Points */}
                <circle cx="0" cy={elem.height / 2} r="4" fill="#FF6B6B" opacity="0.7" />
                <circle cx={elem.width} cy={elem.height / 2} r="4" fill="#FF6B6B" opacity="0.7" />
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      {showElementPanel && selectedElement && (
        <div className="w-72 bg-gray-800 border-l border-gray-700 flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="font-bold">Component Properties</h3>
            <button
              onClick={() => setShowElementPanel(false)}
              className="text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>

          <div className="p-4 space-y-4 flex-1">
            {equipment.find(e => e.id === selectedElement) && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Component Name</label>
                  <input
                    type="text"
                    value={equipment.find(e => e.id === selectedElement)?.name || ''}
                    onChange={(e) => updateElement(selectedElement, { name: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Voltage (V)</label>
                  <input
                    type="number"
                    defaultValue={equipment.find(e => e.id === selectedElement)?.properties?.voltage || 48}
                    onChange={(e) => {
                      const elem = equipment.find(e => e.id === selectedElement);
                      if (elem) {
                        updateElement(selectedElement, {
                          properties: { ...elem.properties, voltage: parseFloat(e.target.value) }
                        });
                      }
                    }}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Current (A)</label>
                  <input
                    type="number"
                    defaultValue={equipment.find(e => e.id === selectedElement)?.properties?.current || 0}
                    onChange={(e) => {
                      const elem = equipment.find(e => e.id === selectedElement);
                      if (elem) {
                        updateElement(selectedElement, {
                          properties: { ...elem.properties, current: parseFloat(e.target.value) }
                        });
                      }
                    }}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Power (W)</label>
                  <input
                    type="number"
                    defaultValue={equipment.find(e => e.id === selectedElement)?.properties?.power || 0}
                    onChange={(e) => {
                      const elem = equipment.find(e => e.id === selectedElement);
                      if (elem) {
                        updateElement(selectedElement, {
                          properties: { ...elem.properties, power: parseFloat(e.target.value) }
                        });
                      }
                    }}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-700 space-y-2">
            <button
              onClick={() => handleDeleteElement(selectedElement)}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DesignCanvas;
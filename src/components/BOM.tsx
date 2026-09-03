import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, ShoppingCart, Plus, Minus, Trash2, DollarSign } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { EQUIPMENT_DATABASE } from '../data/equipmentDatabase';

interface BOMItem {
  id: string;
  category: string;
  equipment: string;
  specification: string;
  quantity: number;
  unitPrice: number;
  total: number;
  equipmentId?: string;
}

interface BOMProps {
  onBack: () => void;
}

function BOM({ onBack }: BOMProps) {
  const { currentProjectData, updateBOM, updateCostEstimate } = useProjectStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [bomItems, setBOMItems] = useState<BOMItem[]>(currentProjectData?.bom || []);
  const [laborCost, setLaborCost] = useState(1000);
  const [transportCost, setTransportCost] = useState(500);
  const [installationCost, setInstallationCost] = useState(1500);
  const [otherCost, setOtherCost] = useState(0);
  const [profitMargin, setProfitMargin] = useState(0.2);

  const allEquipment = [
    ...EQUIPMENT_DATABASE.SOLAR_PANELS.map(p => ({ ...p, category: 'Solar Panels', type: 'panel' })),
    ...EQUIPMENT_DATABASE.INVERTERS.map(i => ({ ...i, category: 'Inverters', type: 'inverter' })),
    ...EQUIPMENT_DATABASE.BATTERIES.map(b => ({ ...b, category: 'Batteries', type: 'battery' })),
    ...EQUIPMENT_DATABASE.CABLES.map(c => ({ ...c, category: 'Cables', type: 'cable' })),
    ...EQUIPMENT_DATABASE.PROTECTION.map(p => ({ ...p, category: 'Protection', type: 'protection' }))
  ];

  const categories = ['All', 'Solar Panels', 'Inverters', 'Batteries', 'Cables', 'Protection'];

  const filteredEquipment = useMemo(() => {
    return allEquipment.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = searchTerm === '' || 
        item.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const handleAddItem = (equipment: any) => {
    const existingItem = bomItems.find(item => item.equipmentId === equipment.id);
    if (existingItem) {
      updateBOMItem(existingItem.id, { quantity: existingItem.quantity + 1 });
    } else {
      const newItem: BOMItem = {
        id: Date.now().toString(),
        category: equipment.category,
        equipment: equipment.brand ? `${equipment.brand} ${equipment.model}` : equipment.name || '',
        specification: equipment.power ? `${equipment.power}W` : equipment.kwh ? `${equipment.kwh}kWh` : `${equipment.size}mm²`,
        quantity: 1,
        unitPrice: equipment.price || 0,
        total: equipment.price || 0,
        equipmentId: equipment.id
      };
      setBOMItems([...bomItems, newItem]);
    }
  };

  const updateBOMItem = (id: string, updates: Partial<BOMItem>) => {
    setBOMItems(bomItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        updated.total = updated.quantity * updated.unitPrice;
        return updated;
      }
      return item;
    }));
  };

  const removeBOMItem = (id: string) => {
    setBOMItems(bomItems.filter(item => item.id !== id));
  };

  const subtotal = bomItems.reduce((sum, item) => sum + item.total, 0);
  const equipmentTotal = subtotal;
  const costEstimate = {
    equipment: equipmentTotal,
    labor: laborCost,
    transportation: transportCost,
    installation: installationCost,
    engineering: 0,
    other: otherCost,
    subtotal: equipmentTotal + laborCost + transportCost + installationCost + otherCost,
    profit: 0,
    total: 0,
    currency: 'USD'
  };
  costEstimate.profit = costEstimate.subtotal * profitMargin;
  costEstimate.total = costEstimate.subtotal + costEstimate.profit;

  const handleSave = () => {
    updateBOM(bomItems);
    updateCostEstimate(costEstimate);
    alert('BOM and cost estimate saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-8 text-blue-600 hover:text-blue-800 font-semibold"
        >
          <ArrowLeft size={20} />
          Back to Design
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Equipment Selector */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-6 h-fit">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <ShoppingCart size={24} />
              Equipment
            </h2>

            {/* Search */}
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search equipment..."
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Category Tabs */}
            <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-4 py-2 rounded transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Equipment List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredEquipment.map(item => (
                <div
                  key={item.id}
                  className="bg-gray-50 p-3 rounded border border-gray-200 hover:border-blue-500 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-bold text-sm">{item.brand || item.name}</p>
                      <p className="text-xs text-gray-600">{item.model || ''}</p>
                    </div>
                    <button
                      onClick={() => handleAddItem(item)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className="text-sm font-bold text-blue-600">${item.price || 0}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - BOM and Costs */}
          <div className="lg:col-span-2">
            {/* BOM Table */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Bill of Materials</h2>
              {bomItems.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b-2 border-gray-300">
                      <tr>
                        <th className="text-left px-4 py-3 font-bold">Category</th>
                        <th className="text-left px-4 py-3 font-bold">Equipment</th>
                        <th className="text-right px-4 py-3 font-bold">Qty</th>
                        <th className="text-right px-4 py-3 font-bold">Unit Price</th>
                        <th className="text-right px-4 py-3 font-bold">Total</th>
                        <th className="text-center px-4 py-3 font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bomItems.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{item.category}</td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-bold">{item.equipment}</p>
                              <p className="text-xs text-gray-600">{item.specification}</p>
                            </div>
                          </td>
                          <td className="text-right px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => updateBOMItem(item.id, { quantity: Math.max(1, item.quantity - 1) })}
                                className="bg-gray-300 hover:bg-gray-400 p-1 rounded"
                              >
                                <Minus size={14} />
                              </button>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateBOMItem(item.id, { quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                                className="w-12 text-center border border-gray-300 rounded px-2 py-1"
                              />
                              <button
                                onClick={() => updateBOMItem(item.id, { quantity: item.quantity + 1 })}
                                className="bg-gray-300 hover:bg-gray-400 p-1 rounded"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </td>
                          <td className="text-right px-4 py-3">
                            <input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => updateBOMItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                              className="w-24 text-right border border-gray-300 rounded px-2 py-1"
                            />
                          </td>
                          <td className="text-right px-4 py-3 font-bold text-blue-600">${item.total.toFixed(2)}</td>
                          <td className="text-center px-4 py-3">
                            <button
                              onClick={() => removeBOMItem(item.id)}
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
                <p className="text-gray-500 text-center py-8">No items in BOM yet. Add equipment from the left panel.</p>
              )}
            </div>

            {/* Cost Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <DollarSign size={24} />
                  Cost Breakdown
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between pb-2 border-b">
                    <span className="font-bold">Equipment Subtotal</span>
                    <span className="font-bold text-blue-600">${equipmentTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="font-semibold">Labor Cost</label>
                    <input
                      type="number"
                      value={laborCost}
                      onChange={(e) => setLaborCost(parseFloat(e.target.value) || 0)}
                      className="w-32 text-right border border-gray-300 rounded px-3 py-1"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="font-semibold">Transport Cost</label>
                    <input
                      type="number"
                      value={transportCost}
                      onChange={(e) => setTransportCost(parseFloat(e.target.value) || 0)}
                      className="w-32 text-right border border-gray-300 rounded px-3 py-1"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="font-semibold">Installation Cost</label>
                    <input
                      type="number"
                      value={installationCost}
                      onChange={(e) => setInstallationCost(parseFloat(e.target.value) || 0)}
                      className="w-32 text-right border border-gray-300 rounded px-3 py-1"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="font-semibold">Other Costs</label>
                    <input
                      type="number"
                      value={otherCost}
                      onChange={(e) => setOtherCost(parseFloat(e.target.value) || 0)}
                      className="w-32 text-right border border-gray-300 rounded px-3 py-1"
                    />
                  </div>
                  <div className="flex justify-between pb-2 border-b pt-2">
                    <span className="font-bold">Subtotal</span>
                    <span className="font-bold">${costEstimate.subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">Profit & Total</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <label className="font-semibold">Profit Margin (%)</label>
                    <input
                      type="number"
                      value={(profitMargin * 100).toFixed(0)}
                      onChange={(e) => setProfitMargin(parseFloat(e.target.value) / 100)}
                      className="w-24 text-right border border-gray-300 rounded px-3 py-1"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Profit Amount</span>
                    <span className="font-bold text-green-600">${costEstimate.profit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 pb-2 border-t-2 border-b-2 text-xl">
                    <span className="font-bold">GRAND TOTAL</span>
                    <span className="font-bold text-green-700">${costEstimate.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-lg transition-all"
              >
                Save BOM & Costs
              </button>
              <button
                onClick={onBack}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BOM;
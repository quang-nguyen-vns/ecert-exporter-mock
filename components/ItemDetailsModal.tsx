
import React, { useState } from 'react';
import { X, Check, Info } from 'lucide-react';
import { PlantProduct, PQ7Item } from '../types';
import { PACKAGE_UNITS } from '../constants';

interface ItemDetailsModalProps {
  product: PlantProduct;
  onClose: () => void;
  onSubmit: (item: PQ7Item) => void;
}

const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({ product, onClose, onSubmit }) => {
  const [details, setDetails] = useState<Partial<PQ7Item>>({
    purpose: 'Consumption',
    quantity: 1,
    unit: 'Unit',
    netWeight: 0,
    valueThb: 0,
    packages: 1,
    packageUnit: 'Boxes',
    packageLayer: 'Outer',
    additionalDetails: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: Math.random().toString(36).substr(2, 9),
      productId: product.id,
      productName: product.name,
      scientificName: product.scientificName,
      ...(details as Omit<PQ7Item, 'id' | 'productId' | 'productName' | 'scientificName'>)
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 border-b flex items-center justify-between bg-blue-50">
            <div>
              <h3 className="text-lg font-bold text-primary">Item Details</h3>
              <p className="text-xs text-blue-700 font-medium">{product.name} ({product.scientificName})</p>
            </div>
            <button type="button" onClick={onClose} className="p-2 hover:bg-blue-100 rounded-full transition-colors text-blue-600">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Purpose</label>
                <select 
                  className="w-full p-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/20 outline-none"
                  value={details.purpose}
                  onChange={e => setDetails({...details, purpose: e.target.value})}
                >
                  <option value="Consumption">Consumption</option>
                  <option value="Propagation">Propagation</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Sample">Sample</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Net Weight (KG)*</label>
                <input 
                  type="number" required step="0.01"
                  className="w-full p-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                  value={details.netWeight}
                  onChange={e => setDetails({...details, netWeight: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</label>
                <input 
                  type="number" required
                  className="w-full p-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/20 outline-none"
                  value={details.quantity}
                  onChange={e => setDetails({...details, quantity: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Unit</label>
                <input 
                  className="w-full p-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/20 outline-none"
                  value={details.unit}
                  onChange={e => setDetails({...details, unit: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Packages</label>
                <input 
                  type="number" required
                  className="w-full p-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/20 outline-none"
                  value={details.packages}
                  onChange={e => setDetails({...details, packages: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Package Unit</label>
                <select 
                  className="w-full p-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/20 outline-none"
                  value={details.packageUnit}
                  onChange={e => setDetails({...details, packageUnit: e.target.value})}
                >
                  {PACKAGE_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Estimated Value (THB)</label>
              <input 
                type="number"
                className="w-full p-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/20 outline-none"
                value={details.valueThb}
                onChange={e => setDetails({...details, valueThb: Number(e.target.value)})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Additional Details (EN)</label>
              <textarea 
                className="w-full p-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/20 outline-none h-20 resize-none uppercase"
                placeholder="ANY ADDITIONAL PRODUCT DESCRIPTION IN ENGLISH"
                value={details.additionalDetails}
                onChange={e => setDetails({...details, additionalDetails: e.target.value.toUpperCase()})}
              />
            </div>

            <div className="bg-amber-50 rounded-lg p-3 flex gap-3 text-xs text-amber-700 items-start">
              <Info size={16} className="shrink-0 mt-0.5" />
              <p>Scientific name <strong>{product.scientificName}</strong> is auto-filled and cannot be edited per central regulation.</p>
            </div>
          </div>
          
          <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-blue-900 transition-all shadow-md active:scale-95"
            >
              <Check size={18} />
              Add to List
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemDetailsModal;

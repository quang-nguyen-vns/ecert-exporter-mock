
import React, { useState } from 'react';
import { Search, X, Check } from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';
import { PlantProduct } from '../types';

interface ProductSearchModalProps {
  onClose: () => void;
  onSelect: (product: PlantProduct) => void;
}

const ProductSearchModal: React.FC<ProductSearchModalProps> = ({ onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">Select Plant Product</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              autoFocus
              type="text" 
              placeholder="Search by common name or scientific name..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-500 italic">
                No products found matching "{searchTerm}"
              </div>
            ) : (
              filteredProducts.map(product => (
                <button
                  key={product.id}
                  onClick={() => onSelect(product)}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary hover:bg-blue-50/50 transition-all text-left group"
                >
                  <div>
                    <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">{product.name}</p>
                    <p className="text-sm text-gray-500 italic">{product.scientificName}</p>
                  </div>
                  <Check className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                </button>
              ))
            )}
          </div>
        </div>
        
        <div className="px-6 py-4 border-t bg-gray-50 text-xs text-gray-500 text-center">
          Note: Users cannot type scientific names manually. Please select from the official master list.
        </div>
      </div>
    </div>
  );
};

export default ProductSearchModal;

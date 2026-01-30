
import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  Send, 
  X, 
  User, 
  Globe, 
  Package, 
  MapPin, 
  Stethoscope, 
  AlertCircle,
  Plus,
  ClipboardList,
  CheckCircle2,
  Clock,
  Truck,
  FileText,
  PlusCircle,
  Search,
  RotateCcw
} from 'lucide-react';
import { PQApplication, AppStatus, PQ7Item, PlantProduct, ApplicationType } from '../types';
import ProductSearchModal from './ProductSearchModal';
import ItemDetailsModal from './ItemDetailsModal';
import { 
  COUNTRIES, 
  TRANSPORT_MEANS, 
  PACKAGE_UNITS, 
  QUARANTINE_STATIONS
} from '../constants';

interface PQFormProps {
  initialData: PQApplication | null;
  type: ApplicationType;
  onCancel: () => void;
  onSubmit: (app: PQApplication) => void;
}

const STEPS = [
  { id: 1, label: 'Exporter', icon: <User size={20} /> },
  { id: 2, label: 'Consignee', icon: <Globe size={20} /> },
  { id: 3, label: 'Shipment & Items', icon: <Package size={20} /> },
  { id: 4, label: 'Issuance', icon: <MapPin size={20} /> },
  { id: 5, label: 'Inspection', icon: <Stethoscope size={20} /> }
];

const EN_REGEX = /^[A-Z0-9\s.,#/-]*$/;

const PQ7Form: React.FC<PQFormProps> = ({ initialData, type, onCancel, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<PlantProduct | null>(null);
  const [transitPortInput, setTransitPortInput] = useState('');
  const [shippingMarkInput, setShippingMarkInput] = useState('');
  
  const [formData, setFormData] = useState<PQApplication>(initialData || {
    id: `${type === 'PQ7' ? 'APP' : type === 'PQ8' ? 'REX' : 'REP'}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    type: type,
    status: 'New',
    createdAt: new Date().toISOString().split('T')[0],
    exporter: {
      taxId: '1234567890123',
      name: 'Thai Exports Co., Ltd.',
      address: '123 Sukhumvit Rd, Khlong Toei, Bangkok 10110, Thailand',
      isOnBehalfOf: false
    },
    consignee: {
      taxId: '', branch: '', companyName: '', address: '', subdistrict: '', district: '', province: '', country: '', phone: '', email: ''
    },
    shipment: {
      transportMeans: '', vehicleInfo: '', exportDate: '', blAwbNumber: '', grossWeight: 0, totalPackages: 0, packageUnit: '', destinationCountry: '', portOfEntry: '', transitPorts: [], shippingMarks: [], items: [], totalNetWeight: 0,
      originCountry: '', originalPCNumber: '', entryDateToThailand: ''
    },
    issuance: { stationId: '' },
    inspection: { type: 'Checkpoint', appointmentDate: '', appointmentTime: '' }
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const updateFormData = (path: string, value: any) => {
    const keys = path.split('.');
    setFormData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      let current = next;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const addItem = (item: PQ7Item) => {
    const newItems = [...formData.shipment.items, item];
    updateFormData('shipment.items', newItems);
    setSelectedProduct(null);
  };

  const removeItem = (id: string) => {
    const newItems = formData.shipment.items.filter(i => i.id !== id);
    updateFormData('shipment.items', newItems);
  };

  const totalItemsNetWeight = Number(formData.shipment.items.reduce((sum, item) => sum + Number(item.netWeight), 0).toFixed(2));
  const isNetWeightValid = Number(formData.shipment.totalNetWeight) === totalItemsNetWeight;

  const handleFinalSubmit = (status: AppStatus) => {
    if (status !== 'New' && (!isNetWeightValid && formData.shipment.items.length > 0)) {
      alert(`Warning: Total Net Weight does not match itemized sum.`);
      return;
    }
    onSubmit({ ...formData, status });
  };

  const handleEnInput = (path: string, val: string) => {
    const upper = val.toUpperCase();
    if (EN_REGEX.test(upper)) updateFormData(path, upper);
  };

  const renderPQ9Header = () => {
    if (formData.type !== 'PQ9') return null;
    return (
      <div className="mb-8 p-6 bg-purple-50 border border-purple-200 rounded-2xl flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1 space-y-2">
          <label className="text-xs font-bold text-purple-700 uppercase tracking-widest">Search Original Certificate ID</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
            <input 
              type="text" 
              placeholder="e.g. PC-2024-00123"
              className="w-full pl-10 pr-4 py-3 bg-white border border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-100 outline-none"
              value={formData.originalCertificateId}
              onChange={e => updateFormData('originalCertificateId', e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-xs font-bold text-purple-700 uppercase tracking-widest">Reason for Replacement*</label>
          <select 
            className="w-full p-3 bg-white border border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-100 outline-none"
            value={formData.replacementReason}
            onChange={e => updateFormData('replacementReason', e.target.value)}
          >
            <option value="">Select Reason...</option>
            <option value="Lost">Original Certificate Lost</option>
            <option value="Error">Data Entry Error (Typo)</option>
            <option value="Correction">Consignee Address Correction</option>
            <option value="Damaged">Original Certificate Damaged</option>
          </select>
        </div>
        <div className="text-center bg-white px-6 py-3 rounded-xl border border-purple-200 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Standard Fee</p>
          <p className="text-xl font-black text-purple-700 leading-none mt-1">50.00 <span className="text-sm">THB</span></p>
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            {renderPQ9Header()}
            <div className="bg-blue-50 border-l-4 border-primary p-4 rounded-r-lg shadow-sm"><p className="text-sm text-primary font-bold">Exporter information is automatically fetched from SSO.</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tax ID</label><input disabled className="w-full bg-gray-100 p-3 border rounded-lg text-gray-600 font-mono" value={formData.exporter.taxId} /></div>
              <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Company Name (TH)</label><input disabled className="w-full bg-gray-100 p-3 border rounded-lg text-gray-600" value={formData.exporter.name} /></div>
              <div className="md:col-span-2 space-y-1"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Address</label><textarea disabled className="w-full bg-gray-100 p-3 border rounded-lg text-gray-600 h-24 resize-none" value={formData.exporter.address} /></div>
            </div>
            <div className="pt-8 border-t"><label className="flex items-center gap-4 cursor-pointer group"><div className="relative"><input type="checkbox" className="sr-only peer" checked={formData.exporter.isOnBehalfOf} onChange={(e) => updateFormData('exporter.isOnBehalfOf', e.target.checked)}/><div className="w-14 h-7 bg-gray-200 rounded-full peer-checked:bg-primary transition-all"></div><div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-all peer-checked:left-8 shadow"></div></div><div className="flex flex-col"><span className="font-bold text-gray-800 group-hover:text-primary">On Behalf Of / Representative</span><span className="text-xs text-gray-500">Enable if shipping via an agent</span></div></label>
              {formData.exporter.isOnBehalfOf && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 p-8 border-2 border-dashed border-primary/30 rounded-2xl bg-primary/5 animate-in zoom-in-95 duration-200">
                  <div className="space-y-1"><label className="text-xs font-bold text-primary uppercase tracking-widest">Representative Name (EN)*</label><input className="w-full p-3 border rounded-xl outline-none uppercase font-semibold" value={formData.exporter.obName} onChange={(e) => handleEnInput('exporter.obName', e.target.value)}/></div>
                  <div className="md:col-span-2 space-y-1"><label className="text-xs font-bold text-primary uppercase tracking-widest">Representative Address (EN)*</label><textarea className="w-full p-3 border rounded-xl outline-none h-24 uppercase font-semibold" value={formData.exporter.obAddress} onChange={(e) => handleEnInput('exporter.obAddress', e.target.value)}/></div>
                </div>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-3 text-amber-600 bg-amber-50 p-4 rounded-xl text-sm border border-amber-200 shadow-sm"><AlertCircle size={20} className="shrink-0" /><p className="font-medium">Consignee details must be in <strong>English characters</strong>.</p></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-white border rounded-2xl shadow-sm">
              <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Consignee Tax ID</label><input className="w-full p-3 border rounded-xl font-mono" value={formData.consignee.taxId} onChange={(e) => updateFormData('consignee.taxId', e.target.value)}/></div>
              <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Branch</label><input className="w-full p-3 border rounded-xl" value={formData.consignee.branch} onChange={(e) => updateFormData('consignee.branch', e.target.value)}/></div>
              <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Country*</label><select className="w-full p-3 border rounded-xl bg-white" value={formData.consignee.country} onChange={(e) => updateFormData('consignee.country', e.target.value)}><option value="">Select Destination</option>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div className="md:col-span-3 space-y-1"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Company Name (EN)*</label><input className="w-full p-3 border rounded-xl uppercase font-semibold" value={formData.consignee.companyName} onChange={(e) => handleEnInput('consignee.companyName', e.target.value)}/></div>
              <div className="md:col-span-3 space-y-1"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Address (EN)*</label><textarea className="w-full p-3 border rounded-xl uppercase font-semibold h-28" value={formData.consignee.address} onChange={(e) => handleEnInput('consignee.address', e.target.value)}/></div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            {formData.type === 'PQ8' && (
              <div className="p-8 bg-amber-50 border border-amber-200 rounded-2xl space-y-6">
                <div className="flex items-center gap-2 text-amber-800 font-bold"><RotateCcw size={20} /> Origin Tracking Details (P.Q. 8)</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1"><label className="text-xs font-bold text-amber-700 uppercase tracking-widest">Country of Origin*</label><select className="w-full p-3 border border-amber-200 rounded-xl bg-white" value={formData.shipment.originCountry} onChange={e => updateFormData('shipment.originCountry', e.target.value)}><option value="">Select Origin...</option>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                  <div className="space-y-1"><label className="text-xs font-bold text-amber-700 uppercase tracking-widest">Original PC Number*</label><input className="w-full p-3 border border-amber-200 rounded-xl" value={formData.shipment.originalPCNumber} onChange={e => updateFormData('shipment.originalPCNumber', e.target.value)} /></div>
                  <div className="space-y-1"><label className="text-xs font-bold text-amber-700 uppercase tracking-widest">Thai Entry Date*</label><input type="date" className="w-full p-3 border border-amber-200 rounded-xl" value={formData.shipment.entryDateToThailand} onChange={e => updateFormData('shipment.entryDateToThailand', e.target.value)} /></div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="space-y-1"><label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">Transport Means</label><select className="w-full p-2.5 border rounded-lg bg-white" value={formData.shipment.transportMeans} onChange={(e) => updateFormData('shipment.transportMeans', e.target.value)}><option value="">Select...</option>{TRANSPORT_MEANS.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
              <div className="space-y-1"><label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">Vehicle / Flight</label><input className="w-full p-2.5 border rounded-lg uppercase" value={formData.shipment.vehicleInfo} onChange={(e) => updateFormData('shipment.vehicleInfo', e.target.value.toUpperCase())}/></div>
              <div className="space-y-1"><label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">Export Date</label><input type="date" className="w-full p-2.5 border rounded-lg" value={formData.shipment.exportDate} onChange={(e) => updateFormData('shipment.exportDate', e.target.value)}/></div>
              <div className="space-y-1"><label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">B/L or AWB No.</label><input className="w-full p-2.5 border rounded-lg" value={formData.shipment.blAwbNumber} onChange={(e) => updateFormData('shipment.blAwbNumber', e.target.value)}/></div>
              <div className="space-y-1"><label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">Gross Weight (KG)</label><input type="number" className="w-full p-2.5 border rounded-lg" value={formData.shipment.grossWeight} onChange={(e) => updateFormData('shipment.grossWeight', Number(e.target.value))}/></div>
              <div className="space-y-1"><label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">Declared Net Weight (KG)*</label><input type="number" className={`w-full p-2.5 border rounded-lg ${!isNetWeightValid && formData.shipment.items.length > 0 ? 'border-red-500' : ''}`} value={formData.shipment.totalNetWeight} onChange={(e) => updateFormData('shipment.totalNetWeight', Number(e.target.value))}/></div>
            </div>

            <div className="space-y-6 bg-white p-8 border rounded-2xl shadow-sm">
              <div className="flex items-center justify-between border-b pb-6"><div><h4 className="text-xl font-bold text-gray-800">Itemized Product List</h4></div><button onClick={() => setSearchModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg active:scale-95"><Plus size={20} />Search Plants</button></div>
              {formData.shipment.items.length === 0 ? (<div className="py-16 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">No items added yet.</div>) : (
                <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b"><th className="px-4 py-4 text-xs font-black text-gray-400 uppercase">Product</th><th className="px-4 py-4 text-xs font-black text-gray-400 uppercase">Weight</th><th className="px-4 py-4 text-xs font-black text-gray-400 uppercase text-right">Action</th></tr></thead><tbody className="divide-y divide-gray-100">{formData.shipment.items.map(item => (<tr key={item.id}><td className="px-4 py-4"><div className="flex flex-col"><span className="font-bold text-gray-900">{item.productName}</span><span className="text-xs italic text-gray-500">{item.scientificName}</span></div></td><td className="px-4 py-4"><span className="font-mono font-bold text-primary">{item.netWeight} KG</span></td><td className="px-4 py-4 text-right"><button onClick={() => removeItem(item.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><X size={20} /></button></td></tr>))}</tbody><tfoot className="bg-gray-50 font-bold"><tr><td className="px-4 py-4 text-right">Sum of Items:</td><td className={`px-4 py-4 font-mono ${isNetWeightValid ? 'text-green-600' : 'text-red-600'}`}>{totalItemsNetWeight} KG</td><td></td></tr></tfoot></table></div>
              )}
            </div>
            {isSearchModalOpen && <ProductSearchModal onClose={() => setSearchModalOpen(false)} onSelect={(p) => { setSelectedProduct(p); setSearchModalOpen(false); }} />}
            {selectedProduct && <ItemDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onSubmit={addItem} />}
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div className="max-w-2xl mx-auto p-12 bg-white border rounded-[2rem] shadow-xl text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8"><MapPin size={48} className="text-primary" /></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Issuance Location</h3>
              <div className="space-y-4 text-left">
                {QUARANTINE_STATIONS.map(station => (
                  <button key={station.id} onClick={() => updateFormData('issuance.stationId', station.id)} className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ${formData.issuance.stationId === station.id ? 'border-primary bg-primary/5' : 'border-gray-100 bg-gray-50'}`}><span className={`font-bold ${formData.issuance.stationId === station.id ? 'text-primary' : 'text-gray-700'}`}>{station.name}</span><div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.issuance.stationId === station.id ? 'bg-primary border-primary' : 'border-gray-300'}`}>{formData.issuance.stationId === station.id && <div className="w-2 h-2 bg-white rounded-full"></div>}</div></button>
                ))}
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto">
              {['Checkpoint', 'Off-site'].map(type => (
                <button key={type} onClick={() => updateFormData('inspection.type', type)} className={`p-8 rounded-3xl border-2 transition-all text-center group ${formData.inspection.type === type ? 'border-primary bg-primary text-white shadow-2xl scale-105' : 'border-gray-200 bg-white text-gray-500'}`}><p className="text-xl font-black uppercase tracking-widest mb-2">{type}</p></button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 bg-white border rounded-[2rem] shadow-sm">
              <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Inspection Date*</label><input type="date" className="w-full p-4 border rounded-xl" value={formData.inspection.appointmentDate} onChange={(e) => updateFormData('inspection.appointmentDate', e.target.value)}/></div>
              <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Inspection Time*</label><input type="time" className="w-full p-4 border rounded-xl" value={formData.inspection.appointmentTime} onChange={(e) => updateFormData('inspection.appointmentTime', e.target.value)}/></div>
              {formData.inspection.type === 'Off-site' && (
                <div className="md:col-span-2 pt-8 mt-4 border-t border-dashed space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Contact Person</label><input className="w-full p-3 border rounded-xl" value={formData.inspection.contactPerson} onChange={e => updateFormData('inspection.contactPerson', e.target.value)} /></div>
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Site Name</label><input className="w-full p-3 border rounded-xl" value={formData.inspection.siteName} onChange={e => updateFormData('inspection.siteName', e.target.value)} /></div>
                  </div>
                  <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Address</label><textarea className="w-full p-3 border rounded-xl h-24" /></div>
                </div>
              )}
            </div>
            <div className="bg-primary/5 border border-primary/20 p-8 rounded-3xl"><h5 className="font-bold text-primary mb-4 text-lg flex items-center gap-2"><FileText size={20} />Document Attachments (PDF)</h5><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="p-8 border-2 border-dashed border-primary/30 rounded-2xl bg-white flex flex-col items-center justify-center hover:bg-blue-50 cursor-pointer group"><PlusCircle size={32} className="text-primary mb-2" /><span className="font-bold text-gray-800">Standard Attachment</span></div><div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-white flex flex-col items-center justify-center text-gray-400"><PlusCircle size={32} className="mb-2" /><span className="font-bold">P.Q. 6 (Import Permit)</span></div></div></div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-32">
      <div className="mb-16"><div className="flex items-center justify-between mb-8 overflow-x-auto pb-6 px-4 no-scrollbar">{STEPS.map((step, i) => (<React.Fragment key={step.id}><div className={`flex flex-col items-center gap-3 min-w-[100px] cursor-pointer ${currentStep === step.id ? 'opacity-100' : 'opacity-40'}`} onClick={() => setCurrentStep(step.id)}><div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center transition-all ${currentStep >= step.id ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>{step.icon}</div><span className={`text-[10px] font-black uppercase text-center ${currentStep === step.id ? 'text-primary' : 'text-gray-400'}`}>{step.label}</span></div>{i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-4 mt-7 ${currentStep > step.id ? 'bg-primary' : 'bg-gray-200'}`} />}</React.Fragment>))}</div></div>
      <div className="min-h-[500px]">{renderStep()}</div>
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white/90 backdrop-blur-xl border-t p-6 flex items-center justify-between z-40 px-12"><div className="flex gap-4"><button onClick={onCancel} className="px-8 py-3.5 text-gray-500 font-bold hover:bg-gray-100 rounded-2xl">Discard</button><button onClick={() => handleFinalSubmit('New')} className="flex items-center gap-2 px-8 py-3.5 bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 rounded-2xl transition-all shadow-sm"><Save size={20} />Save Draft</button></div><div className="flex gap-4">{currentStep > 1 && <button onClick={prevStep} className="flex items-center gap-2 px-8 py-3.5 border-2 border-gray-100 text-gray-600 font-bold hover:bg-gray-50 rounded-2xl transition-all"><ChevronLeft size={20} />Previous</button>}{currentStep < 5 ? (<button onClick={nextStep} className="flex items-center gap-2 px-10 py-3.5 bg-primary text-white font-bold hover:bg-blue-900 rounded-2xl shadow-2xl transition-all active:scale-95 group">Continue<ChevronRight size={20} className="group-hover:translate-x-1" /></button>) : (<button onClick={() => handleFinalSubmit('Waiting for Document Check')} className="flex items-center gap-3 px-12 py-3.5 bg-green-600 text-white font-black uppercase tracking-widest hover:bg-green-700 rounded-2xl shadow-2xl active:scale-95">Submit Application<Send size={20} /></button>)}</div></div>
    </div>
  );
};

export default PQ7Form;


import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  ClipboardList, 
  Settings, 
  LogOut, 
  Bell,
  Menu,
  X,
  ShieldCheck,
  Repeat,
  RotateCcw,
  UserCheck
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import PQ7Form from './components/PQ7Form';
import { PQApplication, ApplicationType } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'form'>('dashboard');
  const [currentFormType, setCurrentFormType] = useState<ApplicationType>('PQ7');
  const [editingApplication, setEditingApplication] = useState<PQApplication | null>(null);
  const [applications, setApplications] = useState<PQApplication[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const mockApps: PQApplication[] = [
      {
        id: 'APP-2024-001',
        type: 'PQ7',
        status: 'Waiting for Inspection',
        createdAt: '2024-05-15',
        exporter: { taxId: '1234567890123', name: 'Thai Exports Co., Ltd.', address: '123 Sukhumvit Rd, Bangkok', isOnBehalfOf: false },
        consignee: { taxId: 'JP-999', branch: '001', companyName: 'Tokyo Fruit Importers', address: '4-5 Ginza, Tokyo', subdistrict: '-', district: 'Chuo', province: 'Tokyo', country: 'Japan', phone: '+81-3-1234-5678', email: 'contact@tokyofruit.jp' },
        shipment: { transportMeans: 'Air Freight', vehicleInfo: 'TG672', exportDate: '2024-05-20', blAwbNumber: 'AWB-888-999', grossWeight: 500, totalPackages: 50, packageUnit: 'Boxes', destinationCountry: 'Japan', portOfEntry: 'Narita', transitPorts: [], shippingMarks: ['FRAGILE'], items: [], totalNetWeight: 450 },
        issuance: { stationId: '2' },
        inspection: { type: 'Checkpoint', appointmentDate: '2024-05-18', appointmentTime: '09:00' }
      },
      {
        id: 'REX-2024-002',
        type: 'PQ8',
        status: 'New',
        createdAt: '2024-05-18',
        exporter: { taxId: '1234567890123', name: 'Thai Exports Co., Ltd.', address: '123 Sukhumvit Rd, Bangkok', isOnBehalfOf: false },
        consignee: { taxId: 'CN-111', branch: '000', companyName: 'Shanghai Fresh', address: '99 Pudong, Shanghai', subdistrict: '-', district: 'Pudong', province: 'Shanghai', country: 'China', phone: '+86-21-999', email: 'sh@fresh.cn' },
        shipment: { transportMeans: 'Sea Freight', vehicleInfo: 'COSCO 12', exportDate: '2024-06-01', blAwbNumber: 'BL-Shanghai', grossWeight: 2000, totalPackages: 100, packageUnit: 'Pallets', destinationCountry: 'China', portOfEntry: 'Shanghai', transitPorts: [], shippingMarks: ['RE-EXPORT'], items: [], totalNetWeight: 1800, originCountry: 'USA', originalPCNumber: 'US-8812', entryDateToThailand: '2024-04-10' },
        issuance: { stationId: '3' },
        inspection: { type: 'Off-site', appointmentDate: '2024-05-25', appointmentTime: '14:00' }
      }
    ];
    setApplications(mockApps);
  }, []);

  const handleCreateNew = (type: ApplicationType = 'PQ7') => {
    setEditingApplication(null);
    setCurrentFormType(type);
    setActiveTab('form');
  };

  const handleEdit = (app: PQApplication) => {
    setEditingApplication(app);
    setCurrentFormType(app.type);
    setActiveTab('form');
  };

  const handleSubmitApplication = (app: PQApplication) => {
    if (editingApplication) {
      setApplications(apps => apps.map(a => a.id === app.id ? app : a));
    } else {
      setApplications(apps => [...apps, app]);
    }
    setActiveTab('dashboard');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-primary transition-all duration-300 flex flex-col z-20`}>
        <div className="p-6 flex items-center gap-4 text-white">
          <div className="bg-white/20 p-2 rounded-lg"><ShieldCheck size={24} /></div>
          {isSidebarOpen && <span className="font-bold text-lg tracking-tight">E-CERT</span>}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-4 p-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-white/10 text-white' : 'text-blue-100 hover:bg-white/5'}`}>
            <LayoutDashboard size={20} />{isSidebarOpen && <span>Dashboard</span>}
          </button>
          
          <div className="pt-4 pb-2 px-3 text-[10px] font-black text-blue-300 uppercase tracking-widest">{isSidebarOpen && 'New Application'}</div>
          
          <button onClick={() => handleCreateNew('PQ7')} className={`w-full flex items-center gap-4 p-3 rounded-lg transition-colors ${activeTab === 'form' && currentFormType === 'PQ7' ? 'bg-white/10 text-white' : 'text-blue-100 hover:bg-white/5'}`}>
            <PlusCircle size={20} />{isSidebarOpen && <span>P.Q. 7 Export</span>}
          </button>
          <button onClick={() => handleCreateNew('PQ8')} className={`w-full flex items-center gap-4 p-3 rounded-lg transition-colors ${activeTab === 'form' && currentFormType === 'PQ8' ? 'bg-white/10 text-white' : 'text-blue-100 hover:bg-white/5'}`}>
            <Repeat size={20} />{isSidebarOpen && <span>P.Q. 8 Re-export</span>}
          </button>
          <button onClick={() => handleCreateNew('PQ9')} className={`w-full flex items-center gap-4 p-3 rounded-lg transition-colors ${activeTab === 'form' && currentFormType === 'PQ9' ? 'bg-white/10 text-white' : 'text-blue-100 hover:bg-white/5'}`}>
            <RotateCcw size={20} />{isSidebarOpen && <span>P.Q. 9 Replacement</span>}
          </button>
          <button onClick={() => handleCreateNew('PQ13')} className={`w-full flex items-center gap-4 p-3 rounded-lg transition-colors ${activeTab === 'form' && currentFormType === 'PQ13' ? 'bg-white/10 text-white' : 'text-blue-100 hover:bg-white/5'}`}>
            <UserCheck size={20} />{isSidebarOpen && <span>P.Q. 13 Exporter Reg</span>}
          </button>
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <button className="w-full flex items-center gap-4 p-3 rounded-lg text-blue-100 hover:bg-white/5 transition-colors">
            <Settings size={20} />{isSidebarOpen && <span>Settings</span>}
          </button>
          <button className="w-full flex items-center gap-4 p-3 rounded-lg text-red-300 hover:bg-red-500/10 transition-colors">
            <LogOut size={20} />{isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-xl font-bold text-gray-800">
              {activeTab === 'dashboard' ? 'Application Dashboard' : `${currentFormType} Submission`}
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 hover:bg-gray-100 rounded-full"><Bell size={20} className="text-gray-600" /><span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span></button>
            <div className="flex items-center gap-3 pl-6 border-l text-right">
              <div><p className="text-sm font-semibold text-gray-800 leading-none">Somchai Jaidee</p><p className="text-xs text-gray-500 mt-1">Export Manager</p></div>
              <img src="https://picsum.photos/40/40" className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/10" alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' ? (
            <Dashboard applications={applications} onEdit={handleEdit} onCreateNew={() => handleCreateNew('PQ7')} />
          ) : (
            <PQ7Form initialData={editingApplication} type={currentFormType} onCancel={() => setActiveTab('dashboard')} onSubmit={handleSubmitApplication} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;

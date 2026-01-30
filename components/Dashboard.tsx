
import React from 'react';
import { Search, Filter, Eye, Edit2, Trash2, Lock } from 'lucide-react';
import { PQApplication } from '../types';
import { STATUS_MAP, TYPE_MAP } from '../constants';

interface DashboardProps {
  applications: PQApplication[];
  onEdit: (app: PQApplication) => void;
  onCreateNew: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ applications, onEdit, onCreateNew }) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Applications', count: applications.length, trend: 'Lifetime' },
          { label: 'Export (PQ7)', count: applications.filter(a => a.type === 'PQ7').length, trend: 'Standard' },
          { label: 'Re-export (PQ8)', count: applications.filter(a => a.type === 'PQ8').length, trend: 'International' },
          { label: 'Replacements (PQ9)', count: applications.filter(a => a.type === 'PQ9').length, trend: 'Fee Required' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            <div className="flex items-baseline gap-3 mt-2">
              <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-50 text-blue-700">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-[300px]">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search by ID, Consignee, or Country..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-600"><Filter size={18} /><span>Filters</span></button>
          </div>
          <button onClick={onCreateNew} className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg shadow-lg active:scale-95">Create New P.Q.7</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">ID / Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Exporter / Consignee</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Destination</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Created</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {applications.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">No applications found.</td></tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono font-bold text-primary">{app.id}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold inline-block w-fit ${TYPE_MAP[app.type]?.color}`}>{TYPE_MAP[app.type]?.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col"><span className="font-semibold text-gray-900">{app.exporter.name}</span><span className="text-xs text-gray-500 truncate max-w-[200px]">To: {app.consignee.companyName || 'N/A'}</span></div>
                    </td>
                    <td className="px-6 py-4"><span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium">{app.consignee.country || '-'}</span></td>
                    <td className="px-6 py-4 text-sm text-gray-600">{app.createdAt}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${STATUS_MAP[app.status]?.color}`}>
                        {STATUS_MAP[app.status]?.icon}{app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 group-hover:text-primary"><Eye size={18} /></button>
                        {app.status === 'New' ? (
                          <button onClick={() => onEdit(app)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 group-hover:text-blue-600"><Edit2 size={18} /></button>
                        ) : (
                          <div className="p-2 text-gray-300 cursor-not-allowed"><Lock size={18} /></div>
                        )}
                        <button className="p-2 hover:bg-red-50 rounded-lg text-gray-500 group-hover:text-red-600"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

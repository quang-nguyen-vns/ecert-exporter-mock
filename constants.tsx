
import React from 'react';
import { 
  FileText, 
  Search, 
  Truck, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  XCircle
} from 'lucide-react';

export const PRIMARY_COLOR = '#1E3A8A';

export const COUNTRIES = [
  'Japan', 'China', 'Vietnam', 'Singapore', 'Malaysia', 'USA', 'Germany', 'United Kingdom', 'Australia', 'Netherlands', 'France', 'Italy'
].sort();

export const TRANSPORT_MEANS = [
  'Sea Freight', 'Air Freight', 'Road Transport', 'Rail Transport'
];

export const PACKAGE_UNITS = [
  'Cartons', 'Boxes', 'Pallets', 'Bags', 'Crates', 'Units'
];

export const QUARANTINE_STATIONS = [
  { id: '1', name: 'Don Mueang Plant Quarantine Station' },
  { id: '2', name: 'Suvarnabhumi Plant Quarantine Station' },
  { id: '3', name: 'Laem Chabang Plant Quarantine Station' },
  { id: '4', name: 'Bangkok Port Plant Quarantine Station' }
];

export const MOCK_PRODUCTS = [
  { id: 'p1', name: 'Mango (Nam Dok Mai)', scientificName: 'Mangifera indica' },
  { id: 'p2', name: 'Durian (Monthong)', scientificName: 'Durio zibethinus' },
  { id: 'p3', name: 'Thai Jasmine Rice', scientificName: 'Oryza sativa' },
  { id: 'p4', name: 'Orchid (Dendrobium)', scientificName: 'Dendrobium spp.' },
  { id: 'p5', name: 'Pineapple', scientificName: 'Ananas comosus' },
  { id: 'p6', name: 'Banana (Cavendish)', scientificName: 'Musa acuminata' },
  { id: 'p7', name: 'Mangosteen', scientificName: 'Garcinia mangostana' }
];

export const STATUS_MAP: Record<string, { color: string; icon: any }> = {
  'New': { color: 'bg-gray-100 text-gray-700 ring-gray-500/10', icon: <FileText size={14} /> },
  'Waiting for Document Check': { color: 'bg-yellow-100 text-yellow-700 ring-yellow-600/20', icon: <Search size={14} /> },
  'Waiting for Inspection': { color: 'bg-blue-100 text-blue-700 ring-blue-600/20', icon: <Truck size={14} /> },
  'Waiting for Payment': { color: 'bg-purple-100 text-purple-700 ring-purple-600/20', icon: <Clock size={14} /> },
  'Approved': { color: 'bg-green-100 text-green-700 ring-green-600/20', icon: <CheckCircle2 size={14} /> },
  'Cancelled': { color: 'bg-red-100 text-red-700 ring-red-600/20', icon: <XCircle size={14} /> }
};

export const TYPE_MAP: Record<string, { label: string; color: string }> = {
  'PQ7': { label: 'P.Q. 7 (Export)', color: 'bg-blue-100 text-blue-800' },
  'PQ8': { label: 'P.Q. 8 (Re-export)', color: 'bg-amber-100 text-amber-800' },
  'PQ9': { label: 'P.Q. 9 (Replacement)', color: 'bg-purple-100 text-purple-800' },
  'PQ13': { label: 'P.Q. 13 (Registration)', color: 'bg-emerald-100 text-emerald-800' }
};

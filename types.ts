
export type AppStatus = 'New' | 'Waiting for Document Check' | 'Waiting for Inspection' | 'Waiting for Payment' | 'Approved' | 'Cancelled';

export type ApplicationType = 'PQ7' | 'PQ8' | 'PQ9' | 'PQ13';

export interface PlantProduct {
  id: string;
  name: string;
  scientificName: string;
}

export interface PQ7Item {
  id: string;
  productId: string;
  productName: string;
  scientificName: string;
  purpose: string;
  quantity: number;
  unit: string;
  netWeight: number;
  valueThb: number;
  packages: number;
  packageUnit: string;
  packageLayer: 'Inner' | 'Outer';
  additionalDetails: string;
}

export interface PQApplication {
  id: string;
  type: ApplicationType;
  status: AppStatus;
  createdAt: string;
  
  // Specific to PQ9
  originalCertificateId?: string;
  replacementReason?: string;
  replacementFee?: number;

  // Step 1: Exporter
  exporter: {
    taxId: string;
    name: string;
    address: string;
    isOnBehalfOf: boolean;
    obName?: string;
    obAddress?: string;
  };

  // Step 2: Consignee
  consignee: {
    taxId: string;
    branch: string;
    companyName: string;
    address: string;
    subdistrict: string;
    district: string;
    province: string;
    country: string;
    phone: string;
    email: string;
  };

  // Step 3: Shipment
  shipment: {
    transportMeans: string;
    vehicleInfo: string;
    exportDate: string;
    blAwbNumber: string;
    grossWeight: number;
    totalPackages: number;
    packageUnit: string;
    destinationCountry: string;
    portOfEntry: string;
    transitPorts: string[];
    shippingMarks: string[];
    items: PQ7Item[];
    totalNetWeight: number;
    
    // Specific to PQ8 (Re-export)
    originCountry?: string;
    originalPCNumber?: string;
    entryDateToThailand?: string;
  };

  // Step 4: Issuance
  issuance: {
    stationId: string;
  };

  // Step 5: Inspection
  inspection: {
    type: 'Checkpoint' | 'Off-site';
    appointmentDate: string;
    appointmentTime: string;
    contactPerson?: string;
    thirdPartyCompanyId?: string;
    siteName?: string;
    latitude?: string;
    longitude?: string;
    siteAddress?: string;
  };
}

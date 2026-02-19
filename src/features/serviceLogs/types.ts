export enum ServiceType {
  Planned = 'planned',
  Unplanned = 'unplanned',
  Emergency = 'emergency',
}

export interface ServiceLog {
  id: string;
  providerId: string;
  serviceOrder: string;
  carId: string;
  odometer: number;
  engineHours: number;
  startDate: string;
  endDate: string;
  type: ServiceType;
  serviceDescription: string;
  createdAt: string;
  updatedAt: string;
}
export type DraftServiceLog = { id: string } & Partial<Omit<ServiceLog, 'id'>>;

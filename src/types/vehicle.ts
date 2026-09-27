// ─── Veículo ──────────────────────────────────────────────────────────────────

export type Vehicle = {
  id: string;
  ownerId: string;
  vin: string;          // VIN/chassi — identificador único do veículo
  brand: string;        // Ex: "Ford"
  model: string;        // Ex: "Ka 1.0 SE"
  year: number;         // Ex: 2016
  color: string;        // Ex: "Prata"
  licensePlate: string; // Ex: "ABC1D23"
  mileage: number;      // Quilometragem atual em km
  fuelType: 'flex' | 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  transmission: 'manual' | 'automatic' | 'cvt';
  nextServiceMileage: number;  // Km previsto para próxima revisão
  nextServiceDate: number | null; // Timestamp previsto para próxima revisão
  registeredAt: number; // Timestamp de cadastro no sistema
};

// ─── Serviço / Histórico ──────────────────────────────────────────────────────

export type ServiceStatus =
  | 'scheduled'    // Agendado
  | 'in_progress'  // Em andamento
  | 'completed'    // Concluído
  | 'cancelled';   // Cancelado

export type ServiceType =
  | 'oil_change'           // Troca de óleo
  | 'tire_rotation'        // Rodízio de pneus
  | 'brake_inspection'     // Inspeção de freios
  | 'full_revision'        // Revisão completa
  | 'alignment_balancing'  // Alinhamento e balanceamento
  | 'air_filter'           // Filtro de ar
  | 'spark_plugs'          // Velas
  | 'timing_belt'          // Correia dentada
  | 'recall'               // Recall
  | 'warranty'             // Garantia
  | 'diagnostic'           // Diagnóstico
  | 'other';               // Outros

export type ServiceRecord = {
  id: string;
  vehicleId: string;
  vin: string;
  shopId: string;
  shopName: string;
  shopType: 'dealer' | 'partner'; // Concessionária oficial ou oficina parceira
  serviceType: ServiceType;
  description: string;
  mileageAtService: number;
  totalCost: number;
  genuineParts: boolean;  // Peças genuínas Ford utilizadas
  technician: string;
  notes: string;
  status: ServiceStatus;
  scheduledAt: number;    // Timestamp do agendamento
  completedAt: number | null; // Timestamp da conclusão
  createdAt: number;
  fordVerified: boolean;  // Verificado e chancelado pela Ford
};

// ─── Agendamento ─────────────────────────────────────────────────────────────

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export type Appointment = {
  id: string;
  vehicleId: string;
  ownerId: string;
  shopId: string;
  shopName: string;
  serviceType: ServiceType;
  description: string;
  scheduledDate: number; // Timestamp
  estimatedDuration: number; // Minutos
  estimatedCost: number;
  status: AppointmentStatus;
  notes: string;
  createdAt: number;
  confirmedAt: number | null;
  reminderSent: boolean;
};

// ─── Oficina Parceira ─────────────────────────────────────────────────────────

export type ShopCertification = 'ford_dealer' | 'ford_service_partner' | 'independent';

export type PartnerShop = {
  id: string;
  name: string;
  certification: ShopCertification;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  phone: string;
  whatsapp: string;
  rating: number;        // 0-5
  reviewCount: number;
  genuineParts: boolean;
  openHours: string;     // Ex: "Seg-Sex 8h-18h, Sáb 8h-12h"
  specialties: ServiceType[];
  distanceKm?: number;   // Calculado em runtime
};

// ─── Notificação ──────────────────────────────────────────────────────────────

export type NotificationType =
  | 'service_reminder'
  | 'appointment_confirmed'
  | 'appointment_reminder'
  | 'appointment_cancelled'
  | 'recall_alert'
  | 'service_completed'
  | 'mileage_alert';

export type AppNotification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  data?: Record<string, string>;
  createdAt: number;
};

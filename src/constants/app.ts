import { ServiceType, ShopCertification, NotificationType } from '../types/vehicle';

// ─── Labels de Tipo de Serviço ────────────────────────────────────────────────

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  oil_change: 'Troca de Óleo',
  tire_rotation: 'Rodízio de Pneus',
  brake_inspection: 'Inspeção de Freios',
  full_revision: 'Revisão Completa',
  alignment_balancing: 'Alinhamento e Balanceamento',
  air_filter: 'Filtro de Ar',
  spark_plugs: 'Velas de Ignição',
  timing_belt: 'Correia Dentada',
  recall: 'Recall Ford',
  warranty: 'Serviço de Garantia',
  diagnostic: 'Diagnóstico',
  other: 'Outros Serviços',
};

export const SERVICE_TYPE_ICONS: Record<ServiceType, string> = {
  oil_change: 'water',
  tire_rotation: 'sync',
  brake_inspection: 'warning',
  full_revision: 'build',
  alignment_balancing: 'settings',
  air_filter: 'air',
  spark_plugs: 'flash-on',
  timing_belt: 'settings-input-component',
  recall: 'campaign',
  warranty: 'verified',
  diagnostic: 'search',
  other: 'handyman',
};

// ─── Labels de Certificação ───────────────────────────────────────────────────

export const CERTIFICATION_LABELS: Record<ShopCertification, string> = {
  ford_dealer: 'Concessionária Ford',
  ford_service_partner: 'Ford Service Partner',
  independent: 'Oficina Independente',
};

export const CERTIFICATION_COLORS: Record<ShopCertification, string> = {
  ford_dealer: '#00274F',
  ford_service_partner: '#0066CC',
  independent: '#4A5568',
};

// ─── Labels de Notificação ────────────────────────────────────────────────────

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  service_reminder: 'Lembrete de Manutenção',
  appointment_confirmed: 'Agendamento Confirmado',
  appointment_reminder: 'Lembrete de Agendamento',
  appointment_cancelled: 'Agendamento Cancelado',
  recall_alert: 'Alerta de Recall',
  service_completed: 'Serviço Concluído',
  mileage_alert: 'Alerta de Quilometragem',
};

// ─── Intervalos de Manutenção (km) ────────────────────────────────────────────

export const MAINTENANCE_INTERVALS: Record<string, number> = {
  oil_change: 10000,
  air_filter: 20000,
  spark_plugs: 40000,
  timing_belt: 100000,
  brake_inspection: 30000,
};

// ─── Dados mock de oficinas parceiras ────────────────────────────────────────
// Usados para demonstração do app (Sprint 3 não requer integração de maps real)

export const MOCK_PARTNER_SHOPS = [
  {
    id: 'shop_001',
    name: 'Auto Ford Sorocaba',
    certification: 'ford_dealer' as ShopCertification,
    address: 'Av. Dr. Armando de Salles Oliveira, 1990',
    neighborhood: 'Jardim Sabiá',
    city: 'Sorocaba',
    state: 'SP',
    zipCode: '18050-000',
    latitude: -23.5034,
    longitude: -47.4579,
    phone: '(15) 3333-1001',
    whatsapp: '5515991234567',
    rating: 4.7,
    reviewCount: 243,
    genuineParts: true,
    openHours: 'Seg-Sex 8h-18h, Sáb 8h-12h',
    specialties: ['full_revision', 'warranty', 'recall', 'diagnostic'] as ServiceType[],
    distanceKm: 2.4,
  },
  {
    id: 'shop_002',
    name: 'Meca Ford Service Partner',
    certification: 'ford_service_partner' as ShopCertification,
    address: 'Rua das Oficinas, 450',
    neighborhood: 'Centro',
    city: 'Sorocaba',
    state: 'SP',
    zipCode: '18010-100',
    latitude: -23.5015,
    longitude: -47.4521,
    phone: '(15) 3333-2002',
    whatsapp: '5515987654321',
    rating: 4.5,
    reviewCount: 118,
    genuineParts: true,
    openHours: 'Seg-Sex 8h-17h30, Sáb 8h-12h',
    specialties: ['oil_change', 'tire_rotation', 'brake_inspection', 'alignment_balancing'] as ServiceType[],
    distanceKm: 5.1,
  },
  {
    id: 'shop_003',
    name: 'TechCar Ford Partner',
    certification: 'ford_service_partner' as ShopCertification,
    address: 'Rua Independência, 1200',
    neighborhood: 'Vila Helena',
    city: 'Sorocaba',
    state: 'SP',
    zipCode: '18075-000',
    latitude: -23.5120,
    longitude: -47.4640,
    phone: '(15) 3333-3003',
    whatsapp: '5515999887766',
    rating: 4.3,
    reviewCount: 87,
    genuineParts: true,
    openHours: 'Seg-Sáb 8h-18h',
    specialties: ['oil_change', 'spark_plugs', 'air_filter', 'timing_belt', 'diagnostic'] as ServiceType[],
    distanceKm: 8.7,
  },
  {
    id: 'shop_004',
    name: 'AutoFord Campinas Centro',
    certification: 'ford_dealer' as ShopCertification,
    address: 'Av. Francisco Glicério, 500',
    neighborhood: 'Cambuí',
    city: 'Campinas',
    state: 'SP',
    zipCode: '13025-000',
    latitude: -22.9056,
    longitude: -47.0608,
    phone: '(19) 3333-4004',
    whatsapp: '5519998765432',
    rating: 4.6,
    reviewCount: 312,
    genuineParts: true,
    openHours: 'Seg-Sex 7h30-18h, Sáb 8h-12h',
    specialties: ['full_revision', 'warranty', 'recall', 'timing_belt', 'diagnostic'] as ServiceType[],
    distanceKm: 14.2,
  },
];

// ─── Dados mock de histórico de serviços ─────────────────────────────────────

export const MOCK_SERVICE_HISTORY = [
  {
    id: 'svc_001',
    vehicleId: 'vehicle_001',
    vin: '9BFZZ5FSXCT001234',
    shopId: 'shop_001',
    shopName: 'Auto Ford Sorocaba',
    shopType: 'dealer' as const,
    serviceType: 'full_revision' as ServiceType,
    description: 'Revisão completa dos 50.000 km — troca de óleo sintético, filtro de óleo, filtro de ar, filtro de combustível, velas de ignição e verificação de freios.',
    mileageAtService: 50000,
    totalCost: 890.00,
    genuineParts: true,
    technician: 'Carlos Eduardo Martins',
    notes: 'Veículo em ótimas condições. Próxima revisão recomendada aos 60.000 km.',
    status: 'completed' as const,
    scheduledAt: Date.now() - 180 * 24 * 60 * 60 * 1000,
    completedAt: Date.now() - 179 * 24 * 60 * 60 * 1000,
    createdAt: Date.now() - 181 * 24 * 60 * 60 * 1000,
    fordVerified: true,
  },
  {
    id: 'svc_002',
    vehicleId: 'vehicle_001',
    vin: '9BFZZ5FSXCT001234',
    shopId: 'shop_001',
    shopName: 'Auto Ford Sorocaba',
    shopType: 'dealer' as const,
    serviceType: 'oil_change' as ServiceType,
    description: 'Troca de óleo semissintético 5W-30 + filtro de óleo genuíno Ford.',
    mileageAtService: 42500,
    totalCost: 230.00,
    genuineParts: true,
    technician: 'Roberto Alves da Silva',
    notes: 'Feito com óleo genuíno Ford/Motorcraft.',
    status: 'completed' as const,
    scheduledAt: Date.now() - 365 * 24 * 60 * 60 * 1000,
    completedAt: Date.now() - 365 * 24 * 60 * 60 * 1000,
    createdAt: Date.now() - 366 * 24 * 60 * 60 * 1000,
    fordVerified: true,
  },
  {
    id: 'svc_003',
    vehicleId: 'vehicle_001',
    vin: '9BFZZ5FSXCT001234',
    shopId: 'shop_002',
    shopName: 'Meca Ford Service Partner',
    shopType: 'partner' as const,
    serviceType: 'tire_rotation' as ServiceType,
    description: 'Rodízio de pneus + alinhamento e balanceamento.',
    mileageAtService: 38000,
    totalCost: 145.00,
    genuineParts: false,
    technician: 'André Souza',
    notes: 'Pneus com desgaste uniforme. Pressão corrigida em todos os pneus.',
    status: 'completed' as const,
    scheduledAt: Date.now() - 420 * 24 * 60 * 60 * 1000,
    completedAt: Date.now() - 420 * 24 * 60 * 60 * 1000,
    createdAt: Date.now() - 421 * 24 * 60 * 60 * 1000,
    fordVerified: true,
  },
];

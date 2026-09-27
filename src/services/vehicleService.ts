import { ref, set, get, push, query, orderByChild, equalTo, DataSnapshot } from 'firebase/database';
import { database } from './firebase';
import { Vehicle } from '../types/vehicle';
import { MOCK_SERVICE_HISTORY } from '../constants/app';

// ─── Veículo ──────────────────────────────────────────────────────────────────

export async function saveVehicle(vehicle: Vehicle): Promise<void> {
  const vehicleRef = ref(database, `vehicles/${vehicle.id}`);
  await set(vehicleRef, vehicle);
}

export async function getVehiclesByOwner(ownerId: string): Promise<Vehicle[]> {
  const vehiclesQuery = query(
    ref(database, 'vehicles'),
    orderByChild('ownerId'),
    equalTo(ownerId)
  );

  const snapshot = await get(vehiclesQuery);
  if (!snapshot.exists()) return [];

  const vehicles: Vehicle[] = [];
  snapshot.forEach((child: DataSnapshot) => {
    vehicles.push({ id: child.key as string, ...child.val() });
  });

  return vehicles;
}

export async function getVehicleByVin(vin: string): Promise<Vehicle | null> {
  const vinQuery = query(
    ref(database, 'vehicles'),
    orderByChild('vin'),
    equalTo(vin.toUpperCase())
  );

  const snapshot = await get(vinQuery);
  if (!snapshot.exists()) return null;

  let vehicle: Vehicle | null = null;
  snapshot.forEach((child: DataSnapshot) => {
    vehicle = { id: child.key as string, ...child.val() };
  });

  return vehicle;
}

export async function createVehicle(
  ownerId: string,
  data: Omit<Vehicle, 'id' | 'ownerId' | 'registeredAt'>
): Promise<Vehicle> {
  const vehiclesRef = ref(database, 'vehicles');
  const newRef = push(vehiclesRef);

  const vehicle: Vehicle = {
    id: newRef.key as string,
    ownerId,
    registeredAt: Date.now(),
    ...data,
  };

  await set(newRef, vehicle);
  return vehicle;
}

export async function updateVehicleMileage(vehicleId: string, mileage: number): Promise<void> {
  const mileageRef = ref(database, `vehicles/${vehicleId}/mileage`);
  await set(mileageRef, mileage);
}

// ─── Histórico de Serviços ────────────────────────────────────────────────────
// Para Sprint 3, retornamos dados mock para demonstração completa do app
// Em Sprint 4 isso seria integrado ao motor de intervalo real

export async function getServiceHistory(vehicleId: string) {
  // Em produção: buscar do Firebase por vehicleId
  // Para demo Sprint 3: retornar dados mock filtrados
  return MOCK_SERVICE_HISTORY.filter((s) => s.vehicleId === vehicleId);
}

export async function getServiceHistoryByVin(vin: string) {
  return MOCK_SERVICE_HISTORY.filter((s) => s.vin === vin);
}

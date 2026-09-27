import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { Vehicle } from '../types/vehicle';
import {
  getVehiclesByOwner,
  createVehicle,
  updateVehicleMileage,
} from '../services/vehicleService';

type VehicleContextData = {
  vehicles: Vehicle[];
  activeVehicle: Vehicle | null;
  loading: boolean;
  error: string | null;
  fetchVehicles: (ownerId: string) => Promise<void>;
  addVehicle: (ownerId: string, data: Omit<Vehicle, 'id' | 'ownerId' | 'registeredAt'>) => Promise<Vehicle>;
  setActiveVehicle: (vehicle: Vehicle | null) => void;
  updateMileage: (vehicleId: string, mileage: number) => Promise<void>;
  clearError: () => void;
};

const VehicleContext = createContext<VehicleContextData>({} as VehicleContextData);

export function VehicleProvider({ children }: { children: ReactNode }): JSX.Element {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeVehicle, setActiveVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async (ownerId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVehiclesByOwner(ownerId);
      setVehicles(data);
      if (data.length > 0 && !activeVehicle) {
        setActiveVehicle(data[0]);
      }
    } catch {
      setError('Não foi possível carregar seus veículos.');
    } finally {
      setLoading(false);
    }
  }, [activeVehicle]);

  const addVehicle = useCallback(
    async (ownerId: string, data: Omit<Vehicle, 'id' | 'ownerId' | 'registeredAt'>) => {
      setLoading(true);
      setError(null);
      try {
        const vehicle = await createVehicle(ownerId, data);
        setVehicles((prev) => [...prev, vehicle]);
        setActiveVehicle(vehicle);
        return vehicle;
      } catch {
        setError('Não foi possível cadastrar o veículo.');
        throw new Error('Falha ao cadastrar veículo.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateMileage = useCallback(async (vehicleId: string, mileage: number) => {
    await updateVehicleMileage(vehicleId, mileage);
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, mileage } : v))
    );
    setActiveVehicle((prev) =>
      prev?.id === vehicleId ? { ...prev, mileage } : prev
    );
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        activeVehicle,
        loading,
        error,
        fetchVehicles,
        addVehicle,
        setActiveVehicle,
        updateMileage,
        clearError,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicleContext(): VehicleContextData {
  return useContext(VehicleContext);
}

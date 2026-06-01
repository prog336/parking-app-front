import axios from 'axios';
import type {
    Owner,
    Vehicle,
    ParkingSpot,
    Booking,
    OwnerCreateDTO,
    VehicleCreateDTO,
    ParkingSpotCreateDTO,
    BookingCreateDTO,
} from '../types';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const ownersApi = {
    getAll: () => api.get<Owner[]>('/owners'),
    search: (fullName: string) => api.get<Owner[]>(`/owners?fullName=${fullName}`),
    create: (owner: OwnerCreateDTO) => api.post<Owner>('/owners', owner),
    update: (id: string, owner: OwnerCreateDTO) => api.put<Owner>(`/owners/${id}`, owner),
    delete: (id: string) => api.delete(`/owners/${id}`),
};

export const vehiclesApi = {
    getAll: () => api.get<Vehicle[]>('/vehicles'),
    search: (licensePlate: string) => api.get<Vehicle[]>(`/vehicles?licensePlate=${licensePlate}`),
    create: (vehicle: VehicleCreateDTO) => api.post<Vehicle>('/vehicles', vehicle),
    update: (id: string, vehicle: VehicleCreateDTO) => api.put<Vehicle>(`/vehicles/${id}`, vehicle),
    delete: (id: string) => api.delete(`/vehicles/${id}`),
};

export const parkingSpotsApi = {
    getAll: () => api.get<ParkingSpot[]>('/parkingSpots'),
    create: (spot: ParkingSpotCreateDTO) => api.post<ParkingSpot>('/parkingSpots', spot),
    update: (id: string, spot: ParkingSpotCreateDTO) => api.put<ParkingSpot>(`/parkingSpots/${id}`, spot),
    delete: (id: string) => api.delete(`/parkingSpots/${id}`),
};

export const bookingsApi = {
    getAll: () => api.get<Booking[]>('/bookings'),
    searchByPlate: (licensePlate: string) => api.get<Booking[]>(`/bookings?licensePlate=${licensePlate}`),
    searchByOwner: (fullName: string) => api.get<Booking[]>(`/bookings?fullName=${fullName}`),
    create: (booking: BookingCreateDTO) => api.post<Booking>('/bookings', booking),
    pay: (id: string) => api.put<Booking>(`/bookings/${id}`),
    release: (id: string) => api.delete(`/bookings/${id}`),
    deleteExpired: () => api.delete('/bookings/expired'),
};

export default api;
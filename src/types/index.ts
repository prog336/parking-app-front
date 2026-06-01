export interface Owner {
    id: string;
    fullName: string;
    phoneNumber: string;
}

export interface Vehicle {
    id: string;
    licensePlate: string;
    brand: string;
    model: string;
    owner: Owner;
}

export interface ParkingSpot {
    id: string;
    spotNumber: string;
    occupied: boolean;
}

export interface Booking {
    id: string;
    parkingSpot: ParkingSpot;
    vehicle: Vehicle;
    startTime: string;
    endTime: string;
    isPaid: boolean;
    cost: number;
}

export interface OwnerCreateDTO {
    fullName: string;
    phoneNumber: string;
}

export interface VehicleCreateDTO {
    licensePlate: string;
    brand: string;
    model: string;
    ownerId: string;
}

export interface ParkingSpotCreateDTO {
    spotNumber: string;
}

export interface BookingCreateDTO {
    startTime: string;
    endTime: string;
    parkingSpotId: string;
    vehicleId: string;
}
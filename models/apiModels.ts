export interface Driver {
    id: string,
    name: string,
    picture: string,
    phone: number,
    present: boolean,
    carModel: string,
    carPlate: string,
    nickname: string,
    busy: boolean,
    tripCount?: number
}
export interface DriverCreateRequest {
    name: string,
    picture: Blob | null,
    phone: number,
    present: boolean,
    carModel: string,
    carPlate: string,
    nickname: string,
    busy: boolean
}
export interface Trip {
    id: string,
    targetLocation: string,
    pickupLocation: string,
    finishedAt: string,
    driverId: string,
    created: string,
    expand?: {
        driverId: Driver
    },
}

export interface PaginationOptions {
    page?: number;
    pageSize?: number;
}
export interface PaginationInfo {
    page: number,
    perPage: number,
    totalItems: number,
    totalPages: number,
}
export interface CollectionResponse<T> extends PaginationInfo{
    items: T
}
export interface TripCreateRequest {
    targetLocation: string,
    pickupLocation: string,
    driverId: string,
}

export type UserRole = 'admin' | 'driver' | 'nothing'
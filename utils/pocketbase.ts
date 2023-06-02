import axios from "axios";
import {Driver, DriverCreateRequest, Trip, TripCreateRequest, UserRole} from "~/models/apiModels";

export async function fetchDrivers(): Promise<Driver[]> {
    try {
        const response = await axios.get('https://mealmind-pocketbase.fly.dev/api/collections/drivers/records');
        const drivers = await response.data;
        return drivers.items;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function fetchDriver(driverId: string): Promise<Driver> {
    try {
        const response = await axios.get(`https://mealmind-pocketbase.fly.dev/api/collections/drivers/records/${driverId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function fetchTrips(driverId: string): Promise<Trip[]> {
    try {
        const response = await axios.get(
            'https://mealmind-pocketbase.fly.dev/api/collections/trips/records',
            {
                params: {
                    filter: `driverId='${driverId}'`,
                    sort: '-created'
                },
            }
        );
        const trips = await response.data;
        // console.log(response.data)
        return trips.items;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function createTrip(newTrip: TripCreateRequest) {
    try {
        const response = await axios.post('https://mealmind-pocketbase.fly.dev/api/collections/trips/records', newTrip);
        const createdTrip = response.data;
        await setDriverBusyStatus(newTrip.driverId,true);
        // console.log('New trip created:', createdTrip);
        return createdTrip;
    } catch (error) {
        console.error('Error creating trip:', error);
        throw error;
    }
}

export async function createDriver(driver: DriverCreateRequest): Promise<void> {
    try {
        const formData = new FormData();
        formData.append('name', driver.name);
        if(driver.picture!=='') {
            formData.append('picture', {
                // @ts-ignore
                uri: driver.picture, // Assuming driver.picture is the file path or file URL
                name: 'driver_picture.jpg', // Provide a desired filename for the image
                type: 'image/jpeg', // Adjust the MIME type according to your image file
            });
        }
        formData.append('phone', driver.phone.toString());
        formData.append('present', driver.present.toString());
        formData.append('carModel', driver.carModel);
        formData.append('carPlate', driver.carPlate);
        formData.append('nickname', driver.nickname);
        formData.append('busy', driver.busy.toString());
        await axios.post('https://mealmind-pocketbase.fly.dev/api/collections/drivers/records', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function setDriverBusyStatus(driverId: string, busy: boolean) {
    try {
        // Fetch the driver record
        const response = await axios.get(`https://mealmind-pocketbase.fly.dev/api/collections/drivers/records/${driverId}`);
        const driver = response.data;
        // Update the busy status
        driver.busy = busy;

        // Save the updated driver record
        await axios.patch(`https://mealmind-pocketbase.fly.dev/api/collections/drivers/records/${driverId}`, {busy:driver.busy});
        // console.log(`Driver ${driverId} busy status updated: ${busy}`);
    } catch (error) {
        console.error(`Error updating driver ${driverId} busy status:`, error);
        throw error;
    }
}

export async function setTripFinished(driverId: string): Promise<void> {
    try {
        console.log(driverId)
        // Fetch the trips associated with the driver
        const response = await axios.get('https://mealmind-pocketbase.fly.dev/api/collections/trips/records', {
            params: {
                driverId,
                sort:'-created'
            },
        });
        console.log(response.data)
        const trips: Trip[] = response.data.items;

        const unfinishedTrip = trips.find(trip => !trip.finishedAt);
        // console.log(trips)
        if (unfinishedTrip) {
            // Update the trip fields
            // @ts-ignore
            unfinishedTrip.finishedAt = new Date();

            // Save the updated trip record
            await axios.patch(`https://mealmind-pocketbase.fly.dev/api/collections/trips/records/${unfinishedTrip.id}`, {finishedAt:unfinishedTrip.finishedAt});
            await setDriverBusyStatus(driverId,false);
            // console.log(updatedTrip.data)
        } else {
            console.log('No unfinished trip found for the driver.');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function resetAttendance(): Promise<void> {
    try {
        const response = await axios.get('https://mealmind-pocketbase.fly.dev/api/collections/drivers/records');
        const drivers = response.data.items;

        const updatePromises = drivers.map(async (driver: Driver) => {
            await updateDriverAttendance(driver.id, false);
        });

        await Promise.all(updatePromises);

        console.log('Attendance reset for all drivers');
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function updateDriverAttendance(driverId: string, present: boolean): Promise<void> {
    try {
        const response = await axios.get(`https://mealmind-pocketbase.fly.dev/api/collections/drivers/records/${driverId}`);
        const driver = response.data;

        const updatedDriver = {
            ...driver,
            present: present,
        };

        await axios.patch(`https://mealmind-pocketbase.fly.dev/api/collections/drivers/records/${driverId}`, updatedDriver);
        // if (present) {
        //     Alert.alert('Success', `Driver ${driverName} is marked as present`);
        // }
        // console.log(`Driver ${driverId} attendance updated`);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function fetchTodayTrips(): Promise<any[]> {
    try {
        const currentDate = new Date().toISOString().split('T')[0]; // Get today's date
        const startTime = `${currentDate} 00:00:00`;
        const endTime = `${currentDate} 23:59:59`;

        const response = await axios.get('https://mealmind-pocketbase.fly.dev/api/collections/trips/records', {
            params: {
                filter: `created >= "${startTime}" && created <= "${endTime}"`,
            },
        });

        const trips = response.data.items;
        console.log('Today\'s trips:', trips.length);
        return trips;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export async function checkUserRole(id: string): Promise<UserRole> {
    const formattedId = id.replace(" ","");
    try {
        const driverResponse = await axios.get(`https://mealmind-pocketbase.fly.dev/api/collections/drivers/records/${formattedId}`);
        if (driverResponse.data) {
            return 'driver';
        }
    } catch (driverError) {
        try {
            const adminResponse = await axios.get(`https://mealmind-pocketbase.fly.dev/api/collections/admins/records/${formattedId}`);
            if (adminResponse.data) {
                return 'admin';
            }
        } catch (adminError) {
            console.error('Error occurred while checking user role:', adminError);
            return 'nothing';
        }
    }

    return 'nothing';
}


export async function getDriverDetails(driverId: string): Promise<{ driver: Driver; trips: Trip[] }> {
    const userRole = await checkUserRole(driverId);

    if (userRole === 'driver') {
        try {
            const formattedId = driverId.replace(" ", "");

            const [driverResponse, tripsResponse] = await Promise.all([
                axios.get<Driver>(`https://mealmind-pocketbase.fly.dev/api/collections/drivers/records/${formattedId}`),
                axios.get<{ items:Trip[] }>(`https://mealmind-pocketbase.fly.dev/api/collections/trips/records?driverId=${formattedId}`,{
                    params: {
                        sort: '-created'
                    },
                })
            ]);

            const driver = driverResponse.data;
            const trips = tripsResponse.data.items;

            return { driver, trips };
        } catch (error) {
            console.error('Error occurred while retrieving driver details:', error);
            throw error;
        }
    } else {
        throw new Error('Invalid user role. User is not a driver.');
    }
}
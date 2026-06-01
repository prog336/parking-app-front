import { defineStore } from 'pinia';
import { ref } from 'vue';
import { vehiclesApi } from '../api';
import type { Vehicle, VehicleCreateDTO } from '../types';
import { ElMessage } from 'element-plus';

export const useVehiclesStore = defineStore('vehicles', () => {
    const vehicles = ref<Vehicle[]>([]);
    const loading = ref(false);

    async function fetchVehicles() {
        loading.value = true;
        try {
            const response = await vehiclesApi.getAll();
            vehicles.value = response.data;
        } catch (error) {
            ElMessage.error('Ошибка загрузки автомобилей');
        } finally {
            loading.value = false;
        }
    }

    async function searchVehicle(licensePlate: string) {
        loading.value = true;
        try {
            const response = await vehiclesApi.search(licensePlate);
            vehicles.value = response.data;
        } catch (error) {
            ElMessage.error('Ошибка поиска автомобилей');
        } finally {
            loading.value = false;
        }
    }

    async function addVehicle(vehicle: VehicleCreateDTO) {
        try {
            await vehiclesApi.create(vehicle);
            await fetchVehicles();
            ElMessage.success('Автомобиль добавлен');
        } catch (error) {
            ElMessage.error('Ошибка добавления автомобиля');
        }
    }

    async function updateVehicle(id: string, vehicle: VehicleCreateDTO) {
        try {
            await vehiclesApi.update(id, vehicle);
            await fetchVehicles();
            ElMessage.success('Автомобиль обновлён');
        } catch (error) {
            ElMessage.error('Ошибка обновления автомобиля');
        }
    }

    async function deleteVehicle(id: string) {
        try {
            await vehiclesApi.delete(id);
            await fetchVehicles();
            ElMessage.success('Автомобиль удалён');
        } catch (error) {
            ElMessage.error('Ошибка удаления автомобиля');
        }
    }

    return { vehicles, loading, fetchVehicles, searchVehicle, addVehicle, updateVehicle, deleteVehicle };
});
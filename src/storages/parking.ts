import { defineStore } from 'pinia';
import { ref } from 'vue';
import { parkingSpotsApi } from '../api';
import type { ParkingSpot, ParkingSpotCreateDTO } from '../types';
import { ElMessage } from 'element-plus';

export const useParkingStore = defineStore('parking', () => {
    const spots = ref<ParkingSpot[]>([]);
    const loading = ref(false);

    async function fetchSpots() {
        loading.value = true;
        try {
            const response = await parkingSpotsApi.getAll();
            spots.value = response.data;
        } catch (error) {
            ElMessage.error('Ошибка загрузки парковочных мест');
        } finally {
            loading.value = false;
        }
    }

    async function addSpot(spot: ParkingSpotCreateDTO) {
        try {
            await parkingSpotsApi.create(spot);
            await fetchSpots();
            ElMessage.success('Место добавлено');
        } catch (error) {
            ElMessage.error('Ошибка добавления места');
        }
    }

    async function updateSpot(id: string, spot: ParkingSpotCreateDTO) {
        try {
            await parkingSpotsApi.update(id, spot);
            await fetchSpots();
            ElMessage.success('Место обновлено');
        } catch (error) {
            ElMessage.error('Ошибка обновления места');
        }
    }

    async function deleteSpot(id: string) {
        try {
            await parkingSpotsApi.delete(id);
            await fetchSpots();
            ElMessage.success('Место удалено');
        } catch (error) {
            ElMessage.error('Ошибка удаления места');
        }
    }

    return { spots, loading, fetchSpots, addSpot, updateSpot, deleteSpot };
});
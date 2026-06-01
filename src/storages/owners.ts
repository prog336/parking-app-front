import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ownersApi } from '../api';
import type { Owner, OwnerCreateDTO } from '../types';
import { ElMessage } from 'element-plus';

export const useOwnersStore = defineStore('owners', () => {
    const owners = ref<Owner[]>([]);
    const loading = ref(false);

    async function fetchOwners() {
        loading.value = true;
        try {
            const response = await ownersApi.getAll();
            owners.value = response.data;
        } catch (error) {
            ElMessage.error('Ошибка загрузки владельцев');
        } finally {
            loading.value = false;
        }
    }

    async function searchOwners(fullName: string) {
        loading.value = true;
        try {
            const response = await ownersApi.search(fullName);
            owners.value = response.data;
        } catch (error) {
            ElMessage.error('Ошибка поиска владельцев');
        } finally {
            loading.value = false;
        }
    }

    async function addOwner(owner: OwnerCreateDTO) {
        try {
            await ownersApi.create(owner);
            await fetchOwners();
            ElMessage.success('Владелец добавлен');
        } catch (error) {
            ElMessage.error('Ошибка добавления владельца');
        }
    }

    async function updateOwner(id: string, owner: OwnerCreateDTO) {
        try {
            await ownersApi.update(id, owner);
            await fetchOwners();
            ElMessage.success('Владелец обновлён');
        } catch (error) {
            ElMessage.error('Ошибка обновления владельца');
        }
    }

    async function deleteOwner(id: string) {
        try {
            await ownersApi.delete(id);
            await fetchOwners();
            ElMessage.success('Владелец удалён');
        } catch (error) {
            ElMessage.error('Ошибка удаления владельца');
        }
    }

    return { owners, loading, fetchOwners, searchOwners, addOwner, updateOwner, deleteOwner };
});
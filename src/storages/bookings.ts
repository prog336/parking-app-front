import { defineStore } from 'pinia';
import { ref } from 'vue';
import { bookingsApi } from '../api';
import type { Booking, BookingCreateDTO } from '../types';
import { ElMessage, ElMessageBox } from 'element-plus';

export const useBookingsStore = defineStore('bookings', () => {
    const bookings = ref<Booking[]>([]);
    const loading = ref(false);

    async function fetchBookings() {
        loading.value = true;
        try {
            const response = await bookingsApi.getAll();
            bookings.value = response.data;
        } catch (error) {
            ElMessage.error('Ошибка загрузки бронирований');
        } finally {
            loading.value = false;
        }
    }

    async function searchByPlate(licensePlate: string) {
        loading.value = true;
        try {
            const response = await bookingsApi.searchByPlate(licensePlate);
            bookings.value = response.data;
        } catch (error) {
            ElMessage.error('Ошибка поиска по номеру авто');
        } finally {
            loading.value = false;
        }
    }

    async function searchByOwner(fullName: string) {
        loading.value = true;
        try {
            const response = await bookingsApi.searchByOwner(fullName);
            bookings.value = response.data;
        } catch (error) {
            ElMessage.error('Ошибка поиска по ФИО владельца');
        } finally {
            loading.value = false;
        }
    }

    async function createBooking(booking: BookingCreateDTO) {
        try {
            await bookingsApi.create(booking);
            await fetchBookings();
            ElMessage.success('Бронирование создано');
        } catch (error) {
            ElMessage.error('Ошибка создания бронирования');
        }
    }

    async function releaseBooking(id: string) {
        try {
            await bookingsApi.release(id);
            await fetchBookings();
            ElMessage.success('Место освобождено');
        } catch (error) {
            ElMessage.error('Ошибка освобождения места');
        }
    }

    async function deleteExpiredBookings() {
        try {
            await ElMessageBox.confirm(
                'Вы уверены, что хотите удалить все истёкшие бронирования?',
                'Подтверждение',
                {
                    confirmButtonText: 'Удалить',
                    cancelButtonText: 'Отмена',
                    type: 'warning',
                }
            );
            await bookingsApi.deleteExpired();
            await fetchBookings();
            ElMessage.success('Истёкшие бронирования удалены');
        } catch (error) {
            if (error !== 'cancel') {
                ElMessage.error('Ошибка удаления истёкших бронирований');
            }
        }
    }

    async function payBooking(id: string) {
        try {
            await bookingsApi.pay(id);
            await fetchBookings();
            ElMessage.success('Оплата проведена');
        } catch (error) {
            ElMessage.error('Ошибка оплаты');
        }
    }

    return {
        bookings,
        loading,
        fetchBookings,
        searchByPlate,
        searchByOwner,
        createBooking,
        releaseBooking,
        deleteExpiredBookings,
        payBooking,
    };
});
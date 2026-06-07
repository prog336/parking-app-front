<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useBookingsStore } from '../storages/bookings';
import { useParkingStore } from '../storages/parking';
import { useVehiclesStore } from '../storages/vehicles';

const bookingsStore = useBookingsStore();
const parkingStore = useParkingStore();
const vehiclesStore = useVehiclesStore();

const searchPlate = ref('');
const searchOwner = ref('');
const createDialogVisible = ref(false);
const bookingForm = ref({
  parkingSpotId: null as string | null,
  vehicleId: null as string | null,
  startTime: '',
  endTime: '',
});

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const freeSpots = computed(() =>
    parkingStore.spots.filter((s) => !s.occupied)
);

function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  return date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function handleSearchByPlate() {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    if (searchPlate.value.trim()) {
      bookingsStore.searchByPlate(searchPlate.value);
    } else {
      bookingsStore.fetchBookings();
    }
  }, 300);
}

function handleSearchByOwner() {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    if (searchOwner.value.trim()) {
      bookingsStore.searchByOwner(searchOwner.value);
    } else {
      bookingsStore.fetchBookings();
    }
  }, 300);
}

function openCreateDialog() {
  bookingForm.value = {
    parkingSpotId: null,
    vehicleId: null,
    startTime: '',
    endTime: '',
  };
  createDialogVisible.value = true;
}

async function handleCreateBooking() {
  if (bookingForm.value.parkingSpotId && bookingForm.value.vehicleId
      && bookingForm.value.startTime && bookingForm.value.endTime) {
    await bookingsStore.createBooking({
      parkingSpotId: bookingForm.value.parkingSpotId,
      vehicleId: bookingForm.value.vehicleId,
      startTime: new Date(bookingForm.value.startTime).toISOString(),
      endTime: new Date(bookingForm.value.endTime).toISOString(),
    });
    createDialogVisible.value = false;
    await parkingStore.fetchSpots();
  }
}

async function handleRelease(id: string) {
  await bookingsStore.releaseBooking(id);
  await parkingStore.fetchSpots();
}

async function handlePay(id: string) {
  await bookingsStore.payBooking(id);
}

async function handleDeleteExpired() {
  await bookingsStore.deleteExpiredBookings();
}

onMounted(() => {
  bookingsStore.fetchBookings();
  parkingStore.fetchSpots();
  vehiclesStore.fetchVehicles();
});
</script>

<template>
  <div class="page-container">
    <h1>Бронирование и оплата</h1>

    <div class="search-section">
      <el-input
          v-model="searchPlate"
          placeholder="Поиск по госномеру авто"
          clearable
          @input="handleSearchByPlate"
          style="width: 280px; margin-right: 16px"
      />
      <el-input
          v-model="searchOwner"
          placeholder="Поиск по ФИО владельца"
          clearable
          @input="handleSearchByOwner"
          style="width: 280px; margin-right: 16px"
      />
      <el-button type="primary" @click="openCreateDialog">Новое бронирование</el-button>
      <el-button type="danger" @click="handleDeleteExpired">
        Удалить истёкшие
      </el-button>
    </div>

    <el-table :data="bookingsStore.bookings" v-loading="bookingsStore.loading" border style="margin-top: 20px">
      <el-table-column label="Место">
        <template #default="{ row }">
          {{ row.parkingSpot?.spotNumber }}
        </template>
      </el-table-column>
      <el-table-column label="Госномер">
        <template #default="{ row }">
          {{ row.vehicle?.licensePlate }}
        </template>
      </el-table-column>
      <el-table-column label="Марка / Модель">
        <template #default="{ row }">
          {{ row.vehicle?.brand }} {{ row.vehicle?.model }}
        </template>
      </el-table-column>
      <el-table-column label="Владелец">
        <template #default="{ row }">
          {{ row.vehicle?.owner?.fullName }}
        </template>
      </el-table-column>
      <el-table-column label="Начало" width="170">
        <template #default="{ row }">
          {{ formatDateTime(row.startTime) }}
        </template>
      </el-table-column>
      <el-table-column label="Окончание" width="170">
        <template #default="{ row }">
          {{ formatDateTime(row.endTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="cost" label="Стоимость" width="110" />
      <el-table-column label="Оплачено" width="100">
        <template #default="{ row }">
          <el-tag :type="row.isPaid ? 'success' : 'warning'">
            {{ row.isPaid ? 'Да' : 'Нет' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Действия" width="200" fixed="right">
        <template #default="{ row }">
          <el-button
              size="small"
              type="warning"
              @click="handleRelease(row.id)"
          >
            Освободить
          </el-button>
          <el-button
              v-if="!row.isPaid"
              size="small"
              type="success"
              @click="handlePay(row.id)"
          >
            Оплатить
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="createDialogVisible" title="Новое бронирование" width="500px">
      <el-form :model="bookingForm" label-width="140px">
        <el-form-item label="Парковочное место">
          <el-select v-model="bookingForm.parkingSpotId" placeholder="Выберите место" style="width: 100%">
            <el-option
                v-for="spot in freeSpots"
                :key="spot.id"
                :label="`Место ${spot.spotNumber}`"
                :value="spot.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Автомобиль">
          <el-select v-model="bookingForm.vehicleId" placeholder="Выберите автомобиль" style="width: 100%">
            <el-option
                v-for="vehicle in vehiclesStore.vehicles"
                :key="vehicle.id"
                :label="`${vehicle.licensePlate} — ${vehicle.brand} ${vehicle.model} (${vehicle.owner?.fullName})`"
                :value="vehicle.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Начало">
          <el-date-picker
              v-model="bookingForm.startTime"
              type="datetime"
              placeholder="Выберите дату и время начала"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DDTHH:mm"
              style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Окончание">
          <el-date-picker
              v-model="bookingForm.endTime"
              type="datetime"
              placeholder="Выберите дату и время окончания"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DDTHH:mm"
              style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createDialogVisible = false">Отмена</el-button>
        <el-button type="primary" @click="handleCreateBooking">Забронировать</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.page-container {
  padding: 20px;
}

.search-section {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
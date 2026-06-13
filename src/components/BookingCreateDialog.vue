<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {useParkingStore} from "../storages/parking.ts";
import {useVehiclesStore} from "../storages/vehicles.ts";
import {useBookingsStore} from "../storages/bookings.ts";

const emit = defineEmits<{
  closeBookingCreateDialog: []
}>();

const parkingStore = useParkingStore();
const vehiclesStore = useVehiclesStore();
const bookingsStore = useBookingsStore();
const freeSpots = computed(() =>
    parkingStore.spots.filter((s) => !s.occupied)
);
const bookingForm = ref({
  parkingSpotId: null as string | null,
  vehicleId: null as string | null,
  startTime: '',
  endTime: '',
});
const createDialogVisible = ref(true);

async function handleCreateBooking() {
  if (bookingForm.value.parkingSpotId && bookingForm.value.vehicleId
      && bookingForm.value.startTime && bookingForm.value.endTime) {
    await bookingsStore.createBooking({
      parkingSpotId: bookingForm.value.parkingSpotId,
      vehicleId: bookingForm.value.vehicleId,
      startTime: new Date(bookingForm.value.startTime).toISOString(),
      endTime: new Date(bookingForm.value.endTime).toISOString(),
    });
    emit('closeBookingCreateDialog');
  }
}

onMounted(() => {
  parkingStore.fetchSpots();
  vehiclesStore.fetchVehicles();
});
</script>

<template>
  <el-dialog
      v-model="createDialogVisible"
      title="Новое бронирование"
      width="500px"
      @close="$emit('closeBookingCreateDialog')"
  >
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
      <el-button @click="$emit('closeBookingCreateDialog')">Отмена</el-button>
      <el-button type="primary" @click="handleCreateBooking">Забронировать</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>
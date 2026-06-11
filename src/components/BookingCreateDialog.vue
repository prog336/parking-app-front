<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import {useParkingStore} from "../storages/parking.ts";
import {useVehiclesStore} from "../storages/vehicles.ts";
import {useBookingsStore} from "../storages/bookings.ts";

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void
}>();

let createDialogVisible = computed({
  get: () => props.visible,
  set: (visible: boolean) => emit('update:visible', visible)
});

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
  }
}

watch(createDialogVisible, async () =>{
  if (createDialogVisible.value) {
    await parkingStore.fetchSpots();
    await vehiclesStore.fetchVehicles();
    bookingForm.value = {
      parkingSpotId: null,
      vehicleId: null,
      startTime: '',
      endTime: '',
    };
  }
})
</script>

<template>
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
</template>

<style scoped>

</style>
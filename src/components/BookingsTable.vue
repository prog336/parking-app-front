<script setup lang="ts">
import {useBookingsStore} from "../storages/bookings.ts";
import {onMounted} from "vue";

const bookingsStore = useBookingsStore();

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

async function handleRelease(id: string) {
  await bookingsStore.releaseBooking(id);
}

async function handlePay(id: string) {
  await bookingsStore.payBooking(id);
}

onMounted(() => {
  bookingsStore.fetchBookings();
})
</script>

<template>
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
        <el-space>
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
        </el-space>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>

</style>
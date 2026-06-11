<script setup lang="ts">
import {ref} from "vue";
import {useBookingsStore} from "../storages/bookings.ts";

const emit = defineEmits<{
  (e: 'openBookingsCreateDialog') :void
}>();

const bookingsStore = useBookingsStore();
const searchPlate = ref('');
const searchOwner = ref('');
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

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

async function handleDeleteExpired() {
  await bookingsStore.deleteExpiredBookings();
}

function openBookingsCreateDialog() {
  emit('openBookingsCreateDialog');
}
</script>

<template>
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
    <el-button type="primary" @click="openBookingsCreateDialog">Новое бронирование</el-button>
    <el-button type="danger" @click="handleDeleteExpired">
      Удалить истёкшие
    </el-button>
  </div>
</template>

<style scoped>
.search-section {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
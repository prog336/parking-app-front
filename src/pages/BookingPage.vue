<script setup lang="ts">
import { ref } from 'vue';
import BookingCreateDialog from "../components/BookingCreateDialog.vue";
import BookingsTable from "../components/BookingsTable.vue";
import BookingsSearchSection from "../components/BookingsSearchSection.vue";

const createDialogVisible = ref(false);

function handleCreateBooking() {
  console.log("opened create dialog " + createDialogVisible.value);
  createDialogVisible.value = true;
  console.log("closed create dialog " + createDialogVisible.value);
}
</script>

<template>
  <div class="page-container">
    <h1>Бронирование и оплата</h1>

    <BookingsSearchSection @openBookingsCreateDialog = "handleCreateBooking"/>
    <BookingsTable />

    <BookingCreateDialog v-if="createDialogVisible" @closeBookingCreateDialog="createDialogVisible = false" />
  </div>
</template>

<style scoped>
.page-container {
  padding: 20px;
}
</style>
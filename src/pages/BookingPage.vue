<script setup lang="ts">
import { ref } from 'vue';
import BookingCreateDialog from "../components/BookingCreateDialog.vue";
import BookingsTable from "../components/BookingsTable.vue";
import BookingsSearchSection from "../components/BookingsSearchSection.vue";

const createDialogVisible = ref(false);
</script>

<template>
  <div class="page-container">
    <h1>Бронирование и оплата</h1>

    <BookingsSearchSection @openBookingsCreateDialog = "createDialogVisible = true" />
    <BookingsTable />

    <BookingCreateDialog v-if="createDialogVisible" @closeBookingCreateDialog="createDialogVisible = false" />
  </div>
</template>

<style scoped>
.page-container {
  padding: 20px;
}
</style>
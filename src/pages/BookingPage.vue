<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BookingCreateDialog from "../components/BookingCreateDialog.vue";
import BookingsTable from "../components/BookingsTable.vue";
import BookingsSearchSection from "../components/BookingsSearchSection.vue";

const createDialogVisible = ref(false);

onMounted(() => {

});
</script>

<template>
  <div class="page-container">
    <h1>Бронирование и оплата</h1>

    <BookingsSearchSection @openBookingsCreateDialog = "createDialogVisible = true"/>
    <BookingsTable />

    <BookingCreateDialog v-model:visible="createDialogVisible" />
  </div>
</template>

<style scoped>
.page-container {
  padding: 20px;
}
</style>
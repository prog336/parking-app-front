<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ParkingSpotsTab from "../components/ParkingSpotsTab.vue";
import OwnersTab from "../components/OwnersTab.vue";
import VehiclesTab from "../components/VehiclesTab.vue";

const activeTab = ref('spots');

onMounted(() => {

});
</script>

<template>
  <div class="page-container">
    <h1>Управление автостоянкой</h1>

    <el-tabs v-model="activeTab" type="border-card">
      <ParkingSpotsTab />
      <OwnersTab />
      <VehiclesTab />
    </el-tabs>
  </div>
</template>

<style scoped>
.page-container {
  padding: 20px;
}
</style>
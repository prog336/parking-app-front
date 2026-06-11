<script setup lang="ts">
import type {ParkingSpot} from "../types";
import {onMounted, ref} from "vue";
import {useParkingStore} from "../storages/parking.ts";

const parkingStore = useParkingStore();
const spotDialogVisible = ref(false);
const editingSpot = ref<ParkingSpot | null>(null);
const spotForm = ref({ spotNumber: '' });

function openSpotDialog(spot?: ParkingSpot) {
  editingSpot.value = spot || null;
  spotForm.value = spot
      ? { spotNumber: spot.spotNumber }
      : { spotNumber: '' };
  spotDialogVisible.value = true;
}

async function handleSaveSpot() {
  const dto = { spotNumber: spotForm.value.spotNumber };
  if (editingSpot.value) {
    await parkingStore.updateSpot(editingSpot.value.id, dto);
  } else {
    await parkingStore.addSpot(dto);
  }

  spotDialogVisible.value = false;
}

async function handleDeleteSpot(id: string) {
  await parkingStore.deleteSpot(id);
}

onMounted(() => {
  parkingStore.fetchSpots();
});
</script>

<template>
  <el-tab-pane label="Парковочные места" name="spots">
    <el-button type="primary" @click="openSpotDialog()" style="margin-bottom: 16px">
      Добавить место
    </el-button>
    <el-table :data="parkingStore.spots" v-loading="parkingStore.loading" border>
      <el-table-column prop="spotNumber" label="Номер места" />
      <el-table-column prop="occupied" label="Занято" width="100">
        <template #default="{ row }">
          <el-tag :type="row.occupied ? 'danger' : 'success'">
            {{ row.occupied ? 'Да' : 'Нет' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Действия" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="openSpotDialog(row)">Изменить</el-button>
          <el-button size="small" type="danger" @click="handleDeleteSpot(row.id)">
            Удалить
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
        v-model="spotDialogVisible"
        :title="editingSpot ? 'Редактировать место' : 'Добавить место'"
        width="400px"
    >
      <el-form :model="spotForm" label-width="120px">
        <el-form-item label="Номер места">
          <el-input v-model="spotForm.spotNumber" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="spotDialogVisible = false">Отмена</el-button>
        <el-button type="primary" @click="handleSaveSpot">
          {{ editingSpot ? 'Сохранить' : 'Добавить' }}
        </el-button>
      </template>
    </el-dialog>
  </el-tab-pane>
</template>

<style scoped>

</style>
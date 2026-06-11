<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {Vehicle} from "../types";
import {useVehiclesStore} from "../storages/vehicles.ts";
import {useOwnersStore} from "../storages/owners.ts";

const vehiclesStore = useVehiclesStore();
const ownersStore = useOwnersStore();

const vehicleSearch = ref('');
const vehicleDialogVisible = ref(false);
const editingVehicle = ref<Vehicle | null>(null);
const vehicleForm = ref({
  licensePlate: '',
  brand: '',
  model: '',
  ownerId: null as string | null,
});
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

function handleSearchVehicles() {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    if (vehicleSearch.value.trim()) {
      vehiclesStore.searchVehicle(vehicleSearch.value);
    } else {
      vehiclesStore.fetchVehicles();
    }
  }, 300);
}

function openVehicleDialog(vehicle?: Vehicle) {
  editingVehicle.value = vehicle || null;
  vehicleForm.value = vehicle
      ? {
        licensePlate: vehicle.licensePlate,
        brand: vehicle.brand,
        model: vehicle.model,
        ownerId: vehicle.owner.id,
      }
      : { licensePlate: '', brand: '', model: '', ownerId: null };
  vehicleDialogVisible.value = true;
}

async function handleSaveVehicle() {
  if (!vehicleForm.value.ownerId) return;
  const dto = {
    licensePlate: vehicleForm.value.licensePlate,
    brand: vehicleForm.value.brand,
    model: vehicleForm.value.model,
    ownerId: vehicleForm.value.ownerId,
  };
  if (editingVehicle.value) {
    await vehiclesStore.updateVehicle(editingVehicle.value.id, dto);
  } else {
    await vehiclesStore.addVehicle(dto);
  }
  vehicleDialogVisible.value = false;
}

async function handleDeleteVehicle(id: string) {
  await vehiclesStore.deleteVehicle(id);
}

onMounted(() => {
  vehiclesStore.fetchVehicles();
});
</script>

<template>
  <el-tab-pane label="Автомобили" name="vehicles">
    <div class="search-bar">
      <el-input
          v-model="vehicleSearch"
          placeholder="Поиск по госномеру"
          clearable
          @input="handleSearchVehicles"
          style="width: 300px; margin-right: 16px"
      />
      <el-button type="primary" @click="openVehicleDialog()">Добавить автомобиль</el-button>
    </div>
    <el-table :data="vehiclesStore.vehicles" v-loading="vehiclesStore.loading" border style="margin-top: 16px">
      <el-table-column prop="licensePlate" label="Госномер" />
      <el-table-column prop="brand" label="Марка" />
      <el-table-column prop="model" label="Модель" />
      <el-table-column label="Владелец">
        <template #default="{ row }">
          {{ row.owner?.fullName || '—' }}
        </template>
      </el-table-column>
      <el-table-column label="Действия" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="openVehicleDialog(row)">Изменить</el-button>
          <el-button size="small" type="danger" @click="handleDeleteVehicle(row.id)">
            Удалить
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
        v-model="vehicleDialogVisible"
        :title="editingVehicle ? 'Редактировать автомобиль' : 'Добавить автомобиль'"
        width="450px"
    >
      <el-form :model="vehicleForm" label-width="100px">
        <el-form-item label="Госномер">
          <el-input v-model="vehicleForm.licensePlate" />
        </el-form-item>
        <el-form-item label="Марка">
          <el-input v-model="vehicleForm.brand" />
        </el-form-item>
        <el-form-item label="Модель">
          <el-input v-model="vehicleForm.model" />
        </el-form-item>
        <el-form-item label="Владелец">
          <el-select v-model="vehicleForm.ownerId" placeholder="Выберите владельца" style="width: 100%">
            <el-option
                v-for="owner in ownersStore.owners"
                :key="owner.id"
                :label="owner.fullName"
                :value="owner.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="vehicleDialogVisible = false">Отмена</el-button>
        <el-button type="primary" @click="handleSaveVehicle">
          {{ editingVehicle ? 'Сохранить' : 'Добавить' }}
        </el-button>
      </template>
    </el-dialog>
  </el-tab-pane>
</template>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
}
</style>
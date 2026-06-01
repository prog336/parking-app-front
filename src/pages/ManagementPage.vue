<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useParkingStore } from '../storages/parking';
import { useOwnersStore } from '../storages/owners';
import { useVehiclesStore } from '../storages/vehicles';
import type { ParkingSpot, Owner, Vehicle } from '../types';

const parkingStore = useParkingStore();
const ownersStore = useOwnersStore();
const vehiclesStore = useVehiclesStore();

const activeTab = ref('spots');

const ownerSearch = ref('');
const vehicleSearch = ref('');

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

function handleSearchOwners() {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    if (ownerSearch.value.trim()) {
      ownersStore.searchOwners(ownerSearch.value);
    } else {
      ownersStore.fetchOwners();
    }
  }, 300);
}

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

const ownerDialogVisible = ref(false);
const editingOwner = ref<Owner | null>(null);
const ownerForm = ref({ fullName: '', phoneNumber: '' });

function openOwnerDialog(owner?: Owner) {
  editingOwner.value = owner || null;
  ownerForm.value = owner
      ? { fullName: owner.fullName, phoneNumber: owner.phoneNumber }
      : { fullName: '', phoneNumber: '' };
  ownerDialogVisible.value = true;
}

async function handleSaveOwner() {
  const dto = {
    fullName: ownerForm.value.fullName,
    phoneNumber: ownerForm.value.phoneNumber,
  };
  if (editingOwner.value) {
    await ownersStore.updateOwner(editingOwner.value.id, dto);
  } else {
    await ownersStore.addOwner(dto);
  }
  ownerDialogVisible.value = false;
}

async function handleDeleteOwner(id: string) {
  await ownersStore.deleteOwner(id);
}

const vehicleDialogVisible = ref(false);
const editingVehicle = ref<Vehicle | null>(null);
const vehicleForm = ref({
  licensePlate: '',
  brand: '',
  model: '',
  ownerId: null as string | null,
});

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
  parkingStore.fetchSpots();
  ownersStore.fetchOwners();
  vehiclesStore.fetchVehicles();
});
</script>

<template>
  <div class="page-container">
    <h1>Управление автостоянкой</h1>

    <el-tabs v-model="activeTab" type="border-card">
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

      <el-tab-pane label="Владельцы" name="owners">
        <div class="search-bar">
          <el-input
              v-model="ownerSearch"
              placeholder="Поиск по ФИО"
              clearable
              @input="handleSearchOwners"
              style="width: 300px; margin-right: 16px"
          />
          <el-button type="primary" @click="openOwnerDialog()">Добавить владельца</el-button>
        </div>
        <el-table :data="ownersStore.owners" v-loading="ownersStore.loading" border style="margin-top: 16px">
          <el-table-column prop="fullName" label="ФИО" />
          <el-table-column prop="phoneNumber" label="Телефон" />
          <el-table-column label="Действия" width="200">
            <template #default="{ row }">
              <el-button size="small" @click="openOwnerDialog(row)">Изменить</el-button>
              <el-button size="small" type="danger" @click="handleDeleteOwner(row.id)">
                Удалить
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-dialog
            v-model="ownerDialogVisible"
            :title="editingOwner ? 'Редактировать владельца' : 'Добавить владельца'"
            width="400px"
        >
          <el-form :model="ownerForm" label-width="100px">
            <el-form-item label="ФИО">
              <el-input v-model="ownerForm.fullName" />
            </el-form-item>
            <el-form-item label="Телефон">
              <el-input v-model="ownerForm.phoneNumber" />
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button @click="ownerDialogVisible = false">Отмена</el-button>
            <el-button type="primary" @click="handleSaveOwner">
              {{ editingOwner ? 'Сохранить' : 'Добавить' }}
            </el-button>
          </template>
        </el-dialog>
      </el-tab-pane>

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
    </el-tabs>
  </div>
</template>

<style scoped>
.page-container {
  padding: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
}
</style>
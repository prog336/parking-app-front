<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {Owner} from "../types";
import {useOwnersStore} from "../storages/owners.ts";
import {useVehiclesStore} from "../storages/vehicles.ts";

const ownersStore = useOwnersStore();
const vehiclesStore = useVehiclesStore();

const ownerSearch = ref('');
const ownerDialogVisible = ref(false);
const editingOwner = ref<Owner | null>(null);
const ownerForm = ref({ fullName: '', phoneNumber: '' });
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
    await vehiclesStore.fetchVehicles();
  } else {
    await ownersStore.addOwner(dto);
  }
  ownerDialogVisible.value = false;
}

async function handleDeleteOwner(id: string) {
  await ownersStore.deleteOwner(id);
  await vehiclesStore.fetchVehicles();
}

onMounted(() => {
  ownersStore.fetchOwners();
});
</script>

<template>
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
</template>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
}
</style>
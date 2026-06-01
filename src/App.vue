<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const currentRoute = computed(() => route.path);
</script>

<template>
  <div id="app">
    <el-container>
      <el-header class="app-header">
        <el-menu
            mode="horizontal"
            :default-active="currentRoute"
            router
            class="header-menu"
        >
          <el-menu-item index="/">Управление</el-menu-item>
          <el-menu-item index="/booking">Бронирование и оплата</el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
  'Microsoft YaHei', Arial, sans-serif;
}

.app-header {
  padding: 0;
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
}

.header-menu {
  border-bottom: none !important;
}
</style>
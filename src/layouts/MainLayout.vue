<template>
  <q-layout view="lHh Lpr lFf" class="bg-teal-1">
    <q-header elevated class="bg-teal-7 text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="lt-md"
        />
        <q-toolbar-title class="row items-center">
          <q-icon name="spa" size="sm" class="q-mr-sm" />
          <span class="text-weight-bold">SafeSpace</span>
        </q-toolbar-title>
        <div class="gt-sm q-gutter-sm">
          <q-btn flat label="บันทึกความรู้สึก" to="/" exact />
          <q-btn flat label="ฝึกหายใจ" to="/breathing" />
          <q-btn flat label="ปรึกษา / สายด่วน" to="/counselor" />
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" bordered class="bg-white">
      <q-list padding>
        <q-item-label header class="text-teal-8 text-weight-bold"
          >เมนูหลัก</q-item-label
        >
        <q-item
          clickable
          v-ripple
          to="/"
          exact
          active-class="text-teal-8 bg-teal-1"
        >
          <q-item-section avatar><q-icon name="edit_note" /></q-item-section>
          <q-item-section>บันทึกความรู้สึก</q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
          to="/breathing"
          active-class="text-teal-8 bg-teal-1"
        >
          <q-item-section avatar
            ><q-icon name="self_improvement"
          /></q-item-section>
          <q-item-section>ฝึกหายใจคลายเครียด</q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
          to="/counselor"
          active-class="text-teal-8 bg-teal-1"
        >
          <q-item-section avatar
            ><q-icon name="support_agent"
          /></q-item-section>
          <q-item-section>ปรึกษา / สายด่วน</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

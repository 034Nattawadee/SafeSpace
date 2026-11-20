<template>
  <q-page class="q-pa-md" style="max-width: 750px; margin: 0 auto">
    <div class="row items-center justify-between q-mb-lg q-mt-sm">
      <div>
        <h5 class="q-my-none text-teal-9 text-weight-bold">พื้นที่ปลอดภัยของคุณ</h5>
        <p class="text-grey-7 q-mb-none">จดบันทึกและทบทวนความรู้สึกในแต่ละวัน</p>
      </div>
      <q-btn
        color="teal-7"
        icon="add"
        label="เขียนบันทึก"
        unelevated
        @click="openCreateDialog"
      />
    </div>
    <q-banner
      v-if="moodStore.error"
      rounded
      class="bg-red-1 text-red-9 q-mb-md"
    >
      <template v-slot:avatar>
        <q-icon name="error_outline" color="red" />
      </template>
      {{ moodStore.error }}
      <template v-slot:action>
        <q-btn
          flat
          color="red"
          label="ลองใหม่"
          @click="moodStore.fetchMoods()"
        />
      </template>
    </q-banner>
    <div
      v-if="moodStore.loading && moodStore.moodList.length === 0"
      class="text-center q-pa-xl"
    >
      <q-spinner-dots color="teal-7" size="40px" />
      <div class="text-grey-7 q-mt-sm">กำลังโหลดบันทึกของคุณ...</div>
    </div>
    <q-card
      v-else-if="moodStore.moodList.length === 0"
      flat
      bordered
      class="text-center q-pa-xl bg-white"
    >
      <q-icon name="auto_stories" size="48px" color="teal-4" />
      <div class="text-subtitle1 text-grey-8 q-mt-sm">ยังไม่มีบันทึกความรู้สึก</div>
      <div class="text-caption text-grey-6 q-mb-md"
        >เริ่มต้นเขียนเรื่องราววันนี้ของคุณได้เลย</div
      >
      <q-btn
        outline
        color="teal-7"
        label="สร้างบันทึกแรก"
        @click="openCreateDialog"
      />
    </q-card>
    <div v-else>
      <MoodCard
        v-for="item in moodStore.moodList"
        :key="item.id"
        :item="item"
        @edit="openEditDialog"
        @delete="confirmDelete"
      />
    </div>
    <MoodFormDialog
      v-model="dialogOpen"
      :edit-data="selectedMood"
      :loading="moodStore.loading"
      @save="handleSaveMood"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useMoodStore } from '@/stores/moodStore'
import MoodCard from '../components/MoodCard.vue'
import MoodFormDialog from '../components/MoodFormDialog.vue'

const $q = useQuasar()
const moodStore = useMoodStore()
const dialogOpen = ref(false)
const selectedMood = ref(null)
onMounted(() => {
  moodStore.fetchMoods()
})
const openCreateDialog = () => {
  selectedMoodItem.value = {
    mood: '',
    note: '',
    title: ''
  }
  dialogOpen.value = true
}
const openEditDialog = item => {
  selectedMood.value = item
  dialogOpen.value = true
}
const handleSaveMood = async formData => {
  let success = false
  if (selectedMood.value) {
    success = await moodStore.updateMood(selectedMood.value.id, formData)
  } else {
    success = await moodStore.addMood(formData)
  }
  if (success) {
    dialogOpen.value = false
    $q.notify({
      type: 'positive',
      message: selectedMood.value
        ? 'อัปเดตบันทึกเรียบร้อยแล้ว'
        : 'บันทึกความรู้สึกเรียบร้อยแล้ว'
    })
  } else {
    $q.notify({
      type: 'negative',
      message: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
    })
  }
}
const confirmDelete = id => {
  $q.dialog({
    title: 'ยืนยันการลบ',
    message: 'คุณต้องการลบบันทึกนี้ใช่หรือไม่?',
    cancel: { label: 'ยกเลิก', flat: true, color: 'grey-7' },
    ok: { label: 'ลบบันทึก', color: 'negative', unelevated: true },
    persistent: true
  }).onOk(async () => {
    const success = await moodStore.deleteMood(id)
    if (success) {
      $q.notify({ type: 'info', message: 'ลบบันทึกแล้ว' })
    }
  })
}
</script>

<template>
  <q-page class="home-page q-pa-md">
    <div class="home-container">
      <!-- Welcome -->
      <div class="welcome-section q-mb-lg">
        <div class="text-overline text-teal-7"> WELCOME TO SAFESPACE </div>

        <h4 class="text-teal-10 text-weight-bold q-my-sm">
          ยินดีต้อนรับสู่Safezoneของคุณ 🌿
        </h4>
        <div class="text-grey-7"> ทุกความรู้สึกของคุณมีความหมาย </div>
        <div v-if="authStore.user" class="text-caption text-teal-8 q-mt-sm">
          <q-icon name="account_circle" class="q-mr-xs" />
          {{ authStore.user.email }}
        </div>
        <div class="text-caption text-grey-6 q-mt-sm">
          <q-icon name="calendar_today" class="q-mr-xs" />
          {{ today }}
        </div>
      </div>
      <q-card flat bordered class="summary-card q-mb-lg">
        <q-card-section class="row items-center no-wrap">
          <div class="summary-icon q-mr-md">
            <q-icon name="auto_stories" size="30px" color="teal-8" />
          </div>
          <div>
            <div class="text-caption text-grey-7"> บันทึกความรู้สึกทั้งหมด </div>

            <div class="text-h4 text-teal-9 text-weight-bold">
              {{ moodStore.moodList.length }}
              <span class="text-subtitle2 text-grey-7">รายการ</span>
            </div>
          </div>
          <q-space />
          <q-icon name="favorite" size="28px" color="pink-3" />
        </q-card-section>
      </q-card>
      <div class="row items-center justify-between q-mb-md">
        <div class="text-h6 text-teal-10 text-weight-bold"> บันทึกของฉัน </div>
        <q-btn
          color="teal-7"
          icon="add"
          label="เขียนบันทึก"
          unelevated
          rounded
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
        <div class="text-grey-7 q-mt-sm"> กำลังโหลดบันทึกของคุณ... </div>
      </div>
      <q-card
        v-else-if="moodStore.moodList.length === 0"
        flat
        bordered
        class="empty-card text-center q-pa-xl"
      >
        <q-icon name="auto_stories" size="56px" color="teal-4" />
        <div class="text-h6 text-teal-9 q-mt-md"> ยังไม่มีบันทึกความรู้สึก </div>
        <div class="text-body2 text-grey-6 q-mb-lg">
          เริ่มต้นเขียนเรื่องราวของคุณในวันนี้ได้เลย
        </div>
        <q-btn
          outline
          rounded
          color="teal-7"
          label="สร้างบันทึกแรก"
          icon="edit"
          @click="openCreateDialog"
        />
      </q-card>
      <div v-else>
        <MoodCard
          v-for="item in moodStore.moodList"
          :key="item.id"
          :mood="item"
          @edit="openEditDialog"
          @delete="confirmDelete"
        />
      </div>
      <MoodFormDialog
        v-model="dialogOpen"
        :initial-data="selectedMood"
        @save="handleSaveMood"
      />
    </div>
  </q-page>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useMoodStore } from '@/stores/moodStore'
import { useAuthStore } from '@/stores/authStore'
import MoodCard from '../components/MoodCard.vue'
import MoodFormDialog from '../components/MoodFormDialog.vue'

const $q = useQuasar()

const moodStore = useMoodStore()
const authStore = useAuthStore()

const dialogOpen = ref(false)
const selectedMood = ref(null)

const today = computed(() => {
  return new Date().toLocaleDateString('th-TH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

onMounted(async () => {
  await authStore.initializeAuth()
  await moodStore.fetchMoods()
})

const openCreateDialog = () => {
  selectedMood.value = null
  dialogOpen.value = true
}

const openEditDialog = item => {
  selectedMood.value = item ?? null
  dialogOpen.value = true
}

const handleSaveMood = async formData => {
  const isEditing = Boolean(selectedMood.value?.id)
  let success = false

  if (isEditing) {
    success = await moodStore.updateMood(selectedMood.value.id, formData)
  } else {
    success = await moodStore.addMood(formData)
  }

  if (success) {
    dialogOpen.value = false
    selectedMood.value = null

    $q.notify({
      type: 'positive',
      message: isEditing ? 'อัปเดตบันทึกเรียบร้อยแล้ว' : 'บันทึกความรู้สึกเรียบร้อยแล้ว'
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
    cancel: {
      label: 'ยกเลิก',
      flat: true,
      color: 'grey-7'
    },
    ok: {
      label: 'ลบบันทึก',
      color: 'negative',
      unelevated: true
    },
    persistent: true
  }).onOk(async () => {
    const success = await moodStore.deleteMood(id)

    if (success) {
      $q.notify({
        type: 'info',
        message: 'ลบบันทึกแล้ว'
      })
    }
  })
}
</script>

<style scoped>
.home-page {
  background: #f3faf8;
  min-height: 100%;
}

.home-container {
  max-width: 750px;
  margin: 0 auto;
}

.welcome-section {
  padding: 20px 8px;
}

.summary-card {
  border-radius: 18px;
  background: white;
  border-color: #d9eee8;
}

.summary-icon {
  width: 58px;
  height: 58px;
  border-radius: 16px;
  background: #e2f5ef;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-card {
  border-radius: 18px;
  background: white;
  border-color: #d9eee8;
}

@media (max-width: 480px) {
  .welcome-section h4 {
    font-size: 24px;
  }
}
</style>

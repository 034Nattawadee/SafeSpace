<template>
  <q-page class="flex flex-center q-pa-md">
    <q-card
      flat
      bordered
      class="text-center q-pa-lg bg-white"
      style="max-width: 450px; width: 100%"
    >
      <h6 class="q-my-none text-teal-9 text-weight-bold"
        >ฝึกหายใจ 4-4-4 (Box Breathing)</h6
      >
      <p class="text-grey-7 q-mt-xs">ช่วยให้จิตใจสงบและลดความวิตกกังวล</p>
      <div class="q-my-xl flex flex-center">
        <div
          class="breathing-circle flex flex-center text-white text-h6 text-weight-bold"
          :class="stepClass"
        >
          {{ statusText }}
        </div>
      </div>
      <q-btn
        :color="isRunning ? 'grey-7' : 'teal-7'"
        :label="isRunning ? 'หยุดพัก' : 'เริ่มฝึกหายใจ'"
        unelevated
        class="full-width"
        @click="toggleBreathing"
      />
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
const isRunning = ref(false)
const statusText = ref('พร้อมไหม?')
const stepClass = ref('')
let timer = null
const steps = [
  { text: 'หายใจเข้า (4 วิ)', cls: 'inhale' },
  { text: 'กลั้นหายใจ (4 วิ)', cls: 'hold' },
  { text: 'หายใจออก (4 วิ)', cls: 'exhale' }
]
const toggleBreathing = () => {
  if (isRunning.value) {
    clearInterval(timer)
    isRunning.value = false
    statusText.value = 'พร้อมไหม?'
    stepClass.value = ''
    return
  }
  isRunning.value = true
  let index = 0
  statusText.value = steps[0].text
  stepClass.value = steps[0].cls
  timer = setInterval(() => {
    index = (index + 1) % steps.length
    statusText.value = steps[index].text
    stepClass.value = steps[index].cls
  }, 4000)
}
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
<style scoped>
.breathing-circle {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background-color: #26a69a;
  transition:
    transform 4s ease-in-out,
    background-color 1s ease;
}
.inhale {
  transform: scale(1.35);
  background-color: #00897b;
}
.hold {
  transform: scale(1.35);
  background-color: #00695c;
}
.exhale {
  transform: scale(1);
  background-color: #4db6ac;
}
</style>

<template>
  <q-dialog v-model="model" persistent>
    <q-card style="min-width: 320px; max-width: 480px; width: 100%">
      <q-card-section class="row items-center justify-between">
        <div class="text-h6">
          {{ initialData ? 'แก้ไขบันทึกอารมณ์' : 'บันทึกอารมณ์ใหม่' }}
        </div>
        <q-btn flat round dense icon="close" @click="closeDialog" />
      </q-card-section>
      <q-separator />
      <q-form @submit.prevent="onSubmit">
        <q-card-section class="q-gutter-md">
          <div class="text-subtitle2 text-teal-9"> วันนี้คุณรู้สึกอย่างไร? </div>
          <q-select
            v-model="form.mood"
            :options="moodOptions"
            label="เลือกอารมณ์ของคุณ *"
            outlined
            emit-value
            map-options
            :rules="[val => !!val || 'กรุณาเลือกอารมณ์']"
          >
            <template v-slot:selected-item="scope">
              <div class="row items-center">
                <span class="q-mr-sm">{{ scope.opt.emoji }}</span>
                {{ scope.opt.label }}
              </div>
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <div class="text-h5">{{ scope.opt.emoji }}</div>
                </q-item-section>
                <q-item-section>
                  {{ scope.opt.label }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input
            v-model="form.note"
            label="บันทึกเพิ่มเติม"
            type="textarea"
            rows="3"
            outlined
            maxlength="1000"
            counter
          />
        </q-card-section>
        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn flat label="ยกเลิก" color="grey-7" @click="closeDialog" />
          <q-btn unelevated label="บันทึก" color="teal-7" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  initialData: {
    type: Object,
    default: null
  }
})
const emit = defineEmits(['update:modelValue', 'save'])
const moodOptions = [
  { label: 'สุขใจ', value: 'สุขใจ', emoji: '😄' },
  { label: 'ดีใจ', value: 'ดีใจ', emoji: '🥰' },
  { label: 'ตื่นเต้น', value: 'ตื่นเต้น', emoji: '🥳' },
  { label: 'สงบ', value: 'สงบ', emoji: '😌' },
  { label: 'ผ่อนคลาย', value: 'ผ่อนคลาย', emoji: '🌿' },
  { label: 'เศร้า', value: 'เศร้า', emoji: '😢' },
  { label: 'เหงา', value: 'เหงา', emoji: '😔' },
  { label: 'กังวล', value: 'กังวล', emoji: '😟' },
  { label: 'เครียด', value: 'เครียด', emoji: '😰' },
  { label: 'เหนื่อยล้า', value: 'เหนื่อยล้า', emoji: '🥱' },
  { label: 'โกรธ', value: 'โกรธ', emoji: '😠' },
  { label: 'สับสน', value: 'สับสน', emoji: '😕' }
]
const form = ref({
  mood: '',
  note: ''
})
const model = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})
watch(
  () => [props.initialData, props.modelValue],
  ([val, isOpen]) => {
    if (!isOpen) return

    form.value = {
      mood: val?.mood || '',
      note: val?.note || ''
    }
  },
  { immediate: true }
)
const closeDialog = () => {
  emit('update:modelValue', false)
}
const onSubmit = () => {
  emit('save', { ...form.value })
}
</script>

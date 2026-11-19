<template>
  <q-dialog v-model="model" persistent>
    <q-card style="min-width: 360px; max-width: 480px; width: 100%">
      <q-card-section class="row items-center justify-between">
        <div class="text-h6">{{ initialData ? 'แก้ไขบันทึกอารมณ์' : 'บันทึกอารมณ์ใหม่' }}</div>
        <q-btn flat round dense icon="close" @click="closeDialog" />
      </q-card-section>

      <q-separator />

      <q-form @submit.prevent="onSubmit">
        <q-card-section class="q-gutter-md">
          <q-select
            v-model="form.mood"
            :options="moodOptions"
            label="อารมณ์ปัจจุบัน *"
            outlined
            dense
            :rules="[val => !!val || 'กรุณาเลือกอารมณ์']"
          />

          <q-input
            v-model="form.note"
            label="บันทึกเพิ่มเติม"
            type="textarea"
            rows="3"
            outlined
            dense
          />
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn flat label="ยกเลิก" color="grey-7" @click="closeDialog" />
          <q-btn unelevated label="บันทึก" color="primary" type="submit" />
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

const moodOptions = ['สุขใจ', 'สงบ', 'เหนื่อยล้า', 'กังวล', 'เศร้า']

const form = ref({
  mood: '',
  note: ''
})

const model = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})

watch(
  () => props.initialData,
  val => {
    if (val) {
      form.value = {
        mood: val.mood || '',
        note: val.note || ''
      }
    } else {
      form.value = {
        mood: '',
        note: ''
      }
    }
  },
  { immediate: true }
)

const closeDialog = () => {
  emit('update:modelValue', false)
}

const onSubmit = () => {
  emit('save', { ...form.value })
  closeDialog()
}
</script>
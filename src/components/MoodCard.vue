<template>
  <q-card flat bordered class="q-mb-md">
    <q-card-section class="row items-center justify-between">
      <div>
        <div class="text-subtitle1 text-weight-bold">
          {{ mood.mood || mood.title || 'Mood Entry' }}
        </div>
        <div v-if="mood.note" class="text-body2 q-mt-xs">
          {{ mood.note }}
        </div>
        <div v-if="mood.createdAt" class="text-caption text-grey q-mt-xs">
          {{ mood.createdAt }}
        </div>
      </div>
      <div class="row q-gutter-xs">
        <q-btn flat round dense icon="edit" color="primary" @click="$emit('edit', mood)" />
        <q-btn flat round dense icon="delete" color="negative" @click="$emit('delete', mood.id)" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  mood: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'delete'])
</script>
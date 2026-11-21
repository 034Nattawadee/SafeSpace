<template>
  <q-card flat bordered class="mood-card q-mb-md" :class="moodStyle.card">
    <q-card-section class="row items-start no-wrap">
      <div class="mood-icon q-mr-md" :class="moodStyle.iconBg">
        <q-icon :name="moodStyle.icon" size="28px" :color="moodStyle.color" />
      </div>
      <div class="col">
        <div class="text-subtitle1 text-weight-bold" :class="moodStyle.text">
          {{ mood.mood || mood.title || 'Mood Entry' }}
        </div>
        <div v-if="mood.note" class="text-body2 text-grey-8 q-mt-sm note-text">
          {{ mood.note }}
        </div>
        <div
          v-if="mood.created_at || mood.createdAt"
          class="text-caption text-grey-6 q-mt-md"
        >
          <q-icon name="schedule" class="q-mr-xs" />
          {{ formatDate(mood.created_at || mood.createdAt) }}
        </div>
      </div>
    </q-card-section>
    <q-separator color="grey-3" />
    <q-card-actions align="right" class="q-px-md q-py-sm">
      <q-btn
        flat
        dense
        no-caps
        icon="edit"
        label="แก้ไข"
        color="teal-8"
        @click="$emit('edit', mood)"
      />
      <q-btn
        flat
        dense
        no-caps
        icon="delete_outline"
        label="ลบ"
        color="negative"
        @click="$emit('delete', mood.id)"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  mood: {
    type: Object,
    required: true
  }
})
defineEmits(['edit', 'delete'])
const moodStyles = {
  สุขใจ: [
    'sentiment_very_satisfied',
    'orange-8',
    'bg-orange-1',
    'mood-happy',
    'text-orange-9'
  ],
  ดีใจ: ['favorite', 'pink-7', 'bg-pink-1', 'mood-happy', 'text-pink-9'],
  ตื่นเต้น: ['celebration', 'amber-8', 'bg-amber-1', 'mood-happy', 'text-amber-9'],
  สงบ: ['self_improvement', 'teal-8', 'bg-teal-1', 'mood-calm', 'text-teal-9'],
  ผ่อนคลาย: ['spa', 'green-8', 'bg-green-1', 'mood-calm', 'text-green-9'],
  เศร้า: [
    'sentiment_dissatisfied',
    'blue-7',
    'bg-blue-1',
    'mood-sad',
    'text-blue-9'
  ],
  เหงา: [
    'sentiment_neutral',
    'indigo-7',
    'bg-indigo-1',
    'mood-sad',
    'text-indigo-9'
  ],
  กังวล: [
    'psychology',
    'purple-7',
    'bg-purple-1',
    'mood-stress',
    'text-purple-9'
  ],
  เครียด: [
    'mood_bad',
    'deep-purple-7',
    'bg-deep-purple-1',
    'mood-stress',
    'text-deep-purple-9'
  ],
  เหนื่อยล้า: [
    'bedtime',
    'blue-grey-7',
    'bg-blue-grey-1',
    'mood-tired',
    'text-blue-grey-9'
  ],
  โกรธ: [
    'sentiment_very_dissatisfied',
    'red-7',
    'bg-red-1',
    'mood-angry',
    'text-red-9'
  ],
  สับสน: [
    'help_outline',
    'brown-7',
    'bg-brown-1',
    'mood-default',
    'text-brown-9'
  ]
}
const moodStyle = computed(() => {
  const style = moodStyles[props.mood.mood]
  if (!style) {
    return {
      icon: 'favorite',
      color: 'teal-7',
      iconBg: 'bg-teal-1',
      card: 'mood-default',
      text: 'text-teal-9'
    }
  }
  return {
    icon: style[0],
    color: style[1],
    iconBg: style[2],
    card: style[3],
    text: style[4]
  }
})
const formatDate = value => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}
</script>
<style scoped>
.mood-card {
  border-radius: 16px;
  background: white;
  border-color: #e0eeea;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.mood-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 18px rgba(35, 110, 95, 0.1);
}
.mood-icon {
  width: 52px;
  height: 52px;
  min-width: 52px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.note-text {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  line-height: 1.7;
}
.mood-happy {
  border-left: 4px solid #ffcc80;
}
.mood-calm {
  border-left: 4px solid #80cbc4;
}
.mood-sad {
  border-left: 4px solid #90caf9;
}
.mood-stress {
  border-left: 4px solid #ce93d8;
}
.mood-tired {
  border-left: 4px solid #b0bec5;
}
.mood-angry {
  border-left: 4px solid #ef9a9a;
}
.mood-default {
  border-left: 4px solid #80cbc4;
}
</style>

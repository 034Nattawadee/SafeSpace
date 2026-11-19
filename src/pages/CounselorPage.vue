<template>
  <q-page class="q-pa-md" style="max-width: 750px; margin: 0 auto">
    <h5 class="q-mt-sm q-mb-xs text-teal-9 text-weight-bold"
      >ช่องทางขอคำปรึกษา</h5
    >
    <p class="text-grey-7 q-mb-md"
      >คุณไม่ได้อยู่ตัวคนเดียว หากไม่ไหวสามารถติดต่อช่องทางเหล่านี้ได้ตลอดเวลา</p
    >
    <q-card flat bordered class="bg-red-1 q-mb-lg">
      <q-card-section class="row items-center justify-between">
        <div>
          <div class="text-subtitle1 text-weight-bold text-red-9"
            >สายด่วนสุขภาพจิต (ฟรี 24 ชม.)</div
          >
          <div class="text-body2 text-red-8">กรมสุขภาพจิต กระทรวงสาธารณสุข</div>
        </div>
        <q-btn
          color="red-8"
          icon="call"
          label="โทร 1323"
          href="tel:1323"
          unelevated
        />
      </q-card-section>
    </q-card>
    <div class="row q-col-gutter-md">
      <div
        class="col-12 col-sm-6"
        v-for="person in counselors"
        :key="person.name"
      >
        <q-card flat bordered class="bg-white full-height">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold text-teal-9">{{
              person.name
            }}</div>
            <div class="text-caption text-teal-7 q-mb-sm">{{
              person.role
            }}</div>
            <p class="text-body2 text-grey-8">{{ person.desc }}</p>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              flat
              color="teal-7"
              label="นัดหมายพูดคุย"
              @click="bookSession(person.name)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()
const counselors = [
  {
    name: 'คุณพลอยไพลิน (นักจิตวิทยาอาสา)',
    role: 'เชี่ยวชาญด้านความเครียดจากการเรียนและการทำงาน',
    desc: 'พร้อมรับฟังทุกเรื่องราวอย่างเข้าใจ ไม่ตัดสิน ให้พื้นที่คุณได้เป็นตัวเอง'
  },
  {
    name: 'คุณธนากร (ผู้ให้คำปรึกษา)',
    role: 'เชี่ยวชาญด้านความสัมพันธ์และครอบครัว',
    desc: 'ช่วยจัดระเบียบความคิดและหาทางออกร่วมกันในวันที่รู้สึกสับสน'
  }
]
const bookSession = name => {
  $q.dialog({
    title: 'ส่งคำขอนัดหมาย',
    message: `ต้องการส่งคำขอพูดคุยกับ ${name} ใช่หรือไม่?`,
    cancel: 'ยกเลิก',
    ok: { label: 'ยืนยัน', color: 'teal-7' }
  }).onOk(() => {
    $q.notify({
      type: 'positive',
      message: 'ส่งคำขอนัดหมายเรียบร้อยแล้ว เจ้าหน้าที่จะติดต่อกลับทางอีเมล'
    })
  })
}
</script>

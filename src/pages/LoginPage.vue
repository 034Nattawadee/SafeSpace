<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-2">
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2 q-pa-md">
        <q-card class="login-card q-pa-lg" flat bordered>
          <div class="text-center q-mb-lg">
            <div class="text-h4 text-teal-9 text-weight-bold"> SafeSpace </div>
            <div class="text-grey-7 q-mt-sm"> พื้นที่ปลอดภัยสำหรับความรู้สึกของคุณ </div>
          </div>

          <div class="text-h6 text-center text-teal-9 q-mb-md">
            {{ isRegister ? 'สร้างบัญชี' : 'เข้าสู่ระบบ' }}
          </div>

          <q-form @submit.prevent="submitForm" class="q-gutter-md">
            <q-input
              v-model="email"
              label="Email"
              type="email"
              outlined
              color="teal-7"
              autocomplete="email"
              required
            />

            <q-input
              v-model="password"
              label="Password"
              type="password"
              outlined
              color="teal-7"
              autocomplete="current-password"
              required
            />

            <q-btn
              type="submit"
              color="teal-7"
              class="full-width"
              unelevated
              :label="isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'"
              :loading="loading"
            />

            <q-btn
              v-if="isRegister"
              flat
              color="teal-7"
              class="full-width"
              label="ส่งลิงก์ยืนยัน Email อีกครั้ง"
              :loading="loading"
              @click="resendConfirmation"
            />

            <q-btn
              flat
              color="teal-7"
              class="full-width"
              :label="
                isRegister ? 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบ' : 'ยังไม่มีบัญชี? สมัครสมาชิก'
              "
              @click="toggleMode"
            />
          </q-form>

          <q-banner
            v-if="message"
            class="q-mt-md"
            rounded
            :class="
              messageType === 'error'
                ? 'bg-red-1 text-negative'
                : 'bg-teal-1 text-teal-9'
            "
          >
            {{ message }}
          </q-banner>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import supabase from '../boot/supabase'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const isRegister = ref(false)
const message = ref('')
const messageType = ref('success')

function toggleMode() {
  isRegister.value = !isRegister.value
  message.value = ''
}

async function submitForm() {
  message.value = ''

  if (!email.value.trim() || !password.value) {
    messageType.value = 'error'
    message.value = 'กรุณากรอก Email และ Password'
    return
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(email.value.trim())) {
    messageType.value = 'error'
    message.value = 'รูปแบบ Email ไม่ถูกต้อง'
    return
  }

  loading.value = true

  try {
    if (isRegister.value) {
      const { data, error } = await supabase.auth.signUp({
        email: email.value.trim(),
        password: password.value
      })

      if (error) throw error

      messageType.value = 'success'
      message.value = data.session
        ? 'สมัครสมาชิกสำเร็จ'
        : 'สมัครสมาชิกสำเร็จ กรุณาตรวจสอบ Email เพื่อยืนยันบัญชี'
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.value.trim(),
        password: password.value
      })

      if (error) throw error

      messageType.value = 'success'
      message.value = 'เข้าสู่ระบบสำเร็จ'
      await router.push('/home')
    }
  } catch (err) {
    messageType.value = 'error'

    if (err.message === 'Invalid login credentials') {
      message.value = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
    } else if (err.message === 'Email not confirmed') {
      message.value = 'กรุณายืนยัน Email ก่อนเข้าสู่ระบบ'
    } else {
      message.value = 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
    }

    console.error('Login/Register error:', err)
  } finally {
    loading.value = false
  }
}

async function resendConfirmation() {
  if (!email.value) {
    messageType.value = 'error'
    message.value = 'กรุณากรอก Email ก่อน'
    return
  }

  loading.value = true
  message.value = ''

  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.value
    })

    if (error) throw error

    messageType.value = 'success'
    message.value = 'ส่งลิงก์ยืนยันใหม่แล้ว กรุณาตรวจสอบ Email'
  } catch (err) {
    messageType.value = 'error'
    message.value = err.message || 'ส่งอีเมลไม่สำเร็จ'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 420px;
  border-radius: 16px;
  background: white;
}
</style>

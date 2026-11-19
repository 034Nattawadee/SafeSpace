import { defineStore } from 'pinia'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
})

export const useMoodStore = defineStore('mood', {
  state: () => ({
    moodList: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchMoods() {
      this.loading = true
      this.error = null
      try {
        const res = await api.get('/moods')
        const rawList = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : []

        this.moodList = [...rawList].sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        )
      } catch (err) {
        this.error = 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง'
        console.error('fetchMoods error:', err)
      } finally {
        this.loading = false
      }
    },

    async addMood(payload) {
      this.loading = true
      this.error = null
      try {
        const newData = {
          ...payload,
          createdAt: new Date().toISOString()
        }
        const res = await api.post('/moods', newData)
        this.moodList.unshift(res.data)
        return true
      } catch (err) {
        this.error = 'บันทึกข้อมูลไม่สำเร็จ'
        console.error('addMood error:', err)
        return false
      } finally {
        this.loading = false
      }
    },

    async updateMood(id, payload) {
      this.loading = true
      this.error = null
      try {
        const res = await api.put(`/moods/${id}`, payload)
        const index = this.moodList.findIndex(item => item.id === id)
        if (index !== -1) {
          this.moodList[index] = res.data
        }
        return true
      } catch (err) {
        this.error = 'แก้ไขข้อมูลไม่สำเร็จ'
        console.error('updateMood error:', err)
        return false
      } finally {
        this.loading = false
      }
    },

    async deleteMood(id) {
      this.loading = true
      this.error = null
      try {
        await api.delete(`/moods/${id}`)
        this.moodList = this.moodList.filter(item => item.id !== id)
        return true
      } catch (err) {
        this.error = 'ลบข้อมูลไม่สำเร็จ'
        console.error('deleteMood error:', err)
        return false
      } finally {
        this.loading = false
      }
    }
  }
})
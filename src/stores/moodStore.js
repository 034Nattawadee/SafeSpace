import { defineStore } from 'pinia'
import supabase from '../boot/supabase'

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
        const { data: userData, error: userError } =
          await supabase.auth.getUser()

        if (userError) throw userError
        if (!userData.user) throw new Error('กรุณาเข้าสู่ระบบ')

        const { data, error } = await supabase
          .from('moods')
          .select('*')
          .eq('user_id', userData.user.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        this.moodList = data || []
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
        const { data: userData, error: userError } =
          await supabase.auth.getUser()

        if (userError) throw userError
        if (!userData.user) throw new Error('กรุณาเข้าสู่ระบบ')

        const newData = {
          mood: payload.mood,
          note: payload.note || '',
          user_id: userData.user.id
        }

        const { data, error } = await supabase
          .from('moods')
          .insert(newData)
          .select()
          .single()

        if (error) throw error

        this.moodList.unshift(data)
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
        const updateData = {
          mood: payload.mood,
          note: payload.note || ''
        }

        const { data, error } = await supabase
          .from('moods')
          .update(updateData)
          .eq('id', id)
          .select()
          .single()

        if (error) throw error

        const index = this.moodList.findIndex(item => item.id === id)

        if (index !== -1) {
          this.moodList[index] = data
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
        const { error } = await supabase.from('moods').delete().eq('id', id)

        if (error) throw error

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

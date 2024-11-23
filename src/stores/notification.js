// src/stores/notification.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])

  const addNotification = (message, type = 'info') => {
    const id = Date.now()
    notifications.value.push({
      id,
      message,
      type
    })

    setTimeout(() => {
      removeNotification(id)
    }, 3000)
  }

  const removeNotification = (id) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  return {
    notifications,
    addNotification,
    removeNotification
  }
})
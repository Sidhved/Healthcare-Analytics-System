<!-- src/components/Notification.vue -->
<template>
  <div 
    class="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
    style="min-width: 300px"
  >
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'p-4 rounded-lg shadow-lg border-l-4 flex items-center justify-between',
          notification.type === 'success' ? 'bg-green-50 border-green-500' :
          notification.type === 'error' ? 'bg-red-50 border-red-500' :
          'bg-blue-50 border-blue-500'
        ]"
      >
        <span 
          :class="[
            'text-sm',
            notification.type === 'success' ? 'text-green-800' :
            notification.type === 'error' ? 'text-red-800' :
            'text-blue-800'
          ]"
        >
          {{ notification.message }}
        </span>
        <button 
          @click="removeNotification(notification.id)"
          class="ml-4 text-gray-400 hover:text-gray-500"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { X } from 'lucide-vue-next'
import { useNotificationStore } from '@/stores/notification'
import { storeToRefs } from 'pinia'

const notificationStore = useNotificationStore()
const { notifications } = storeToRefs(notificationStore)
const { removeNotification } = notificationStore
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
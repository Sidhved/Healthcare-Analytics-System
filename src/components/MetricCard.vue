<!-- src/components/MetricCard.vue -->
<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center">
      <div class="flex-1">
        <h3 class="text-sm font-medium text-gray-500">{{ title }}</h3>
        <div class="mt-2 flex items-baseline">
          <p class="text-2xl font-semibold text-gray-900">{{ value }}</p>
          <p 
            :class="[
              trending === 'up' ? 'text-green-600' : 'text-red-600',
              'ml-2 flex items-center text-sm font-medium'
            ]"
          >
            <TrendingUp v-if="trending === 'up'" class="h-4 w-4 mr-1" />
            <TrendingDown v-else class="h-4 w-4 mr-1" />
            {{ change }}
          </p>
        </div>
        <p class="mt-1 text-sm text-gray-500">{{ timeframe }}</p>
      </div>
      <div class="ml-4">
        <slot name="icon">
          <ActivitySquare :class="[
            trending === 'up' ? 'text-green-600' : 'text-red-600',
            'h-8 w-8'
          ]" />
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { TrendingUp, TrendingDown, ActivitySquare } from 'lucide-vue-next'

defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  change: {
    type: String,
    required: true
  },
  trending: {
    type: String,
    default: 'up',
    validator: value => ['up', 'down'].includes(value)
  },
  timeframe: {
    type: String,
    required: true
  }
})
</script>
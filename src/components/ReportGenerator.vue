<!-- src/components/ReportGenerator.vue -->
<template>
  <div>
    <!-- Generate Report Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
        <div class="flex justify-between items-start">
          <h3 class="text-lg font-medium text-gray-900">
            Generate {{ reportType.name }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
            <X class="h-5 w-5" />
          </button>
        </div>

        <div class="mt-4">
          <!-- Report Configuration -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Date Range</label>
              <div class="mt-1 flex space-x-4">
                <input
                  type="date"
                  v-model="config.dateRange.start"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
                <input
                  type="date"
                  v-model="config.dateRange.end"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Format</label>
              <select
                v-model="config.format"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Include Sections</label>
              <div class="mt-2 space-y-2">
                <label v-for="section in availableSections" :key="section.id" class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="config.sections"
                    :value="section.id"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span class="ml-2 text-sm text-gray-600">{{ section.name }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Generation Progress -->
          <div v-if="isGenerating" class="mt-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-700">{{ generationStatus }}</span>
              <span class="text-sm text-gray-500">{{ progress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-primary-600 h-2 rounded-full transition-all duration-500"
                :style="{ width: `${progress}%` }"
              ></div>
            </div>
            <p class="mt-2 text-sm text-gray-500">{{ currentStep }}</p>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mt-4 p-4 bg-red-50 rounded-md">
            <div class="flex">
              <AlertCircle class="h-5 w-5 text-red-400" />
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Generation Failed</h3>
                <p class="mt-1 text-sm text-red-700">{{ error }}</p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-6 flex justify-end space-x-3">
            <button
              @click="closeModal"
              class="btn-secondary"
              :disabled="isGenerating"
            >
              Cancel
            </button>
            <button
              @click="generateReport"
              class="btn-primary"
              :disabled="isGenerating || !isConfigValid"
            >
              <FileDown v-if="!isGenerating" class="h-4 w-4 mr-2" />
              <Loader2 v-else class="h-4 w-4 mr-2 animate-spin" />
              {{ isGenerating ? 'Generating...' : 'Generate' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { X, FileDown, Loader2, AlertCircle } from 'lucide-vue-next'

const props = defineProps({
  reportType: {
    type: Object,
    required: true
  },
  showModal: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'complete'])

// State
const isGenerating = ref(false)
const progress = ref(0)
const error = ref(null)
const currentStep = ref('')
const generationStatus = ref('')

// Configuration
const config = ref({
  dateRange: {
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  },
  format: 'pdf',
  sections: []
})

// Available sections based on report type
const availableSections = computed(() => {
  const sections = {
    'inventory': [
      { id: 'summary', name: 'Summary Statistics' },
      { id: 'details', name: 'Detailed Inventory List' },
      { id: 'alerts', name: 'Stock Alerts' },
      { id: 'trends', name: 'Trends Analysis' }
    ],
    'usage': [
      { id: 'usage_summary', name: 'Usage Summary' },
      { id: 'department_usage', name: 'Usage by Department' },
      { id: 'peak_times', name: 'Peak Usage Times' },
      { id: 'predictions', name: 'Usage Predictions' }
    ],
    // Add more report types as needed
  }
  return sections[props.reportType.id] || []
})

const isConfigValid = computed(() => {
  return (
    config.value.dateRange.start &&
    config.value.dateRange.end &&
    config.value.sections.length > 0
  )
})

// Methods
const closeModal = () => {
  if (!isGenerating.value) {
    emit('close')
    resetState()
  }
}

const resetState = () => {
  isGenerating.value = false
  progress.value = 0
  error.value = null
  currentStep.value = ''
  generationStatus.value = ''
  config.value = {
    dateRange: {
      start: new Date().toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    format: 'pdf',
    sections: []
  }
}

const updateProgress = (step, statusText, progressValue) => {
  currentStep.value = step
  generationStatus.value = statusText
  progress.value = progressValue
}

const generateReport = async () => {
  isGenerating.value = true
  error.value = null
  
  try {
    // Simulate report generation steps
    const steps = [
      { name: 'Gathering data...', time: 1000 },
      { name: 'Processing information...', time: 1500 },
      { name: 'Generating visualizations...', time: 1200 },
      { name: 'Creating report...', time: 800 },
      { name: 'Finalizing...', time: 500 }
    ]

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]
      updateProgress(
        step.name,
        `Step ${i + 1} of ${steps.length}`,
        (i + 1) * (100 / steps.length)
      )
      await new Promise(resolve => setTimeout(resolve, step.time))
    }

    // Simulate successful completion
    updateProgress('Complete!', 'Report generated successfully', 100)
    await new Promise(resolve => setTimeout(resolve, 500))

    emit('complete', {
      type: props.reportType.id,
      config: { ...config.value },
      timestamp: new Date().toISOString(),
      downloadUrl: '#' // In real app, this would be actual URL
    })

    closeModal()
  } catch (e) {
    error.value = e.message || 'Failed to generate report. Please try again.'
    isGenerating.value = false
  }
}
</script>
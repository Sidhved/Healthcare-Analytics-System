<!-- src/views/Dashboard.vue -->
<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Dashboard
          </h2>
        </div>
        <div class="mt-4 flex items-center space-x-4 md:mt-0">
          <!-- Date Range Picker -->
          <div class="relative">
            <input
              type="date"
              v-model="dateRange.start"
              class="px-3 py-2 border rounded-md text-sm"
            />
            <span class="mx-2">to</span>
            <input
              type="date"
              v-model="dateRange.end"
              class="px-3 py-2 border rounded-md text-sm"
            />
          </div>
          
          <button 
            @click="refreshData" 
            class="btn-primary"
            :disabled="loading"
          >
            <RefreshCw 
              class="h-4 w-4 mr-2"
              :class="{ 'animate-spin': loading }"
            />
            {{ loading ? 'Refreshing...' : 'Refresh Data' }}
          </button>
        </div>
      </div>

      <!-- Interactive Filters -->
      <div class="mt-6 bg-white rounded-lg shadow p-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Category Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select 
              v-model="filters.category"
              class="w-full rounded-md border-gray-300"
              @change="updateCharts"
            >
              <option value="all">All Categories</option>
              <option v-for="cat in categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>

          <!-- Department Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select 
              v-model="filters.department"
              class="w-full rounded-md border-gray-300"
              @change="updateCharts"
            >
              <option value="all">All Departments</option>
              <option v-for="dept in departments" :key="dept" :value="dept">
                {{ dept }}
              </option>
            </select>
          </div>

          <!-- View Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              View Type
            </label>
            <select 
              v-model="selectedView"
              class="w-full rounded-md border-gray-300"
              @change="updateCharts"
            >
              <option value="quantity">By Quantity</option>
              <option value="value">By Value</option>
              <option value="usage">By Usage Rate</option>
            </select>
          </div>

          <!-- Chart Type for Trends -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Trend Display
            </label>
            <select 
              v-model="chartType"
              class="w-full rounded-md border-gray-300"
            >
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <!-- Inventory Trends -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Inventory Trends</h3>
            <div class="flex items-center space-x-2">
              <button 
                v-for="period in trendPeriods" 
                :key="period.value"
                @click="updateTrendPeriod(period.value)"
                :class="[
                  'px-3 py-1 text-sm rounded-md transition-colors',
                  selectedTrendPeriod === period.value
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:bg-gray-100'
                ]"
              >
                {{ period.label }}
              </button>
            </div>
          </div>
          <div class="relative h-80">
            <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
              <RefreshCw class="h-8 w-8 text-primary-600 animate-spin" />
            </div>
            <component
              :is="chartType === 'line' ? Line : Bar"
              v-if="chartData.inventoryTrends"
              :data="chartData.inventoryTrends"
              :options="chartOptions.trends"
              @click="handleChartClick"
            />
          </div>
        </div>

        <!-- Category Distribution -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Category Distribution</h3>
            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input 
                  type="checkbox" 
                  v-model="showLabels"
                  class="rounded text-primary-600"
                >
                <span class="ml-2 text-sm text-gray-600">Show Labels</span>
              </label>
            </div>
          </div>
          <div class="relative h-80">
            <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
              <RefreshCw class="h-8 w-8 text-primary-600 animate-spin" />
            </div>
            <Doughnut
              v-if="chartData.categoryDistribution"
              :data="chartData.categoryDistribution"
              :options="chartOptions.doughnut"
              @click="handleCategoryClick"
            />
          </div>
          <!-- Legend with Interactions -->
          <div class="mt-4 grid grid-cols-2 gap-2">
            <div 
              v-for="(item, index) in chartData.categoryDistribution.datasets[0].data" 
              :key="index"
              class="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
              @click="toggleCategory(index)"
            >
              <div 
                class="w-3 h-3 rounded-full"
                :style="{ backgroundColor: chartData.categoryDistribution.datasets[0].backgroundColor[index] }"
              ></div>
              <span class="text-sm text-gray-600">
                {{ chartData.categoryDistribution.labels[index] }}: 
                {{ formatValue(item) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Details Panel (shows when a chart element is clicked) -->
      <div 
        v-if="selectedDetail"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
        @click.self="selectedDetail = null"
      >
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              {{ selectedDetail.title }}
            </h3>
            <div class="mt-2 px-7 py-3">
              <p class="text-sm text-gray-500">
                {{ selectedDetail.description }}
              </p>
              <div class="mt-3">
                <dl class="grid grid-cols-2 gap-4">
                  <div v-for="(value, key) in selectedDetail.data" :key="key">
                    <dt class="text-sm font-medium text-gray-500">{{ key }}</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ value }}</dd>
                  </div>
                </dl>
              </div>
            </div>
            <div class="items-center px-4 py-3">
              <button
                class="btn-primary w-full"
                @click="selectedDetail = null"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Line, Bar, Doughnut } from 'vue-chartjs'
import { RefreshCw } from 'lucide-vue-next'
import { useDashboardStore } from '@/stores/dashboard'
import { storeToRefs } from 'pinia'
import Notification from '@/components/Notification.vue'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const store = useDashboardStore()
const { loading } = storeToRefs(store)

// Interactive states
const selectedTrendPeriod = ref('30d')
const selectedView = ref('quantity')
const chartType = ref('line')
const showLabels = ref(true)
const selectedDetail = ref(null)
const dateRange = ref({
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  end: new Date().toISOString().split('T')[0]
})

// Filters
const filters = ref({
  category: 'all',
  department: 'all'
})

const categories = ['Medical Supplies', 'Medications', 'Equipment', 'PPE', 'Lab Supplies']
const departments = ['Emergency', 'Surgery', 'Pharmacy', 'General', 'Laboratory']

const trendPeriods = [
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '3M', value: '90d' },
  { label: '1Y', value: '1y' }
]

// Chart data with interactivity
const chartData = computed(() => ({
  inventoryTrends: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Total Items',
        data: generateTrendData(),
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        tension: 0.4,
        fill: chartType.value === 'bar'
      },
      {
        label: 'Low Stock Items',
        data: generateTrendData(true),
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.2)',
        tension: 0.4,
        fill: chartType.value === 'bar'
      }
    ]
  },
  categoryDistribution: {
    labels: categories,
    datasets: [{
      data: generateDistributionData(),
      backgroundColor: [
        '#0ea5e9',
        '#22c55e',
        '#f43f5e',
        '#eab308',
        '#8b5cf6'
      ],
      borderWidth: 1
    }]
  }
}))

// Enhanced chart options
const chartOptions = computed(() => ({
  trends: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        onClick: (e, legendItem) => {
          const index = legendItem.datasetIndex
          const ci = e.chart
          const meta = ci.getDatasetMeta(index)
          meta.hidden = !meta.hidden
          ci.update()
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || ''
            const value = context.parsed.y
            return `${label}: ${value.toLocaleString()}`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'nearest'
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart'
    }
  },
  doughnut: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLabels.value,
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || ''
            const value = context.raw
            return formatValue(value)
          }
        }
      }
    },
    cutout: '70%',
    animation: {
      animateRotate: true,
      animateScale: true
    }
  }
}))

// Helper functions
function generateTrendData(isLowStock = false) {
  const baseValue = isLowStock ? 50 : 1000
  const variance = isLowStock ? 20 : 200
  return Array.from({ length: 6 }, () => 
    baseValue + Math.floor(Math.random() * variance)
  )
}

function generateDistributionData() {
  return selectedView.value === 'quantity'
    ? [300, 250, 200, 150, 100]
    : [50000, 75000, 100000, 25000, 30000]
}

function formatValue(value) {
  if (selectedView.value === 'value') {
    return `$${value.toLocaleString()}`
  }
  return `${value.toLocaleString()} items`
}

// Event handlers
function updateTrendPeriod(period) {
  selectedTrendPeriod.value = period
  updateCharts()
}

function handleChartClick(event, elements) {
  if (!elements.length) return

  const element = elements[0]
  const datasetIndex = element.datasetIndex
  const index = element.index

  selectedDetail.value = {
    title: chartData.value.inventoryTrends.datasets[datasetIndex].label,
    description: `Details for ${chartData.value.inventoryTrends.labels[index]}`,
    data: {
      Period: chartData.value.inventoryTrends.labels[index],
      Value: chartData.value.inventoryTrends.datasets[datasetIndex].data[index],
      'Change from previous': '+12%', // You can calculate this dynamically
      'Projected next month': Math.floor(chartData.value.inventoryTrends.datasets[datasetIndex].data[index] * 1.1)
    }
  }
}

function handleCategoryClick(event, elements) {
  if (!elements.length) return

  const element = elements[0]
  const index = element.index

  selectedDetail.value = {
    title: chartData.value.categoryDistribution.labels[index],
    description: 'Category details and analytics',
    data: {
      Total: formatValue(chartData.value.categoryDistribution.datasets[0].data[index]),
      'Market Share': `${Math.floor(Math.random() * 30 + 10)}%`,
      'Growth Rate': `+${Math.floor(Math.random() * 15 + 5)}%`,
      'Stock Status': Math.random() > 0.5 ? 'Optimal' : 'Review Required'
    }
  }
}

function toggleCategory(index) {
  const meta = chartRef.value?.chart.getDatasetMeta(0)
  if (meta) {
    meta.data[index].hidden = !meta.data[index].hidden
    chartRef.value.chart.update()
  }
}

function updateCharts() {
  loading.value = true
  
  // Simulate API call delay
  setTimeout(() => {
    // In a real application, you would fetch new data based on filters
    // For now, we'll just update the loading state
    loading.value = false
  }, 500)
}

// Watchers
watch([filters, selectedView, dateRange], () => {
  updateCharts()
}, { deep: true })

watch(showLabels, () => {
  chartOptions.value.doughnut.plugins.legend.display = showLabels.value
})

// Lifecycle hooks
onMounted(async () => {
  await refreshData()
  
  // Set up chart click handlers
  const charts = document.querySelectorAll('canvas')
  charts.forEach(chart => {
    chart.addEventListener('click', (e) => {
      const elements = chart.getElementsAtEventForMode(
        e,
        'nearest',
        { intersect: true },
        true
      )
      if (elements.length) {
        const firstElement = elements[0]
        // Handle click based on chart type
        if (chart.id.includes('doughnut')) {
          handleCategoryClick(e, [firstElement])
        } else {
          handleChartClick(e, [firstElement])
        }
      }
    })
  })
})

const refreshData = async () => {
  loading.value = true
  try {
    await store.fetchDashboardData()
    // Additional data processing if needed
  } finally {
    loading.value = false
  }
}

// Export all necessary methods and variables
defineExpose({
  refreshData,
  updateCharts,
  handleChartClick,
  handleCategoryClick,
  toggleCategory
})
</script>

<style scoped>
.chart-container {
  position: relative;
  transition: all 0.3s ease;
}

.chart-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

/* Animation classes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar for the detail panel */
.detail-panel {
  scrollbar-width: thin;
  scrollbar-color: #e5e7eb transparent;
}

.detail-panel::-webkit-scrollbar {
  width: 8px;
}

.detail-panel::-webkit-scrollbar-track {
  background: transparent;
}

.detail-panel::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 4px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
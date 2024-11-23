<!-- src/views/Analytics.vue -->
<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Analytics Dashboard
          </h2>
          <p class="mt-1 text-sm text-gray-500">
            Detailed analysis and insights of inventory performance
          </p>
        </div>
        <div class="mt-4 flex space-x-3 md:mt-0 md:ml-4">
          <div class="relative">
            <select
              v-model="selectedPeriod"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
          <button class="btn-primary">
            <Download class="h-4 w-4 mr-2" />
            Export Analytics
          </button>
        </div>
      </div>

      <!-- Key Metrics -->
      <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div 
          v-for="metric in keyMetrics" 
          :key="metric.name"
          class="bg-white overflow-hidden shadow rounded-lg"
        >
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <component 
                  :is="metric.icon" 
                  :class="[metric.iconColor, 'h-6 w-6']"
                />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    {{ metric.name }}
                  </dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">
                      {{ metric.value }}
                    </div>
                    <div 
                      :class="[
                        metric.change > 0 ? 'text-green-600' : 'text-red-600',
                        'ml-2 flex items-center text-sm font-medium'
                      ]"
                    >
                      <component 
                        :is="metric.change > 0 ? TrendingUp : TrendingDown"
                        class="h-4 w-4 mr-1"
                      />
                      {{ Math.abs(metric.change) }}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
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
                v-for="period in ['1W', '1M', '3M', '1Y']"
                :key="period"
                :class="[
                  'px-3 py-1 text-sm rounded-md',
                  selectedTrendPeriod === period
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:bg-gray-100'
                ]"
                @click="selectedTrendPeriod = period"
              >
                {{ period }}
              </button>
            </div>
          </div>
          <div class="h-80">
            <Line :data="inventoryTrendsData" :options="lineChartOptions" />
          </div>
        </div>

        <!-- Category Distribution -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Category Distribution</h3>
          <div class="h-80">
            <Doughnut :data="categoryDistributionData" :options="doughnutOptions" />
          </div>
        </div>

        <!-- Stock Status -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Stock Status</h3>
          <div class="h-80">
            <Bar :data="stockStatusData" :options="barChartOptions" />
          </div>
        </div>

        <!-- Usage Patterns -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Usage Patterns</h3>
          <div class="h-80">
            <Line :data="usagePatternsData" :options="lineChartOptions" />
          </div>
        </div>
      </div>

      <!-- Top Items Table -->
      <div class="mt-8 bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">Top Moving Items</h3>
          <button class="btn-secondary text-sm">
            View All
          </button>
        </div>
        <div class="border-t border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Name
                </th>
                <th class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage Rate
                </th>
                <th class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in topItems" :key="item.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ item.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                  {{ item.usageRate }} units/day
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                  {{ item.currentStock }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <span 
                    :class="[
                      item.trend === 'up' ? 'text-green-600' : 'text-red-600',
                      'inline-flex items-center'
                    ]"
                  >
                    <component 
                      :is="item.trend === 'up' ? TrendingUp : TrendingDown"
                      class="h-4 w-4 mr-1"
                    />
                    {{ item.trendValue }}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  Download,
  TrendingUp,
  TrendingDown,
  Package,
  AlertTriangle,
  DollarSign,
  Clock
} from 'lucide-vue-next'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement
} from 'chart.js'
import { Line, Bar, Doughnut } from 'vue-chartjs'

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

// State
const selectedPeriod = ref('30d')
const selectedTrendPeriod = ref('1M')

// Key Metrics Data
const keyMetrics = [
  {
    name: 'Total Inventory Value',
    value: '$234,567',
    change: 12.5,
    icon: DollarSign,
    iconColor: 'text-green-500'
  },
  {
    name: 'Stock Turnover Rate',
    value: '3.2x',
    change: -2.1,
    icon: Package,
    iconColor: 'text-blue-500'
  },
  {
    name: 'Low Stock Items',
    value: '12',
    change: -5.0,
    icon: AlertTriangle,
    iconColor: 'text-red-500'
  },
  {
    name: 'Average Lead Time',
    value: '4.5 days',
    change: 1.8,
    icon: Clock,
    iconColor: 'text-yellow-500'
  }
]

// Chart Data
const inventoryTrendsData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Total Items',
      data: [1200, 1400, 1300, 1800, 1600, 2000],
      borderColor: '#2563eb',
      tension: 0.4
    },
    {
      label: 'Used Items',
      data: [1000, 1200, 1100, 1600, 1400, 1800],
      borderColor: '#16a34a',
      tension: 0.4
    }
  ]
}

const categoryDistributionData = {
  labels: ['Medical Supplies', 'Medications', 'Equipment', 'PPE', 'Lab Supplies'],
  datasets: [{
    data: [30, 25, 20, 15, 10],
    backgroundColor: [
      '#2563eb',
      '#16a34a',
      '#dc2626',
      '#ca8a04',
      '#7c3aed'
    ]
  }]
}

const stockStatusData = {
  labels: ['In Stock', 'Low Stock', 'Out of Stock', 'Expired'],
  datasets: [{
    label: 'Number of Items',
    data: [150, 12, 5, 3],
    backgroundColor: [
      '#2563eb',
      '#ca8a04',
      '#dc2626',
      '#7c3aed'
    ]
  }]
}

const usagePatternsData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Usage Count',
      data: [65, 59, 80, 81, 56, 40, 30],
      borderColor: '#2563eb',
      tension: 0.4
    }
  ]
}

// Chart Options
const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right'
    }
  }
}

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

// Top Items Data
const topItems = [
  {
    id: 1,
    name: 'Surgical Masks',
    usageRate: '250',
    currentStock: '5,000',
    trend: 'up',
    trendValue: 12.5
  },
  {
    id: 2,
    name: 'Nitrile Gloves',
    usageRate: '200',
    currentStock: '3,500',
    trend: 'up',
    trendValue: 8.2
  },
  {
    id: 3,
    name: 'Antibiotics',
    usageRate: '75',
    currentStock: '1,200',
    trend: 'down',
    trendValue: 3.1
  },
  {
    id: 4,
    name: 'Syringes',
    usageRate: '180',
    currentStock: '4,200',
    trend: 'up',
    trendValue: 5.7
  },
  {
    id: 5,
    name: 'Bandages',
    usageRate: '120',
    currentStock: '2,800',
    trend: 'down',
    trendValue: 2.3
  }
]
</script>
<!-- src/views/Reports.vue -->
<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Reports
          </h2>
          <p class="mt-1 text-sm text-gray-500">
            Generate and manage inventory reports and analytics
          </p>
        </div>
        <div class="mt-4 flex space-x-3 md:mt-0 md:ml-4">
          <button class="btn-secondary">
            <FileCog2 class="h-4 w-4 mr-2" />
            Schedule Reports
          </button>
          <button class="btn-primary">
            <Plus class="h-4 w-4 mr-2" />
            New Report
          </button>
        </div>
      </div>

      <!-- Quick Filters -->
      <div class="mt-6 bg-white shadow rounded-lg p-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div class="relative rounded-md shadow-sm">
            <input
              type="text"
              v-model="searchQuery"
              class="block w-full rounded-md border-gray-300 pr-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Search reports..."
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
              <Search class="h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <select
              v-model="selectedType"
              class="block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="">All Types</option>
              <option value="inventory">Inventory</option>
              <option value="usage">Usage</option>
              <option value="cost">Cost</option>
              <option value="expiry">Expiry</option>
            </select>
          </div>

          <div>
            <select
              v-model="selectedPeriod"
              class="block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="">All Time Periods</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>

          <div>
            <select
              v-model="selectedStatus"
              class="block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="generated">Generated</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Report Types Grid -->
      <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div 
          v-for="report in reportTypes" 
          :key="report.id" 
          class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200 hover:shadow-md transition-shadow duration-200"
        >
          <div class="px-4 py-5 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <component 
                  :is="report.icon" 
                  class="h-6 w-6 text-primary-600"
                />
                <h3 class="ml-2 text-lg font-medium text-gray-900">
                  {{ report.name }}
                </h3>
              </div>
              <span 
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  report.frequency === 'Daily' ? 'bg-green-100 text-green-800' :
                  report.frequency === 'Weekly' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                ]"
              >
                {{ report.frequency }}
              </span>
            </div>
          </div>
          <div class="px-4 py-4 sm:px-6">
            <p class="text-sm text-gray-500">
              {{ report.description }}
            </p>
            <div class="mt-2 flex items-center text-sm text-gray-500">
              <Clock class="h-4 w-4 mr-1" />
              Last generated: {{ report.lastGenerated }}
            </div>
          </div>
          <div class="px-4 py-4 sm:px-6 bg-gray-50">
            <div class="flex justify-between items-center">
              <div class="flex space-x-2">
                <button class="inline-flex items-center text-sm text-gray-600 hover:text-primary-600">
                  <Eye class="h-4 w-4 mr-1" />
                  Preview
                </button>
                <button class="inline-flex items-center text-sm text-gray-600 hover:text-primary-600">
                  <Settings class="h-4 w-4 mr-1" />
                  Configure
                </button>
              </div>
              <button class="btn-secondary text-sm">
                Generate Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Reports -->
      <div class="mt-8">
        <div class="sm:flex sm:items-center">
          <div class="sm:flex-auto">
            <h3 class="text-lg font-medium text-gray-900">Recent Reports</h3>
            <p class="mt-1 text-sm text-gray-500">
              List of recently generated reports and their status
            </p>
          </div>
        </div>
        <div class="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Generated By
                </th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="report in recentReports" :key="report.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <component 
                      :is="report.icon" 
                      class="h-5 w-5 text-gray-400"
                    />
                    <span class="ml-2 text-sm font-medium text-gray-900">
                      {{ report.name }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ report.generatedBy }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ report.date }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    :class="[
                      'px-2 py-1 text-xs font-medium rounded-full',
                      report.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      report.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ report.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button class="text-primary-600 hover:text-primary-900 mr-3">
                    <Eye class="h-4 w-4" />
                  </button>
                  <button class="text-primary-600 hover:text-primary-900 mr-3">
                    <Download class="h-4 w-4" />
                  </button>
                  <button class="text-red-600 hover:text-red-900">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="mt-4 flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button class="btn-secondary">Previous</button>
            <button class="btn-secondary">Next</button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing
                <span class="font-medium">1</span>
                to
                <span class="font-medium">10</span>
                of
                <span class="font-medium">{{ recentReports.length }}</span>
                results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button class="btn-secondary rounded-l-md">Previous</button>
                <button class="btn-secondary rounded-r-md ml-2">Next</button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  Plus,
  FileCog2,
  Search,
  Eye,
  Download,
  Trash2,
  Clock,
  Settings,
  BarChart2,
  PieChart,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Calendar
} from 'lucide-vue-next'

// Search and filter states
const searchQuery = ref('')
const selectedType = ref('')
const selectedPeriod = ref('')
const selectedStatus = ref('')

// Report types data
const reportTypes = [
  {
    id: 1,
    name: 'Inventory Status',
    description: 'Complete inventory status report including stock levels and alerts',
    icon: BarChart2,
    lastGenerated: '2024-02-20',
    frequency: 'Daily'
  },
  {
    id: 2,
    name: 'Usage Analysis',
    description: 'Analysis of item usage patterns and trends',
    icon: PieChart,
    lastGenerated: '2024-02-19',
    frequency: 'Weekly'
  },
  {
    id: 3,
    name: 'Trend Report',
    description: 'Historical trends and future projections',
    icon: TrendingUp,
    lastGenerated: '2024-02-18',
    frequency: 'Monthly'
  },
  {
    id: 4,
    name: 'Alerts Summary',
    description: 'Summary of all inventory alerts and actions taken',
    icon: AlertTriangle,
    lastGenerated: '2024-02-17',
    frequency: 'Daily'
  },
  {
    id: 5,
    name: 'Expiry Report',
    description: 'Items approaching expiration dates',
    icon: Clock,
    lastGenerated: '2024-02-16',
    frequency: 'Weekly'
  },
  {
    id: 6,
    name: 'Cost Analysis',
    description: 'Detailed cost analysis and budget tracking',
    icon: DollarSign,
    lastGenerated: '2024-02-15',
    frequency: 'Monthly'
  }
]

// Recent reports data
const recentReports = [
  {
    id: 1,
    name: 'Monthly Inventory Report',
    icon: BarChart2,
    generatedBy: 'John Doe',
    date: '2024-02-20',
    status: 'Completed'
  },
  {
    id: 2,
    name: 'Weekly Usage Analysis',
    icon: PieChart,
    generatedBy: 'Jane Smith',
    date: '2024-02-19',
    status: 'Processing'
  },
  {
    id: 3,
    name: 'Q1 Cost Analysis',
    icon: DollarSign,
    generatedBy: 'Mike Johnson',
    date: '2024-02-18',
    status: 'Failed'
  },
  {
    id: 4,
    name: 'Daily Stock Alert Report',
    icon: AlertTriangle,
    generatedBy: 'Sarah Williams',
    date: '2024-02-17',
    status: 'Completed'
  },
  {
    id: 5,
    name: 'Expiry Tracking Report',
    icon: Clock,
    generatedBy: 'Robert Brown',
    date: '2024-02-16',
    status: 'Completed'
  }
]
</script>
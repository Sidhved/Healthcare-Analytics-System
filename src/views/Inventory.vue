<!-- src/views/Inventory.vue -->
<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Inventory Management
          </h2>
        </div>
        <div class="mt-4 flex space-x-3 md:mt-0 md:ml-4">
          <button class="btn-secondary">
            <FileDown class="h-4 w-4 mr-2" />
            Export
          </button>
          <button class="btn-primary">
            <Plus class="h-4 w-4 mr-2" />
            Add Item
          </button>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="mt-6 bg-white shadow rounded-lg p-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search items..."
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
            <Search class="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <select
            v-model="selectedCategory"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>

          <select
            v-model="selectedStatus"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">All Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

          <select
            v-model="selectedDepartment"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">All Departments</option>
            <option v-for="dept in departments" :key="dept" :value="dept">
              {{ dept }}
            </option>
          </select>
        </div>
      </div>

      <!-- Inventory Table -->
      <div class="mt-8 bg-white shadow overflow-hidden rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th 
                v-for="header in tableHeaders" 
                :key="header.key"
                class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {{ header.label }}
              </th>
              <th class="px-6 py-3 bg-gray-50"></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in filteredItems" :key="item.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ item.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ item.category }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ item.quantity }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ item.department }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ item.lastUpdated }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-primary-600 hover:text-primary-900 mr-3">
                  <Edit2 class="h-4 w-4" />
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
        <div class="flex items-center">
          <span class="text-sm text-gray-700">
            Showing <span class="font-medium">1</span> to <span class="font-medium">10</span> of <span class="font-medium">{{ inventoryItems.length }}</span> results
          </span>
        </div>
        <div class="flex items-center space-x-2">
          <button 
            class="btn-secondary"
            :disabled="currentPage === 1"
          >
            Previous
          </button>
          <button 
            class="btn-secondary"
            :disabled="currentPage === totalPages"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  FileDown, 
  Plus, 
  Search, 
  Edit2, 
  Trash2 
} from 'lucide-vue-next'

// Mock data
const categories = ['Medical Supplies', 'Medications', 'Equipment', 'PPE', 'Lab Supplies']
const departments = ['Emergency', 'Surgery', 'Pharmacy', 'Laboratory', 'General']

const tableHeaders = [
  { key: 'name', label: 'Item Name' },
  { key: 'category', label: 'Category' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'department', label: 'Department' },
  { key: 'lastUpdated', label: 'Last Updated' },
  { key: 'actions', label: '' }
]

const inventoryItems = ref([
  {
    id: 1,
    name: 'Surgical Masks',
    category: 'PPE',
    quantity: 5000,
    department: 'Emergency',
    lastUpdated: '2024-02-20'
  },
  {
    id: 2,
    name: 'Antibiotics',
    category: 'Medications',
    quantity: 2000,
    department: 'Pharmacy',
    lastUpdated: '2024-02-19'
  },
  // Add more items as needed
])

// Filters
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const selectedDepartment = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const filteredItems = computed(() => {
  return inventoryItems.value.filter(item => {
    const matchesSearch = searchQuery.value === '' || 
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value === '' || 
      item.category === selectedCategory.value
    const matchesDepartment = selectedDepartment.value === '' || 
      item.department === selectedDepartment.value
    
    return matchesSearch && matchesCategory && matchesDepartment
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / itemsPerPage)
})
</script>
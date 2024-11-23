// src/stores/dashboard.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDashboardStore = defineStore('dashboard', () => {
  const loading = ref(false)
  const error = ref(null)
  
  const metrics = ref([
    {
      id: 1,
      title: 'Total Inventory Items',
      value: '2,345',
      change: '+12.5%',
      trending: 'up',
      timeframe: 'from last month'
    },
    {
      id: 2,
      title: 'Low Stock Alerts',
      value: '12',
      change: '-2',
      trending: 'down',
      timeframe: 'from yesterday'
    },
    {
      id: 3,
      title: 'Critical Items',
      value: '5',
      change: '+1',
      trending: 'up',
      timeframe: 'from last week'
    }
  ])

  const inventoryData = ref({
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
  })

  const categoryData = ref({
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
  })

  const criticalItems = ref([
    {
      id: 1,
      name: 'Surgical Masks',
      currentStock: 500,
      minRequired: 1000,
      status: 'critical',
      department: 'Emergency'
    },
    {
      id: 2,
      name: 'Nitrile Gloves',
      currentStock: 1200,
      minRequired: 2000,
      status: 'warning',
      department: 'Surgery'
    },
    {
      id: 3,
      name: 'Antibiotics',
      currentStock: 300,
      minRequired: 500,
      status: 'critical',
      department: 'Pharmacy'
    }
  ])

  const fetchDashboardData = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      // In a real app, this would be an API call
    } catch (e) {
      error.value = 'Failed to fetch dashboard data'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    metrics,
    inventoryData,
    categoryData,
    criticalItems,
    fetchDashboardData
  }
})
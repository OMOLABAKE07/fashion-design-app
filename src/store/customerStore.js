// src/store/customerStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { customerAPI } from '@/services/api'

export const useCustomerStore = defineStore('customer', () => {
  const customers = ref([])
  const searchQuery = ref('')
  const loading = ref(false)
  const error = ref(null)

  const filteredCustomers = computed(() => {
    if (!searchQuery.value) return customers.value
    return customers.value.filter(c =>
      c.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })

  // Load customers from backend
  async function loadCustomers() {
    try {
      loading.value = true
      error.value = null
      customers.value = await customerAPI.getAll()
    } catch (err) {
      error.value = err.message
      console.error('Error loading customers:', err)
    } finally {
      loading.value = false
    }
  }

  // Add customer
  async function addCustomer(customer) {
    try {
      loading.value = true
      error.value = null
      const newCustomer = await customerAPI.create(customer)
      customers.value.push(newCustomer)
      return newCustomer
    } catch (err) {
      error.value = err.message
      console.error('Error adding customer:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update customer
  async function updateCustomer(id, updatedData) {
    try {
      loading.value = true
      error.value = null
      const updatedCustomer = await customerAPI.update(id, updatedData)
      const index = customers.value.findIndex(c => c.id === id)
      if (index !== -1) customers.value[index] = updatedCustomer
      return updatedCustomer
    } catch (err) {
      error.value = err.message
      console.error('Error updating customer:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete customer
  async function deleteCustomer(id) {
    try {
      loading.value = true
      error.value = null
      await customerAPI.delete(id)
      customers.value = customers.value.filter(c => c.id !== id)
    } catch (err) {
      error.value = err.message
      console.error('Error deleting customer:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return { 
    customers, 
    searchQuery, 
    loading, 
    error,
    filteredCustomers, 
    loadCustomers, 
    addCustomer, 
    updateCustomer, 
    deleteCustomer 
  }
})
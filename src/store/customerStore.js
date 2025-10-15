// src/store/customerStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCustomerStore = defineStore('customer', () => {
  const customers = ref([])
  const searchQuery = ref('')

  const filteredCustomers = computed(() => {
    if (!searchQuery.value) return customers.value
    return customers.value.filter(c =>
      c.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })

  function addCustomer(customer) {
    customers.value.push({ id: Date.now(), ...customer })
  }

  function updateCustomer(id, updatedData) {
    const index = customers.value.findIndex(c => c.id === id)
    if (index !== -1) customers.value[index] = { ...customers.value[index], ...updatedData }
  }

  function deleteCustomer(id) {
    customers.value = customers.value.filter(c => c.id !== id)
  }

  return { customers, searchQuery, filteredCustomers, addCustomer, updateCustomer, deleteCustomer }
})

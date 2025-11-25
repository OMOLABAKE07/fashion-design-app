<template>
  <div class="customer-list">
    <div class="list-header">
      <h3>Customer List</h3>
      <div class="header-actions">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search customers..."
          class="search-input"
        />
        <button @click="showCustomerForm = true" class="btn-primary">
          Add New Customer
        </button>
      </div>
    </div>

    <div v-if="showCustomerForm" class="form-overlay">
      <div class="form-container">
        <CustomerForm 
          :customer="editingCustomer" 
          @save="handleCustomerSave" 
          @cancel="handleFormCancel"
        />
      </div>
    </div>

    <div class="table-container">
      <table class="customer-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Gender</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredCustomers.length === 0">
            <td colspan="6" class="no-data">No customers found</td>
          </tr>
          <template v-else>
            <tr v-for="customer in filteredCustomers" :key="customer.id">
              <td>
                <div class="customer-name">
                  {{ customer.name || `${customer.first_name} ${customer.last_name}` }}
                </div>
              </td>
              <td>{{ customer.email }}</td>
              <td>{{ customer.phone }}</td>
              <td>{{ customer.gender || 'Not specified' }}</td>
              <td>{{ formatDate(customer.createdAt) }}</td>
              <td class="actions">
                <button @click="selectCustomer(customer)" class="btn-view">
                  View
                </button>
                <button @click="editCustomer(customer)" class="btn-edit">
                  Edit
                </button>
                <button @click="deleteCustomer(customer.id)" class="btn-delete">
                  Delete
                </button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import { useCustomerStore } from '@/store/customerStore'
import CustomerForm from './CustomerForm.vue'

export default {
  name: 'CustomerList',
  components: { CustomerForm },
  data() {
    return {
      showCustomerForm: false,
      searchQuery: '',
      editingCustomer: null
    }
  },
  computed: {
    customerStore() {
      return useCustomerStore()
    },
    filteredCustomers() {
      if (!this.searchQuery) return this.customerStore.customers
      const query = this.searchQuery.toLowerCase()
      return this.customerStore.customers.filter(customer =>
        (customer.name && customer.name.toLowerCase().includes(query)) ||
        (customer.email && customer.email.toLowerCase().includes(query)) ||
        (customer.phone && customer.phone.toLowerCase().includes(query)) ||
        (customer.first_name && customer.first_name.toLowerCase().includes(query)) ||
        (customer.last_name && customer.last_name.toLowerCase().includes(query))
      )
    }
  },
  async mounted() {
    await this.customerStore.loadCustomers()
  },
  methods: {
    async handleCustomerSave(customerData) {
      try {
        if (this.editingCustomer) {
          // Edit customer
          await this.customerStore.updateCustomer(this.editingCustomer.id, customerData)
          this.showCustomerForm = false
          this.editingCustomer = null
          Swal.fire({ 
            icon: "success", 
            title: "Saved", 
            text: "Customer updated successfully!", 
            timer: 2000, 
            showConfirmButton: false 
          })
        } else {
          // Add new customer
          await this.customerStore.addCustomer(customerData)
          this.showCustomerForm = false
          this.editingCustomer = null
          Swal.fire({ 
            icon: "success", 
            title: "Saved", 
            text: "Customer added successfully!", 
            timer: 2000, 
            showConfirmButton: false 
          })
        }
      } catch (error) {
        console.error('Error saving customer:', error)
        Swal.fire({ 
          icon: "error", 
          title: "Error", 
          text: `Error ${this.editingCustomer ? 'updating' : 'adding'} customer. Data has been saved locally and will sync when online.` 
        })
      }
    },
    async deleteCustomer(customerId) {
      Swal.fire({
        icon: "warning",
        title: "Delete Customer",
        text: "Are you sure you want to delete this customer record?",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
        cancelButtonColor: "#d92550",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await this.customerStore.deleteCustomer(customerId)
            Swal.fire({ 
              icon: "success", 
              title: "Deleted", 
              text: "Customer deleted successfully!", 
              timer: 2000, 
              showConfirmButton: false 
            })
          } catch (error) {
            Swal.fire({ 
              icon: "error", 
              title: "Error", 
              text: "Error deleting customer. The deletion has been queued and will sync when online." 
            })
          }
        }
      })
    },
    editCustomer(customer) {
      this.editingCustomer = customer
      this.showCustomerForm = true
    },
    handleFormCancel() {
      this.showCustomerForm = false
      this.editingCustomer = null
    },
    selectCustomer(customer) {
      this.$emit('customer-selected', customer)
    },
    formatDate(date) {
      if (!date) return 'Invalid Date'
      const dateObj = new Date(date)
      if (isNaN(dateObj.getTime())) return 'Invalid Date'
      return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(dateObj)
    }
  }
}
</script>
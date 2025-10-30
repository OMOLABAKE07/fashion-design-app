<template>
  <div class="customer-list">
    <div class="header">
      <h2>Customer List</h2>
      <div class="header-actions">
        <div class="search-wrapper">
          <input type="text" v-model="searchQuery" placeholder="Search customers..." class="search-input" />
        </div>
        <button @click="showCustomerForm = !showCustomerForm" class="btn-primary">
          {{ showCustomerForm ? 'Hide Form' : 'Add New Customer' }}
        </button>
      </div>
    </div>

    <!-- Customer Form -->
    <div v-if="showCustomerForm" class="mb-4">
      <CustomerForm :customer="editingCustomer" @save="handleCustomerSave" @cancel="handleFormCancel" />
    </div>

    <div v-if="customers.length === 0" class="empty-state">
      <p>No customers found. Add your first customer to get started!</p>
    </div>

    <div v-else class="customers-grid">
      <div class="card-border mb-3 border-primary mt-4 table-container">
        <table class="table table-sm table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone No.</th>
              <th>Address</th>
              <th>Gender</th>
              <th>Comment</th>
              <th>Date Added</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <template v-if="filteredCustomers.length > 0">
              <tr v-for="(customer, index) in filteredCustomers" :key="customer.id" class="customer-row">
                <td>{{ index + 1 }}</td>
                <td>{{ customer.name || `${customer.first_name} ${customer.last_name}` }}</td>
                <td>{{ customer.email }}</td>
                <td>{{ customer.phone }}</td>
                <td>{{ customer.address }}</td>
                <td>{{ customer.gender }}</td>
                <td>
                  <span class="comment" :class="customer.notes ? 'active' : 'pending'">
                    {{ customer.notes || 'No comments' }}
                  </span>
                </td>
                <td>{{ formatDate(customer.createdAt) }}</td>
                <td>
                  <div class="d-flex gap-2 justify-content-center action-buttons">
                    <button @click.stop="editCustomer(customer)" class="btn btn-sm btn-success">Edit</button>
                    <button @click.stop="deleteCustomer(customer.id)" class="btn btn-sm btn-danger">Delete</button>
                  </div>
                </td>
              </tr>
            </template>

            <template v-else>
              <tr>
                <td colspan="9" class="text-center">
                  <div class="alert alert-info m-0">No Record Found</div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import axios from 'axios'
import CustomerForm from './CustomerForm.vue'

export default {
  name: 'CustomerList',
  components: { CustomerForm },
  data() {
    return {
      showCustomerForm: false,
      searchQuery: '',
      customers: [],
      editingCustomer: null
    }
  },
  computed: {
    filteredCustomers() {
      if (!this.searchQuery) return this.customers
      const query = this.searchQuery.toLowerCase()
      return this.customers.filter(customer =>
        (customer.name && customer.name.toLowerCase().includes(query)) ||
        (customer.email && customer.email.toLowerCase().includes(query)) ||
        (customer.phone && customer.phone.toLowerCase().includes(query)) ||
        (customer.first_name && customer.first_name.toLowerCase().includes(query)) ||
        (customer.last_name && customer.last_name.toLowerCase().includes(query))
      )
    }
  },
  async mounted() {
    await this.loadCustomers()
  },
  methods: {
    async loadCustomers() {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/customers')
        this.customers = response.data.map(c => ({
          ...c,
          id: c.id,
          first_name: c.first_name || c.firstName || '',
          last_name: c.last_name || c.lastName || '',
          name: c.name || `${c.first_name || c.firstName || ''} ${c.last_name || c.lastName || ''}`.trim(),
          email: c.email || '',
          phone: c.phone || '',
          address: c.address || '',
          gender: c.gender || '',
          notes: c.notes || '',
          createdAt: c.created_at ? new Date(c.created_at) : (c.createdAt ? new Date(c.createdAt) : null),
          updatedAt: c.updated_at ? new Date(c.updated_at) : (c.updatedAt ? new Date(c.updatedAt) : null)
        }))
      } catch (error) {
        console.error('Error loading customers:', error)
        this.customers = []
      }
    },
    async handleCustomerSave(customerData) {
      // Ensure name is properly set
      const payload = { 
        ...customerData, 
        name: customerData.name || `${customerData.first_name} ${customerData.last_name}`.trim() 
      }

      if (this.editingCustomer) {
        // Edit customer
        try {
          const res = await axios.put(`http://localhost:8000/api/v1/customers/${this.editingCustomer.id}`, payload)
          const updatedCustomer = res.data
          const index = this.customers.findIndex(c => c.id === this.editingCustomer.id)
          if (index > -1) {
            // Preserve the processed fields structure
            this.customers.splice(index, 1, {
              ...updatedCustomer,
              id: updatedCustomer.id,
              first_name: updatedCustomer.first_name || updatedCustomer.firstName || '',
              last_name: updatedCustomer.last_name || updatedCustomer.lastName || '',
              name: updatedCustomer.name || `${updatedCustomer.first_name || updatedCustomer.firstName || ''} ${updatedCustomer.last_name || updatedCustomer.lastName || ''}`.trim(),
              email: updatedCustomer.email || '',
              phone: updatedCustomer.phone || '',
              address: updatedCustomer.address || '',
              gender: updatedCustomer.gender || '',
              notes: updatedCustomer.notes || '',
              createdAt: updatedCustomer.created_at ? new Date(updatedCustomer.created_at) : (updatedCustomer.createdAt ? new Date(updatedCustomer.createdAt) : null),
              updatedAt: updatedCustomer.updated_at ? new Date(updatedCustomer.updated_at) : (updatedCustomer.updatedAt ? new Date(updatedCustomer.updatedAt) : null)
            })
          }
          this.showCustomerForm = false
          this.editingCustomer = null
          Swal.fire({ icon: "success", title: "Saved", text: "Customer updated successfully!", timer: 2000, showConfirmButton: false })
        } catch (error) {
          if (error.response && error.response.status === 422) {
            // Validation error
            const errors = error.response.data.errors
            if (errors.email) {
              Swal.fire({ icon: "error", title: "Email Exists", text: errors.email[0] })
            } else {
              Swal.fire({ icon: "error", title: "Validation Error", text: Object.values(errors).flat()[0] })
            }
          } else {
            Swal.fire({ icon: "error", title: "Error", text: "Error updating customer." })
          }
        }
      } else {
        // Add new customer
        try {
          const res = await axios.post('http://localhost:8000/api/v1/customers', payload)
          // Process the new customer data the same way as in loadCustomers
          const newCustomer = {
            ...res.data,
            id: res.data.id,
            first_name: res.data.first_name || res.data.firstName || '',
            last_name: res.data.last_name || res.data.lastName || '',
            name: res.data.name || `${res.data.first_name || res.data.firstName || ''} ${res.data.last_name || res.data.lastName || ''}`.trim(),
            email: res.data.email || '',
            phone: res.data.phone || '',
            address: res.data.address || '',
            gender: res.data.gender || '',
            notes: res.data.notes || '',
            createdAt: res.data.created_at ? new Date(res.data.created_at) : (res.data.createdAt ? new Date(res.data.createdAt) : null),
            updatedAt: res.data.updated_at ? new Date(res.data.updated_at) : (res.data.updatedAt ? new Date(res.data.updatedAt) : null)
          }
          this.customers.push(newCustomer)
          this.showCustomerForm = false
          this.editingCustomer = null
          Swal.fire({ icon: "success", title: "Saved", text: "Customer added successfully!", timer: 2000, showConfirmButton: false })
        } catch (error) {
          if (error.response && error.response.status === 422) {
            // Validation error
            const errors = error.response.data.errors
            if (errors.email) {
              Swal.fire({ icon: "error", title: "Email Exists", text: errors.email[0] })
            } else {
              Swal.fire({ icon: "error", title: "Validation Error", text: Object.values(errors).flat()[0] })
            }
          } else {
            Swal.fire({ icon: "error", title: "Error", text: "Error adding customer." })
          }
        }
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
            await axios.delete(`http://localhost:8000/api/v1/customers/${customerId}`)
            this.customers = this.customers.filter(c => c.id !== customerId)
            Swal.fire({ icon: "success", title: "Deleted", text: "Customer deleted successfully!", timer: 2000, showConfirmButton: false })
          } catch (error) {
            Swal.fire({ icon: "error", title: "Error", text: "Error deleting customer." })
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


<style scoped>
.customer-list {
  padding: 1rem;
  max-width: 1200px;
  /* margin: 0 auto; */
  /* height: 100% !important; */
  width: 100%;
  
  /* margin-top: 50px; */
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h2 {
  color: #2c3e50;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.search-wrapper {
  flex: 1;
}

.search-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  width: 100%;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.btn-primary {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
  white-space: nowrap;
  flex: 1;
  min-width: fit-content;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .header-actions {
    flex-direction: row;
  }

  .search-input {
    min-width: auto;
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  .table {
    min-width: 800px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.25rem !important;
  }
  
  .btn-sm {
    width: 100%;
    margin-bottom: 0.25rem;
  }
}

@media (max-width: 576px) {
  .header h2 {
    font-size: 1.5rem;
  }
  
  .header-actions {
    flex-direction: row;
  }
  
  .btn-primary {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
  
  .search-input {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
}
</style>
<template>
  <div class="customer-list">
    <div class="header">
      <h2>Customer List</h2>
      <div class="header-actions">
        <div class="search-box">
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
      <div class="card-border mb-3 border-primary mt-4">
        <table class="table table-sm table-striped table-bordered table-hover table-responsive-sm">
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
                <td>{{ customer.name }}</td>
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
                  <div class="d-flex gap-2 justify-content-center">
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
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query)
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
          createdAt: c.created_at ? new Date(c.created_at) : null,
          updatedAt: c.updated_at ? new Date(c.updated_at) : null
        }))
      } catch (error) {
        console.error('Error loading customers:', error)
        this.customers = []
      }
    },
    async handleCustomerSave(customerData) {
      const payload = { ...customerData, name: `${customerData.first_name} ${customerData.last_name}`.trim() }

      if (this.editingCustomer) {
        // Edit customer
        try {
          const res = await axios.put(`http://localhost:8000/api/v1/customers/${this.editingCustomer.id}`, payload)
          const updatedCustomer = res.data
          const index = this.customers.findIndex(c => c.id === this.editingCustomer.id)
          if (index > -1) this.customers.splice(index, 1, updatedCustomer)
          this.showCustomerForm = false
          this.editingCustomer = null
          Swal.fire({ icon: "success", title: "Saved", text: "Customer updated successfully!", timer: 2000, showConfirmButton: false })
        } catch (error) {
          console.error('Error updating customer:', error)
          let errorMessage = "Error updating customer."
          if (error.response) {
            if (error.response.status === 404) {
              errorMessage = "Customer not found."
            } else if (error.response.status === 422) {
              // Validation error
              const errors = error.response.data.errors
              if (errors) {
                errorMessage = Object.values(errors).flat()[0]
              } else {
                errorMessage = "Validation error. Please check your input."
              }
            } else if (error.response.data && error.response.data.message) {
              errorMessage = error.response.data.message
            } else {
              errorMessage = `Server error: ${error.response.status}`
            }
          } else if (error.request) {
            errorMessage = "Network error. Please check your connection."
          }
          Swal.fire({ icon: "error", title: "Error", text: errorMessage })
        }
      } else {
        // Add new customer
        try {
          const res = await axios.post('http://localhost:8000/api/v1/customers', payload)
          this.customers.push(res.data)
          this.showCustomerForm = false
          this.editingCustomer = null
          Swal.fire({ icon: "success", title: "Saved", text: "Customer added successfully!", timer: 2000, showConfirmButton: false })
        } catch (error) {
          console.error('Error adding customer:', error)
          if (error.response && error.response.status === 422) {
            // Validation error
            const errors = error.response.data.errors
            if (errors) {
              const firstError = Object.values(errors).flat()[0]
              Swal.fire({ icon: "error", title: "Validation Error", text: firstError })
            } else {
              Swal.fire({ icon: "error", title: "Validation Error", text: "Please check your input." })
            }
          } else {
            let errorMessage = "Error adding customer."
            if (error.response) {
              if (error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message
              } else {
                errorMessage = `Server error: ${error.response.status}`
              }
            } else if (error.request) {
              errorMessage = "Network error. Please check your connection."
            }
            Swal.fire({ icon: "error", title: "Error", text: errorMessage })
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
}

.search-box {
  position: relative;
}

.search-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  min-width: 250px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
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
}

.btn-primary:hover {
  background: #2980b9;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #7f8c8d;
}

.customer-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.customer-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.customer-info h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.customer-info .email,
.customer-info .phone {
  margin: 0.25rem 0;
  color: #6c757d;
}

.customer-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f3f4;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status.active {
  background: #d4edda;
  color: #155724;
}

.status.pending {
  background: #fff3cd;
  color: #856404;
}

.date-added {
  font-size: 0.875rem;
  color: #6c757d;
}

.customer-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-secondary,
.btn-danger {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s;
}

.btn-secondary {
  background: #198754;
  color: white;
}

.btn-secondary:hover {
  background: #246534;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .header-actions {
    justify-content: space-between;
  }

  .search-input {
    min-width: auto;
    flex: 1;
  }
}

.table {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.table th {
  background: #3498db;
  color: white;
  text-align: center;
  vertical-align: middle;
}

.table td {
  vertical-align: middle;
}

.customer-row {
  cursor: pointer;
}

.customer-row:hover {
  background-color: #f8f9fa;
}

/* 
.comment.active {
    background-color: #d4edda;
    color: #155724;
    border-radius: 8px;
    padding: 0.25rem 0.5rem;
} */

.comment.pending {
  background-color: #fff3cd;
  color: #856404;
  border-radius: 8px;
  padding: 0.25rem 0.5rem;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .header-actions {
    justify-content: space-between;
  }

  .search-input {
    min-width: auto;
    flex: 1;
  }
}
</style>
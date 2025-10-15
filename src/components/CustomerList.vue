<template>
  <div class="customer-list mt-5">
    <div class="header">
      <h2>Customer List</h2>
      <div class="header-actions">
        <div class="search-box">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search customers..."
            class="search-input"
          />
        </div>
        <button @click="showCustomerForm = !showCustomerForm" class="btn-primary">
          {{ showCustomerForm ? 'Hide Form' : 'Add New Customer' }}
        </button>
      </div>
    </div>

    <!-- Customer Form -->
    <div v-if="showCustomerForm" class="mb-4">
      <CustomerForm 
        @save="handleCustomerSave"
        @cancel="showCustomerForm = false"
      />
    </div>

    <div v-if="customers.length === 0" class="empty-state">
      <p>No customers found. Add your first customer to get started!</p>
    </div>

    <div v-else class="customers-grid">
      <div 
        v-for="customer in filteredCustomers" 
        :key="customer.id" 
        class="customer-card"
        @click="selectCustomer(customer)"
      >
        <div class="customer-info">
          <h3>{{ customer.name }}</h3>
          <p class="email">{{ customer.email }}</p>
          <p class="phone">{{ customer.phone }}</p>
          <div class="customer-meta">
            <span class="status" :class="customer.status">
              {{ customer.status }}
            </span>
            <span class="date-added">
              Added {{ formatDate(customer.createdAt) }}
            </span>
          </div>
        </div>
        <div class="customer-actions">
          <button @click.stop="editCustomer(customer)" class="btn-secondary">
            Edit
          </button>
          <button @click.stop="deleteCustomer(customer.id)" class="btn-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomerForm from './CustomerForm.vue'

export default {
  name: 'CustomerList',
  components: {
    CustomerForm
  },
  data() {
    return {
      showCustomerForm: false,
      searchQuery: '',
      customers: []
    }
  },
  computed: {
    filteredCustomers() {
      if (!this.searchQuery) {
        return this.customers
      }
      
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
    selectCustomer(customer) {
      // Navigate to customer detail view or emit event
      this.$emit('customer-selected', customer)
    },
    editCustomer(customer) {
      // Open edit modal or navigate to edit page
      this.$emit('customer-edit', customer)
    },
    async deleteCustomer(customerId) {
      if (confirm('Are you sure you want to delete this customer?')) {
        const index = this.customers.findIndex(c => c.id === customerId)
        if (index > -1) {
          this.customers.splice(index, 1)
          // Also delete from local storage and queue for sync
          const { syncUtils } = await import('@/utils/sync.js')
          await syncUtils.deleteCustomer(customerId)
        }
      }
    },
    handleCustomerSave(customerData) {
      // Add new customer to the list
      const newCustomer = {
        id: Date.now(), // Simple ID generation
        ...customerData,
        status: 'active',
        createdAt: new Date()
      }
      this.customers.push(newCustomer)
      this.showCustomerForm = false
    },
    async loadCustomers() {
      try {
        const { syncUtils } = await import('@/utils/sync.js')
        const storedCustomers = syncUtils.getAllCustomers()
        
        if (storedCustomers.length > 0) {
          this.customers = storedCustomers
        } else {
          // Load sample data if no stored customers
          this.customers = [
            {
              id: 1,
              name: 'Sarah Johnson',
              email: 'sarah@email.com',
              phone: '+1 (555) 123-4567',
              status: 'active',
              createdAt: new Date('2024-01-15')
            },
            {
              id: 2,
              name: 'Michael Chen',
              email: 'michael@email.com',
              phone: '+1 (555) 987-6543',
              status: 'pending',
              createdAt: new Date('2024-01-20')
            }
          ]
        }
      } catch (error) {
        console.error('Error loading customers:', error)
        // Fallback to sample data
        this.customers = [
          {
            id: 1,
            name: 'Sarah Johnson',
            email: 'sarah@email.com',
            phone: '+1 (555) 123-4567',
            status: 'active',
            createdAt: new Date('2024-01-15')
          }
        ]
      }
    },
    formatDate(date) {
      // Handle invalid dates more robustly
      if (!date) {
        return 'Invalid Date'
      }
      
      // Try to create a Date object
      const dateObj = new Date(date)
      
      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        return 'Invalid Date'
      }
      
      try {
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }).format(dateObj)
      } catch (error) {
        // Fallback to basic formatting if Intl fails
        return dateObj.toLocaleDateString()
      }
    }
  }
}
</script>

<style scoped>
.customer-list {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.customer-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
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
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
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
</style>
<template>
  <div class="customer-list">
    <div class="header">
      <h2>Customer List</h2>
      <button @click="showAddCustomer = true" class="btn-primary">
        Add New Customer
      </button>
    </div>

    <div v-if="customers.length === 0" class="empty-state">
      <p>No customers found. Add your first customer to get started!</p>
    </div>

    <div v-else class="customers-grid">
      <div 
        v-for="customer in customers" 
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

    <!-- Add Customer Modal -->
    <div v-if="showAddCustomer" class="modal-overlay" @click="showAddCustomer = false">
      <div class="modal" @click.stop>
        <CustomerForm 
          @save="handleCustomerSave"
          @cancel="showAddCustomer = false"
        />
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
      showAddCustomer: false,
      customers: []
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
      this.showAddCustomer = false
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
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date)
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

.btn-primary {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #2980b9;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #7f8c8d;
}

.customers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}
</style>

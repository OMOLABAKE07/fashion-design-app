<template>
  <div class="customers-page mt-5">
    <div class="page-header">
      <h2>Customer Management</h2>
     
    </div>
    
    <div v-if="showCustomerForm" class="form-section">
      <CustomerForm @save="handleCustomerSave" @cancel="showCustomerForm = false" />
    </div>
    
    <div class="list-section">
      <CustomerList 
        @customer-selected="handleCustomerSelected"
        @customer-edit="handleCustomerEdit"
      />
    </div>
  </div>
</template>

<script>
import CustomerForm from '@/components/CustomerForm.vue'
import CustomerList from '@/components/CustomerList.vue'
import { syncUtils } from '@/utils/sync.js'

export default {
  name: 'Customers',
  components: {
    CustomerForm,
    CustomerList
  },
  data() {
    return {
      showCustomerForm: false
    }
  },
  methods: {
    async handleCustomerSave(customerData) {
      try {
        // Add new customer to storage
        const newCustomer = await syncUtils.saveCustomer({
          ...customerData,
          name: `${customerData.firstName} ${customerData.lastName}`.trim(),
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })

        if (newCustomer) {
          console.log('Customer saved successfully:', newCustomer)
          // Emit event or update local state if needed
          this.$emit('customer-added', newCustomer)
        } else {
          console.error('Failed to save customer')
        }
      } catch (error) {
        console.error('Error saving customer:', error)
      }
      
      this.showCustomerForm = false
    },
    handleCustomerSelected(customer) {
      console.log('Customer selected:', customer)
      // Store selected customer in localStorage and navigate to measurements
      localStorage.setItem('selectedCustomer', JSON.stringify(customer))
      this.$router.push('/measurements')
    },
    handleCustomerEdit(customer) {
      console.log('Edit customer:', customer)
    }
  }
}
</script>

<style scoped>
.customers-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 50px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
}

.page-header h2 {
  color: #2c3e50;
  margin: 0;
  font-size: 1.8rem;
}

.form-section {
  margin-bottom: 2rem;
}

.list-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s;
  background: #3498db;
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
}

@media (max-width: 768px) {
  .customers-page {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
<template>
  <div class="measurements-page">
    <div class="page-header">
      <h2>Measurement Management</h2>
      <div v-if="selectedCustomer" class="selected-customer">
        Selected: <strong>{{ selectedCustomer.name }}</strong>
      </div>
    </div>
    
    <div class="measurement-section">
      <MeasurementForm 
        :customer="selectedCustomer"
        :measurement="editingMeasurement"
        @save="handleMeasurementSave"
        @cancel="editingMeasurement = null"
        @edit="editingMeasurement = $event"
        @delete="handleMeasurementDelete"
        @customer-selected="handleCustomerSelected"
      />
    </div>
  </div>
</template>

<script>
import MeasurementForm from '@/components/MeasurementForm.vue'
import { syncUtils } from '@/utils/sync.js'

export default {
  name: 'Measurements',
  components: {
    MeasurementForm
  },
  data() {
    return {
      selectedCustomer: null,
      editingMeasurement: null
    }
  },
  mounted() {
    // Load selected customer from localStorage
    this.loadSelectedCustomer()
  },
  methods: {
    loadSelectedCustomer() {
      // Load selected customer from localStorage
      const storedCustomer = localStorage.getItem('selectedCustomer')
      if (storedCustomer) {
        try {
          this.selectedCustomer = JSON.parse(storedCustomer)
        } catch (error) {
          console.error('Error parsing stored customer:', error)
          this.selectedCustomer = null
        }
        
      }
      
    },
    
    handleCustomerSelected(customer) {
      this.selectedCustomer = customer
      // Store selected customer in localStorage
      localStorage.setItem('selectedCustomer', JSON.stringify(customer))
    },
    handleMeasurementSave(measurementData) {
      // console.log('Measurement saved:', measurementData)
      this.editingMeasurement = null
    },
    handleMeasurementDelete(measurementId) {
      // console.log('Delete measurement:', measurementId)
    }
  }
}
</script>

<style scoped>
.measurements-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
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

.selected-customer {
  color: #6c757d;
  font-size: 1rem;
}

.measurement-section {
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
  text-decoration: none;
  display: inline-block;
}

.btn-primary:hover {
  background: #2980b9;
  text-decoration: none;
}

@media (max-width: 768px) {
  .measurements-page {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
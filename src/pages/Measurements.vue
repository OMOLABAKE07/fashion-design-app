<template>
  <div class="measurements-page">
    <div class="page-header">
      <h2>Measurement Management</h2>
      <div v-if="selectedCustomer" class="selected-customer">
        Selected: <strong>{{ selectedCustomer.name }}</strong>
      </div>
    </div>
    
    <div v-if="!selectedCustomer" class="no-selection">
      <div class="no-selection-content">
        <h3>Select a Customer First</h3>
        <p>Please select a customer from the Customers page to record or view their measurements.</p>
        <router-link to="/customers" class="btn-primary">
          Go to Customers
        </router-link>
      </div>
    </div>
    
    <div v-else class="measurement-section">
      <MeasurementForm 
        :customer="selectedCustomer"
        :measurement="editingMeasurement"
        @save="handleMeasurementSave"
        @cancel="editingMeasurement = null"
        @edit="editingMeasurement = $event"
        @delete="handleMeasurementDelete"
      />
    </div>
  </div>
</template>

<script>
import MeasurementForm from '@/components/MeasurementForm.vue'

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
    // Load selected customer from localStorage or route params
    this.loadSelectedCustomer()
  },
  methods: {
    loadSelectedCustomer() {
      // In a real app, this would load from store or route params
      // For now, we'll use sample data
      this.selectedCustomer = {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah@email.com',
        phone: '+1 (555) 123-4567'
      }
    },
    handleMeasurementSave(measurementData) {
      console.log('Measurement saved:', measurementData)
      this.editingMeasurement = null
    },
    handleMeasurementDelete(measurementId) {
      console.log('Delete measurement:', measurementId)
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

.no-selection {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.no-selection-content {
  text-align: center;
  color: #6c757d;
}

.no-selection-content h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
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
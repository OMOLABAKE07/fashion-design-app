<template>
  <div class="measurement-form">
    <div class="form-header">
      <h3>{{ isEditing ? 'Update Measurements' : 'Record New Measurements' }}</h3>
      <p class="customer-info" v-if="customer">
        For: <strong class="text-success">{{ customer.name }}</strong>
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="form">
      <!-- Top Measurements Section -->
      <div class="measurement-section">
        <h4>Top Measurements</h4>
        <div class="measurement-grid">
          <div class="measurement-group">
            <label for="agbadaLength">Agbada Length (inches)</label>
            <input
              type="number"
              id="agbadaLength"
              v-model="formData.agbadaLength"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
          <div class="measurement-group">
            <label for="topLength">Top Length (inches)</label>
            <input
              type="number"
              id="topLength"
              v-model="formData.topLength"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
          <div class="measurement-group">
            <label for="kaftanLength">Kaftan Length (inches)</label>
            <input
              type="number"
              id="kaftanLength"
              v-model="formData.kaftanLength"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
          <div class="measurement-group">
            <label for="jalamiaLength">Jalamia Length (inches)</label>
            <input
              type="number"
              id="jalamiaLength"
              v-model="formData.jalamiaLength"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
          <div class="measurement-group">
            <label for="shirtLength">Shirt Length (inches)</label>
            <input
              type="number"
              id="shirtLength"
              v-model="formData.shirtLength"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
          <div class="measurement-group">
            <label for="shoulder">Shoulder (inches)</label>
            <input
              type="number"
              id="shoulder"
              v-model="formData.shoulder"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
          <div class="measurement-group">
            <label for="neck">Neck (inches)</label>
            <input
              type="number"
              id="neck"
              v-model="formData.neck"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
          <div class="measurement-group">
            <label for="chest">Chest (inches)</label>
            <input
              type="number"
              id="chest"
              v-model="formData.chest"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
          <div class="measurement-group">
            <label for="bustUpperChest">Bust/Upper Chest (inches)</label>
            <input
              type="number"
              id="bustUpperChest"
              v-model="formData.bustUpperChest"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
          <div class="measurement-group">
            <label for="stomach">Stomach (inches)</label>
            <input
              type="number"
              id="stomach"
              v-model="formData.stomach"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
          <div class="measurement-group">
            <label for="capSize">Cap Size (inches)</label>
            <input
              type="number"
              id="capSize"
              v-model="formData.capSize"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <!-- Sleeve Measurements Section -->
      <div class="measurement-section">
        <h4>Sleeve Measurements</h4>
        <div class="measurement-grid">
          <div class="measurement-group">
            <label for="longSleeve">Long Sleeve (inches)</label>
            <input
              type="number"
              id="longSleeve"
              v-model="formData.longSleeve"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
          <div class="measurement-group">
            <label for="shortSleeve">Short Sleeve (inches)</label>
            <input
              type="number"
              id="shortSleeve"
              v-model="formData.shortSleeve"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
          <div class="measurement-group">
            <label for="threeQuarterSleeve">3/4 Sleeve (inches)</label>
            <input
              type="number"
              id="threeQuarterSleeve"
              v-model="formData.threeQuarterSleeve"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
          <div class="measurement-group">
            <label for="roundSleeve">Round Sleeve (inches)</label>
            <input
              type="number"
              id="roundSleeve"
              v-model="formData.roundSleeve"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
          <div class="measurement-group">
            <label for="biceps">Biceps (inches)</label>
            <input
              type="number"
              id="biceps"
              v-model="formData.biceps"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
          <div class="measurement-group">
            <label for="elbow">Elbow (inches)</label>
            <input
              type="number"
              id="elbow"
              v-model="formData.elbow"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
          <div class="measurement-group">
            <label for="wrist">Wrist (inches)</label>
            <input
              type="number"
              id="wrist"
              v-model="formData.wrist"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <!-- Trouser Measurements Section -->
      <div class="measurement-section">
        <h4>Trouser Measurements</h4>
        <div class="measurement-grid">
          <div class="measurement-group">
            <label for="trouserLength">Trouser Length (inches)</label>
            <input
              type="number"
              id="trouserLength"
              v-model="formData.trouserLength"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
          <div class="measurement-group">
            <label for="waist">Waist (inches)</label>
            <input
              type="number"
              id="waist"
              v-model="formData.waist"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
          <div class="measurement-group">
            <label for="hip">Hip (inches)</label>
            <input
              type="number"
              id="hip"
              v-model="formData.hip"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
          <div class="measurement-group">
            <label for="thigh">Thigh (inches)</label>
            <input
              type="number"
              id="thigh"
              v-model="formData.thigh"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
          <div class="measurement-group">
            <label for="knee">Knee (inches)</label>
            <input
              type="number"
              id="knee"
              v-model="formData.knee"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
          <div class="measurement-group">
            <label for="inseam">Inseam (inches)</label>
            <input
              type="number"
              id="inseam"
              v-model="formData.inseam"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
          <div class="measurement-group">
            <label for="outseam">Outseam (inches)</label>
            <input
              type="number"
              id="outseam"
              v-model="formData.outseam"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
          <div class="measurement-group">
            <label for="ankle">Ankle (inches)</label>
            <input
              type="number"
              id="ankle"
              v-model="formData.ankle"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
          <div class="measurement-group">
            <label for="crotch">Crotch (inches)</label>
            <input
              type="number"
              id="crotch"
              v-model="formData.crotch"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
          <div class="measurement-group">
            <label for="calf">Calf (inches)</label>
            <input
              type="number"
              id="calf"
              v-model="formData.calf"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <!-- Additional Information -->
      <div class="measurement-section">
        <h4>Additional Information</h4>
        <div class="form-group">
          <label for="measurementDate">Measurement Date</label>
          <input
            type="date"
            id="measurementDate"
            v-model="formData.measurementDate"
            class="form-input"
            required
          />
        </div>
        <div class="form-group">
          <label for="notes">Measurement Notes</label>
          <textarea
            id="notes"
            v-model="formData.notes"
            class="form-textarea"
            rows="3"
            placeholder="Any special notes about these measurements..."
          ></textarea>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" @click="handleCancel" class="btn-secondary">
          Cancel
        </button>
        <button type="submit" class="btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Measurements' : 'Save Measurements') }}
        </button>
      </div>
    </form>

    <!-- Measurement History -->
    <div v-if="measurementHistory.length > 0" class="measurement-history">
      <h4>Measurement History</h4>
      <div class="history-list">
        <div 
          v-for="measurement in measurementHistory" 
          :key="measurement.id"
          class="history-item"
        >
          <div class="history-header">
            <span class="date">{{ formatDate(measurement.measurementDate) }}</span>
            <div class="history-actions">
              <button @click="editMeasurement(measurement)" class="btn-small">Edit</button>
              <button @click="deleteMeasurement(measurement.id)" class="btn-small btn-danger">Delete</button>
            </div>
          </div>
          <div class="measurement-summary">
            <span>Chest: {{ measurement.chest || 'N/A' }}"</span>
            <span>Waist: {{ measurement.waist || 'N/A' }}"</span>
            <span>Hips: {{ measurement.hips || 'N/A' }}"</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MeasurementForm',
  props: {
    customer: {
      type: Object,
      required: true
    },
    measurement: {
      type: Object,
      default: null
    }
  },
  emits: ['save', 'cancel', 'edit', 'delete'],
  data() {
    return {
      isSubmitting: false,
      formData: {
        // Top measurements
        agbadaLength: '',
        topLength: '',
        kaftanLength: '',
        jalamiaLength: '',
        shirtLength: '',
        shoulder: '',
        neck: '',
        chest: '',
        bustUpperChest: '',
        stomach: '',
        capSize: '',
        
        // Sleeve measurements
        longSleeve: '',
        shortSleeve: '',
        threeQuarterSleeve: '',
        roundSleeve: '',
        biceps: '',
        elbow: '',
        wrist: '',
        
        // Trouser measurements
        trouserLength: '',
        waist: '',
        hip: '',
        thigh: '',
        knee: '',
        inseam: '',
        outseam: '',
        ankle: '',
        crotch: '',
        calf: '',
        
        // Additional info
        measurementDate: new Date().toISOString().split('T')[0],
        notes: ''
      },
      measurementHistory: [
        // Sample data - in a real app this would come from a store/API
        {
          id: 1,
          measurementDate: '2024-01-15',
          chest: '38.5',
          waist: '32',
          hip: '40',
          shoulder: '16',
          notes: 'Initial measurements'
        },
        {
          id: 2,
          measurementDate: '2024-01-10',
          chest: '38',
          waist: '31.5',
          hip: '39.5',
          shoulder: '15.75',
          notes: 'First fitting'
        }
      ]
    }
  },
  computed: {
    isEditing() {
      return this.measurement !== null
    }
  },
  watch: {
    measurement: {
      handler(newMeasurement) {
        if (newMeasurement) {
          this.formData = {
            // Top measurements
            agbadaLength: newMeasurement.agbadaLength || '',
            topLength: newMeasurement.topLength || '',
            kaftanLength: newMeasurement.kaftanLength || '',
            jalamiaLength: newMeasurement.jalamiaLength || '',
            shirtLength: newMeasurement.shirtLength || '',
            shoulder: newMeasurement.shoulder || '',
            neck: newMeasurement.neck || '',
            chest: newMeasurement.chest || '',
            bustUpperChest: newMeasurement.bustUpperChest || '',
            stomach: newMeasurement.stomach || '',
            capSize: newMeasurement.capSize || '',
            
            // Sleeve measurements
            longSleeve: newMeasurement.longSleeve || '',
            shortSleeve: newMeasurement.shortSleeve || '',
            threeQuarterSleeve: newMeasurement.threeQuarterSleeve || '',
            roundSleeve: newMeasurement.roundSleeve || '',
            biceps: newMeasurement.biceps || '',
            elbow: newMeasurement.elbow || '',
            wrist: newMeasurement.wrist || '',
            
            // Trouser measurements
            trouserLength: newMeasurement.trouserLength || '',
            waist: newMeasurement.waist || '',
            hip: newMeasurement.hip || '',
            thigh: newMeasurement.thigh || '',
            knee: newMeasurement.knee || '',
            inseam: newMeasurement.inseam || '',
            outseam: newMeasurement.outseam || '',
            ankle: newMeasurement.ankle || '',
            crotch: newMeasurement.crotch || '',
            calf: newMeasurement.calf || '',
            
            // Additional info
            measurementDate: newMeasurement.measurementDate || new Date().toISOString().split('T')[0],
            notes: newMeasurement.notes || ''
          }
        } else {
          this.resetForm()
        }
      },
      immediate: true
    }
  },
  methods: {
    async handleSubmit() {
      this.isSubmitting = true
      
      try {
        // Validate required fields
        if (!this.formData.measurementDate) {
          alert('Please select a measurement date')
          return
        }

        // Prepare measurement data
        const measurementData = {
          ...this.formData,
          customerId: this.customer.id,
          id: this.measurement?.id || null,
          createdAt: this.measurement?.createdAt || new Date(),
          updatedAt: new Date()
        }

        // Convert string values to numbers for numeric fields
        const numericFields = [
          // Top measurements
          'agbadaLength', 'topLength', 'kaftanLength', 'jalamiaLength', 'shirtLength',
          'shoulder', 'neck', 'chest', 'bustUpperChest', 'stomach', 'capSize',
          
          // Sleeve measurements
          'longSleeve', 'shortSleeve', 'threeQuarterSleeve', 'roundSleeve',
          'biceps', 'elbow', 'wrist',
          
          // Trouser measurements
          'trouserLength', 'waist', 'hip', 'thigh', 'knee', 'inseam',
          'outseam', 'ankle', 'crotch', 'calf'
        ]
        
        numericFields.forEach(field => {
          if (measurementData[field]) {
            measurementData[field] = parseFloat(measurementData[field])
          }
        })

        // Emit save event with measurement data
        this.$emit('save', measurementData)
        
        // Reset form after successful save
        if (!this.isEditing) {
          this.resetForm()
        }
      } catch (error) {
        console.error('Error saving measurements:', error)
        alert('Error saving measurements. Please try again.')
      } finally {
        this.isSubmitting = false
      }
    },
    handleCancel() {
      this.$emit('cancel')
    },
    resetForm() {
      this.formData = {
        // Top measurements
        agbadaLength: '',
        topLength: '',
        kaftanLength: '',
        jalamiaLength: '',
        shirtLength: '',
        shoulder: '',
        neck: '',
        chest: '',
        bustUpperChest: '',
        stomach: '',
        capSize: '',
        
        // Sleeve measurements
        longSleeve: '',
        shortSleeve: '',
        threeQuarterSleeve: '',
        roundSleeve: '',
        biceps: '',
        elbow: '',
        wrist: '',
        
        // Trouser measurements
        trouserLength: '',
        waist: '',
        hip: '',
        thigh: '',
        knee: '',
        inseam: '',
        outseam: '',
        ankle: '',
        crotch: '',
        calf: '',
        
        // Additional info
        measurementDate: new Date().toISOString().split('T')[0],
        notes: ''
      }
    },
    editMeasurement(measurement) {
      this.$emit('edit', measurement)
    },
    deleteMeasurement(measurementId) {
      if (confirm('Are you sure you want to delete this measurement record?')) {
        this.$emit('delete', measurementId)
      }
    },
    formatDate(dateString) {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(new Date(dateString))
    }
  }
}
</script>

<style scoped>
.measurement-form {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.form-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
}

.form-header h3 {
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.customer-info {
  color: #6c757d;
  margin: 0;
  font-size: 1rem;
}

.measurement-section {
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.measurement-section h4 {
  color: #2c3e50;
  margin: 0 0 1.5rem 0;
  font-size: 1.2rem;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 0.5rem;
}

.measurement-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.measurement-group {
  display: flex;
  flex-direction: column;
}

.measurement-group label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.measurement-input {
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
  background: #fff;
  text-align: right;
}

.measurement-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
}

.form-group label {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-input,
.form-textarea {
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
  background: #fff;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e9ecef;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2980b9;
}

.btn-primary:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.measurement-history {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #e9ecef;
}

.measurement-history h4 {
  color: #2c3e50;
  margin: 0 0 1.5rem 0;
  font-size: 1.2rem;
}

.history-item {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.date {
  font-weight: 600;
  color: #2c3e50;
}

.history-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-small {
  padding: 0.25rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s;
}

.btn-small:not(.btn-danger) {
  background: #6c757d;
  color: white;
}

.btn-small:not(.btn-danger):hover {
  background: #5a6268;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.measurement-summary {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #6c757d;
}

@media (max-width: 768px) {
  .measurement-grid {
    grid-template-columns: 1fr;
  }
  
  .measurement-form {
    padding: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .history-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .measurement-summary {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>
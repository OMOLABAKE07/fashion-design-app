<template>
  <div class="measurement-form">
    <div class="form-header">
      <h3>{{ isEditing ? 'Update Measurements' : 'Record New Measurements' }}</h3>
      <p class="customer-info" v-if="customer">
        For: <strong>{{ customer.name }}</strong>
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="form">
      <!-- Category Filter -->
      <div class="category-filter">
        <h4>Filter by Category</h4>
        <div class="filter-dropdown">
          <select v-model="activeCategory" class="category-select">
            <option value="">Select a Category</option>
            <option value="all">All Categories</option>
            <option value="agbada">Agbada Measurements</option>
            <option value="top">Top Measurements</option>
            <option value="sleeve">Sleeve Measurements</option>
            <option value="trouser">Trouser Measurements</option>
          </select>
        </div>
      </div>

      <!-- Alert as requested by user -->
      <div class="alert alert-info" v-if="activeCategory === ''">
        <p>You have not yet select a category , kindly select a category</p>
      </div>

      <!-- Agbada Measurements Section -->
      <div class="measurement-section" v-if="activeCategory !== '' && (activeCategory === 'all' || activeCategory === 'agbada')">
        <h4>Agbada Measurements</h4>
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
            <label for="agbadaShoulder">Agbada Shoulder (inches)</label>
            <input
              type="number"
              id="agbadaShoulder"
              v-model="formData.agbadaShoulder"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
          <div class="measurement-group">
            <label for="agbadaChest">Agbada Chest (inches)</label>
            <input
              type="number"
              id="agbadaChest"
              v-model="formData.agbadaChest"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
          <div class="measurement-group">
            <label for="agbadaSleeve">Agbada Sleeve (inches)</label>
            <input
              type="number"
              id="agbadaSleeve"
              v-model="formData.agbadaSleeve"
              step="0.25"
              min="0"
              class="measurement-input"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <!-- Top Measurements Section -->
      <div class="measurement-section" v-if="activeCategory !== '' && (activeCategory === 'all' || activeCategory === 'top')">
        <h4>Top Measurements</h4>
        <div class="measurement-grid">
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
      <div class="measurement-section" v-if="activeCategory !== '' && (activeCategory === 'all' || activeCategory === 'sleeve')">
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
      <div class="measurement-section" v-if="activeCategory !== '' && (activeCategory === 'all' || activeCategory === 'trouser')">
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
      <div class="measurement-section" v-if="activeCategory !== ''">
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

      <div class="form-actions" v-if="activeCategory !== ''">
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
            <span>Category: {{ getCategoryName(measurement.category) }}</span>
            <span v-if="measurement.chest">Chest: {{ measurement.chest }}</span>
            <span v-if="measurement.waist">Waist: {{ measurement.waist }}</span>
            <span v-if="measurement.hip">Hip: {{ measurement.hip }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Measurement Edit Modal -->
    <MeasurementModal 
      :is-visible="showEditModal"
      :measurement="measurementToEdit"
      @close="showEditModal = false"
      @save="saveEditedMeasurement"
    />
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import MeasurementModal from './MeasurementModal.vue'

export default {
  name: 'MeasurementForm',
  components: {
    MeasurementModal
  },
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
      activeCategory: '',
      showEditModal: false,
      measurementToEdit: null,
      formData: {
        // Agbada measurements
        agbadaLength: '',
        agbadaShoulder: '',
        agbadaChest: '',
        agbadaSleeve: '',
        
        // Top measurements
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
        measurementDate: '',
        notes: ''
      },
      measurementHistory: []
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
            // Agbada measurements
            agbadaLength: newMeasurement.agbadaLength || '',
            agbadaShoulder: newMeasurement.agbadaShoulder || '',
            agbadaChest: newMeasurement.agbadaChest || '',
            agbadaSleeve: newMeasurement.agbadaSleeve || '',
            
            // Top measurements
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
  mounted() {
    // Load measurement history from localStorage when component mounts
    this.loadMeasurementHistory()
  },
  methods: {
    getCategoryName(category) {
      // Handle empty category
      if (!category) {
        return 'No Category Selected'
      }
      
      const categoryNames = {
        'agbada': 'Agbada',
        'top': 'Top',
        'sleeve': 'Sleeve',
        'trouser': 'Trouser',
        'all': 'All Categories'
      }
      return categoryNames[category] || category
    },
    loadMeasurementHistory() {
      try {
        const storedHistory = localStorage.getItem(`measurementHistory_${this.customer.id}`)
        if (storedHistory) {
          this.measurementHistory = JSON.parse(storedHistory)
        }
      } catch (error) {
        console.error('Error loading measurement history from localStorage:', error)
        this.measurementHistory = []
      }
    },
    saveMeasurementHistory(measurement) {
      try {
        // Get existing history or initialize empty array
        let history = []
        const storedHistory = localStorage.getItem(`measurementHistory_${this.customer.id}`)
        if (storedHistory) {
          history = JSON.parse(storedHistory)
        }
        
        // Check if measurement already exists (for updates)
        const existingIndex = history.findIndex(item => item.id === measurement.id)
        if (existingIndex !== -1) {
          // Update existing measurement
          history[existingIndex] = measurement
        } else {
          // Add new measurement
          history.unshift(measurement)
        }
        
        // Save updated history to localStorage
        localStorage.setItem(`measurementHistory_${this.customer.id}`, JSON.stringify(history))
        
        // Update local state
        this.measurementHistory = history
      } catch (error) {
        console.error('Error saving measurement history to localStorage:', error)
      }
    },
    deleteMeasurementHistory(id) {
      try {
        let history = []
        const storedHistory = localStorage.getItem(`measurementHistory_${this.customer.id}`)
        if (storedHistory) {
          history = JSON.parse(storedHistory)
        }
        
        // Remove measurement with matching ID
        history = history.filter(measurement => measurement.id !== id)
        
        // Save updated history to localStorage
        localStorage.setItem(`measurementHistory_${this.customer.id}`, JSON.stringify(history))
        
        // Update local state
        this.measurementHistory = history
      } catch (error) {
        console.error('Error deleting measurement from localStorage:', error)
      }
    },
    generateId() {
      return Date.now() + Math.floor(Math.random() * 10000)
    },
    setActiveCategory(category) {
      this.activeCategory = category;
    },
    getFieldsForCategory(category) {
      // Handle empty category
      if (!category) {
        return []
      }
      
      const fieldGroups = {
        agbada: [
          'agbadaLength', 'agbadaShoulder', 'agbadaChest', 'agbadaSleeve'
        ],
        top: [
          'topLength', 'kaftanLength', 'jalamiaLength', 'shirtLength',
          'shoulder', 'neck', 'chest', 'bustUpperChest', 'stomach', 'capSize'
        ],
        sleeve: [
          'longSleeve', 'shortSleeve', 'threeQuarterSleeve', 'roundSleeve',
          'biceps', 'elbow', 'wrist'
        ],
        trouser: [
          'trouserLength', 'waist', 'hip', 'thigh', 'knee', 'inseam',
          'outseam', 'ankle', 'crotch', 'calf'
        ]
      }
      
      return fieldGroups[category] || []
    },
    editMeasurement(measurement) {
      this.measurementToEdit = measurement
      this.showEditModal = true
    },
    saveEditedMeasurement(updatedMeasurement) {
      // Update the measurement in localStorage
      this.saveMeasurementHistory(updatedMeasurement)
      
      // Update the measurement in the current history list
      const index = this.measurementHistory.findIndex(m => m.id === updatedMeasurement.id)
      if (index !== -1) {
        this.measurementHistory.splice(index, 1, updatedMeasurement)
      }
      
      // Emit edit event
      this.$emit('edit', updatedMeasurement)
    },
    async handleSubmit() {
      this.isSubmitting = true
      
      try {
        // Validate required fields
        if (!this.formData.measurementDate) {
          alert('Please select a measurement date')
          return
        }

        // Check if a category is selected
        if (!this.activeCategory) {
          alert('Please select a category')
          return
        }

        // Prepare measurement data based on active category
        const measurementData = {
          customerId: this.customer.id,
          id: this.measurement?.id || this.generateId(),
          category: this.activeCategory,
          measurementDate: this.formData.measurementDate,
          notes: this.formData.notes,
          createdAt: this.measurement?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        // Only include fields relevant to the active category
        if (this.activeCategory === 'all') {
          // Include all fields except the additional info which is already added
          Object.keys(this.formData).forEach(key => {
            if (key !== 'measurementDate' && key !== 'notes') {
              measurementData[key] = this.formData[key]
            }
          })
        } else {
          // Include only fields for the active category
          const categoryFields = this.getFieldsForCategory(this.activeCategory)
          categoryFields.forEach(field => {
            if (this.formData[field] !== '' && this.formData[field] !== undefined) {
              measurementData[field] = this.formData[field]
            }
          })
        }

        // Convert string values to numbers for numeric fields
        const allFields = Object.keys(measurementData)
        allFields.forEach(field => {
          if (field !== 'customerId' && field !== 'id' && field !== 'category' && 
              field !== 'measurementDate' && field !== 'notes' && 
              field !== 'createdAt' && field !== 'updatedAt') {
            if (measurementData[field] !== '' && measurementData[field] !== undefined) {
              measurementData[field] = parseFloat(measurementData[field])
            }
          }
        })

        // Save to localStorage
        this.saveMeasurementHistory(measurementData)
        
        // Emit save event with measurement data
        this.$emit('save', measurementData)
        
        // Reset form after successful save (only if not editing)
        if (!this.isEditing) {
          this.resetForm()
        }
        
        // Show success message
        Swal.fire({
          icon: "success",
          title: "Saved",
          text: "Measurement saved successfully!",
          timer: 2000,
          showConfirmButton: false
        })
      } catch (error) {
        console.error('Error saving measurements:', error)
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error saving measurements. Please try again."
        })
      } finally {
        this.isSubmitting = false
      }
    },
    handleCancel() {
      this.$emit('cancel')
    },
    resetForm() {
      this.formData = {
        // Agbada measurements
        agbadaLength: '',
        agbadaShoulder: '',
        agbadaChest: '',
        agbadaSleeve: '',
        
        // Top measurements
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
        measurementDate: '',
        notes: ''
      }
    },
    deleteMeasurement(measurementId) {
      Swal.fire({
        icon: "warning",
        title: "Delete Measurement",
        text: "Are you sure you want to delete this measurement record?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
        cancelButtonColor: "#d92550",
        showCloseButton: true,
        showLoaderOnConfirm: true,
      }).then((result) => {
        if (result.value) {
          this.deleteMeasurementHistory(measurementId)
          this.$emit('delete', measurementId)
          
          Swal.fire({
            icon: "success",
            title: "Deleted",
            text: "Measurement deleted successfully!",
            timer: 2000,
            showConfirmButton: false
          })
        } else {
          Swal.fire("Cancelled", "Measurement was not deleted", "info")
        }
      })
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
  position: relative;
}

.alert {
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
}

.alert-info {
  color: #0c5460;
  background-color: #d1ecf1;
  border-color: #bee5eb;
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

.category-filter {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.category-filter h4 {
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
}

.filter-dropdown {
  display: flex;
  align-items: center;
}

.category-select {
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  min-width: 200px;
}

.category-select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
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
  background: #198754;
  color: white;
}

.btn-small:not(.btn-danger):hover {
  background: #246534;
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
  
  .category-select {
    min-width: 100%;
  }
}
</style>
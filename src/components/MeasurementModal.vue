<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ mode === 'view' ? 'View Measurement' : 'Edit Measurement' }}</h3>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="handleSave">
          <!-- Category Info -->
          <div class="category-info">
            <p><strong>Categories:</strong> {{ formatCategories(measurement.categories) }}</p>
            <p><strong>Date:</strong> {{ formatDate(measurement.measurementDate) }}</p>
          </div>

          <!-- Dynamic Fields grouped by Category -->
          <div class="measurement-fields">
            <!-- Render fields for each category -->
            <template v-for="category in measurement.categories" :key="category">
              <div class="category-section">
                <h4>{{ getCategoryName(category) }}</h4>
                <div class="category-fields">
                  <div v-for="field in getFieldsForCategory(category)" :key="field.key" class="form-group">
                    <template v-if="mode === 'view'">
                      <!-- View Mode: Show label and value -->
                      <div class="view-field">
                        <span class="field-label">{{ field.label }}:</span>
                        <span class="field-value">{{ editableMeasurement[field.key] || '-' }}</span>
                      </div>
                    </template>
                    <template v-else>
                      <!-- Edit Mode: Show form input -->
                      <label :for="field.key">{{ field.label }}</label>
                      <input :id="field.key" type="number" v-model="editableMeasurement[field.key]" step="0.25" min="0"
                        class="form-input" :placeholder="field.placeholder" />
                    </template>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- Notes -->
          <div class="form-group">
            <template v-if="mode === 'view'">
              <div class="view-field">
                <span class="field-label">Notes:</span>
                <span class="field-value">{{ editableMeasurement.notes || '-' }}</span>
              </div>
            </template>
            <template v-else>
              <label for="notes">Notes</label>
              <textarea id="notes" v-model="editableMeasurement.notes" class="form-textarea" rows="3"
                placeholder="Any special notes about these measurements..."></textarea>
            </template>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button @click="closeModal" class="btn-secondary"> {{ mode === 'view' ? 'Close' : 'Cancel' }}</button>
        <button v-if="mode === 'edit'" @click="handleSave" class="btn-primary">Save Changes</button>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'

export default {
  name: 'MeasurementModal',
  props: {
    isVisible: { type: Boolean, required: true },
    measurement: { type: Object, default: null },
    mode: { type: String, default: 'edit' }
  },
  emits: ['close', 'save'],
  data() {
    return {
      editableMeasurement: {}
    }
  },
  watch: {
    measurement: {
      handler(newMeasurement) {
        if (newMeasurement && newMeasurement.measurements) {
          this.editableMeasurement = {
            ...newMeasurement.measurements,
            notes: newMeasurement.notes || '',
            measurementDate: newMeasurement.measurementDate || ''
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
handleSave() {
  Swal.fire({
    icon: "warning",
    title: "Save Changes",
    text: "Are you sure you want to save these changes?",
    showCancelButton: true,
    confirmButtonText: "Yes, Save Changes",
    cancelButtonText: "Cancel",
    cancelButtonColor: "#d92550",
    showLoaderOnConfirm: true,
  }).then((result) => {
    if (result.isConfirmed) {
      // ✅ FIXED: CORRECT STRUCTURE FOR PARENT
      const updatedMeasurement = {
        id: this.measurement.id,
        customerId: this.measurement.customerId,
        customerName: this.measurement.customerName,
        measurementDate: this.editableMeasurement.measurementDate,
        categories: this.measurement.categories,
        notes: this.editableMeasurement.notes,
        // ✅ STEP 1: FULL MEASUREMENTS (Remove notes/date)
        measurements: Object.fromEntries(
          Object.entries(this.editableMeasurement)
            .filter(([key]) => !['notes', 'measurementDate'].includes(key))
        ),
        // ✅ STEP 2: FLATTENED FOR HISTORY DISPLAY
        chest: this.editableMeasurement.chest || '',
        waist: this.editableMeasurement.waist || '',
        bust: this.editableMeasurement.bust || '',
        shoulder: this.editableMeasurement.shoulder || ''
      }
      
      this.$emit('save', updatedMeasurement)
      this.closeModal()

      Swal.fire({
        icon: "success",
        title: "Saved",
        text: "Measurement updated successfully!",
        timer: 2000,
        showConfirmButton: false
      })
    }
  })
},
    formatDate(dateString) {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      }).format(new Date(dateString))
    },
    getCategoryName(category) {
      const categoryNames = {
        'male': 'Male Measurements',
        'female': 'Female Measurements',
        'agbada': 'Agbada Measurements', 
        'top': 'Top Measurements',
        'sleeve': 'Sleeve Measurements', 
        'trouser': 'Trouser Measurements',
        'bust': 'Bust Measurements', 
        'shoulder': 'Shoulder Measurements',
        'length': 'Length Measurements', 
        'skirt': 'Skirt Measurements',
        'gown': 'Gown Measurements'
      }
      return categoryNames[category] || category
    },
    formatCategories(categories) {
      if (!categories || categories.length === 0) return 'No Categories'
      return categories.map(cat => this.getCategoryName(cat)).join(', ')
    },
    getFieldsForCategory(category) {
      const fieldDefinitions = {
        male: [
          // Top Measurements
          { key: 'agbadaLength', label: 'Agbada Length (inches)', placeholder: '0.00' },
          { key: 'topLength', label: 'Top Length (inches)', placeholder: '0.00' },
          { key: 'kaftanLength', label: 'Kaftan Length (inches)', placeholder: '0.00' },
          { key: 'jalamiaLength', label: 'Jalamia Length (inches)', placeholder: '0.00' },
          { key: 'shirtLength', label: 'Shirt Length (inches)', placeholder: '0.00' },
          { key: 'shoulder', label: 'Shoulder (inches)', placeholder: '0.00' },
          { key: 'neck', label: 'Neck (inches)', placeholder: '0.00' },
          
          // Sleeve Measurements
          { key: 'longSleeve', label: 'Long Sleeve (inches)', placeholder: '0.00' },
          { key: 'shortSleeve', label: 'Short Sleeve (inches)', placeholder: '0.00' },
          { key: 'threeQuarterSleeve', label: '3/4 Sleeve (inches)', placeholder: '0.00' },
          { key: 'roundSleeve', label: 'Round Sleeve (inches)', placeholder: '0.00' },
          { key: 'biceps', label: 'Biceps (inches)', placeholder: '0.00' },
          { key: 'elbow', label: 'Elbow (inches)', placeholder: '0.00' },
          { key: 'wrist', label: 'Wrist (inches)', placeholder: '0.00' },
          
          // Chest Measurements
          { key: 'chest', label: 'Chest (inches)', placeholder: '0.00' },
          { key: 'bustUpperChest', label: 'Bust/Upper Chest (inches)', placeholder: '0.00' },
          { key: 'stomach', label: 'Stomach (inches)', placeholder: '0.00' },
          { key: 'capSize', label: 'Cap Size (inches)', placeholder: '0.00' },
          
          // Trouser Measurements
          { key: 'trouserLength', label: 'Trouser Length (inches)', placeholder: '0.00' },
          { key: 'waist', label: 'Waist (inches)', placeholder: '0.00' },
          { key: 'hip', label: 'Hip (inches)', placeholder: '0.00' },
          { key: 'thigh', label: 'Thigh (inches)', placeholder: '0.00' },
          { key: 'knee', label: 'Knee (inches)', placeholder: '0.00' },
          { key: 'inseam', label: 'Inseam (inches)', placeholder: '0.00' },
          { key: 'outseam', label: 'Outseam (inches)', placeholder: '0.00' },
          { key: 'ankle', label: 'Ankle (inches)', placeholder: '0.00' },
          { key: 'crotch', label: 'Crotch (inches)', placeholder: '0.00' },
          { key: 'calf', label: 'Calf (inches)', placeholder: '0.00' }
        ],
        female: [
          // Bust Measurements
          { key: 'shoulder', label: 'Shoulder (inches)', placeholder: '0.00' },
          { key: 'bust', label: 'Bust (inches)', placeholder: '0.00' },
          { key: 'shoulderToUpperBust', label: 'Shoulder to Upper Bust (inches)', placeholder: '0.00' },
          { key: 'shoulderToUnderBust', label: 'Shoulder to Under Bust (inches)', placeholder: '0.00' },
          { key: 'shoulderToNipplePoint', label: 'Shoulder to Nipple Point (inches)', placeholder: '0.00' },
          { key: 'nippleToNipple', label: 'Nipple to Nipple (inches)', placeholder: '0.00' },
          { key: 'roundUpperBust', label: 'Round Upper Bust (inches)', placeholder: '0.00' },
          { key: 'roundUnderBust', label: 'Round Under Bust (inches)', placeholder: '0.00' },
          
          // Length Measurements
          { key: 'halfLength', label: 'Half Length (inches)', placeholder: '0.00' },
          { key: 'blouseLength', label: 'Blouse Length (inches)', placeholder: '0.00' },
          
          // Sleeve Measurements
          { key: 'roundSleeve', label: 'Round Sleeve (inches)', placeholder: '0.00' },
          { key: 'biceps', label: 'Biceps (inches)', placeholder: '0.00' },
          { key: 'elbow', label: 'Elbow (inches)', placeholder: '0.00' },
          { key: 'longSleeve', label: 'Long Sleeve (inches)', placeholder: '0.00' },
          { key: 'shortSleeve', label: 'Short Sleeve (inches)', placeholder: '0.00' },
          { key: 'threeQuarterSleeve', label: '3/4 Sleeve (inches)', placeholder: '0.00' },
          
          // Skirt Measurements
          { key: 'longSkirt', label: 'Long Skirt (inches)', placeholder: '0.00' },
          { key: 'shortSkirt', label: 'Short Skirt (inches)', placeholder: '0.00' },
          { key: 'threeQuarterSkirt', label: '3/4 Skirt (inches)', placeholder: '0.00' },
          
          // Waist/Hip Measurements
          { key: 'waist', label: 'Waist (inches)', placeholder: '0.00' },
          { key: 'hips', label: 'Hips (inches)', placeholder: '0.00' },
          { key: 'waistToHipLine', label: 'Waist to Hip Line (inches)', placeholder: '0.00' },
          { key: 'waistToHip', label: 'Waist to Hip (inches)', placeholder: '0.00' },
          
          // Gown Measurements
          { key: 'longGownLength', label: 'Long Gown Length (inches)', placeholder: '0.00' },
          { key: 'shortGownLength', label: 'Short Gown Length (inches)', placeholder: '0.00' },
          { key: 'threeQuarterGownLength', label: '3/4 Gown Length (inches)', placeholder: '0.00' },
          
          // Trouser Measurements
          { key: 'trouserLength', label: 'Trouser Length (inches)', placeholder: '0.00' },
          { key: 'band', label: 'Band (inches)', placeholder: '0.00' },
          { key: 'thigh', label: 'Thigh (inches)', placeholder: '0.00' },
          { key: 'knee', label: 'Knee (inches)', placeholder: '0.00' },
          { key: 'inseam', label: 'Inseam (inches)', placeholder: '0.00' },
          { key: 'outseam', label: 'Outseam (inches)', placeholder: '0.00' },
          { key: 'ankle', label: 'Ankle (inches)', placeholder: '0.00' },
          { key: 'crotch', label: 'Crotch (inches)', placeholder: '0.00' },
          { key: 'calf', label: 'Calf (inches)', placeholder: '0.00' }
        ],
        bust: [
          { key: 'bust', label: 'Bust (inches)', placeholder: '0.00' },
          { key: 'shoulder', label: 'Shoulder (inches)', placeholder: '0.00' },
          { key: 'shoulderToUpperBust', label: 'Shoulder to Upper Bust (inches)', placeholder: '0.00' },
          { key: 'shoulderToUnderBust', label: 'Shoulder to Under Bust (inches)', placeholder: '0.00' },
          { key: 'shoulderToNipplePoint', label: 'Shoulder to Nipple Point (inches)', placeholder: '0.00' },
          { key: 'nippleToNipple', label: 'Nipple to Nipple (inches)', placeholder: '0.00' },
          { key: 'roundUpperBust', label: 'Round Upper Bust (inches)', placeholder: '0.00' },
          { key: 'roundUnderBust', label: 'Round Under Bust (inches)', placeholder: '0.00' }
        ],
        shoulder: [
          { key: 'shoulder', label: 'Shoulder (inches)', placeholder: '0.00' }
        ],
        length: [
          { key: 'halfLength', label: 'Half Length (inches)', placeholder: '0.00' },
          { key: 'blouseLength', label: 'Blouse Length (inches)', placeholder: '0.00' }
        ],
        sleeve: [
          { key: 'roundSleeve', label: 'Round Sleeve (inches)', placeholder: '0.00' },
          { key: 'biceps', label: 'Biceps (inches)', placeholder: '0.00' },
          { key: 'elbow', label: 'Elbow (inches)', placeholder: '0.00' },
          { key: 'longSleeve', label: 'Long Sleeve (inches)', placeholder: '0.00' },
          { key: 'shortSleeve', label: 'Short Sleeve (inches)', placeholder: '0.00' },
          { key: 'threeQuarterSleeve', label: '3/4 Sleeve (inches)', placeholder: '0.00' }
        ],
        skirt: [
          { key: 'longSkirt', label: 'Long Skirt (inches)', placeholder: '0.00' },
          { key: 'shortSkirt', label: 'Short Skirt (inches)', placeholder: '0.00' },
          { key: 'threeQuarterSkirt', label: '3/4 Skirt (inches)', placeholder: '0.00' }
        ],
        gown: [
          { key: 'longGownLength', label: 'Long Gown Length (inches)', placeholder: '0.00' },
          { key: 'shortGownLength', label: 'Short Gown Length (inches)', placeholder: '0.00' },
          { key: 'threeQuarterGownLength', label: '3/4 Gown Length (inches)', placeholder: '0.00' }
        ],
        trouser: [
          { key: 'trouserLength', label: 'Trouser Length (inches)', placeholder: '0.00' },
          { key: 'band', label: 'Band (inches)', placeholder: '0.00' },
          { key: 'thigh', label: 'Thigh (inches)', placeholder: '0.00' },
          { key: 'knee', label: 'Knee (inches)', placeholder: '0.00' },
          { key: 'inseam', label: 'Inseam (inches)', placeholder: '0.00' },
          { key: 'outseam', label: 'Outseam (inches)', placeholder: '0.00' },
          { key: 'ankle', label: 'Ankle (inches)', placeholder: '0.00' },
          { key: 'crotch', label: 'Crotch (inches)', placeholder: '0.00' },
          { key: 'calf', label: 'Calf (inches)', placeholder: '0.00' }
        ],
        agbada: [
          { key: 'agbadaLength', label: 'Agbada Length (inches)', placeholder: '0.00' }
        ],
        top: [
          { key: 'topLength', label: 'Top Length (inches)', placeholder: '0.00' }
        ]
      }
      return fieldDefinitions[category] || []
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  color: #2c3e50;
}

.modal-body {
  padding: 1.5rem;
}

.category-info {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  border: 1px solid #e9ecef;
}

.category-info p {
  margin: 0.25rem 0;
  color: #495057;
}

.measurement-fields {
  margin-bottom: 1.5rem;
}

.category-section {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  background: #f8f9fa;
}

.category-section h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #dee2e6;
}

.category-fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
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

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem;
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

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.view-field {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  border-bottom: 1px solid #e9ecef;
}

.field-label {
  font-weight: 600;
  color: #2c3e50;
}

.field-value {
  color: #495057;
}

@media (max-width: 768px) {
  .category-fields {
    grid-template-columns: 1fr;
  }

  .modal-content {
    width: 95%;
    margin: 20px;
  }

  .modal-footer {
    flex-direction: column;
  }
}
</style>
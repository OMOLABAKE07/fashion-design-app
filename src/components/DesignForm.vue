<template>
  <div class="design-form">
    <div class="form-header">
      <h3>{{ isEditing ? 'Update Design' : 'Create New Design' }}</h3>
      <p class="form-description">
        Upload outfit photos and add detailed design notes including fabric type, style, and important dates.
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="form">
      <!-- Basic Information -->
      <div class="form-section">
        <h4>Design Information</h4>
        <div class="form-row">
          <div class="form-group">
            <label for="designName">Design Name *</label>
            <input type="text" id="designName" v-model="formData.designName" required class="form-input"
              placeholder="Enter design name" />
          </div>
          <div class="form-group">
            <label for="customer">Customer *</label>
            <select id="customer" v-model="formData.customerId" required class="form-select">
              <option value="">Select customer...</option>
              <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                {{ customer.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="designDate">Design Date *</label>
            <input type="date" id="designDate" v-model="formData.designDate" required class="form-input" />
          </div>
          <div class="form-group">
            <label for="status">Status</label>
            <select id="status" v-model="formData.status" class="form-select">
              <option value="draft">Draft</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Photo Upload Section -->
      <div class="form-section">
        <h4>Design Photos</h4>
        <div class="photo-upload-area">
          <div class="upload-zone" @click="triggerFileUpload" @dragover.prevent @drop.prevent="handleDrop">
            <input ref="fileInput" type="file" multiple accept="image/*" @change="handleFileSelect"
              style="display: none" />
            <div class="upload-content">
              <div class="upload-icon">📸</div>
              <h5>Upload Design Photos</h5>
              <p>Click to select files or drag and drop images here</p>
              <small>Supported formats: JPG, PNG, GIF (Max 10MB each)</small>
            </div>
          </div>
        </div>

        <!-- Uploaded Photos Preview -->
        <div v-if="formData.photos.length > 0" class="photos-preview">
          <h5>Uploaded Photos ({{ formData.photos.length }})</h5>
          <div class="photos-grid">
            <div v-for="(photo, index) in formData.photos" :key="index" class="photo-item">
              <img :src="photo.preview" :alt="photo.name" class="photo-preview" />
              <div class="photo-overlay">
                <button type="button" @click="removePhoto(index)" class="btn-remove">×</button>
                <div class="photo-info">
                  <span class="photo-name">{{ photo.name }}</span>
                  <span class="photo-size">{{ formatFileSize(photo.size) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Design Details -->
      <div class="form-section">
        <h4>Design Details</h4>
        <div class="form-row">
          <div class="form-group">
            <label for="fabricType">Fabric Type</label>
            <input type="text" id="fabricType" v-model="formData.fabricType" class="form-input"
              placeholder="e.g., Silk, Cotton, Wool" />
          </div>
          <div class="form-group">
            <label for="color">Primary Color</label>
            <input type="text" id="color" v-model="formData.color" class="form-input"
              placeholder="e.g., Navy Blue, Burgundy" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="style">Style/Type</label>
            <select id="style" v-model="formData.style" class="form-select">
              <option value="">Select style...</option>
              <option value="dress">Dress</option>
              <option value="suit">Suit</option>
              <option value="jacket">Jacket</option>
              <option value="pants">Pants</option>
              <option value="shirt">Shirt</option>
              <option value="skirt">Skirt</option>
              <option value="coat">Coat</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div class="form-group">
            <label for="occasion">Occasion</label>
            <input type="text" id="occasion" v-model="formData.occasion" class="form-input"
              placeholder="e.g., Wedding, Business, Casual" />
          </div>
        </div>

        <div class="form-group">
          <label for="specialInstructions">Special Instructions</label>
          <textarea id="specialInstructions" v-model="formData.specialInstructions" class="form-textarea" rows="4"
            placeholder="Any specific requirements, modifications, or special notes..."></textarea>
        </div>
      </div>

      <!-- Important Dates -->
      <div class="form-section">
        <h4>Important Dates</h4>
        <div class="form-row">
          <div class="form-group">
            <label for="firstFitting">First Fitting Date</label>
            <input type="date" id="firstFitting" v-model="formData.firstFitting" class="form-input" />
          </div>
          <div class="form-group">
            <label for="finalFitting">Final Fitting Date</label>
            <input type="date" id="finalFitting" v-model="formData.finalFitting" class="form-input" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="completionDate">Expected Completion Date</label>
            <input type="date" id="completionDate" v-model="formData.completionDate" class="form-input" />
          </div>
          <div class="form-group">
            <label for="deliveryDate">Delivery Date</label>
            <input type="date" id="deliveryDate" v-model="formData.deliveryDate" class="form-input" />
          </div>
        </div>
      </div>

      <!-- Pricing Information -->
      <div class="form-section">
        <h4>Pricing & Notes</h4>
        <div class="form-row d-flex">
          <div class="form-group">
            <label for="estimatedPrice">Estimated Price</label>
            <div class="price-input">
              <span class="currency">$</span>
              <input type="number" id="estimatedPrice" v-model="formData.estimatedPrice" class="form-input"
                placeholder="0.00" step="0.01" min="0" />
            </div>
          </div>
          <div class="form-group">
            <label for="finalPrice">Final Price</label>
            <div class="price-input">
              <span class="currency">$</span>
              <input type="number" id="finalPrice" v-model="formData.finalPrice" class="form-input"
                placeholder="0.00" step="0.01" min="0" />
            </div>
          </div>
          <div class="form-group">
            <label for="partPayment">Part Payment</label>
            <div class="price-input">
              <span class="currency">$</span>
              <input type="number" id="partPayment" v-model="formData.partPayment" class="form-input"
                placeholder="0.00" step="0.01" min="0" />
            </div>
          </div>
          <div class="form-group">
            <label for="balance">Balance</label>
            <div class="price-input">
              <span class="currency">$</span>
              <input type="number" id="balance" v-model="formData.balance" class="form-input"
                placeholder="0.00" step="0.01" min="0" readonly />
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="notes">Additional Notes</label>
          <textarea id="notes" v-model="formData.notes" class="form-textarea" rows="3"
            placeholder="Any additional notes about this design project..."></textarea>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" @click="handleCancel" class="btn-secondary">
          Cancel
        </button>
        <button type="submit" class="btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Design' : 'Create Design') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { designAPI } from '@/services/api.js'
import Swal from 'sweetalert2'

export default {
  name: 'DesignForm',
  props: {
    design: {
      type: Object,
      default: null
    }
  },
  emits: ['save', 'cancel'],
  data() {
    return {
      isSubmitting: false,
      formData: {
        designName: '',
        customerId: '',
        designDate: new Date().toISOString().split('T')[0],
        status: 'draft',
        photos: [],
        fabricType: '',
        color: '',
        style: '',
        occasion: '',
        specialInstructions: '',
        firstFitting: '',
        finalFitting: '',
        completionDate: '',
        deliveryDate: '',
        estimatedPrice: '',
        finalPrice: '',
        partPayment: '',
        balance: '',
        notes: ''
      },
      customers: []
    }
  },
  computed: {
    isEditing() {
      return this.design !== null
    }
  },
  watch: {
    design: {
      handler(newDesign) {
        if (newDesign) {
          this.formData = {
            designName: newDesign.name || '',
            customerId: newDesign.customer_id || '',
            designDate: newDesign.design_date || new Date().toISOString().split('T')[0],
            status: newDesign.status || 'draft',
            photos: newDesign.photos || [],
            fabricType: newDesign.fabric_type || '',
            color: newDesign.color || '',
            style: newDesign.style || '',
            occasion: newDesign.occasion || '',
            specialInstructions: newDesign.special_instructions || '',
            firstFitting: newDesign.first_fitting || '',
            finalFitting: newDesign.final_fitting || '',
            completionDate: newDesign.completion_date || '',
            deliveryDate: newDesign.delivery_date || '',
            estimatedPrice: newDesign.estimated_price || '',
            finalPrice: newDesign.final_price || '',
            partPayment: newDesign.part_payment || '',
            balance: newDesign.balance || '',
            notes: newDesign.notes || ''
          }
        } else {
          this.resetForm()
        }
      },
      immediate: true
    },

    // 💰 Auto-calculate balance whenever price fields change
    'formData.finalPrice': 'calculateBalance',
    'formData.partPayment': 'calculateBalance'
  },
  mounted() {
    this.loadCustomers()
  },
  methods: {
    calculateBalance() {
      const finalPrice = parseFloat(this.formData.finalPrice) || 0
      const partPayment = parseFloat(this.formData.partPayment) || 0
      const balance = finalPrice - partPayment
      this.formData.balance = balance > 0 ? balance.toFixed(2) : '0.00'
    },

    async loadCustomers() {
      try {
        const response = await fetch(`${process.env.BASE_URL}customers`)
        const result = await response.json()
        this.customers = result.data || result
      } catch (error) {
        console.error('Error loading customers:', error)
        this.customers = []
      }
    },

    async handleSubmit() {
      this.isSubmitting = true

      try {
        if (!this.formData.designName || !this.formData.customerId || !this.formData.designDate) {
          Swal.fire({
            icon: 'warning',
            title: 'Missing Required Fields',
            text: 'Please fill in all required fields (Design Name, Customer, and Design Date)'
          })
          return
        }

        let result
        const formData = new FormData()
        formData.append('name', this.formData.designName)
        formData.append('customer_id', this.formData.customerId)
        formData.append('status', this.formData.status)
        formData.append('design_date', this.formData.designDate)

        // Add optional fields if they exist
        const fields = [
          'description', 'fabricType', 'color', 'style', 'occasion', 'specialInstructions',
          'firstFitting', 'finalFitting', 'completionDate', 'deliveryDate',
          'estimatedPrice', 'finalPrice', 'partPayment', 'balance', 'notes'
        ]
        fields.forEach(field => {
          const key = field.replace(/[A-Z]/g, m => '_' + m.toLowerCase())
          if (this.formData[field]) formData.append(key, this.formData[field])
        })

        this.formData.photos.forEach(photo => {
          if (photo.file) formData.append('photos[]', photo.file)
        })

        result = this.isEditing
          ? await designAPI.update(this.design.id, formData)
          : await designAPI.create(formData)

        this.$emit('save', result.data || result)
        window.dispatchEvent(new CustomEvent('design-saved', { detail: result.data || result }))

        if (!this.isEditing) this.resetForm()

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Design ${this.isEditing ? 'updated' : 'created'} successfully!`,
          timer: 2000,
          showConfirmButton: false
        })
      } catch (error) {
        console.error('Error saving design:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error ${this.isEditing ? 'updating' : 'creating'} design. Please try again.`
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
        designName: '',
        customerId: '',
        designDate: new Date().toISOString().split('T')[0],
        status: 'draft',
        photos: [],
        fabricType: '',
        color: '',
        style: '',
        occasion: '',
        specialInstructions: '',
        firstFitting: '',
        finalFitting: '',
        completionDate: '',
        deliveryDate: '',
        estimatedPrice: '',
        finalPrice: '',
        partPayment: '',
        balance: '',
        notes: ''
      }
      if (this.$refs.fileInput) this.$refs.fileInput.value = ''
    },

    triggerFileUpload() {
      this.$refs.fileInput.click()
    },

    handleFileSelect(event) {
      const files = Array.from(event.target.files)
      this.processFiles(files)
    },

    handleDrop(event) {
      const files = Array.from(event.dataTransfer.files)
      this.processFiles(files)
    },

    processFiles(files) {
      files.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (e) => {
            const photo = {
              name: file.name,
              size: file.size,
              type: file.type,
              file,
              preview: e.target.result
            }
            this.formData.photos.push(photo)
          }
          reader.readAsDataURL(file)
        }
      })
    },

    removePhoto(index) {
      this.formData.photos.splice(index, 1)
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }
  }
}
</script>


<style scoped>
.design-form {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

.form-description {
  color: #6c757d;
  margin: 0;
  line-height: 1.6;
}

.form-section {
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.form-section h4 {
  color: #2c3e50;
  margin: 0 0 1.5rem 0;
  font-size: 1.2rem;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-input,
.form-select,
.form-textarea {
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
  background: #fff;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.price-input {
  position: relative;
  display: flex;
  align-items: center;
}

.currency {
  position: absolute;
  left: 0.75rem;
  color: #6c757d;
  font-weight: 600;
  z-index: 1;
}

.price-input .form-input {
  padding-left: 2rem;
}

.photo-upload-area {
  margin-bottom: 2rem;
}

.upload-zone {
  border: 2px dashed #3498db;
  border-radius: 8px;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #f8f9ff;
}

.upload-zone:hover {
  border-color: #2980b9;
  background: #f0f4ff;
}

.upload-content h5 {
  color: #2c3e50;
  margin: 1rem 0 0.5rem 0;
  font-size: 1.2rem;
}

.upload-content p {
  color: #6c757d;
  margin: 0 0 0.5rem 0;
}

.upload-content small {
  color: #adb5bd;
}

.upload-icon {
  font-size: 3rem;
}

.photos-preview {
  margin-top: 1.5rem;
}

.photos-preview h5 {
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.photo-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.photo-preview {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s;
}

.photo-item:hover .photo-overlay {
  opacity: 1;
}

.btn-remove {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  align-self: flex-end;
}

.photo-info {
  color: white;
  font-size: 0.8rem;
}

.photo-name {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.25rem;
}

.photo-size {
  opacity: 0.8;
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

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .design-form {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .photos-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
</style>
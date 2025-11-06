<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ mode === 'view' ? 'View Design' : 'Edit Design' }}</h3>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="handleSave" v-if="mode === 'edit'">
          <!-- Photo Upload Section -->
          <div class="form-section">
            <h4>Design Photos</h4>
            <div class="photo-upload-area">
              <div class="upload-zone" @click="triggerFileUpload" @dragover.prevent @drop.prevent="handleDrop">
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  accept="image/*"
                  @change="handleFileSelect"
                  style="display: none"
                />
                <div class="upload-content">
                  <div class="upload-icon">📸</div>
                  <h5>Upload Design Photos</h5>
                  <p>Click to select files or drag and drop images here</p>
                  <small>Supported formats: JPG, PNG, GIF (Max 10MB each)</small>
                </div>
              </div>
            </div>

            <!-- Uploaded Photos Preview -->
            <div v-if="editableDesign.photos && editableDesign.photos.length > 0" class="photos-preview">
              <h5>Uploaded Photos ({{ editableDesign.photos.length }})</h5>
              <div class="photos-grid">
                <div
                  v-for="(photo, index) in editableDesign.photos"
                  :key="index"
                  class="photo-item"
                  @click="openImageModal(photo.preview || photo.url)"
                >
                  <img :src="photo.preview || photo.url" :alt="photo.name" class="photo-preview" />
                  <div class="photo-overlay">
                    <button type="button" @click.stop="removePhoto(index)" class="btn-remove">
                      ×
                    </button>
                    <div class="photo-info">
                      <span class="photo-name">{{ photo.name }}</span>
                      <span class="photo-size">{{ formatFileSize(photo.size) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Basic Information -->
          <div class="form-section">
            <h4>Design Information</h4>
            <div class="form-row">
              <div class="form-group">
                <label for="designName">Design Name *</label>
                <input
                  type="text"
                  id="designName"
                  v-model="editableDesign.designName"
                  required
                  class="form-input"
                  placeholder="Enter design name"
                />
              </div>
              <div class="form-group">
                <label for="customer">Customer *</label>
                <select id="customer" v-model="editableDesign.customerId" required class="form-select">
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
                <input
                  type="date"
                  id="designDate"
                  v-model="editableDesign.designDate"
                  required
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label for="status">Status</label>
                <select id="status" v-model="editableDesign.status" class="form-select">
                  <option value="draft">Draft</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Design Details -->
          <div class="form-section">
            <h4>Design Details</h4>
            <div class="form-row">
              <div class="form-group">
                <label for="fabricType">Fabric Type</label>
                <input
                  type="text"
                  id="fabricType"
                  v-model="editableDesign.fabricType"
                  class="form-input"
                  placeholder="e.g., Silk, Cotton, Wool"
                />
              </div>
              <div class="form-group">
                <label for="color">Primary Color</label>
                <input
                  type="text"
                  id="color"
                  v-model="editableDesign.color"
                  class="form-input"
                  placeholder="e.g., Navy Blue, Burgundy"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="style">Style/Type</label>
                <select id="style" v-model="editableDesign.style" class="form-select">
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
                <input
                  type="text"
                  id="occasion"
                  v-model="editableDesign.occasion"
                  class="form-input"
                  placeholder="e.g., Wedding, Business, Casual"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="specialInstructions">Special Instructions</label>
              <textarea
                id="specialInstructions"
                v-model="editableDesign.specialInstructions"
                class="form-textarea"
                rows="4"
                placeholder="Any specific requirements, modifications, or special notes..."
              ></textarea>
            </div>
          </div>

          <!-- Important Dates -->
          <div class="form-section">
            <h4>Important Dates</h4>
            <div class="form-row">
              <div class="form-group">
                <label for="firstFitting">First Fitting Date</label>
                <input
                  type="date"
                  id="firstFitting"
                  v-model="editableDesign.firstFitting"
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label for="finalFitting">Final Fitting Date</label>
                <input
                  type="date"
                  id="finalFitting"
                  v-model="editableDesign.finalFitting"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="completionDate">Expected Completion Date</label>
                <input
                  type="date"
                  id="completionDate"
                  v-model="editableDesign.completionDate"
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label for="deliveryDate">Delivery Date</label>
                <input
                  type="date"
                  id="deliveryDate"
                  v-model="editableDesign.deliveryDate"
                  class="form-input"
                />
              </div>
            </div>
          </div>

          <!-- Pricing Information -->
          <div class="form-section">
            <h4>Pricing & Notes</h4>
            <div class="form-row">
              <div class="form-group">
                <label for="estimatedPrice">Estimated Price</label>
                <div class="price-input">
                  <span class="currency">$</span>
                  <input
                    type="number"
                    id="estimatedPrice"
                    v-model="editableDesign.estimatedPrice"
                    class="form-input"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
              <div class="form-group">
                <label for="finalPrice">Final Price</label>
                <div class="price-input">
                  <span class="currency">$</span>
                  <input
                    type="number"
                    id="finalPrice"
                    v-model="editableDesign.finalPrice"
                    class="form-input"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <!-- New Payment Fields -->
            <div class="form-row">
              <div class="form-group">
                <label for="partPayment">Part Payment</label>
                <div class="price-input">
                  <span class="currency">$</span>
                  <input
                    type="number"
                    id="partPayment"
                    v-model="editableDesign.partPayment"
                    class="form-input"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
              <div class="form-group">
                <label for="balanceToPay">Balance to Pay</label>
                <div class="price-input">
                  <span class="currency">$</span>
                  <input
                    type="number"
                    id="balanceToPay"
                    v-model="editableDesign.balanceToPay"
                    class="form-input"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="notes">Additional Notes</label>
              <textarea
                id="notes"
                v-model="editableDesign.notes"
                class="form-textarea"
                rows="3"
                placeholder="Any additional notes about this design project..."
              ></textarea>
            </div>
          </div>
        </form>

        <!-- View Mode -->
        <div v-else class="view-mode">
          <!-- Photo Gallery -->
          <div class="detail-section" v-if="(editableDesign.photos && editableDesign.photos.length > 0) || editableDesign.photo_url">
            <h4>Design Photos</h4>
            <div class="photos-gallery">
              <!-- Filter out duplicates: show photo_url if it's not already in photos array -->
              <img 
                v-if="editableDesign.photo_url && !isPhotoInArray(editableDesign.photo_url)"
                :src="editableDesign.photo_url" 
                :alt="editableDesign.designName"
                class="gallery-photo"
                @click="openImageModal(editableDesign.photo_url)"
              />
              <!-- Additional photos -->
              <img 
                v-for="(photo, index) in editableDesign.photos" 
                :key="index"
                :src="photo.url || photo.preview" 
                :alt="`${editableDesign.designName} - Photo ${index + 1}`"
                class="gallery-photo"
                @click="openImageModal(photo.url || photo.preview)"
              />
            </div>
          </div>
          
          <div class="detail-section">
            <h4>Design Information</h4>
            <div class="view-field">
              <span class="field-label">Design Name:</span>
              <span class="field-value">{{ editableDesign.designName || '-' }}</span>
            </div>
            <div class="view-field">
              <span class="field-label">Customer:</span>
              <span class="field-value">{{ getCustomerName(editableDesign.customerId) || '-' }}</span>
            </div>
            <div class="view-field">
              <span class="field-label">Design Date:</span>
              <span class="field-value">{{ formatDate(editableDesign.designDate) || '-' }}</span>
            </div>
            <div class="view-field">
              <span class="field-label">Status:</span>
              <span class="field-value">
                <span class="status-badge" :class="editableDesign.status">
                  {{ formatStatus(editableDesign.status) }}
                </span>
              </span>
            </div>
          </div>

          <div class="detail-section">
            <h4>Design Details</h4>
            <div class="view-field">
              <span class="field-label">Fabric Type:</span>
              <span class="field-value">{{ editableDesign.fabricType || '-' }}</span>
            </div>
            <div class="view-field">
              <span class="field-label">Primary Color:</span>
              <span class="field-value">{{ editableDesign.color || '-' }}</span>
            </div>
            <div class="view-field">
              <span class="field-label">Style/Type:</span>
              <span class="field-value">{{ editableDesign.style || '-' }}</span>
            </div>
            <div class="view-field">
              <span class="field-label">Occasion:</span>
              <span class="field-value">{{ editableDesign.occasion || '-' }}</span>
            </div>
            <div class="view-field">
              <span class="field-label">Special Instructions:</span>
              <span class="field-value">{{ editableDesign.specialInstructions || '-' }}</span>
            </div>
          </div>

          <div class="detail-section">
            <h4>Important Dates</h4>
            <div class="view-field">
              <span class="field-label">First Fitting Date:</span>
              <span class="field-value">{{ formatDate(editableDesign.firstFitting) || '-' }}</span>
            </div>
            <div class="view-field">
              <span class="field-label">Final Fitting Date:</span>
              <span class="field-value">{{ formatDate(editableDesign.finalFitting) || '-' }}</span>
            </div>
            <div class="view-field">
              <span class="field-label">Expected Completion Date:</span>
              <span class="field-value">{{ formatDate(editableDesign.completionDate) || '-' }}</span>
            </div>
            <div class="view-field">
              <span class="field-label">Delivery Date:</span>
              <span class="field-value">{{ formatDate(editableDesign.deliveryDate) || '-' }}</span>
            </div>
          </div>

          <div class="detail-section">
            <h4>Pricing & Notes</h4>
            <div class="view-field">
              <span class="field-label">Estimated Price:</span>
              <span class="field-value">${{ editableDesign.estimatedPrice || '0.00' }}</span>
            </div>
            <div class="view-field">
              <span class="field-label">Final Price:</span>
              <span class="field-value">${{ editableDesign.finalPrice || '0.00' }}</span>
            </div>
            <div class="view-field">
              <span class="field-label">Part Payment:</span>
              <span class="field-value">${{ editableDesign.partPayment || '0.00' }}</span>
            </div>
            <div class="view-field">
              <span class="field-label">Balance to Pay:</span>
              <span class="field-value">${{ editableDesign.balanceToPay || '0.00' }}</span>
            </div>
            <div class="view-field">
              <span class="field-label">Additional Notes:</span>
              <span class="field-value">{{ editableDesign.notes || '-' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="closeModal" class="btn-secondary">
          {{ mode === 'view' ? 'Close' : 'Cancel' }}
        </button>
        <button v-if="mode === 'edit'" @click="handleSave" class="btn-primary">
          Save Changes
        </button>
        <button v-if="mode === 'view'" @click="switchToEditMode" class="btn-primary">
          Edit Design
        </button>
      </div>
    </div>
  </div>

  <!-- Image Zoom Modal -->
  <div v-if="showImageModal" class="image-modal-overlay" @click="closeImageModal">
    <div class="image-modal-content" @click.stop>
      <button class="image-modal-close" @click="closeImageModal">&times;</button>
      <img :src="currentImageSrc" class="zoomed-image" />
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import { designAPI } from '@/services/api.js'

export default {
  name: 'DesignModal',
  props: {
    isVisible: { type: Boolean, required: true },
    design: { type: Object, default: null },
    mode: { type: String, default: 'view' }
  },
  emits: ['close', 'save', 'edit'],
  data() {
    return {
      editableDesign: {},
      customers: [],
      showImageModal: false,
      currentImageSrc: ''
    }
  },
  watch: {
    design: {
      handler(newDesign) {
        if (newDesign) {
          // Create a deep copy to prevent reference issues
          this.setEditableDesign(JSON.parse(JSON.stringify(newDesign)))
        }
      },
      immediate: true
    },

     'editableDesign.finalPrice': 'calculateBalance',
    'editableDesign.partPayment': 'calculateBalance'
  },
  mounted() {
    this.loadCustomers()
  },
  methods: {

     calculateBalance() {
      const finalPrice = parseFloat(this.editableDesign.finalPrice) || 0
      const partPayment = parseFloat(this.editableDesign.partPayment) || 0
      const balance = finalPrice - partPayment
      this.editableDesign.balanceToPay = balance > 0 ? balance.toFixed(2) : '0.00'
    },
    // Helper method to check if photo_url is already in photos array
    isPhotoInArray(photoUrl) {
      if (!this.editableDesign.photos || !photoUrl) return false;
      return this.editableDesign.photos.some(photo => 
        (photo.url && photo.url === photoUrl) || 
        (photo.preview && photo.preview === photoUrl)
      );
    },
    setEditableDesign(design) {
      this.editableDesign = {
        id: design.id,
        designName: design.name || design.designName || '',
        customerId: design.customer_id || design.customerId || '',
        designDate: design.design_date || design.designDate || '',
        status: design.status || 'draft',
        fabricType: design.fabric_type || design.fabricType || '',
        color: design.color || '',
        style: design.style || '',
        occasion: design.occasion || '',
        specialInstructions: design.special_instructions || design.specialInstructions || '',
        firstFitting: design.first_fitting || design.firstFitting || '',
        finalFitting: design.final_fitting || design.finalFitting || '',
        completionDate: design.completion_date || design.completionDate || '',
        deliveryDate: design.delivery_date || design.deliveryDate || '',
        estimatedPrice: design.estimated_price || design.estimatedPrice || '',
        finalPrice: design.final_price || design.finalPrice || '',
        partPayment: design.part_payment || design.partPayment || '',
        balanceToPay: design.balance_to_pay || design.balanceToPay || '',
        notes: design.notes || '',
        photos: design.photos ? [...design.photos] : [],
        photo_url: design.photo_url || ''
      }
    },
    closeModal() {
      this.$emit('close')
    },
    switchToEditMode() {
      this.$emit('edit', this.design)
    },
    // Image zoom methods
    openImageModal(imageSrc) {
      this.currentImageSrc = imageSrc;
      this.showImageModal = true;
    },
    closeImageModal() {
      this.showImageModal = false;
      this.currentImageSrc = '';
    },
    async handleSave() {
      Swal.fire({
        icon: "warning",
        title: "Save Changes",
        text: "Are you sure you want to save these changes?",
        showCancelButton: true,
        confirmButtonText: "Yes, Save Changes",
        cancelButtonText: "Cancel",
        cancelButtonColor: "#d92550",
        showLoaderOnConfirm: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            // For updates, we need to use FormData to handle potential file uploads
            const formData = new FormData()
            formData.append('name', this.editableDesign.designName)
            formData.append('customer_id', this.editableDesign.customerId)
            formData.append('status', this.editableDesign.status)
            formData.append('design_date', this.editableDesign.designDate)
            
            // Add optional fields if they have values
            if (this.editableDesign.fabricType) formData.append('fabric_type', this.editableDesign.fabricType)
            if (this.editableDesign.color) formData.append('color', this.editableDesign.color)
            if (this.editableDesign.style) formData.append('style', this.editableDesign.style)
            if (this.editableDesign.occasion) formData.append('occasion', this.editableDesign.occasion)
            if (this.editableDesign.specialInstructions) formData.append('special_instructions', this.editableDesign.specialInstructions)
            if (this.editableDesign.firstFitting) formData.append('first_fitting', this.editableDesign.firstFitting)
            if (this.editableDesign.finalFitting) formData.append('final_fitting', this.editableDesign.finalFitting)
            if (this.editableDesign.completionDate) formData.append('completion_date', this.editableDesign.completionDate)
            if (this.editableDesign.deliveryDate) formData.append('delivery_date', this.editableDesign.deliveryDate)
            if (this.editableDesign.estimatedPrice) formData.append('estimated_price', this.editableDesign.estimatedPrice)
            if (this.editableDesign.finalPrice) formData.append('final_price', this.editableDesign.finalPrice)
            if (this.editableDesign.partPayment) formData.append('part_payment', this.editableDesign.partPayment)
            if (this.editableDesign.balanceToPay) formData.append('balance_to_pay', this.editableDesign.balanceToPay)
            if (this.editableDesign.notes) formData.append('notes', this.editableDesign.notes)
            
            // Add new photos
            this.editableDesign.photos.forEach(photo => {
              if (photo.file) {
                formData.append('photos[]', photo.file)
              }
            })
            
            const result = await designAPI.update(this.editableDesign.id, formData)
            
            this.$emit('save', result.data || result)
            this.closeModal()

            Swal.fire({
              icon: "success",
              title: "Saved",
              text: "Design updated successfully!",
              timer: 2000,
              showConfirmButton: false
            })
          } catch (error) {
            console.error('Error updating design:', error)
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to update design. Please try again."
            })
          }
        }
      })
    },
    async loadCustomers() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}customers`)
        const result = await response.json()
        this.customers = result.data || result
      } catch (error) {
        console.error('Error loading customers:', error)
        this.customers = []
      }
    },
    getCustomerName(customerId) {
      const customer = this.customers.find(c => c.id === customerId)
      return customer ? customer.name : 'Unknown Customer'
    },
    formatStatus(status) {
      const statusMap = {
        'draft': 'Draft',
        'in_progress': 'In Progress',
        'completed': 'Completed',
        'delivered': 'Delivered'
      }
      return statusMap[status] || status
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(new Date(dateString))
    },
    triggerFileUpload() {
      if (this.$refs.fileInput) {
        this.$refs.fileInput.click()
      }
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
              file: file,
              preview: e.target.result
            }
            if (!this.editableDesign.photos) {
              this.editableDesign.photos = []
            }
            // Avoid duplication by checking if photo already exists
            const exists = this.editableDesign.photos.some(p => p.name === photo.name && p.size === photo.size)
            if (!exists) {
              this.editableDesign.photos.push(photo)
            }
          }
          reader.readAsDataURL(file)
        }
      })
    },
    removePhoto(index) {
      if (this.editableDesign.photos) {
        this.editableDesign.photos.splice(index, 1)
      }
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
  max-width: 650px;
  max-height: 75vh;
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

.form-section,
.detail-section {
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.form-section h4,
.detail-section h4 {
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
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
  text-align: right;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
}

.status-badge.draft {
  background: #fff3cd;
  color: #856404;
}

.status-badge.in_progress {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.completed {
  background: #d4edda;
  color: #155724;
}

.status-badge.delivered {
  background: #d1ecf1;
  color: #0c5460;
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

/* Photo Upload Styles */
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
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
  background: rgba(0,0,0,0.7);
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

/* Photo Gallery Styles */
.photos-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.gallery-photo {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.gallery-photo:hover {
  transform: scale(1.05);
}

/* Image Zoom Modal Styles */
.image-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.image-modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.image-modal-close {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  z-index: 2001;
}

.zoomed-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    width: 95%;
    margin: 20px;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .view-field {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .field-value {
    text-align: left;
  }
  
  .photos-grid,
  .photos-gallery {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
</style>
<template>
  <div class="customer-form">
    <div v-if="!isEditing" class="form-header">
      <h3>Register New Customer</h3>
    </div>
    <div v-else class="form-header">
      <h3>Edit Customer Information</h3>
    </div>

    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-row">
        <div class="form-group">
          <label for="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            v-model="formData.firstName"
            required
            class="form-input"
            placeholder="Enter first name"
          />
        </div>
        <div class="form-group">
          <label for="lastName">Last Name *</label>
          <input
            type="text"
            id="lastName"
            v-model="formData.lastName"
            required
            class="form-input"
            placeholder="Enter last name"
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="email">Email Address *</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            required
            class="form-input"
            placeholder="Enter email address"
          />
        </div>
        <div class="form-group">
          <label for="phone">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            v-model="formData.phone"
            required
            class="form-input"
            placeholder="Enter phone number"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="address">Address</label>
        <textarea
          id="address"
          v-model="formData.address"
          class="form-textarea"
          rows="3"
          placeholder="Enter full address"
        ></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="dateOfBirth">Date of Birth</label>
          <input
            type="date"
            id="dateOfBirth"
            v-model="formData.dateOfBirth"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="preferredContact">Preferred Contact Method</label>
          <select id="preferredContact" v-model="formData.preferredContact" class="form-select">
            <option value="">Select preferred method</option>
            <option value="email">Email</option>
            <option value="phone">WhatsApp</option>
            <option value="sms">SMS</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="notes">Additional Notes</label>
        <textarea
          id="notes"
          v-model="formData.notes"
          class="form-textarea"
          rows="3"
          placeholder="Any additional information about the customer"
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="button" @click="handleCancel" class="btn-secondary">
          {{ isEditing ? 'Cancel' : 'Clear' }}
        </button>
        <button type="submit" class="btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Customer' : 'Register Customer') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CustomerForm',
  props: {
    customer: {
      type: Object,
      default: null
    }
  },
  emits: ['save', 'cancel'],
  data() {
    return {
      isSubmitting: false,
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        preferredContact: '',
        notes: ''
      }
    }
  },
  computed: {
    isEditing() {
      return this.customer !== null
    }
  },
  watch: {
    customer: {
      handler(newCustomer) {
        if (newCustomer) {
          this.formData = {
            firstName: newCustomer.firstName || '',
            lastName: newCustomer.lastName || '',
            email: newCustomer.email || '',
            phone: newCustomer.phone || '',
            address: newCustomer.address || '',
            dateOfBirth: newCustomer.dateOfBirth || '',
            preferredContact: newCustomer.preferredContact || '',
            notes: newCustomer.notes || ''
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
        if (!this.formData.firstName || !this.formData.lastName || 
            !this.formData.email || !this.formData.phone) {
          alert('Please fill in all required fields')
          return
        }

        // Prepare customer data
        const customerData = {
          ...this.formData,
          name: `${this.formData.firstName} ${this.formData.lastName}`.trim(),
          id: this.customer?.id || null,
          updatedAt: new Date()
        }

        // Save to local storage and queue for sync
        const { syncUtils } = await import('@/utils/sync.js')
        const savedCustomer = await syncUtils.saveCustomer(customerData)
        
        // Emit save event with customer data
        this.$emit('save', savedCustomer)
        
        // Reset form after successful save
        if (!this.isEditing) {
          this.resetForm()
        }
      } catch (error) {
        console.error('Error saving customer:', error)
        alert('Error saving customer. Please try again.')
      } finally {
        this.isSubmitting = false
      }
    },
    handleCancel() {
      if (this.isEditing) {
        this.$emit('cancel')
      } else {
        this.resetForm()
      }
    },
    resetForm() {
      this.formData = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        preferredContact: '',
        notes: ''
      }
    }
  }
}
</script>

<style scoped>
.customer-form {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
  max-width: 700px;
}

.form-header {
  margin-bottom: 2rem;
}

.form-header h3 {
  color: #2c3e50;
  margin: 0;
  font-size: 1.5rem;
}

.form {
  max-width: 800px;
}

/* .form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
} */

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
  
  .customer-form {
    padding: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>

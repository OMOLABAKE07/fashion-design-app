<template>
  <div class="design-list">
    <div class="header">
      <h2>Design Projects</h2>
      <div class="header-actions">
        <div class="search-box">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search designs..."
            class="search-input"
          />
        </div>
        <div class="filter-controls">
          <select v-model="statusFilter" class="filter-select">
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="delivered">Delivered</option>
          </select>
          <select v-model="customerFilter" class="filter-select">
            <option value="">All Customers</option>
            <option v-for="customer in customers" :key="customer.id" :value="customer.id">
              {{ customer.name }}
            </option>
          </select>
          <button @click="createNewDesign" class="btn-primary filter-create-btn">
            Create Design
          </button>
        </div>
      </div>
    </div>

    <div v-if="filteredDesigns.length === 0" class="empty-state">
      <div class="empty-content">
        <div class="empty-icon">📸</div>
        <h3>No designs found</h3>
        <p>{{ searchQuery || statusFilter || customerFilter ? 'Try adjusting your search or filters.' : 'Create your first design project to get started!' }}</p>
      </div>
    </div>

    <div v-else class="designs-grid">
      <div 
        v-for="design in filteredDesigns" 
        :key="design.id" 
        class="design-card"
        @click="selectDesign(design)"
      >
        <!-- ✅ Design Photo -->
        <div class="design-photo">
          <img 
            v-if="design.photo_url" 
            :src="getImageUrl(design.photo_url)" 
            :alt="design.name"
            class="photo"
          />
          <div v-else class="no-photo">
            <span class="no-photo-icon">📸</span>
          </div>
          <div class="photo-count" v-if="design.photos && design.photos.length > 1">
            +{{ design.photos.length - 1 }} more
          </div>
        </div>

        <!-- Design Info -->
        <div class="design-info">
          <div class="design-header">
            <h3>{{ design.name }}</h3>
            <span class="status-badge" :class="design.status">
              {{ formatStatus(design.status) }}
            </span>
          </div>
          
          <div class="design-details">
            <p class="customer-name">
              <span class="label">Customer:</span> {{ getCustomerName(design.customer_id) }}
            </p>
            <p class="design-style" v-if="design.description">
              <span class="label">Description:</span> {{ design.description }}
            </p>
          </div>

          <div class="design-meta">
            <div class="dates">
              <span class="date" v-if="design.created_at">
                <span class="label">Created:</span> {{ formatDate(design.created_at) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Design Actions -->
        <div class="design-actions">
          <button @click.stop="editDesign(design)" class="btn-secondary btn-small">
            Edit
          </button>
          <button @click.stop="viewDesign(design)" class="btn-primary btn-small">
            View
          </button>
          <button @click.stop="deleteDesign(design.id)" class="btn-danger btn-small">
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Design Detail Modals -->
    <DesignModal 
      :is-visible="showViewModal" 
      :design="selectedDesign" 
      mode="view"
      @close="showViewModal = false"
      @edit="editDesign"
    />
    
    <DesignModal 
      :is-visible="showEditModal" 
      :design="designToEdit" 
      mode="edit"
      @close="showEditModal = false"
      @save="saveEditedDesign"
    />
  </div>
</template>

<script>
import { designAPI } from '@/services/api.js'
import Swal from 'sweetalert2'
import DesignModal from './DesignModal.vue'

export default {
  name: 'DesignList',
  components: { DesignModal },
  emits: ['design-selected', 'design-edit', 'create-new-design'],
  data() {
    return {
      searchQuery: '',
      statusFilter: '',
      customerFilter: '',
      selectedDesign: null,
      designToEdit: null,
      showViewModal: false,
      showEditModal: false,
      customers: [],
      designs: []
    }
  },
  computed: {
    filteredDesigns() {
      let filtered = this.designs

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(design =>
          (design.name && design.name.toLowerCase().includes(query)) ||
          this.getCustomerName(design.customer_id).toLowerCase().includes(query) ||
          (design.description && design.description.toLowerCase().includes(query))
        )
      }

      if (this.statusFilter) {
        filtered = filtered.filter(design => design.status === this.statusFilter)
      }

      if (this.customerFilter) {
        filtered = filtered.filter(design => design.customer_id === parseInt(this.customerFilter))
      }

      return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }
  },
  mounted() {
    this.loadDesigns()
    this.loadCustomers()
    window.addEventListener('design-saved', this.handleDesignSaved)
  },
  beforeUnmount() {
    window.removeEventListener('design-saved', this.handleDesignSaved)
  },
  methods: {
    async loadDesigns() {
      try {
        const response = await designAPI.getAll()
        this.designs = response.data || response
        // console.log('Loaded designs:', this.designs)
      } catch (error) {
        // console.error('Error loading designs:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load designs. Please try again.'
        })
      }
    },
    async loadCustomers() {
      try {
        const response = await fetch('http://localhost:8000/api/v1/customers')
        const result = await response.json()
        this.customers = result.data || result
      } catch (error) {
        // console.error('Error loading customers:', error)
      }
    },
    getImageUrl(path) {
      // ✅ Ensure proper image URL formatting
      if (!path) return ''
      if (path.startsWith('http')) return path
      return `http://localhost:8000/storage/${path.replace(/^\/?storage\/?/, '')}`
    },
    selectDesign(design) {
      this.selectedDesign = { ...design, photos: design.photos || [] }
      this.showViewModal = true
      this.$emit('design-selected', design)
    },
    editDesign(design) {
      this.designToEdit = { ...design, photos: design.photos || [] }
      this.showEditModal = true
    },
    viewDesign(design) {
      this.selectedDesign = { ...design, photos: design.photos || [] }
      this.showViewModal = true
      this.$emit('design-selected', design)
    },
    async saveEditedDesign(updatedDesign) {
      try {
        const index = this.designs.findIndex(d => d.id === updatedDesign.id)
        if (index !== -1) this.designs[index] = { ...this.designs[index], ...updatedDesign }

        this.showEditModal = false
        Swal.fire({
          icon: 'success',
          title: 'Saved',
          text: 'Design updated successfully!',
          timer: 2000,
          showConfirmButton: false
        })
      } catch (error) {
        // console.error('Error saving edited design:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update design. Please try again.'
        })
      }
    },
    async deleteDesign(designId) {
      Swal.fire({
        title: 'Delete Design',
        text: 'Are you sure you want to delete this design? This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete',
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#6c757d'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await designAPI.delete(designId)
            this.loadDesigns()
            Swal.fire({
              title: 'Deleted!',
              text: 'The design has been deleted successfully.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            })
          } catch (error) {
            // console.error('Error deleting design:', error)
            Swal.fire({
              title: 'Error',
              text: 'Failed to delete the design. Please try again.',
              icon: 'error'
            })
          }
        }
      })
    },
    getCustomerName(customerId) {
      const customer = this.customers.find(c => c.id === customerId)
      return customer ? customer.name : 'Unknown Customer'
    },
    formatStatus(status) {
      const statusMap = {
        draft: 'Draft',
        in_progress: 'In Progress',
        completed: 'Completed',
        delivered: 'Delivered'
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
    createNewDesign() {
      this.$emit('create-new-design')
    },
    handleDesignSaved() {
      this.loadDesigns()
    }
  }
}
</script>


<style scoped>
.design-list {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header h2 {
  color: #2c3e50;
  margin: 0;
  font-size: 1.8rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
}

.filter-controls {
  display: flex;
  gap: 0.5rem;
}

.filter-create-btn {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s;
  background: #3498db;
  color: white;
  white-space: nowrap;
}

.filter-create-btn:hover {
  background: #2980b9;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.empty-content {
  text-align: center;
  color: #6c757d;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-content h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.empty-content .btn-primary {
  margin-top: 1rem;
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

.empty-content .btn-primary:hover {
  background: #2980b9;
}

.designs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.design-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.design-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}

.design-photo {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-photo {
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
}

.no-photo-icon {
  font-size: 3rem;
}

.photo-count {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.design-info {
  padding: 1.5rem;
}

.design-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.design-header h3 {
  color: #2c3e50;
  margin: 0;
  font-size: 1.2rem;
  line-height: 1.3;
  flex: 1;
  margin-right: 1rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
}

.status-badge.concept {
  background: #fff3cd;
  color: #856404;
}

.status-badge.in-progress {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.fitting {
  background: #f8d7da;
  color: #721c24;
}

.status-badge.completed {
  background: #d4edda;
  color: #155724;
}

.status-badge.delivered {
  background: #d1ecf1;
  color: #0c5460;
}

.design-details {
  margin-bottom: 1rem;
}

.design-details p {
  margin: 0.25rem 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.label {
  font-weight: 600;
  color: #495057;
}

.design-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f1f3f4;
}

.dates {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.date {
  font-size: 0.8rem;
  color: #6c757d;
}

.price {
  font-weight: 600;
  color: #27ae60;
  font-size: 1.1rem;
}

.design-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.btn-primary,
.btn-secondary,
.btn-danger {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
}

.btn-secondary {
  background: #198754;
  color: white;
}

.btn-secondary:hover {
  background: #246534;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.btn-small {
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-actions {
    flex-direction: column;
  }
  
  .search-box {
    min-width: auto;
  }
  
  .filter-controls {
    flex-direction: column;
  }
  
  .designs-grid {
    grid-template-columns: 1fr;
  }
  
  .design-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .design-actions {
    flex-direction: column;
  }
}

.empty-content .btn-primary {
  margin-top: 1rem;
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

.empty-content .btn-primary:hover {
  background: #2980b9;
}
</style>

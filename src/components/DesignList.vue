<script>
import Swal from 'sweetalert2'
import DesignModal from './DesignModal.vue'
import { useDesignStore } from '@/store/designStore'

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
        const designStore = useDesignStore()
        await designStore.loadDesigns()
        this.designs = designStore.designs
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
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}customers`) 
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
      return `http://localhost:3000/storage/${path.replace(/^\/?storage\/?/, '')}`
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
        const designStore = useDesignStore()
        await designStore.updateDesign(updatedDesign.id, updatedDesign)
        
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
          text: 'Failed to update design. Data has been saved locally and will sync when online.'
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
            const designStore = useDesignStore()
            await designStore.deleteDesign(designId)
            await this.loadDesigns()
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
              text: 'Failed to delete the design. The deletion has been queued and will sync when online.',
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
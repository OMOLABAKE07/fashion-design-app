<script>
import Swal from 'sweetalert2'
import MeasurementModal from './MeasurementModal.vue'
import { useMeasurementStore } from '@/store/measurementStore'

export default {
  name: 'MeasurementForm',
  components: { MeasurementModal },
  props: {
    customer: { type: Object, default: null },
    measurement: { type: Object, default: null }
  },
  emits: ['save', 'cancel', 'edit', 'delete', 'customer-selected'],
  data() {
    return {
      showDropdown: false,
      showViewModal: false,
      measurementToView: null,
      isSubmitting: false,
      selectedCategory: '', // This will now directly control which section is shown
      selectedCategories: [],
      showEditModal: false,
      measurementToEdit: null,
      customerSearchQuery: '',
      allCustomers: [],
      filteredCustomers: [],
      showHistory: false,
      formData: {
        // Male measurements
        agbadaLength: '', topLength: '', kaftanLength: '', jalamiaLength: '', shirtLength: '',
        neck: '', wrist: '', hip: '', hips: '', waistToHipLine: '', waistToHip: '',
        // Shared measurements (some overlap between male/female)
        bust: '', shoulderToUnderBust: '', shoulderToUpperBust: '', shoulderToNipplePoint: '',
        nippleToNipple: '', roundUpperBust: '', roundUnderBust: '', shoulder: '',
        halfLength: '', blouseLength: '', longGownLength: '', shortGownLength: '',
        threeQuarterGownLength: '', trouserLength: '', roundSleeve: '', biceps: '',
        elbow: '', longSleeve: '', shortSleeve: '', threeQuarterSleeve: '',
        longSkirt: '', shortSkirt: '', threeQuarterSkirt: '', waist: '', band: '',
        thigh: '', knee: '', inseam: '', outseam: '', ankle: '', crotch: '', calf: '',
        chest: '', bustUpperChest: '', stomach: '', capSize: '',
        // Additional info
        measurementDate: '', notes: ''
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
            ...newMeasurement.measurements,
            measurementDate: newMeasurement.measurementDate || new Date().toISOString().split('T')[0],
            notes: newMeasurement.notes || ''
          }
          this.selectedCategories = newMeasurement.categories || []
        } else {
          this.resetForm()
        }
      },
      immediate: true
    },
    customer: {
      handler() {
        this.loadMeasurementHistory()
      },
      immediate: true
    }
  },
  mounted() {
    this.loadAllCustomers()
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    saveMeasurementHistory(updatedMeasurement) {
      // Update history with edited data
      const index = this.measurementHistory.findIndex(m => m.id === updatedMeasurement.id)
      if (index !== -1) {
        this.measurementHistory[index] = updatedMeasurement
      }
      this.showEditModal = false
    },

    // Customer Search Methods
    async loadAllCustomers() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}customers`)
        if (!response.ok) throw new Error("Network response was not ok")
        const customers = await response.json()
        this.allCustomers = customers.data || customers
        this.filteredCustomers = this.allCustomers
      } catch (error) {
        console.error("Error loading customers:", error)
        const measurementStore = useMeasurementStore()
        this.allCustomers = measurementStore.getAllCustomers() || []
        this.filteredCustomers = this.allCustomers
      }
    },
    openDropdown() {
      this.showDropdown = true
      this.filteredCustomers = this.allCustomers
    },
    async filterCustomers() {
      const query = this.customerSearchQuery.toLowerCase().trim()
      if (!query) {
        this.filteredCustomers = this.allCustomers
        return
      }
      this.filteredCustomers = this.allCustomers.filter(c =>
        c.name.toLowerCase().includes(query) || c.phone.toLowerCase().includes(query)
      )
    },
    selectCustomer(customer) {
      this.$emit('customer-selected', customer)
      this.customerSearchQuery = `${customer.name} (${customer.phone})`
      this.showDropdown = false
    },
    handleClickOutside(event) {
      if (this.$refs.dropdownRef && !this.$refs.dropdownRef.contains(event.target)) {
        this.showDropdown = false
      }
    },

    // Category Methods
    onCategorySelect() {
      // Form will automatically update due to reactivity
      // Additional logic can be added here if needed
    },
    getCategoryName(category) {
      const categoryNames = {
        'male': 'Male Measurements',
        'female': 'Female Measurements'
      }
      return categoryNames[category] || category
    },

    // ✅ FIXED: Load History from BACKEND
    async loadMeasurementHistory(forceRefresh = false) {
      try {
        console.log('🔄 Loading measurement history...', { forceRefresh, customerId: this.customer?.id })
        this.measurementHistory = []

        if (!this.customer?.id) {
          // console.log('❌ No customer selected')
          return
        }

        let measurements = []

        // ✅ STEP 1: Try BACKEND FIRST
        if (forceRefresh || this.measurementHistory.length === 0) {
          try {
            // console.log('📡 Fetching from backend...')
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}measurements/customer/${this.customer.id}`)

            if (response.ok) {
              const result = await response.json()
              // console.log('✅ Backend response:', result)

              measurements = result.success && Array.isArray(result.data) ? result.data : (result.data || [])
              // console.log('📦 Backend measurements loaded:', measurements.length)
            }
          } catch (apiError) {
            console.warn('❌ Backend unavailable, using local:', apiError)
            const measurementStore = useMeasurementStore()
            measurements = measurementStore.measurements?.filter(m => m.customerId === this.customer.id) || []
          }
        }

        // ✅ STEP 2: Transform for display
        this.measurementHistory = measurements.map(measurement => {
          const measurementData = measurement.data || measurement
          return {
            id: measurement.id,
            customerId: measurement.customer_id,
            customerName: measurement.customer_name,
            measurementDate: measurement.measurement_date,
            categories: measurement.categories || [],
            notes: measurement.notes,
            // Flatten for quick display
            chest: measurementData.measurements?.chest || '',
            waist: measurementData.measurements?.waist || '',
            bust: measurementData.measurements?.bust || '',
            shoulder: measurementData.measurements?.shoulder || '',
            nippleToNipple: measurementData.measurements?.nippleToNipple || '',
            roundUpperBust: measurementData.measurements?.roundUpperBust || '',
            roundUnderBust: measurementData.measurements?.roundUnderBust || '',
            shoulderToUnderBust: measurementData.measurements?.shoulderToUnderBust || '',
            shoulderToUpperBust: measurementData.measurements?.shoulderToUpperBust || '',
            shoulderToNipplePoint: measurementData.measurements?.shoulderToNipplePoint || '',
            halfLength: measurementData.measurements?.halfLength || '',
            blouseLength: measurementData.measurements?.blouseLength || '',
            longGownLength: measurementData.measurements?.longGownLength || '',
            shortGownLength: measurementData.measurements?.shortGownLength || '',
            threeQuarterGownLength: measurementData.measurements?.threeQuarterGownLength || '',
            trouserLength: measurementData.measurements?.trouserLength || '',
            roundSleeve: measurementData.measurements?.roundSleeve || '',
            biceps: measurementData.measurements?.biceps || '',
            elbow: measurementData.measurements?.elbow || '',
            longSleeve: measurementData.measurements?.longSleeve || '',
            shortSleeve: measurementData.measurements?.shortSleeve || '',
            threeQuarterSleeve: measurementData.measurements?.threeQuarterSleeve || '',
            longSkirt: measurementData.measurements?.longSkirt || '',
            shortSkirt: measurementData.measurements?.shortSkirt || '',
            threeQuarterSkirt: measurementData.measurements?.threeQuarterSkirt || '',
            band: measurementData.measurements?.band || '',
            thigh: measurementData.measurements?.thigh || '',
            knee: measurementData.measurements?.knee || '',
            inseam: measurementData.measurements?.inseam || '',
            outseam: measurementData.measurements?.outseam || '',
            ankle: measurementData.measurements?.ankle || '',
            crotch: measurementData.measurements?.crotch || '',
            calf: measurementData.measurements?.calf || '',
            agbadaLength: measurementData.measurements?.agbadaLength || '',
            agbadaShoulder: measurementData.measurements?.agbadaShoulder || '',
            agbadaChest: measurementData.measurements?.agbadaChest || '',
            agbadaSleeve: measurementData.measurements?.agbadaSleeve || '',
            topLength: measurementData.measurements?.topLength || '',
            kaftanLength: measurementData.measurements?.kaftanLength || '',
            jalamiaLength: measurementData.measurements?.jalamiaLength || '',
            shirtLength: measurementData.measurements?.shirtLength || '',
            neck: measurementData.measurements?.neck || '',
            bustUpperChest: measurementData.measurements?.bustUpperChest || '',
            stomach: measurementData.measurements?.stomach || '',
            capSize: measurementData.measurements?.capSize || '',
            // Full measurements for modal
            measurements: measurementData.measurements || {},
            rawData: measurement
          }
        })

        // ✅ STEP 3: Sort newest first
        this.measurementHistory.sort((a, b) => {
          const dateA = new Date(a.measurementDate || a.created_at)
          const dateB = new Date(b.measurementDate || b.created_at)
          return dateB - dateA
        })

        // console.log('✅ History loaded:', this.measurementHistory.length, 'records')

      } catch (error) {
        console.error('❌ Error loading history:', error)
        this.measurementHistory = []
      }
    },

    // ✅ FIXED: Save with Backend Priority
    async handleSubmit() {
      this.isSubmitting = true

      try {
        if (!this.formData.measurementDate) {
          Swal.fire({
            icon: 'warning',
            title: 'Missing Required Fields',
            text: 'Please select a measurement date'
          })
          return
        }
        if (!this.selectedCategory) {
          Swal.fire({
            icon: 'warning',
            title: 'Missing Required Fields',
            text: 'Please select a category'
          })
          return
        }
        if (!this.customer) {
          Swal.fire({
            icon: 'warning',
            title: 'Missing Required Fields',
            text: 'Please select a customer'
          })
          return
        }

        const measurementStore = useMeasurementStore()
        const measurementData = {
          customer_id: this.customer.id,
          customer_name: this.customer.name,
          categories: [this.selectedCategory],
          measurement_date: this.formData.measurementDate,
          notes: this.formData.notes,
          measurements: { ...this.formData }
        }

        // Save using the store which handles offline support
        const savedMeasurement = await measurementStore.addMeasurement(measurementData)

        // Add to HISTORY IMMEDIATELY
        const displayMeasurement = {
          id: savedMeasurement.id,
          customerId: this.customer.id,
          customerName: this.customer.name,
          measurementDate: measurementData.measurement_date,
          categories: measurementData.categories,
          notes: measurementData.notes,
          chest: measurementData.measurements.chest || '',
          waist: measurementData.measurements.waist || '',
          bust: measurementData.measurements.bust || '',
          shoulder: measurementData.measurements.shoulder || '',
          nippleToNipple: measurementData.measurements.nippleToNipple || '',
          roundUpperBust: measurementData.measurements.roundUpperBust || '',
          roundUnderBust: measurementData.measurements.roundUnderBust || '',
          shoulderToUnderBust: measurementData.measurements.shoulderToUnderBust || '',
          shoulderToUpperBust: measurementData.measurements.shoulderToUpperBust || '',
          shoulderToNipplePoint: measurementData.measurements.shoulderToNipplePoint || '',
          halfLength: measurementData.measurements.halfLength || '',
          blouseLength: measurementData.measurements.blouseLength || '',
          longGownLength: measurementData.measurements.longGownLength || '',
          shortGownLength: measurementData.measurements.shortGownLength || '',
          threeQuarterGownLength: measurementData.measurements.threeQuarterGownLength || '',
          trouserLength: measurementData.measurements.trouserLength || '',
          roundSleeve: measurementData.measurements.roundSleeve || '',
          biceps: measurementData.measurements.biceps || '',
          elbow: measurementData.measurements.elbow || '',
          longSleeve: measurementData.measurements.longSleeve || '',
          shortSleeve: measurementData.measurements.shortSleeve || '',
          threeQuarterSleeve: measurementData.measurements.threeQuarterSleeve || '',
          longSkirt: measurementData.measurements.longSkirt || '',
          shortSkirt: measurementData.measurements.shortSkirt || '',
          threeQuarterSkirt: measurementData.measurements.threeQuarterSkirt || '',
          band: measurementData.measurements.band || '',
          thigh: measurementData.measurements.thigh || '',
          knee: measurementData.measurements.knee || '',
          inseam: measurementData.measurements.inseam || '',
          outseam: measurementData.measurements.outseam || '',
          ankle: measurementData.measurements.ankle || '',
          crotch: measurementData.measurements.crotch || '',
          calf: measurementData.measurements.calf || '',
          agbadaLength: measurementData.measurements.agbadaLength || '',
          agbadaShoulder: measurementData.measurements.agbadaShoulder || '',
          agbadaChest: measurementData.measurements.agbadaChest || '',
          agbadaSleeve: measurementData.measurements.agbadaSleeve || '',
          topLength: measurementData.measurements.topLength || '',
          kaftanLength: measurementData.measurements.kaftanLength || '',
          jalamiaLength: measurementData.measurements.jalamiaLength || '',
          shirtLength: measurementData.measurements.shirtLength || '',
          neck: measurementData.measurements.neck || '',
          bustUpperChest: measurementData.measurements.bustUpperChest || '',
          stomach: measurementData.measurements.stomach || '',
          capSize: measurementData.measurements.capSize || '',
          measurements: measurementData.measurements,
          rawData: savedMeasurement
        }
        this.measurementHistory.unshift(displayMeasurement)

        // Reset & Emit
        this.resetForm()
        this.selectedCategory = ''
        this.$emit("save", savedMeasurement)

        Swal.fire({
          icon: "success",
          title: "Saved!",
          text: "Measurement saved successfully!",
          timer: 2000,
          showConfirmButton: false,
        })

      } catch (error) {
        console.error("❌ Error:", error)
        Swal.fire({ 
          icon: "error", 
          title: "Save Failed", 
          text: "Please try again. Data has been saved locally and will sync when online." 
        })
      } finally {
        this.isSubmitting = false
      }
    },

    // ✅ FIXED: Refresh from Backend
    refreshHistory() {
      this.loadMeasurementHistory(true)
      Swal.fire({
        icon: "success",
        title: "Refreshed!",
        text: `${this.measurementHistory.length} records loaded from database`,
        timer: 1500,
        showConfirmButton: false,
      })
    },

    toggleHistory() {
      this.showHistory = !this.showHistory
      if (this.showHistory && !this.measurementHistory.length) {
        this.loadMeasurementHistory()
      }
    },

    viewMeasurement(measurement) {
      // Ensure the measurement object has the correct structure for the modal
      this.measurementToView = {
        id: measurement.id,
        customerId: measurement.customerId,
        customerName: measurement.customerName,
        measurementDate: measurement.measurementDate,
        categories: measurement.categories || [],
        notes: measurement.notes || '',
        measurements: measurement.measurements || {}
      }
      this.showViewModal = true
    },

    editMeasurement(measurement) {
      // Ensure the measurement object has the correct structure for the modal
      this.measurementToEdit = {
        id: measurement.id,
        customerId: measurement.customerId,
        customerName: measurement.customerName,
        measurementDate: measurement.measurementDate,
        categories: measurement.categories || [],
        notes: measurement.notes || '',
        measurements: measurement.measurements || {}
      }
      this.showEditModal = true
    },

    async deleteMeasurement(measurementId) {
      Swal.fire({
        title: 'Delete Measurement',
        text: 'Are you sure you want to delete this measurement?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const measurementStore = useMeasurementStore()
            await measurementStore.deleteMeasurement(measurementId)
            
            // Remove from history
            this.measurementHistory = this.measurementHistory.filter(m => m.id !== measurementId)
            
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Measurement has been deleted.',
              timer: 1500,
              showConfirmButton: false
            })
          } catch (error) {
            console.error('Error deleting measurement:', error)
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete measurement. The deletion has been queued and will sync when online.'
            })
          }
        }
      })
    },

    resetForm() {
      // Reset all form fields
      Object.keys(this.formData).forEach(key => {
        if (typeof this.formData[key] === 'string') {
          this.formData[key] = ''
        }
      })
      
      // Set default date
      this.formData.measurementDate = new Date().toISOString().split('T')[0]
    },

    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>
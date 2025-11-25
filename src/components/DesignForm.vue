<script>
import Swal from 'sweetalert2'
import { useDesignStore } from '@/store/designStore'

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
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}customers`)
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

        const designStore = useDesignStore()
        let result
        
        const designData = {
          name: this.formData.designName,
          customer_id: this.formData.customerId,
          status: this.formData.status,
          design_date: this.formData.designDate,
          description: this.formData.description,
          fabric_type: this.formData.fabricType,
          color: this.formData.color,
          style: this.formData.style,
          occasion: this.formData.occasion,
          special_instructions: this.formData.specialInstructions,
          first_fitting: this.formData.firstFitting,
          final_fitting: this.formData.finalFitting,
          completion_date: this.formData.completionDate,
          delivery_date: this.formData.deliveryDate,
          estimated_price: this.formData.estimatedPrice,
          final_price: this.formData.finalPrice,
          part_payment: this.formData.partPayment,
          balance: this.formData.balance,
          notes: this.formData.notes
        }

        if (this.isEditing) {
          result = await designStore.updateDesign(this.design.id, designData)
        } else {
          result = await designStore.addDesign(designData)
        }

        this.$emit('save', result)
        window.dispatchEvent(new CustomEvent('design-saved', { detail: result }))

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
          text: `Error ${this.isEditing ? 'updating' : 'creating'} design. Data has been saved locally and will sync when online.`
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
    }
  }
}
</script>
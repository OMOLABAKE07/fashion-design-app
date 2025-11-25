<script>
import SyncStatus from './SyncStatus.vue'
import Swal from 'sweetalert2'
import { useMessageStore } from '@/store/messageStore'

export default {
  name: 'MessageCenter',
  components: { SyncStatus },
  data() {
    return {
      searchQuery: '',
      selectedCustomer: null,
      showNewMessage: false,
      newMessage: '',
      newMessageCustomer: '',
      newMessageText: '',
      customers: [],
      messages: [], // Only your sent emails
      isSubmitting: false,
      searchDebounce: null,
      // Attachment handling
      attachmentFile: null,
      attachmentType: 'none',
      isMobile: false
    }
  },
  computed: {
    filteredCustomers() {
      if (!this.searchQuery) return this.customers
      
      const query = this.searchQuery.toLowerCase().trim()
      if (!query) return this.customers
      
      return this.customers.filter(customer => {
        // Handle potential null/undefined values
        const name = (customer.name || customer.firstName || customer.lastName || '').toString()
        const email = (customer.email || '').toString()
        const phone = (customer.phone || '').toString()
        
        // Case-insensitive search in name, email, and phone
        return name.toLowerCase().includes(query) || 
               email.toLowerCase().includes(query) ||
               phone.toLowerCase().includes(query)
      })
    }
  },
  watch: {
    searchQuery: {
      handler() {
        // Debounce search to avoid too many API calls
        clearTimeout(this.searchDebounce)
        this.searchDebounce = setTimeout(() => {
          this.loadCustomers()
        }, 300)
      }
    }
  },
  async mounted() {
    await this.loadCustomers()
    await this.loadMessages()
    window.addEventListener('storage', this.handleStorageChange)
    this.$nextTick(() => this.scrollToBottom())
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.handleStorageChange)
    window.removeEventListener('resize', this.checkMobile)
    // Clean up debounce timer
    if (this.searchDebounce) {
      clearTimeout(this.searchDebounce)
    }
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 768
    },
    // ✅ LOAD CUSTOMERS - WORKS WITH YOUR SEARCH CONTROLLER
    // ✅ FIXED loadCustomers() - - WORKS WITH YOUR API
    async loadCustomers() {
      try {
        // 1️⃣ LOCAL FIRST (INSTANT LOAD)
        const messageStore = useMessageStore()
        let localCustomers = messageStore.getAllCustomers()
        if (localCustomers?.length > 0) {
          this.customers = localCustomers
        }

        // 2️⃣ YOUR BACKEND API with search support
        const searchParam = this.searchQuery ? `?search=${encodeURIComponent(this.searchQuery)}` : ''
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}customers${searchParam}`) 
        if (response.ok) {
          const result = await response.json()
          // Handle both array and object responses
          let dbCustomers = []
          if (Array.isArray(result)) {
            dbCustomers = result
          } else if (Array.isArray(result.data)) {
            dbCustomers = result.data
          } else if (typeof result === 'object' && result !== null) {
            // Handle object responses
            dbCustomers = Object.values(result).filter(item => typeof item === 'object' && item !== null)
          }
          
          // MERGE LOCAL + DB (NO DUPLICATES)
          const merged = this.mergeCustomers(localCustomers || [], dbCustomers)
          this.customers = merged.sort((a, b) => a.name.localeCompare(b.name))
          messageStore.saveAllCustomers(this.customers)
        }
      } catch (error) {
        console.warn('⚠️ Using local customers:', error)
      }
    },

    mergeCustomers(local, db) {
      const merged = [...local]
      db.forEach(dbCustomer => {
        const exists = merged.find(c => c.id === dbCustomer.id)
        if (!exists) merged.push(dbCustomer)
        else Object.assign(exists, dbCustomer)
      })
      return merged.sort((a, b) => a.name.localeCompare(b.name))
    },

    // ✅ LOAD YOUR SENT EMAILS
    async loadMessages() {
      try {
        const messageStore = useMessageStore()
        await messageStore.loadMessages()
        this.messages = messageStore.messages
      } catch (error) {
        console.error('Error loading messages:', error)
        // Fallback to local storage when API is unreachable
        const messageStore = useMessageStore()
        this.messages = messageStore.getAllMessages() || []
      }
    },

    // ✅ SEND EMAIL (your "Send" button)
    async sendMessage() {
      if (!this.newMessage.trim() || !this.selectedCustomer) return

      await this.sendEmailData({
        customer_id: this.selectedCustomer.id,
        subject: `Fashion Design Update - ${this.selectedCustomer.name}`,
        content: this.newMessage.trim(),
        status: 'sent' // Using 'sent' as per your Laravel migration
      }, this.selectedCustomer)

      this.newMessage = ''
      this.$nextTick(() => this.scrollToBottom())
      // Clear attachment after sending
      this.attachmentFile = null
      this.attachmentType = 'none'
    },

    // ✅ SEND NEW EMAIL (modal)
    async sendNewMessage() {
      if (!this.newMessageCustomer || !this.newMessageText.trim()) return
      
      const customer = this.customers.find(c => c.id === parseInt(this.newMessageCustomer))
      if (!customer) return

      await this.sendEmailData({
        customer_id: customer.id,
        subject: `Fashion Design Update - ${customer.name}`,
        content: this.newMessageText.trim(),
        status: 'sent' // Using 'sent' as per your Laravel migration
      }, customer)

      this.selectedCustomer = customer
      this.showNewMessage = false
      this.newMessageCustomer = ''
      this.newMessageText = ''
      // Clear attachment after sending
      this.attachmentFile = null
      this.attachmentType = 'none'
    },

    // ✅ EMAIL ENGINE - UPDATED FOR LARAVEL BACKEND WITH ATTACHMENTS
    async sendEmailData(messageData, customer) {
      this.isSubmitting = true
      try {
        const messageStore = useMessageStore()
        let savedToDb = null
        let apiError = null
        
        try {
          // Create FormData for file upload
          const formData = new FormData()
          formData.append('customer_id', messageData.customer_id)
          formData.append('subject', messageData.subject)
          formData.append('content', messageData.content)
          formData.append('status', messageData.status || 'sent')
          
          // Add attachment if available
          if (this.attachmentFile && this.attachmentType !== 'none') {
            formData.append('attachment_file', this.attachmentFile)
            formData.append('attachment_type', this.attachmentType)
          } else {
            formData.append('attachment_type', 'none')
          }
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}messages`, {
            method: 'POST',
            // Don't set Content-Type header, let browser set it with boundary for FormData
            body: formData
          })
          
          if (response.ok) {
            const result = await response.json()
            savedToDb = result.data || result // Handle Laravel's response format
          } else {
            // Handle non-OK responses
            const errorText = await response.text()
            apiError = 'Server error: ' + response.status + ' ' + response.statusText + ' - ' + errorText
            console.error('API Error:', apiError)
          }
        } catch (error) {
          console.error('Network error:', error)
          apiError = 'Network error - check if backend is running'
        }

        const savedMessage = {
          ...messageData,
          id: savedToDb?.id || Date.now(),
          customer_name: customer.name,
          customer_email: customer.email,
          created_at: new Date().toISOString(),
          sender: 'admin',
          // Add attachment info if available
          attachment_type: this.attachmentType,
          attachment_path: savedToDb?.attachment_path || null
        }
        
        // Save using the store which handles offline support
        await messageStore.addMessage(savedMessage)
        
        // Add to messages array (at the beginning since we sort by date)
        this.messages.unshift(savedMessage)

        Swal.fire({
          icon: savedToDb ? 'success' : 'warning',
          title: savedToDb ? '✅ Message Sent!' : '⏳ Queued',
          text: savedToDb ? ('To ' + customer.email) : ('Message queued for later delivery: ' + (apiError || 'Backend unavailable')),
          timer: savedToDb ? 1500 : null
        })
        
        // Refresh messages after sending (only if successful)
        if (savedToDb) {
          await this.loadMessages()
        }
        
        // Clear attachment after sending
        this.attachmentFile = null
        this.attachmentType = 'none'
      } catch (error) {
        console.error('Error sending message:', error)
        Swal.fire({
          icon: 'error',
          title: '❌ Failed to Send',
          text: 'There was an error sending your message. Data has been saved locally and will sync when online.',
          timer: 3000
        })
      } finally {
        this.isSubmitting = false
      }
    },

    // YOUR EXISTING METHODS
    selectCustomer(customer) {
      this.selectedCustomer = customer
    },

    getInitials(name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase()
    },

    getLastMessagePreview(customerId) {
      const emails = this.getCustomerMessages(customerId)
      return emails.length ? emails[0].content.substring(0, 50) + '...' : 'No messages sent yet'
    },

    getLastMessageTime(customerId) {
      const emails = this.getCustomerMessages(customerId)
      return emails.length ? this.formatMessageTime(emails[0].created_at) : ''
    },

    getUnreadCount() { return 0 }, // No customer messages

    getCustomerMessages(customerId) {
      return this.messages
        .filter(msg => msg.customer_id == customerId) // Using Laravel's field name
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    },

    formatMessageTime(timestamp) {
      const now = new Date()
      const messageTime = new Date(timestamp)
      const diffInHours = (now - messageTime) / (1000 * 60 * 60)
      if (diffInHours < 1) return 'Just now'
      else if (diffInHours < 24) return messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      else return messageTime.toLocaleDateString()
    },

    // Direct attachment handling methods
    openAttachmentDialog() {
      // Trigger file input click
      this.$refs.fileInput.click()
    },

    handleFileSelect(event) {
      const files = Array.from(event.target.files)
      if (files.length > 0) {
        const file = files[0]
        
        // Determine attachment type based on file type
        if (file.type.startsWith('image/')) {
          this.attachmentType = 'photo'
        } else {
          this.attachmentType = 'document'
        }
        
        this.attachmentFile = file
        
        // Show notification
        Swal.fire({
          icon: 'success',
          title: '📎 Attachment Selected',
          text: file.name + ' will be attached to your message',
          timer: 2000,
          showConfirmButton: false
        })
      }
    },

    closeAttachmentOptions() {
      // No longer needed since we removed the attachment options dropdown
    },

    scrollToBottom() {
      if (this.$refs.messagesContainer) {
        this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight
      }
    },

    handleStorageChange(event) {
      if (event.key === 'fashion_app_data' || event.key === 'messages') {
        this.loadCustomers()
        this.loadMessages()
      }
    },

    clearAttachment() {
      this.attachmentFile = null
      this.attachmentType = 'none'
    },

    clearSearch() {
      this.searchQuery = ''
      this.loadCustomers()
    }
  }
}
</script>
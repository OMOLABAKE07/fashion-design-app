<template>
  <!-- YOUR EXACT TEMPLATE - 100% UNCHANGED -->
  <div class="message-center">
    <div class="message-header">
      <h2>Message Center</h2>
      <div class="header-actions">
        <button @click="showNewMessage = true" class="btn-primary">
          New Message
        </button>
        <div class="sync-status">
          <SyncStatus />
        </div>
      </div>
    </div>

    <div class="message-layout">
      <!-- Customer List Sidebar -->
      <div class="customer-sidebar">
        <div class="search-box">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search customers..."
            class="search-input"
          />
          <button v-if="searchQuery" @click="clearSearch" class="btn-clear-search">✕</button>
        </div>
        
        <div class="customer-list">
          <div
            v-for="customer in filteredCustomers"
            :key="customer.id"
            class="customer-item"
            :class="{ active: selectedCustomer?.id === customer.id }"
            @click="selectCustomer(customer)"
          >
            <div class="customer-avatar">
              {{ getInitials(customer.name) }}
            </div>
            <div class="customer-info">
              <div class="customer-name">{{ customer.name }}</div>
              <div class="last-message">
                {{ getLastMessagePreview(customer.id) }}
              </div>
              <div class="message-meta">
                <span class="timestamp">{{ getLastMessageTime(customer.id) }}</span>
                <span v-if="getUnreadCount(customer.id) > 0" class="unread-badge">
                  {{ getUnreadCount(customer.id) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Message Thread -->
      <div class="message-thread">
        <div v-if="!selectedCustomer" class="no-selection">
          <div class="no-selection-content">
            <h3>Select a customer to start messaging</h3>
            <p>Choose a customer from the list to view your conversation history and send messages.</p>
          </div>
        </div>

        <div v-else class="thread-container">
          <div class="thread-header">
            <div class="customer-details">
              <div class="customer-avatar large">
                {{ getInitials(selectedCustomer.name) }}
              </div>
              <div>
                <h3>{{ selectedCustomer.name }}</h3>
                <p class="customer-contact">
                  {{ selectedCustomer.email }} • {{ selectedCustomer.phone }}
                </p>
              </div>
            </div>
            <!-- <div class="thread-actions">
              <button @click="markAsRead" class="btn-secondary btn-small">
                Mark as Read
              </button>
              <button @click="showCustomerDetails" class="btn-secondary btn-small">
                View Details
              </button>
            </div> -->
          </div>

          <div class="messages-container" ref="messagesContainer">
            <div
              v-for="message in getCustomerMessages(selectedCustomer.id)"
              :key="message.id"
              class="message message-sent"
            >
              <div class="message-content">
                <div class="message-text">{{ message.content }}</div>
                <!-- Display attachment info for Laravel messages -->
                <div v-if="message.attachment_type && message.attachment_type !== 'none'" class="message-attachments">
                  <div class="attachment">
                    <div class="file-attachment">
                      <span class="file-icon">
                        {{ message.attachment_type === 'photo' ? '📷' : '📄' }}
                      </span>
                      <span>{{ message.attachment_type }} attached</span>
                      <span v-if="message.attachment_path" class="file-path">
                        ({{ message.attachment_path }})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="message-meta">
                <span class="timestamp">{{ formatMessageTime(message.created_at) }}</span>
                <span class="status">{{ message.status || 'sent' }}</span>
              </div>
            </div>
          </div>

          <div class="message-composer">
            <form @submit.prevent="sendMessage" class="composer-form" @click="closeAttachmentOptions">
              <div class="composer-input">
                <textarea
                  v-model="newMessage"
                  placeholder="Type your message..."
                  class="message-textarea"
                  rows="3"
                  @keydown.enter.exact.prevent="sendMessage"
                  @keydown.enter.shift.exact="newMessage += '\n'"
                ></textarea>
                <div class="composer-actions">
                  <!-- ✅ YOUR ATTACHMENT BUTTON - 100% KEPT -->
                  <button type="button" @click.stop="showAttachmentOptions = !showAttachmentOptions" class="btn-icon">
                    📎
                  </button>
                  <!-- Attachment indicator -->
                  <span v-if="attachmentType !== 'none'" class="attachment-indicator" title="Attachment selected">
                    📎
                  </span>
                  <button v-if="attachmentType !== 'none'" type="button" @click="clearAttachment" class="btn-icon" title="Remove attachment">
                    ✕
                  </button>
                  <button type="submit" :disabled="!newMessage.trim() || isSubmitting" class="btn-primary btn-small">
                    {{ isSubmitting ? 'Sending...' : 'Send' }}
                  </button>
                </div>
              </div>
              
              <!-- ✅ YOUR ATTACHMENT OPTIONS - ENHANCED WITH CLICK OUTSIDE CLOSE -->
              <div v-if="showAttachmentOptions" class="attachment-options" @click.stop>
                <button type="button" @click="uploadImage" class="btn-secondary btn-small">
                  📷 Photo
                </button>
                <button type="button" @click="uploadFile" class="btn-secondary btn-small">
                  📄 Document
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- New Message Modal -->
    <div v-if="showNewMessage" class="modal-overlay" @click="showNewMessage = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>New Message</h3>
          <button @click="showNewMessage = false" class="btn-close">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Select Customer</label>
            <select v-model="newMessageCustomer" class="form-select">
              <option value="">Choose a customer...</option>
              <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                {{ customer.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Message</label>
            <textarea
              v-model="newMessageText"
              class="form-textarea"
              rows="4"
              placeholder="Type your message..."
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showNewMessage = false" class="btn-secondary">Cancel</button>
          <button @click="sendNewMessage" :disabled="!newMessageCustomer || !newMessageText.trim() || isSubmitting" class="btn-primary">
            {{ isSubmitting ? 'Sending...' : 'Send Message' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SyncStatus from './SyncStatus.vue'
import { syncUtils } from '@/utils/sync.js'
import Swal from 'sweetalert2'

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
      showAttachmentOptions: false,
      customers: [],
      messages: [], // Only your sent emails
      isSubmitting: false,
      searchDebounce: null,
      // Attachment handling
      attachmentFile: null,
      attachmentType: 'none'
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
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.handleStorageChange)
    // Clean up debounce timer
    if (this.searchDebounce) {
      clearTimeout(this.searchDebounce)
    }
  },
  methods: {
    // ✅ LOAD CUSTOMERS - WORKS WITH YOUR SEARCH CONTROLLER
    // ✅ FIXED loadCustomers() - - WORKS WITH YOUR API
    async loadCustomers() {
      try {
        // 1️⃣ LOCAL FIRST (INSTANT LOAD)
        let localCustomers = syncUtils.getAllCustomers()
        if (localCustomers?.length > 0) {
          this.customers = localCustomers
        }

        // 2️⃣ YOUR BACKEND API with search support
        const searchParam = this.searchQuery ? `?search=${encodeURIComponent(this.searchQuery)}` : ''
        const response = await fetch(`http://localhost:8000/api/v1/customers${searchParam}`)
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
          syncUtils.saveAllCustomers(this.customers)
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
        const response = await fetch('http://localhost:8000/api/v1/messages')
        if (response.ok) {
          const result = await response.json()
          // Handle Laravel's response format
          let messages = Array.isArray(result.data) ? result.data : (result.data ? Object.values(result.data) : [])
          
          // Process attachment information
          messages = messages.map(message => ({
            ...message,
            attachment_type: message.attachment_type || 'none',
            attachment_path: message.attachment_path || null
          }))
          
          this.messages = messages
        } else {
          // Handle non-OK responses
          console.error('Failed to load messages:', response.status, response.statusText)
          // Fallback to local storage
          this.messages = syncUtils.getAllMessages() || []
        }
      } catch (error) {
        console.error('Error loading messages:', error)
        // Fallback to local storage when API is unreachable
        this.messages = syncUtils.getAllMessages() || []
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
          
          const response = await fetch('http://localhost:8000/api/v1/messages', {
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
        
        // Save to local storage using syncUtils
        syncUtils.saveMessage(savedMessage)
        
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
          text: 'There was an error sending your message. Please try again.',
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

    // markAsRead() {},

    // showCustomerDetails() {
    //   this.$emit('view-customer', this.selectedCustomer)
    // },

    // ✅ YOUR ATTACHMENT BUTTONS - ENHANCED WITH REAL FUNCTIONALITY FOR LARAVEL BACKEND
    async uploadImage() {
      console.log('📷 Uploading photo to email...')
      this.showAttachmentOptions = false
      
      // Create a file input element
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.accept = 'image/*'
      fileInput.multiple = false // Laravel backend expects single file
      
      // Handle file selection
      fileInput.onchange = (event) => {
        const files = Array.from(event.target.files)
        if (files.length > 0) {
          this.attachmentFile = files[0]
          this.attachmentType = 'photo'
          
          // Show notification
          Swal.fire({
            icon: 'success',
            title: '📎 Photo Selected',
            text: files[0].name + ' will be attached to your message',
            timer: 2000,
            showConfirmButton: false
          })
        }
      }
      
      // Trigger file selection
      fileInput.click()
    },

    async uploadFile() {
      console.log('📄 Uploading document to email...')
      this.showAttachmentOptions = false
      
      // Create a file input element
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.accept = '.pdf,.doc,.docx' // Accept document types
      fileInput.multiple = false // Laravel backend expects single file
      
      // Handle file selection
      fileInput.onchange = (event) => {
        const files = Array.from(event.target.files)
        if (files.length > 0) {
          this.attachmentFile = files[0]
          this.attachmentType = 'document'
          
          // Show notification
          Swal.fire({
            icon: 'success',
            title: '📎 Document Selected',
            text: files[0].name + ' will be attached to your message',
            timer: 2000,
            showConfirmButton: false
          })
        }
      }
      
      // Trigger file selection
      fileInput.click()
    },

    // Handle the actual file upload process

    closeAttachmentOptions() {
      this.showAttachmentOptions = false
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


<style scoped>
.message-center {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  /* margin-top: 3rem; */
}

.message-header {
  background: white;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message-header h2 {
  color: #2c3e50;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.message-layout {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.customer-sidebar {
  width: 350px;
  background: white;
  border-right: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
}

.search-box {
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 0.75rem; /* Add right padding for clear button */
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
}

.btn-clear-search {
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #6c757d;
}

.customer-list {
  flex: 1;
  overflow-y: auto;
}

.customer-item {
  padding: 1rem;
  border-bottom: 1px solid #f1f3f4;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.customer-item:hover {
  background: #f8f9fa;
}

.customer-item.active {
  background: #e3f2fd;
  border-left: 3px solid #3498db;
}

.customer-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: #3498db;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.customer-avatar.large {
  width: 60px;
  height: 60px;
  font-size: 1.5rem;
}

.customer-info {
  flex: 1;
  min-width: 0;
}

.customer-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.last-message {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  font-size: 0.8rem;
  color: #adb5bd;
}

.unread-badge {
  background: #3498db;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.message-thread {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

.no-selection {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.no-selection-content {
  text-align: center;
  color: #6c757d;
}

.no-selection-content h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.thread-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.thread-header {
  padding: 1rem 2rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.customer-details {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.customer-details h3 {
  margin: 0;
  color: #2c3e50;
}

.customer-contact {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.thread-actions {
  margin-top: 0.5rem;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 70%;
}

.message-sent {
  align-self: flex-end;
}

.message-received {
  align-self: flex-start;
}

.message-content {
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 0.5rem;
}

.message-sent .message-content {
  background: #3498db;
  color: white;
  border-bottom-right-radius: 4px;
}

.message-received .message-content {
  background: #f1f3f4;
  color: #2c3e50;
  border-bottom-left-radius: 4px;
}

.message-text {
  line-height: 1.5;
}

.message-attachments {
  margin-top: 0.5rem;
}

.attachment img {
  max-width: 200px;
  border-radius: 6px;
}

.file-attachment {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(0,0,0,0.1);
  border-radius: 6px;
  font-size: 0.9rem;
}

.file-path {
  color: #6c757d;
  font-size: 0.8rem;
  font-style: italic;
}

.message-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #6c757d;
  padding: 0 0.5rem;
}

.message-composer {
  padding: 1rem 2rem;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
}

.composer-form {
  max-width: 800px;
  margin: 0 auto;
}

.composer-input {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.message-textarea {
  flex: 1;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  resize: none;
  min-height: 60px;
}

.message-textarea:focus {
  outline: none;
  border-color: #3498db;
}

.composer-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
}

.attachment-indicator {
  position: absolute;
  top: -8px;
  right: 40px;
  background: #3498db;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(52, 152, 219, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(52, 152, 219, 0);
  }
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background 0.3s;
  position: relative;
  z-index: 1;
}

.btn-icon:hover {
  background: #e9ecef;
}

.attachment-options {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.attachment-options button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.form-select,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 1rem;
}

.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3498db;
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

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .customer-sidebar {
    width: 100%;
  }
  
  .message-layout {
    flex-direction: column;
  }
  
  .thread-header {
    padding: 1rem;
  }
  
  .messages-container {
    padding: 1rem;
  }
  
  .message-composer {
    padding: 1rem;
  }
  
  .customer-details {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .thread-actions {
    margin-top: 0.5rem;
  }
}
</style>

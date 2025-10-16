<template>
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
            <div class="thread-actions">
              <button @click="markAsRead" class="btn-secondary btn-small">
                Mark as Read
              </button>
              <button @click="showCustomerDetails" class="btn-secondary btn-small">
                View Details
              </button>
            </div>
          </div>

          <div class="messages-container" ref="messagesContainer">
            <div
              v-for="message in getCustomerMessages(selectedCustomer.id)"
              :key="message.id"
              class="message"
              :class="{ 'message-sent': message.sender === 'admin', 'message-received': message.sender === 'customer' }"
            >
              <div class="message-content">
                <div class="message-text">{{ message.text }}</div>
                <div v-if="message.attachments?.length" class="message-attachments">
                  <div
                    v-for="attachment in message.attachments"
                    :key="attachment.id"
                    class="attachment"
                  >
                    <img v-if="attachment.type === 'image'" :src="attachment.url" :alt="attachment.name" />
                    <div v-else class="file-attachment">
                      <span class="file-icon">📎</span>
                      <span>{{ attachment.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="message-meta">
                <span class="timestamp">{{ formatMessageTime(message.timestamp) }}</span>
                <span v-if="message.sender === 'admin'" class="status">
                  {{ message.status || 'sent' }}
                </span>
              </div>
            </div>
          </div>

          <div class="message-composer">
            <form @submit.prevent="sendMessage" class="composer-form">
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
                  <button type="button" @click="showAttachmentOptions = !showAttachmentOptions" class="btn-icon">
                    📎
                  </button>
                  <button type="submit" :disabled="!newMessage.trim()" class="btn-primary btn-small">
                    Send
                  </button>
                </div>
              </div>
              
              <div v-if="showAttachmentOptions" class="attachment-options">
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
          <button @click="sendNewMessage" :disabled="!newMessageCustomer || !newMessageText.trim()" class="btn-primary">
            Send Message
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SyncStatus from './SyncStatus.vue'

export default {
  name: 'MessageCenter',
  components: {
    SyncStatus
  },
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
      messages: [
        // Sample messages - in a real app this would come from a store/API
        {
          id: 1,
          customerId: 1,
          sender: 'customer',
          text: 'Hi! I wanted to check on the status of my dress order.',
          timestamp: new Date('2024-01-20T10:30:00'),
          status: 'read'
        },
        {
          id: 2,
          customerId: 1,
          sender: 'admin',
          text: 'Hello Sarah! Your dress is currently in the final fitting stage. We should have it ready by next Friday.',
          timestamp: new Date('2024-01-20T10:35:00'),
          status: 'delivered'
        },
        {
          id: 3,
          customerId: 1,
          sender: 'customer',
          text: 'That\'s great! Can I schedule a fitting for next week?',
          timestamp: new Date('2024-01-20T10:40:00'),
          status: 'read'
        },
        {
          id: 4,
          customerId: 2,
          sender: 'admin',
          text: 'Hi Michael! I have your measurements ready. When would be a good time to schedule your consultation?',
          timestamp: new Date('2024-01-19T14:20:00'),
          status: 'delivered'
        }
      ]
    }
  },
  computed: {
    filteredCustomers() {
      if (!this.searchQuery) return this.customers
      
      return this.customers.filter(customer =>
        customer.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    }
  },
  async mounted() {
    await this.loadCustomers()
    // Listen for customer updates
    window.addEventListener('storage', this.handleStorageChange)
    // Auto-scroll to bottom when component mounts
    this.$nextTick(() => {
      this.scrollToBottom()
    })
  },
  beforeUnmount() {
    // Clean up event listener
    window.removeEventListener('storage', this.handleStorageChange)
  },
  methods: {
    async loadCustomers() {
      try {
        const { syncUtils } = await import('@/utils/sync.js')
        const storedCustomers = syncUtils.getAllCustomers()
        
        if (storedCustomers.length > 0) {
          this.customers = storedCustomers
        } else {
          // Fallback to sample data if no stored customers
          this.customers = [
            {
              id: 1,
              name: 'Sarah Johnson',
              email: 'sarah@email.com',
              phone: '+1 (555) 123-4567'
            },
            {
              id: 2,
              name: 'Michael Chen',
              email: 'michael@email.com',
              phone: '+1 (555) 987-6543'
            }
          ]
        }
      } catch (error) {
        console.error('Error loading customers:', error)
        // Fallback to sample data
        this.customers = [
          {
            id: 1,
            name: 'Sarah Johnson',
            email: 'sarah@email.com',
            phone: '+1 (555) 123-4567'
          },
          {
            id: 2,
            name: 'Michael Chen',
            email: 'michael@email.com',
            phone: '+1 (555) 987-6543'
          }
        ]
      }
    },
    handleStorageChange(event) {
      // Refresh customers when localStorage changes
      if (event.key === 'fashion_app_data') {
        this.loadCustomers()
      }
    },
    selectCustomer(customer) {
      this.selectedCustomer = customer
      this.markCustomerMessagesAsRead(customer.id)
    },
    getInitials(name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase()
    },
    getLastMessagePreview(customerId) {
      const customerMessages = this.getCustomerMessages(customerId)
      if (customerMessages.length === 0) return 'No messages yet'
      
      const lastMessage = customerMessages[customerMessages.length - 1]
      return lastMessage.text.length > 50 
        ? lastMessage.text.substring(0, 50) + '...'
        : lastMessage.text
    },
    getLastMessageTime(customerId) {
      const customerMessages = this.getCustomerMessages(customerId)
      if (customerMessages.length === 0) return ''
      
      const lastMessage = customerMessages[customerMessages.length - 1]
      return this.formatMessageTime(lastMessage.timestamp)
    },
    getUnreadCount(customerId) {
      return this.getCustomerMessages(customerId).filter(msg => 
        msg.sender === 'customer' && msg.status !== 'read'
      ).length
    },
    getCustomerMessages(customerId) {
      return this.messages
        .filter(msg => msg.customerId === customerId)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    },
    formatMessageTime(timestamp) {
      const now = new Date()
      const messageTime = new Date(timestamp)
      const diffInHours = (now - messageTime) / (1000 * 60 * 60)
      
      if (diffInHours < 1) {
        return 'Just now'
      } else if (diffInHours < 24) {
        return messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      } else {
        return messageTime.toLocaleDateString()
      }
    },
    async sendMessage() {
      if (!this.newMessage.trim() || !this.selectedCustomer) return
      
      const message = {
        id: Date.now(),
        customerId: this.selectedCustomer.id,
        sender: 'admin',
        text: this.newMessage.trim(),
        timestamp: new Date(),
        status: 'sending'
      }
      
      this.messages.push(message)
      this.newMessage = ''
      
      // Simulate message sending
      setTimeout(() => {
        message.status = 'delivered'
      }, 1000)
      
      // Auto-scroll to bottom
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },
    sendNewMessage() {
      if (!this.newMessageCustomer || !this.newMessageText.trim()) return
      
      const customer = this.customers.find(c => c.id === parseInt(this.newMessageCustomer))
      if (!customer) return
      
      const message = {
        id: Date.now(),
        customerId: customer.id,
        sender: 'admin',
        text: this.newMessageText.trim(),
        timestamp: new Date(),
        status: 'delivered'
      }
      
      this.messages.push(message)
      
      // Select the customer and clear the modal
      this.selectedCustomer = customer
      this.showNewMessage = false
      this.newMessageCustomer = ''
      this.newMessageText = ''
    },
    markAsRead() {
      if (!this.selectedCustomer) return
      this.markCustomerMessagesAsRead(this.selectedCustomer.id)
    },
    markCustomerMessagesAsRead(customerId) {
      this.messages.forEach(msg => {
        if (msg.customerId === customerId && msg.sender === 'customer') {
          msg.status = 'read'
        }
      })
    },
    showCustomerDetails() {
      // Emit event to parent or navigate to customer details
      this.$emit('view-customer', this.selectedCustomer)
    },
    uploadImage() {
      // Implement image upload functionality
      console.log('Upload image')
      this.showAttachmentOptions = false
    },
    uploadFile() {
      // Implement file upload functionality
      console.log('Upload file')
      this.showAttachmentOptions = false
    },
    scrollToBottom() {
      if (this.$refs.messagesContainer) {
        this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight
      }
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
  margin-top: 120px;
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
  display: flex;
  gap: 0.5rem;
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
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background 0.3s;
}

.btn-icon:hover {
  background: #e9ecef;
}

.attachment-options {
  margin-top: 1rem;
  display: flex;
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

// Offline Sync Utility for Fashion Design App
// Handles data synchronization between local storage and remote server

class OfflineSyncManager {
  constructor() {
    // console.log('Initializing OfflineSyncManager') // Debug log
    this.isOnline = navigator.onLine
    this.syncQueue = []
    this.syncInProgress = false
    this.syncInterval = null
    this.retryAttempts = 3
    this.retryDelay = 5000 // 5 seconds
    
    this.init()
  }


  
  init() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true
      // console.log('Network connection restored')
      this.performSync()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      // console.log('Network connection lost - switching to offline mode')
    })

    // Load existing sync queue from localStorage
    this.loadSyncQueue()

    // Start periodic sync attempts when online
    this.startPeriodicSync()
  }

  // Add data to sync queue
  queueForSync(data, operation, entityType) {
    const syncItem = {
      id: this.generateSyncId(),
      timestamp: new Date().toISOString(),
      operation, // 'create', 'update', 'delete'
      entityType, // 'customer', 'measurement', 'design', 'message'
      data,
      attempts: 0,
      lastAttempt: null,
      status: 'pending'
    }

    this.syncQueue.push(syncItem)
    this.saveSyncQueue()
    
    // console.log(`Queued ${operation} operation for ${entityType}:`, data)
    
    // Try immediate sync if online
    if (this.isOnline && !this.syncInProgress) {
      this.performSync()
    }

    return syncItem.id
  }

  // Perform synchronization
  async performSync() {
    if (this.syncInProgress || !this.isOnline || this.syncQueue.length === 0) {
      // Return an empty results object instead of undefined
      return {
        successful: [],
        failed: []
      }
    }

    this.syncInProgress = true
    // console.log(`Starting sync for ${this.syncQueue.length} items`)

    const itemsToSync = [...this.syncQueue]
    const results = {
      successful: [],
      failed: []
    }

    for (const item of itemsToSync) {
      try {
        await this.syncItem(item)
        results.successful.push(item)
        this.removeFromQueue(item.id)
      } catch (error) {
        // console.error(`Sync failed for item ${item.id}:`, error)
        item.attempts++
        item.lastAttempt = new Date().toISOString()
        item.status = item.attempts >= this.retryAttempts ? 'failed' : 'retry'
        
        if (item.status === 'failed') {
          results.failed.push(item)
          this.removeFromQueue(item.id)
        }
      }
    }

    this.saveSyncQueue()
    this.syncInProgress = false

    // console.log(`Sync completed: ${results.successful.length} successful, ${results.failed.length} failed`)
    
    // Emit sync completion event
    this.emitSyncEvent('sync-completed', {
      successful: results.successful.length,
      failed: results.failed.length,
      totalProcessed: results.successful.length + results.failed.length
    })

    return results
  }

  // Sync individual item
  async syncItem(item) {
    const { operation, entityType, data } = item
    
    // Simulate API calls - in a real app, these would be actual HTTP requests
    const apiEndpoint = this.getApiEndpoint(entityType)
    
    switch (operation) {
      case 'create':
        return await this.apiCall('POST', apiEndpoint, data)
      case 'update':
        return await this.apiCall('PUT', `${apiEndpoint}/${data.id}`, data)
      case 'delete':
        return await this.apiCall('DELETE', `${apiEndpoint}/${data.id}`)
      default:
        throw new Error(`Unknown operation: ${operation}`)
    }
  }

  // Simulate API call - replace with actual HTTP requests
  async apiCall(method, url, data = null) {
    // In a real app, you would use fetch or axios here:
    const fullUrl = `http://localhost:3000/api${url}`;
    
    const options = {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    try {
      const response = await fetch(fullUrl, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      
      const result = await response.json();
      // Handle Laravel's response format
      const processedResult = result.data || result;
      // console.log(`API ${method} ${fullUrl} successful:`, processedResult);
      return processedResult;
    } catch (error) {
      // console.error(`API ${method} ${fullUrl} failed:`, error);
      // Return a default structure so the app can continue working
      return { 
        success: false, 
        error: error.message,
        data: null 
      };
    }
  }

  // Get API endpoint for entity type
  getApiEndpoint(entityType) {
    const endpoints = {
      customer: '/api/v1/customers',
      measurement: '/api/v1/measurements',
      design: '/api/v1/designs',
      message: '/api/v1/messages'
    }
    return endpoints[entityType] || '/api/unknown'
  }

  // Generate unique sync ID
  generateSyncId() {
    return `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Start periodic sync attempts
  startPeriodicSync() {
    this.syncInterval = setInterval(() => {
      if (this.isOnline && this.syncQueue.length > 0 && !this.syncInProgress) {
        this.performSync()
      }
    }, 30000) // Try sync every 30 seconds
  }

  // Stop periodic sync
  stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }

  // Save sync queue to localStorage
  saveSyncQueue() {
    // Check if we're in a browser environment where localStorage is available
    if (typeof localStorage === 'undefined') {
      // console.warn('localStorage is not available in this environment')
      return
    }
    
    try {
      localStorage.setItem('fashion_app_sync_queue', JSON.stringify(this.syncQueue))
    } catch (error) {
      // console.error('Failed to save sync queue:', error)
    }
  }

  // Load sync queue from localStorage
  loadSyncQueue() {
    // Check if we're in a browser environment where localStorage is available
    if (typeof localStorage === 'undefined') {
      // console.warn('localStorage is not available in this environment')
      this.syncQueue = []
      return
    }
    
    try {
      const saved = localStorage.getItem('fashion_app_sync_queue')
      if (saved) {
        this.syncQueue = JSON.parse(saved)
        // console.log(`Loaded ${this.syncQueue.length} items from sync queue`)
      }
    } catch (error) {
      // console.error('Failed to load sync queue:', error)
      this.syncQueue = []
    }
  }

  // Remove item from sync queue
  removeFromQueue(syncId) {
    this.syncQueue = this.syncQueue.filter(item => item.id !== syncId)
    this.saveSyncQueue()
  }

  // Clear all sync queue
  clearSyncQueue() {
    this.syncQueue = []
    this.saveSyncQueue()
    // console.log('Sync queue cleared')
  }

  // Get sync status
  getSyncStatus() {
    return {
      isOnline: this.isOnline,
      queueLength: this.syncQueue.length,
      syncInProgress: this.syncInProgress,
      pendingItems: this.syncQueue.filter(item => item.status === 'pending').length,
      retryItems: this.syncQueue.filter(item => item.status === 'retry').length,
      failedItems: this.syncQueue.filter(item => item.status === 'failed').length
    }
  }

  // Get sync queue for display
  getSyncQueue() {
    return [...this.syncQueue]
  }

  // Emit sync events
  emitSyncEvent(eventType, data) {
    const event = new CustomEvent('sync-event', {
      detail: { type: eventType, data }
    })
    window.dispatchEvent(event)
  }

  // Cleanup
  destroy() {
    this.stopPeriodicSync()
    window.removeEventListener('online', this.handleOnline)
    window.removeEventListener('offline', this.handleOffline)
  }
}

// Local Storage Manager for offline data
class LocalStorageManager {
  constructor() {
    this.storageKey = 'fashion_app_data'
    // console.log('Initializing LocalStorageManager') // Debug log
    this.data = this.loadData()
    // console.log('LocalStorageManager initialized with data:', this.data) // Debug log
  }

  // Load data from localStorage
  loadData() {
    // Check if we're in a browser environment where localStorage is available
    if (typeof localStorage === 'undefined') {
      // console.warn('localStorage is not available in this environment')
      return {
        customers: [],
        measurements: [],
        designs: [],
        messages: [],
        lastUpdated: null
      }
    }
    
    try {
      const saved = localStorage.getItem(this.storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Ensure all required data structures exist
        return {
          customers: Array.isArray(parsed.customers) ? parsed.customers : [],
          measurements: Array.isArray(parsed.measurements) ? parsed.measurements : [],
          designs: Array.isArray(parsed.designs) ? parsed.designs : [],
          messages: Array.isArray(parsed.messages) ? parsed.messages : [],
          lastUpdated: parsed.lastUpdated || null
        }
      } else {
        return {
          customers: [],
          measurements: [],
          designs: [],
          messages: [],
          lastUpdated: null
        }
      }
    } catch (error) {
      // console.error('Failed to load data from localStorage:', error)
      return {
        customers: [],
        measurements: [],
        designs: [],
        messages: [],
        lastUpdated: null
      }
    }
  }

  // Save data to localStorage
  saveData() {
    // Check if we're in a browser environment where localStorage is available
    if (typeof localStorage === 'undefined') {
      // console.warn('localStorage is not available in this environment')
      return
    }
    
    try {
      this.data.lastUpdated = new Date().toISOString()
      localStorage.setItem(this.storageKey, JSON.stringify(this.data))
    } catch (error) {
      // console.error('Failed to save data to localStorage:', error)
    }
  }

  // Get all data
  getAllData() {
    return { ...this.data }
  }

  // Get data by type
  getData(type) {
    return this.data[type] || []
  }

  // Add new item
  addItem(type, item) {
    if (!this.data[type]) {
      this.data[type] = []
    }
    
    const newItem = {
      ...item,
      id: item.id || this.generateId(),
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      synced: false
    }
    
    this.data[type].push(newItem)
    this.saveData()
    return newItem
  }

  // Update existing item
  updateItem(type, id, updates) {
    if (!this.data[type]) {
      return null
    }
    
    const index = this.data[type].findIndex(item => item.id === id)
    if (index === -1) {
      return null
    }
    
    this.data[type][index] = {
      ...this.data[type][index],
      ...updates,
      updatedAt: new Date().toISOString(),
      synced: false
    }
    
    this.saveData()
    return this.data[type][index]
  }

  // Delete item
  deleteItem(type, id) {
    if (!this.data[type]) {
      return false
    }
    
    const index = this.data[type].findIndex(item => item.id === id)
    if (index === -1) {
      return false
    }
    
    const deletedItem = this.data[type].splice(index, 1)
    this.saveData()
    return true
  }

  // Mark item as synced
  markAsSynced(type, id) {
    if (!this.data[type]) {
      return false
    }
    
    const item = this.data[type].find(item => item.id === id)
    if (item) {
      item.synced = true
      item.syncedAt = new Date().toISOString()
      this.saveData()
      return true
    }
    
    return false
  }

  // Generate unique ID
  generateId() {
    return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Clear all data
  clearAllData() {
    this.data = {
      customers: [],
      measurements: [],
      designs: [],
      messages: [],
      lastUpdated: null
    }
    this.saveData()
  }

  // Get unsynced items
  getUnsyncedItems(type) {
    if (!this.data[type]) {
      return []
    }
    return this.data[type].filter(item => !item.synced)
  }

  // Get data statistics
  getStats() {
    const stats = {}
    for (const type in this.data) {
      if (Array.isArray(this.data[type])) {
        stats[type] = {
          total: this.data[type].length,
          synced: this.data[type].filter(item => item.synced).length,
          unsynced: this.data[type].filter(item => !item.synced).length
        }
      }
    }
    return stats
  }
}

// Export singleton instances
// console.log('Creating syncManager instance') // Debug log
export const syncManager = new OfflineSyncManager()
// console.log('Creating storageManager instance') // Debug log
export const storageManager = new LocalStorageManager()

// Export classes for testing or custom instances
export { OfflineSyncManager, LocalStorageManager }

// Helper functions for components to use
// console.log('Initializing syncUtils') // Debug log
export const syncUtils = {
 saveMessage(message) {
    const messages = storageManager.getData('messages')
    messages.unshift(message)
    storageManager.data.messages = messages
    storageManager.saveData()
    return message
  },

  saveAllCustomers(customers) {
    storageManager.data.customers = customers
    storageManager.saveData()
    return customers
  },

  // Customer operations
  async saveCustomer(customerData) {
    // console.log('Saving customer:', customerData) // Debug log
    const savedCustomer = storageManager.addItem('customers', customerData)
    // console.log('Saved customer result:', savedCustomer) // Debug log
    syncManager.queueForSync(savedCustomer, 'create', 'customer')
    return savedCustomer
  },

  async updateCustomer(id, customerData) {
    // console.log('Updating customer:', id, customerData) // Debug log
    const updatedCustomer = storageManager.updateItem('customers', id, customerData)
    // console.log('Updated customer result:', updatedCustomer) // Debug log
    if (updatedCustomer) {
      syncManager.queueForSync(updatedCustomer, 'update', 'customer')
    }
    return updatedCustomer
  },

  async deleteCustomer(id) {
    // console.log('Deleting customer:', id) // Debug log
    const deleted = storageManager.deleteItem('customers', id)
    // console.log('Delete customer result:', deleted) // Debug log
    if (deleted) {
      syncManager.queueForSync({ id }, 'delete', 'customer')
    }
    return deleted
  },

  // Measurement operations
  async saveMeasurement(measurementData) {
    const savedMeasurement = storageManager.addItem('measurements', measurementData)
    syncManager.queueForSync(savedMeasurement, 'create', 'measurement')
    return savedMeasurement
  },

  async updateMeasurement(id, measurementData) {
    const updatedMeasurement = storageManager.updateItem('measurements', id, measurementData)
    if (updatedMeasurement) {
      syncManager.queueForSync(updatedMeasurement, 'update', 'measurement')
    }
    return updatedMeasurement
  },

  async deleteMeasurement(id) {
    const deleted = storageManager.deleteItem('measurements', id)
    if (deleted) {
      syncManager.queueForSync({ id }, 'delete', 'measurement')
    }
    return deleted
  },

  // Design operations
  async saveDesign(designData) {
    const savedDesign = storageManager.addItem('designs', designData)
    syncManager.queueForSync(savedDesign, 'create', 'design')
    return savedDesign
  },

  async updateDesign(id, designData) {
    const updatedDesign = storageManager.updateItem('designs', id, designData)
    if (updatedDesign) {
      syncManager.queueForSync(updatedDesign, 'update', 'design')
    }
    return updatedDesign
  },

  async deleteDesign(id) {
    const deleted = storageManager.deleteItem('designs', id)
    if (deleted) {
      syncManager.queueForSync({ id }, 'delete', 'design')
    }
    return deleted
  },

  // Get all data
  getAllCustomers() {
    const customers = storageManager.getData('customers')
    // console.log('getAllCustomers result:', customers) // Debug log
    return customers
  },

  getAllMeasurements() {
    return storageManager.getData('measurements')
  },

  getAllDesigns() {
    return storageManager.getData('designs')
  },

  getAllMessages() {
    return storageManager.getData('messages')
  },

  // Get sync status
  getSyncStatus() {
    return syncManager.getSyncStatus()
  },

  // Manual sync
  async performSync() {
    return await syncManager.performSync()
  },

  // Clear cache
  clearCache() {
    storageManager.clearAllData()
    syncManager.clearSyncQueue()
  }
}

export default syncUtils
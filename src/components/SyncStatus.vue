<template>
  <div class="sync-status">
    <div class="sync-indicator" :class="syncState">
      <div class="sync-icon">
        <span v-if="syncState === 'online'">🟢</span>
        <span v-else-if="syncState === 'syncing'">🔄</span>
        <span v-else-if="syncState === 'offline'">🔴</span>
        <span v-else-if="syncState === 'error'">⚠️</span>
      </div>
      <div class="sync-text">
        <span class="status-label">{{ statusText }}</span>
        <span v-if="lastSyncTime" class="last-sync">
          Last sync: {{ formatTime(lastSyncTime) }}
        </span>
      </div>
    </div>
    
    <!-- Sync Details Tooltip -->
    <div v-if="showDetails" class="sync-details">
      <div class="details-content">
        <h4>Sync Status Details</h4>
        <div class="detail-item">
          <span class="label">Connection:</span>
          <span :class="syncState">{{ connectionStatus }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Pending Changes:</span>
          <span>{{ pendingChangesCount }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Last Sync:</span>
          <span>{{ lastSyncTime ? formatFullTime(lastSyncTime) : 'Never' }}</span>
        </div>
        <div class="detail-item" v-if="syncError">
          <span class="label">Error:</span>
          <span class="error-message">{{ syncError }}</span>
        </div>
        <div class="sync-actions">
          <button @click="manualSync" :disabled="syncState === 'syncing'" class="btn-sync">
            {{ syncState === 'syncing' ? 'Syncing...' : 'Sync Now' }}
          </button>
          <button @click="clearCache" class="btn-clear">Clear Cache</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SyncStatus',
  data() {
    return {
      syncState: 'offline', // 'online', 'offline', 'syncing', 'error'
      lastSyncTime: null,
      syncError: null,
      showDetails: false,
      pendingChangesCount: 0,
      syncInterval: null,
      connectionCheckInterval: null
    }
  },
  computed: {
    statusText() {
      switch (this.syncState) {
        case 'online':
          return 'Online'
        case 'syncing':
          return 'Syncing...'
        case 'offline':
          return 'Offline'
        case 'error':
          return 'Sync Error'
        default:
          return 'Unknown'
      }
    },
    connectionStatus() {
      return this.syncState === 'online' ? 'Connected' : 'Disconnected'
    }
  },
  async mounted() {
    await this.initializeSync()
    this.checkConnection()
    this.startConnectionMonitoring()
    this.loadSyncState()
    this.setupSyncEventListeners()
  },
  beforeUnmount() {
    if (this.connectionCheckInterval) {
      clearInterval(this.connectionCheckInterval)
    }
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
    }
    window.removeEventListener('sync-event', this.handleSyncEvent)
  },
  methods: {
    async initializeSync() {
      try {
        const { syncManager, storageManager } = await import('@/utils/sync.js')
        this.syncManager = syncManager
        this.storageManager = storageManager
        
        // Update pending changes count from storage manager
        const stats = this.storageManager.getStats()
        this.pendingChangesCount = Object.values(stats).reduce((total, stat) => total + stat.unsynced, 0)
      } catch (error) {
        console.error('Error initializing sync:', error)
      }
    },
    setupSyncEventListeners() {
      window.addEventListener('sync-event', this.handleSyncEvent)
    },
    handleSyncEvent(event) {
      const { type, data } = event.detail
      
      switch (type) {
        case 'sync-completed':
          this.pendingChangesCount = 0
          this.lastSyncTime = new Date()
          this.syncState = 'online'
          break
        case 'sync-error':
          this.syncState = 'error'
          this.syncError = data.error
          break
      }
    },
    async checkConnection() {
      try {
        // Simulate network check - in a real app this would check actual connectivity
        const response = await fetch('/api/health', { 
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache'
        })
        this.syncState = 'online'
        this.syncError = null
        this.autoSync()
      } catch (error) {
        this.syncState = 'offline'
        console.log('Offline mode activated')
      }
    },
    startConnectionMonitoring() {
      // Check connection every 30 seconds
      this.connectionCheckInterval = setInterval(() => {
        this.checkConnection()
      }, 30000)
    },
    async autoSync() {
      if (this.syncState === 'online' && this.pendingChangesCount > 0) {
        await this.performSync()
      }
    },
    async manualSync() {
      if (this.syncState !== 'syncing') {
        await this.performSync()
      }
    },
    async performSync() {
      this.syncState = 'syncing'
      this.syncError = null
      
      try {
        let results = null;
        
        if (this.syncManager) {
          // Use the sync manager for actual sync
          results = await this.syncManager.performSync()
          this.lastSyncTime = new Date()
          this.pendingChangesCount = 0
          this.syncState = 'online'
        } else {
          // Fallback to simulated sync
          await new Promise(resolve => setTimeout(resolve, 2000))
          this.lastSyncTime = new Date()
          this.pendingChangesCount = 0
          this.syncState = 'online'
          
          // Create a default results object for the fallback
          results = {
            successful: [],
            failed: []
          }
        }
        
        // Emit sync event for parent components (with safety check)
        this.$emit('sync-completed', {
          timestamp: this.lastSyncTime,
          changesSynced: results && results.successful ? results.successful.length : 0
        })
        
        this.saveSyncState()
      } catch (error) {
        this.syncState = 'error'
        this.syncError = error.message || 'Sync failed'
        console.error('Sync error:', error)
      }
    },
    async clearCache() {
      if (confirm('Are you sure you want to clear the local cache? This will remove all unsynced changes.')) {
        try {
          if (this.storageManager && this.syncManager) {
            // Use the sync utilities to clear cache
            const { syncUtils } = await import('@/utils/sync.js')
            syncUtils.clearCache()
          } else {
            // Fallback to manual clearing
            localStorage.removeItem('fashion_app_cache')
            localStorage.removeItem('fashion_app_data')
            localStorage.removeItem('fashion_app_sync_queue')
            localStorage.removeItem('sync_state')
          }
          
          this.pendingChangesCount = 0
          this.lastSyncTime = null
          this.syncError = null
          
          this.$emit('cache-cleared')
          console.log('Cache cleared successfully')
        } catch (error) {
          console.error('Error clearing cache:', error)
        }
      }
    },
    loadSyncState() {
      try {
        const syncState = localStorage.getItem('sync_state')
        if (syncState) {
          const parsed = JSON.parse(syncState)
          this.lastSyncTime = parsed.lastSyncTime ? new Date(parsed.lastSyncTime) : null
          this.pendingChangesCount = parsed.pendingChangesCount || 0
        }
      } catch (error) {
        console.error('Error loading sync state:', error)
      }
    },
    saveSyncState() {
      try {
        const syncState = {
          lastSyncTime: this.lastSyncTime?.toISOString(),
          pendingChangesCount: this.pendingChangesCount
        }
        localStorage.setItem('sync_state', JSON.stringify(syncState))
      } catch (error) {
        console.error('Error saving sync state:', error)
      }
    },
    formatTime(date) {
      const now = new Date()
      const diff = now - date
      const minutes = Math.floor(diff / 60000)
      
      if (minutes < 1) return 'Just now'
      if (minutes < 60) return `${minutes}m ago`
      if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`
      return date.toLocaleDateString()
    },
    formatFullTime(date) {
      return date.toLocaleString()
    },
    // Method to be called when data changes (for pending changes count)
    markDataChanged() {
      this.pendingChangesCount++
      this.saveSyncState()
    },
    // Method to be called when data is saved locally
    markDataSaved() {
      // In a real app, this would queue the data for sync
      this.pendingChangesCount++
      this.saveSyncState()
    }
  }
}
</script>

<style scoped>
.sync-status {
  position: relative;
  display: inline-block;
}

.sync-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid transparent;
}

.sync-indicator:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.3);
}

.sync-indicator.online {
  background: rgba(40, 167, 69, 0.2);
  border-color: rgba(40, 167, 69, 0.3);
}

.sync-indicator.offline {
  background: rgba(220, 53, 69, 0.2);
  border-color: rgba(220, 53, 69, 0.3);
}

.sync-indicator.syncing {
  background: rgba(255, 193, 7, 0.2);
  border-color: rgba(255, 193, 7, 0.3);
}

.sync-indicator.error {
  background: rgba(255, 87, 34, 0.2);
  border-color: rgba(255, 87, 34, 0.3);
}

.sync-icon {
  font-size: 0.8rem;
}

.sync-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.status-label {
  font-weight: 600;
  font-size: 0.9rem;
  color: white;
}

.last-sync {
  font-size: 0.7rem;
  opacity: 0.8;
  color: white;
}

.sync-details {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1000;
  min-width: 300px;
}

.details-content {
  padding: 1.5rem;
}

.details-content h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f3f4;
}

.detail-item:last-of-type {
  border-bottom: none;
}

.detail-item .label {
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
}

.detail-item .online {
  color: #28a745;
  font-weight: 600;
}

.detail-item .offline {
  color: #dc3545;
  font-weight: 600;
}

.error-message {
  color: #dc3545;
  font-size: 0.8rem;
  max-width: 150px;
  word-wrap: break-word;
}

.sync-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.btn-sync,
.btn-clear {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s;
}

.btn-sync {
  background: #3498db;
  color: white;
}

.btn-sync:hover:not(:disabled) {
  background: #2980b9;
}

.btn-sync:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.btn-clear {
  background: #6c757d;
  color: white;
}

.btn-clear:hover {
  background: #5a6268;
}

@media (max-width: 768px) {
  .sync-details {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 350px;
  }
  
  .sync-actions {
    flex-direction: column;
  }
}
</style>

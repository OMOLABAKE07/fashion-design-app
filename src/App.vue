<template>
  <div id="app" class="app-container">
    <!-- Global Header -->
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">Welcome to Fashion Design Studio</h1>
        <p class="app-subtitle">Manage your customers, measurements, designs, and communications all in one place.</p>
      </div>
      <div class="header-actions">
        <div class="sync-status">
          <SyncStatus />
        </div>
        <button @click="showQuickStats = !showQuickStats" class="btn-secondary">
          📊 Quick Stats
        </button>
      </div>
    </header>

    <!-- Quick Stats Panel -->
    <div v-if="showQuickStats" class="quick-stats">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>{{ totalCustomers }}</h3>
            <p>Total Customers</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📏</div>
          <div class="stat-content">
            <h3>{{ pendingMeasurements }}</h3>
            <p>Pending Measurements</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💬</div>
          <div class="stat-content">
            <h3>{{ unreadMessages }}</h3>
            <p>Unread Messages</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📸</div>
          <div class="stat-content">
            <h3>{{ totalDesigns }}</h3>
            <p>Design Projects</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Navbar Toggle Button -->
    <button @click="toggleMobileNav" class="mobile-nav-toggle">
      ☰
    </button>

    <!-- Main Layout with Sidebar -->
    <div class="main-layout">
      <!-- Global Navbar (Left Side) -->
      <nav class="global-navbar" :class="{ open: mobileNavOpen }">
        <div class="navbar-header">
          <h3>Navigation</h3>
          <button @click="closeMobileNav" class="mobile-close">×</button>
        </div>
        <div class="navbar-nav">
          <router-link
            v-for="navItem in navigationItems"
            :key="navItem.id"
            :to="navItem.route"
            class="navbar-link"
            active-class="active"
            @click="closeMobileNav"
          >
            <span class="nav-icon">{{ navItem.icon }}</span>
            <span class="nav-label">{{ navItem.label }}</span>
          </router-link>
        </div>
      </nav>

      <!-- Main Content Area -->
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import SyncStatus from '@/components/SyncStatus.vue'

export default {
  name: 'App',
  components: {
    SyncStatus
  },
  data() {
    return {
      showQuickStats: false,
      mobileNavOpen: false,
      totalCustomers: 24,
      pendingMeasurements: 3,
      unreadMessages: 7,
      totalDesigns: 15,
      navigationItems: [
        { id: 'dashboard', label: 'Dashboard', icon: '🏠', route: '/' },
        { id: 'customers', label: 'Customers', icon: '👥', route: '/customers' },
        { id: 'measurements', label: 'Measurements', icon: '📏', route: '/measurements' },
        { id: 'messages', label: 'Messages', icon: '💬', route: '/messages' },
        { id: 'designs', label: 'Designs', icon: '📸', route: '/designs' },
        { id: 'settings', label: 'Settings', icon: '⚙️', route: '/settings' }
      ]
    }
  },
  methods: {
    toggleMobileNav() {
      this.mobileNavOpen = !this.mobileNavOpen
    },
    closeMobileNav() {
      this.mobileNavOpen = false
    }
  }
}
</script>

<style>
/* Global App Styles */
.app-container {
  min-height: 100vh;
  background: #f8f9fa;
}

/* Header Styles */
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content {
  flex: 1;
}

.app-title {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.app-subtitle {
  margin: 0;
  opacity: 0.9;
  font-size: 1.1rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Quick Stats Styles */
.quick-stats {
  background: white;
  margin: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  padding: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.stat-icon {
  font-size: 2rem;
}

.stat-content h3 {
  margin: 0;
  font-size: 2rem;
  color: #2c3e50;
  font-weight: 700;
}

.stat-content p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

/* Main Layout */
.main-layout {
  display: flex;
  min-height: calc(100vh - 200px);
}

/* Global Navbar (Left Side) */
.global-navbar {
  width: 280px;
  background: white;
  border-right: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 4px rgba(0,0,0,0.05);
  position: fixed;
  left: 0;
  top: 200px; /* Height of header */
  height: calc(100vh - 200px);
  z-index: 100;
}

.navbar-header {
  padding: 1.5rem 1rem 1rem 1rem;
  border-bottom: 1px solid #e9ecef;
}

.navbar-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 600;
}

.navbar-nav {
  flex: 1;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.navbar-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: #6c757d;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
  border-left: 3px solid transparent;
  margin: 0.25rem 0;
}

.navbar-link:hover {
  color: #3498db;
  background: #f8f9fa;
  border-left-color: #3498db;
  text-decoration: none;
}

.navbar-link.active {
  color: #3498db;
  background: #e3f2fd;
  border-left-color: #3498db;
  font-weight: 600;
}

.nav-icon {
  font-size: 1.3rem;
  min-width: 24px;
}

.nav-label {
  font-size: 1rem;
}

/* Main Content */
.main-content {
  flex: 1;
  margin-left: 280px; /* Width of navbar */
  background: #f8f9fa;
  overflow-y: auto;
  min-height: calc(100vh - 200px);
}

/* Button Styles */
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s;
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .app-title {
    font-size: 2rem;
  }
  
  .main-layout {
    flex-direction: column;
  }
  
  .global-navbar {
    position: fixed;
    top: 200px; /* Height of header */
    left: -280px; /* Hide by default */
    width: 280px;
    height: calc(100vh - 200px);
    transition: left 0.3s ease;
    z-index: 1000;
  }
  
  .global-navbar.open {
    left: 0;
  }
  
  .navbar-nav {
    flex-direction: column;
    padding: 1rem 0;
  }
  
  .navbar-link {
    padding: 1rem 1.5rem;
    border-left: 3px solid transparent;
    border-bottom: none;
    margin: 0.25rem 0;
  }
  
  .navbar-link:hover {
    border-left-color: #3498db;
    border-bottom-color: transparent;
  }
  
  .navbar-link.active {
    border-left-color: #3498db;
    border-bottom-color: transparent;
  }
  
  .main-content {
    margin-left: 0;
    width: 100%;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  /* Mobile navbar toggle button */
  .mobile-nav-toggle {
    display: block;
    position: fixed;
    top: 210px;
    left: 10px;
    z-index: 1001;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  }
  
  .mobile-close {
    display: block;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #6c757d;
    cursor: pointer;
    padding: 0.5rem;
  }
}

/* Desktop styles - hide mobile elements */
.mobile-nav-toggle {
  display: none;
}

.mobile-close {
  display: none;
}

/* Desktop navbar header layout */
.navbar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

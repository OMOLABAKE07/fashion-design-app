<template>
  <div id="app" class="app-container">
    <!-- Global Header -->
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">Welcome to Efizzy Clothing Studio</h1>
        <p class="app-subtitle">
          Manage your customers, measurements, designs, and communications all in one place.
        </p>
      </div>
      <div class="header-actions gap-3">
        <div class="sync-status">
          <SyncStatus />
        </div>
      </div>
    </header>

    <!-- Main Layout with Sidebar -->
    <div class="main-layout">
      <!-- Global Navbar -->
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
  components: { SyncStatus },
  data() {
    return {
      mobileNavOpen: false,
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

<style scoped>
/* Global container */
.app-container {
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 180px; /* Fixed header height */
  z-index: 10;
}

.header-actions {
  display: flex;
}

/* Main layout (fills below header) */
.main-layout {
  display: flex;
  flex: 1;
  /* margin-top: 180px; Equal to header height */
  min-height: calc(100vh - 180px);
  background: #f8f9fa;
}

/* Sidebar */
.global-navbar {
  width: 280px;
  background: white;
  border-right: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
  position: fixed;
  top: 180px; /* Start just below header */
  left: 0;
  height: calc(100vh - 180px); /* Fill remaining height */
  overflow-y: auto;
  z-index: 9;
}

.navbar-header {
  padding: 1.25rem;
  border-bottom: 1px solid #e9ecef;
}

.navbar-nav {
  flex: 1;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
}

.navbar-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: #6c757d;
  text-decoration: none;
  font-weight: 500;
  border-left: 3px solid transparent;
  transition: all 0.3s;
}
.navbar-link:hover {
  color: #3498db;
  background: #f8f9fa;
  border-left-color: #3498db;
}
.navbar-link.active {
  color: #3498db;
  background: #e3f2fd;
  border-left-color: #3498db;
  font-weight: 600;
}

.nav-icon {
  font-size: 1.3rem;
}

/* Main content area */
.main-content {
  flex: 1;
  background: #f8f9fa;
  margin-left: 280px;
  padding: 2rem;
  overflow-y: auto;
  height: calc(100vh - 180px);
}

/* Mobile */
@media (max-width: 768px) {
  .global-navbar {
    position: absolute;
    top: 180px;
    left: -280px;
    transition: left 0.3s;
  }
  .global-navbar.open {
    left: 0;
  }
  .main-content {
    margin-left: 0;
    width: 100%;
  }
}
</style>

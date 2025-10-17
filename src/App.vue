<template>
  <div id="app" class="app-container">
    <!-- Global Header -->
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">Welcome to Efizzy Clothing Studio</h1>
        <p class="app-subtitle">Manage your customers, measurements, designs, and communications all in one place.</p>
      </div>
      <div class="header-actions gap-3">
        <div class="sync-status">
          <SyncStatus />
        </div>
        <!-- Removed Quick Stats button as requested -->
      </div>
    </header>

    <!-- Removed Quick Stats Panel as requested -->

    <!-- Mobile Navbar Toggle Button -->
    <!-- <button @click="toggleMobileNav" class="mobile-nav-toggle">
      ☰
    </button> -->

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

<style scoped>
/* Global container */
.app-container {
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
}

/* Header at the top */
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2.5rem 3rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: fixed; /* Fix the entire header */
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
}

/* Layout under header */
.main-layout {
  display: flex;
  flex: 1;
  min-height: calc(100vh - 200px); /* Adjust based on header height */
}

/* Sidebar (Fixed Navbar) */
.global-navbar {
  width: 280px;
  background: white;
  border-right: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 4px rgba(0,0,0,0.05);
  position: fixed; /* Fix the navbar */
  top: 0; /* Start from the top */
  left: 0;
  height: 100vh; /* Full height */
  overflow-y: auto; /* Scroll if content overflows */
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

.header-actions{
  display: flex;
}
/* Main content (Scrollable) */
.main-content {
  flex: 1;
  background: #f8f9fa;
  padding: 2rem;
  margin-left: 280px; /* Match navbar width */
  overflow-y: auto; 
  height: calc(100vh - 200px); /* Adjust based on header height */
}

/* Mobile */
@media (max-width: 768px) {
  .global-navbar {
    position: absolute;
    top: 0;
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
  /* .mobile-nav-toggle {
    display: block;
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 11;
  } */
}
</style>
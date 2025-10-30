<template>
  <div id="app" class="app-container">
    <!-- Header -->
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">Welcome to Efizzy Clothing Studio</h1>
        <p class="app-subtitle">Manage your customers, measurements, designs, and communications all in one place.</p>
      </div>
      <!-- Hamburger button for mobile -->
      <button
        class="hamburger hamburger--elastic"
        :class="{ 'is-active': isSidebarOpen }"
        @click="toggleSidebar"
      >
        <span class="hamburger-box">
          <span class="hamburger-inner"></span>
        </span>
      </button>
    </header>

    <!-- Main layout -->
    <div class="main-layout">
      <!-- Sidebar -->
      <nav
        class="global-navbar"
        :class="{ open: isSidebarOpen }"
      >
        <div class="navbar-header">
          <h3>Navigation</h3>
        </div>

        <div class="navbar-nav">
          <router-link
            v-for="navItem in navigationItems"
            :key="navItem.id"
            :to="navItem.route"
            class="navbar-link"
            active-class="active"
            @click="closeSidebar"
          >
            <span class="nav-icon">{{ navItem.icon }}</span>
            <span class="nav-label">{{ navItem.label }}</span>
          </router-link>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {
      isSidebarOpen: false,
      navigationItems: [
        { id: 'dashboard', label: 'Dashboard', icon: '🏠', route: '/' },
        { id: 'customers', label: 'Customers', icon: '👥', route: '/customers' },
        { id: 'measurements', label: 'Measurements', icon: '📏', route: '/measurements' },
        { id: 'messages', label: 'Messages', icon: '💬', route: '/messages' },
        { id: 'designs', label: 'Designs', icon: '📸', route: '/designs' },
      ]
    }
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    },
    closeSidebar() {
      // Close sidebar after clicking a link on mobile
      if (window.innerWidth <= 768) {
        this.isSidebarOpen = false
      }
    }
  },
  mounted() {
    // Auto-close sidebar on resize if screen > 768px
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        this.isSidebarOpen = true
      }
    })
  }
}
</script>


<style scoped>

/* Hamburger (from https://jonsuh.com/hamburgers/) */
.hamburger {
  display: none;
  cursor: pointer;
  padding: 1rem;
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 999;
  background: transparent;
  border: none;
  outline: none;
}

.hamburger-box {
  width: 25px;
  height: 19px;
  display: inline-block;
  position: relative;
}

.hamburger-inner {
  display: block;
  top: 50%;
  margin-top: -1px;
}

.hamburger-inner, .hamburger-inner::before, .hamburger-inner::after {
  width: 25px;
  height: 2px;
  background-color: white;
  border-radius: 1px;
  position: absolute;
  transition-property: transform;
  transition-duration: 0.15s;
  transition-timing-function: ease;
}

.hamburger-inner::before, .hamburger-inner::after {
  content: "";
  display: block;
}

.hamburger-inner::before {
  top: -8px;
}

.hamburger-inner::after {
  bottom: -8px;
}

.hamburger--elastic.is-active .hamburger-inner {
  transform: translate3d(0, 0, 0) rotate(45deg);
  transition-delay: 0.1s;
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}

.hamburger--elastic.is-active .hamburger-inner::before {
  top: 0;
  opacity: 0;
  transition: top 0.1s ease-out, opacity 0.1s 0.1s ease-out;
}

.hamburger--elastic.is-active .hamburger-inner::after {
  bottom: 0;
  transform: rotate(-90deg);
  transition: bottom 0.1s ease-out, transform 0.1s 0.1s ease-out;
}

/* Sidebar transitions */
.global-navbar {
  transition: left 0.3s ease;
}

@media (max-width: 768px) {
  .hamburger {
    display: block;
  }

  .global-navbar {
    position: fixed;
    top: 0;
    left: -280px;
    height: 100vh;
    z-index: 99;
    width: 280px;
    background: white;
  }

  .global-navbar.open {
    left: 0;
  }

  .main-content {
    margin-left: 0;
  }
}

/* Global container */
.app-container {
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
}

/* Header at the top */
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
}

/* Layout under header */
.main-layout {
  display: flex;
  flex: 1;
  min-height: calc(100vh - 180px); /* Reduced from 300px to remove extra white space */
}

/* Sidebar (Fixed Navbar) */
.global-navbar {
  width: 280px;
  background: white;
  border-right: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 4px rgba(0,0,0,0.05);
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  overflow-y: auto;
  z-index: 9;
}

.navbar-header {
  padding: 1.25rem;
  border-bottom: 1px solid #e9ecef;
  color: black;
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

.header-actions {
  display: flex;
}

/* Main content */
.main-content {
  flex: 1;
  background: #f8f9fa;
  margin-left: 280px;
  overflow-y: auto;
  padding-top: 180px; /* Prevent content from hiding under the fixed header */
  min-height: calc(100vh - 180px);
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
    padding-top: 180px;
  }
}
</style>

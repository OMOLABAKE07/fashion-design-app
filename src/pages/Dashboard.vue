<template>
  <div class="dashboard-content my-5">
    <!-- Dashboard Overview -->
    <div class="dashboard-overview">
      <div class="overview-header">
        <h2>Dashboard Overview</h2>
        <p>Welcome back! Here's a quick overview of your fashion design business.</p>2
      </div>
      
      <div class="overview-cards mb-2">
        <div class="overview-card">
          <div class="card-icon">👥</div>
          <div class="card-content">
            <h3>Customer Management</h3>
            <p>Register and manage customer information, track their preferences and history.</p>
            <router-link to="/customers" class="card-link">Manage Customers →</router-link>
          </div>

        
        </div>
        
        <div class="overview-card mb-2">
          <div class="card-icon">📏</div>
          <div class="card-content">
            <h3>Measurements</h3>
            <p>Record and track customer measurements with comprehensive history and notes.</p>
            <router-link to="/measurements" class="card-link">View Measurements →</router-link>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="card-icon">💬</div>
          <div class="card-content">
            <h3>Messages</h3>
            <p>Communicate with customers through the built-in messaging system.</p>
            <router-link to="/messages" class="card-link">Open Messages →</router-link>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="card-icon">📸</div>
          <div class="card-content">
            <h3>Design Projects</h3>
            <p>Upload photos, add design notes, and track project progress.</p>
            <router-link to="/designs" class="card-link">View Designs →</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard'
}
</script>

<style scoped>
.dashboard-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-overview {
  margin-bottom: 2rem;
  /* margin-top: 2rem; */
}

.overview-header {
  text-align: center;
  margin-bottom: 3rem;
  margin-top: 4rem;
}

.overview-header h2 {
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-size: 2rem;
  font-weight: 700;
}

.overview-header p {
  color: #6c757d;
  font-size: 1.1rem;
  margin: 0;
}

/* .overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
} */

.overview-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border: 1px solid #e9ecef;
  transition: transform 0.3s, box-shadow 0.3s;
}

.overview-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.card-content h3 {
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
}

.card-content p {
  color: #6c757d;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
}

.card-link {
  color: #3498db;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: color 0.3s;
}

.card-link:hover {
  color: #2980b9;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 1rem;
  }
  
  .overview-header h2 {
    font-size: 1.5rem;
  }
  
  .overview-cards {
    grid-template-columns: 1fr;
  }
  
  .overview-card {
    padding: 1.5rem;
  }
}
</style>

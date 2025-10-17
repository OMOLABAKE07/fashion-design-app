<template>
  <div class="designs-page">
    <div class="page-header">
      <h2>Design Management</h2>
      <button @click="showDesignForm = !showDesignForm" class="btn-primary">
        {{ showDesignForm ? 'Hide Form' : (editingDesign ? 'Cancel Edit' : 'Add New Design') }}
      </button>
    </div>
    
    <div v-if="showDesignForm" class="form-section">
      <DesignForm 
        :design="editingDesign" 
        @save="handleDesignSave" 
        @cancel="handleFormCancel" 
      />
    </div>
    <!-- Debug: show current state -->
    <!-- <div>showDesignForm: {{ showDesignForm }}</div> -->
    
    <div class="list-section">
      <DesignList 
        @design-selected="handleDesignSelected"
        @design-edit="handleDesignEdit"
        @create-new-design="handleCreateNewDesign"
      />
    </div>
  </div>
</template>

<script>
import DesignForm from '@/components/DesignForm.vue'
import DesignList from '@/components/DesignList.vue'

export default {
  name: 'Designs',
  components: {
    DesignForm,
    DesignList
  },
  data() {
    return {
      showDesignForm: false,
      editingDesign: null
    }
  },
  methods: {
    handleDesignSave(designData) {
      console.log('Design saved:', designData)
      this.showDesignForm = false
      this.editingDesign = null
      // Refresh the design list by emitting a custom event
      window.dispatchEvent(new Event('designs-updated'))
    },
    handleDesignSelected(design) {
      console.log('Design selected:', design)
    },
    handleDesignEdit(design) {
      console.log('Edit design:', design)
      this.editingDesign = design
      this.showDesignForm = true
    },
    handleFormCancel() {
      this.showDesignForm = false
      this.editingDesign = null
    },
    handleCreateNewDesign() {
      // Show the design form when user clicks "Create Your First Design"
      this.editingDesign = null
      this.showDesignForm = true
    }
  }
}
</script>

<style scoped>
.designs-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
}

.page-header h2 {
  color: #2c3e50;
  margin: 0;
  font-size: 1.8rem;
}

.form-section {
  margin-bottom: 2rem;
}

.list-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s;
  background: #3498db;
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
}

@media (max-width: 768px) {
  .designs-page {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
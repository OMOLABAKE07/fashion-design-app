<template>
  <div class="measurement-form">
    <div class="form-header">
      <div class="header-content">
        <h3>{{ isEditing ? 'Update Measurements' : 'Record New Measurements' }}</h3>
        <p class="customer-info" v-if="customer">
          For: <strong>{{ customer.name }}</strong>
        </p>
      </div>
      <div class="header-actions">
        <!-- ✅ FIXED: Show history button always (not dependent on customer) -->
        <button v-if="!isEditing" @click="toggleHistory" class="btn-history">
          {{ showHistory ? 'Hide History' : 'View History' }}
        </button>
        <button v-if="!isEditing && showHistory" @click="refreshHistory" class="btn-refresh">
          Refresh
        </button>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="form">
      <!-- Customer Search Filter -->
      <div class="customer-search-filter" ref="dropdownRef">
        <h4>Select Customer</h4>
        <div class="search-container">
          <input type="text" v-model="customerSearchQuery" @focus="openDropdown" @input="filterCustomers"
            placeholder="Search customers..." class="search-input" />
          <div v-if="showDropdown && filteredCustomers.length" class="customer-dropdown">
            <div v-for="customer in filteredCustomers" :key="customer.id" @click="selectCustomer(customer)"
              class="customer-option">
              {{ customer.name }} - {{ customer.phone }}
            </div>
          </div>
        </div>
      </div>

      <!-- Category Filter -->
      <div class="row">
        <div class="col-md-6 col-12 mb-3">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">Select Category</span>
            </div>
              <select v-model="selectedCategory" class="form-control custom-select" @change="onCategorySelect">
                <option value="">-- choose --</option>
                <option value="male">Male Measurements</option>
                <option value="female">Female Measurements</option>
              </select>
          </div>
        </div>
      </div>

      <!-- <div class="form-group">
          <label for="gender">Gender</label>
          <select id="gender" v-model="formData.gender" class="form-select">
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div> -->

      <!-- Measurement Sections -->
      <template v-for="category in [selectedCategory]" :key="category">
        <!-- Male Measurements Section -->
        <div class="measurement-section" v-if="category === 'male'">
          <h4>Male Measurements</h4>
          <div class="measurement-grid">
            <!-- Top Measurements -->
            <div class="measurement-group">
              <label for="agbadaLength">Agbada Length (inches)</label>
              <input type="number" id="agbadaLength" v-model="formData.agbadaLength" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="topLength">Top Length (inches)</label>
              <input type="number" id="topLength" v-model="formData.topLength" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="kaftanLength">Kaftan Length (inches)</label>
              <input type="number" id="kaftanLength" v-model="formData.kaftanLength" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="jalamiaLength">Jalamia Length (inches)</label>
              <input type="number" id="jalamiaLength" v-model="formData.jalamiaLength" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="shirtLength">Shirt Length (inches)</label>
              <input type="number" id="shirtLength" v-model="formData.shirtLength" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="shoulder">Shoulder (inches)</label>
              <input type="number" id="shoulder" v-model="formData.shoulder" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="neck">Neck (inches)</label>
              <input type="number" id="neck" v-model="formData.neck" step="0.25" min="0" class="measurement-input"
                placeholder="0.00" />
            </div>

            <!-- Sleeve Measurements -->
            <div class="measurement-group">
              <label for="longSleeve">Long Sleeve (inches)</label>
              <input type="number" id="longSleeve" v-model="formData.longSleeve" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="shortSleeve">Short Sleeve (inches)</label>
              <input type="number" id="shortSleeve" v-model="formData.shortSleeve" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="threeQuarterSleeve">3/4 Sleeve (inches)</label>
              <input type="number" id="threeQuarterSleeve" v-model="formData.threeQuarterSleeve" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="roundSleeve">Round Sleeve (inches)</label>
              <input type="number" id="roundSleeve" v-model="formData.roundSleeve" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="biceps">Biceps (inches)</label>
              <input type="number" id="biceps" v-model="formData.biceps" step="0.25" min="0" class="measurement-input"
                placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="elbow">Elbow (inches)</label>
              <input type="number" id="elbow" v-model="formData.elbow" step="0.25" min="0" class="measurement-input"
                placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="wrist">Wrist (inches)</label>
              <input type="number" id="wrist" v-model="formData.wrist" step="0.25" min="0" class="measurement-input"
                placeholder="0.00" />
            </div>

            <!-- Chest Measurements -->
            <div class="measurement-group">
              <label for="chest">Chest (inches)</label>
              <input type="number" id="chest" v-model="formData.chest" step="0.25" min="0" class="measurement-input"
                placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="bustUpperChest">Bust/Upper Chest (inches)</label>
              <input type="number" id="bustUpperChest" v-model="formData.bustUpperChest" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="stomach">Stomach (inches)</label>
              <input type="number" id="stomach" v-model="formData.stomach" step="0.25" min="0" class="measurement-input"
                placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="capSize">Cap Size (inches)</label>
              <input type="number" id="capSize" v-model="formData.capSize" step="0.25" min="0" class="measurement-input"
                placeholder="0.00" />
            </div>

            <!-- Trouser Measurements -->
            <div class="measurement-group">
              <label for="trouserLength">Trouser Length (inches)</label>
              <input type="number" id="trouserLength" v-model="formData.trouserLength" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="waist">Waist (inches)</label>
              <input type="number" id="waist" v-model="formData.waist" step="0.25" min="0" class="measurement-input"
                placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="hip">Hip (inches)</label>
              <input type="number" id="hip" v-model="formData.hip" step="0.25" min="0" class="measurement-input"
                placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="thigh">Thigh (inches)</label>
              <input type="number" id="thigh" v-model="formData.thigh" step="0.25" min="0" class="measurement-input"
                placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="knee">Knee (inches)</label>
              <input type="number" id="knee" v-model="formData.knee" step="0.25" min="0" class="measurement-input"
                placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="inseam">Inseam (inches)</label>
              <input type="number" id="inseam" v-model="formData.inseam" step="0.25" min="0" class="measurement-input"
                placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="outseam">Outseam (inches)</label>
              <input type="number" id="outseam" v-model="formData.outseam" step="0.25" min="0" class="measurement-input"
                placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="ankle">Ankle (inches)</label>
              <input type="number" id="ankle" v-model="formData.ankle" step="0.25" min="0" class="measurement-input"
                placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="crotch">Crotch (inches)</label>
              <input type="number" id="crotch" v-model="formData.crotch" step="0.25" min="0" class="measurement-input"
                placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="calf">Calf (inches)</label>
              <input type="number" id="calf" v-model="formData.calf" step="0.25" min="0" class="measurement-input"
                placeholder="0.00" />
            </div>
          </div>
        </div>

        <!-- Female Measurements Section -->
        <div class="measurement-section" v-if="category === 'female'">
          <h4>Female Measurements</h4>
          <div class="measurement-grid">
            <!-- Bust Measurements -->
            <div class="measurement-group">
              <label for="shoulder">Shoulder (inches)</label>
              <input type="number" id="shoulder" v-model="formData.shoulder" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="bust">Bust (inches)</label>
              <input type="number" id="bust" v-model="formData.bust" step="0.25" min="0" class="measurement-input"
                placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="shoulderToUpperBust">Shoulder to Upper Bust (inches)</label>
              <input type="number" id="shoulderToUpperBust" v-model="formData.shoulderToUpperBust" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="shoulderToUnderBust">Shoulder to Under Bust (inches)</label>
              <input type="number" id="shoulderToUnderBust" v-model="formData.shoulderToUnderBust" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="shoulderToNipplePoint">Shoulder to Nipple Point (inches)</label>
              <input type="number" id="shoulderToNipplePoint" v-model="formData.shoulderToNipplePoint" step="0.25"
                min="0" class="measurement-input" placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="nippleToNipple">Nipple to Nipple (inches)</label>
              <input type="number" id="nippleToNipple" v-model="formData.nippleToNipple" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="roundUpperBust">Round Upper Bust (inches)</label>
              <input type="number" id="roundUpperBust" v-model="formData.roundUpperBust" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="roundUnderBust">Round Under Bust (inches)</label>
              <input type="number" id="roundUnderBust" v-model="formData.roundUnderBust" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>

            <!-- Length Measurements -->
            <div class="measurement-group">
              <label for="halfLength">Half Length (inches)</label>
              <input type="number" id="halfLength" v-model="formData.halfLength" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="blouseLength">Blouse Length (inches)</label>
              <input type="number" id="blouseLength" v-model="formData.blouseLength" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>

            <!-- Sleeve Measurements -->
            <div class="measurement-group">
              <label for="roundSleeve">Round Sleeve (inches)</label>
              <input type="number" id="roundSleeve" v-model="formData.roundSleeve" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="biceps">Biceps (inches)</label>
              <input type="number" id="biceps" v-model="formData.biceps" step="0.25" min="0" class="measurement-input"
                placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="elbow">Elbow (inches)</label>
              <input type="number" id="elbow" v-model="formData.elbow" step="0.25" min="0" class="measurement-input"
                placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="longSleeve">Long Sleeve (inches)</label>
              <input type="number" id="longSleeve" v-model="formData.longSleeve" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="shortSleeve">Short Sleeve (inches)</label>
              <input type="number" id="shortSleeve" v-model="formData.shortSleeve" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="threeQuarterSleeve">3/4 Sleeve (inches)</label>
              <input type="number" id="threeQuarterSleeve" v-model="formData.threeQuarterSleeve" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>

            <!-- Skirt Measurements -->
            <div class="measurement-group">
              <label for="longSkirt">Long Skirt (inches)</label>
              <input type="number" id="longSkirt" v-model="formData.longSkirt" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="shortSkirt">Short Skirt (inches)</label>
              <input type="number" id="shortSkirt" v-model="formData.shortSkirt" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="threeQuarterSkirt">3/4 Skirt (inches)</label>
              <input type="number" id="threeQuarterSkirt" v-model="formData.threeQuarterSkirt" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>

            <!-- Waist/Hip Measurements -->
            <div class="measurement-group">
              <label for="waist">Waist (inches)</label>
              <input type="number" id="waist" v-model="formData.waist" step="0.25" min="0" class="measurement-input"
                placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="hips">Hips (inches)</label>
              <input type="number" id="hips" v-model="formData.hips" step="0.25" min="0" class="measurement-input"
                placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="waistToHipLine">Waist to Hip Line (inches)</label>
              <input type="number" id="waistToHipLine" v-model="formData.waistToHipLine" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="waistToHip">Waist to Hip (inches)</label>
              <input type="number" id="waistToHip" v-model="formData.waistToHip" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>

            <!-- Gown Measurements -->
            <div class="measurement-group">
              <label for="longGownLength">Long Gown Length (inches)</label>
              <input type="number" id="longGownLength" v-model="formData.longGownLength" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="shortGownLength">Short Gown Length (inches)</label>
              <input type="number" id="shortGownLength" v-model="formData.shortGownLength" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="threeQuarterGownLength">3/4 Gown Length (inches)</label>
              <input type="number" id="threeQuarterGownLength" v-model="formData.threeQuarterGownLength" step="0.25"
                min="0" class="measurement-input" placeholder="0.00" />
            </div>

            <!-- Trouser Measurements -->
            <div class="measurement-group">
              <label for="trouserLength">Trouser Length (inches)</label>
              <input type="number" id="trouserLength" v-model="formData.trouserLength" step="0.25" min="0"
                class="measurement-input" placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="band">Band (inches)</label>
              <input type="number" id="band" v-model="formData.band" step="0.25" min="0" class="measurement-input"
                placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="thigh">Thigh (inches)</label>
              <input type="number" id="thigh" v-model="formData.thigh" step="0.25" min="0" class="measurement-input"
                placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="knee">Knee (inches)</label>
              <input type="number" id="knee" v-model="formData.knee" step="0.25" min="0" class="measurement-input"
                placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="inseam">Inseam (inches)</label>
              <input type="number" id="inseam" v-model="formData.inseam" step="0.25" min="0" class="measurement-input"
                placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="outseam">Outseam (inches)</label>
              <input type="number" id="outseam" v-model="formData.outseam" step="0.25" min="0" class="measurement-input"
                placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="ankle">Ankle (inches)</label>
              <input type="number" id="ankle" v-model="formData.ankle" step="0.25" min="0" class="measurement-input"
                placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="crotch">Crotch (inches)</label>
              <input type="number" id="crotch" v-model="formData.crotch" step="0.25" min="0" class="measurement-input"
                placeholder="0.00" />
            </div>
            <div class="measurement-group">
              <label for="calf">Calf (inches)</label>
              <input type="number" id="calf" v-model="formData.calf" step="0.25" min="0" class="measurement-input"
                placeholder="0.00" />
            </div>
          </div>
        </div>
      </template>

      <!-- Additional Information -->
      <div class="measurement-section" v-if="selectedCategory">
        <h4>Additional Information</h4>
        <div class="form-group">
          <label for="measurementDate">Measurement Date</label>
          <input type="date" id="measurementDate" v-model="formData.measurementDate" class="form-input" required />
        </div>
        <div class="form-group">
          <label for="notes">Measurement Notes</label>
          <textarea id="notes" v-model="formData.notes" class="form-textarea" rows="3"
            placeholder="Any special notes about these measurements..."></textarea>
        </div>
      </div>

      <div class="form-actions" v-if="selectedCategory">
        <button type="button" @click="handleCancel" class="btn-secondary">Cancel</button>
        <button type="submit" class="btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Measurements' : 'Save') }}
        </button>
      </div>
    </form>

    <!-- Measurement History -->
    <div v-if="showHistory" class="measurement-history">
      <h4>Measurement History {{ customer ? `for ${customer.name}` : '' }}</h4>
      <div v-if="measurementHistory.length === 0" class="no-history">
        <p>No measurements found{{ customer ? ` for ${customer.name}` : '' }}.</p>
      </div>
      <div v-else class="history-list">
        <div v-for="measurement in measurementHistory" :key="measurement.id" class="history-item">
          <div class="history-header">
            <span class="date">{{ formatDate(measurement.measurementDate) }}</span>
            <div class="history-actions">
              <button @click="viewMeasurement(measurement)" class="btn btn-warning">View</button>
              <button @click="editMeasurement(measurement)" class="btn-small">Edit</button>
              <button @click="deleteMeasurement(measurement.id)" class="btn-small btn-danger">Delete</button>
            </div>
          </div>
          <div class="measurement-summary">
            <span>Customer: {{ measurement.customerName }}</span>
            <span>Categories: {{ formatCategories(measurement.categories) }}</span>
            <span v-if="measurement.chest">Chest: {{ measurement.chest }}"</span>
            <span v-if="measurement.waist">Waist: {{ measurement.waist }}"</span>
            <span v-if="measurement.bust">Bust: {{ measurement.bust }}"</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Measurement Edit Modal -->
    <MeasurementModal :is-visible="showEditModal" :measurement="measurementToEdit" @close="showEditModal = false"
      @save="saveEditedMeasurement" />

    <!-- View Modal -->
    <MeasurementModal :is-visible="showViewModal" :measurement="measurementToView" mode="view"
      @close="showViewModal = false" />
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import MeasurementModal from './MeasurementModal.vue'
import { syncUtils } from '@/utils/sync.js'

export default {
  name: 'MeasurementForm',
  components: { MeasurementModal },
  props: {
    customer: { type: Object, default: null },
    measurement: { type: Object, default: null }
  },
  emits: ['save', 'cancel', 'edit', 'delete', 'customer-selected'],
  data() {
    return {
      showDropdown: false,
      showViewModal: false,
      measurementToView: null,
      isSubmitting: false,
      selectedCategory: '', // This will now directly control which section is shown
      selectedCategories: [],
      showEditModal: false,
      measurementToEdit: null,
      customerSearchQuery: '',
      allCustomers: [],
      filteredCustomers: [],
      showHistory: false,
      formData: {
        // Male measurements
        agbadaLength: '', topLength: '', kaftanLength: '', jalamiaLength: '', shirtLength: '',
        neck: '', wrist: '', hip: '', hips: '', waistToHipLine: '', waistToHip: '',
        // Shared measurements (some overlap between male/female)
        bust: '', shoulderToUnderBust: '', shoulderToUpperBust: '', shoulderToNipplePoint: '',
        nippleToNipple: '', roundUpperBust: '', roundUnderBust: '', shoulder: '',
        halfLength: '', blouseLength: '', longGownLength: '', shortGownLength: '',
        threeQuarterGownLength: '', trouserLength: '', roundSleeve: '', biceps: '',
        elbow: '', longSleeve: '', shortSleeve: '', threeQuarterSleeve: '',
        longSkirt: '', shortSkirt: '', threeQuarterSkirt: '', waist: '', band: '',
        thigh: '', knee: '', inseam: '', outseam: '', ankle: '', crotch: '', calf: '',
        chest: '', bustUpperChest: '', stomach: '', capSize: '',
        // Additional info
        measurementDate: '', notes: ''
      },
      measurementHistory: []
    }
  },
  computed: {
    isEditing() {
      return this.measurement !== null
    }
  },
  watch: {
    measurement: {
      handler(newMeasurement) {
        if (newMeasurement) {
          this.formData = {
            ...newMeasurement.measurements,
            measurementDate: newMeasurement.measurementDate || new Date().toISOString().split('T')[0],
            notes: newMeasurement.notes || ''
          }
          this.selectedCategories = newMeasurement.categories || []
        } else {
          this.resetForm()
        }
      },
      immediate: true
    },
    customer: {
      handler() {
        this.loadMeasurementHistory()
      },
      immediate: true
    }
  },
  mounted() {
    this.loadAllCustomers()
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    saveMeasurementHistory(updatedMeasurement) {
      // Update history with edited data
      const index = this.measurementHistory.findIndex(m => m.id === updatedMeasurement.id)
      if (index !== -1) {
        this.measurementHistory[index] = updatedMeasurement
      }
      this.showEditModal = false
    },

    // Customer Search Methods
    async loadAllCustomers() {
      try {
        const response = await fetch("http://localhost:3000/api/v1/customers")
        if (!response.ok) throw new Error("Network response was not ok")
        const customers = await response.json()
        this.allCustomers = customers.data || customers
        this.filteredCustomers = this.allCustomers
      } catch (error) {
        console.error("Error loading customers:", error)
        this.allCustomers = syncUtils.getAllCustomers() || []
        this.filteredCustomers = this.allCustomers
      }
    },
    openDropdown() {
      this.showDropdown = true
      this.filteredCustomers = this.allCustomers
    },
    async filterCustomers() {
      const query = this.customerSearchQuery.toLowerCase().trim()
      if (!query) {
        this.filteredCustomers = this.allCustomers
        return
      }
      this.filteredCustomers = this.allCustomers.filter(c =>
        c.name.toLowerCase().includes(query) || c.phone.toLowerCase().includes(query)
      )
    },
    selectCustomer(customer) {
      this.$emit('customer-selected', customer)
      this.customerSearchQuery = `${customer.name} (${customer.phone})`
      this.showDropdown = false
    },
    handleClickOutside(event) {
      if (this.$refs.dropdownRef && !this.$refs.dropdownRef.contains(event.target)) {
        this.showDropdown = false
      }
    },

    // Category Methods
    onCategorySelect() {
      // Form will automatically update due to reactivity
      // Additional logic can be added here if needed
    },
    getCategoryName(category) {
      const categoryNames = {
        'male': 'Male Measurements',
        'female': 'Female Measurements'
      }
      return categoryNames[category] || category
    },

    // ✅ FIXED: Load History from BACKEND
    async loadMeasurementHistory(forceRefresh = false) {
      try {
        console.log('🔄 Loading measurement history...', { forceRefresh, customerId: this.customer?.id })
        this.measurementHistory = []

        if (!this.customer?.id) {
          // console.log('❌ No customer selected')
          return
        }

        let measurements = []

        // ✅ STEP 1: Try BACKEND FIRST
        if (forceRefresh || this.measurementHistory.length === 0) {
          try {
            // console.log('📡 Fetching from backend...')
            const response = await fetch(`http://localhost:3000/api/v1/measurements/customer/${this.customer.id}`)

            if (response.ok) {
              const result = await response.json()
              // console.log('✅ Backend response:', result)

              measurements = result.success && Array.isArray(result.data) ? result.data : (result.data || [])
              // console.log('📦 Backend measurements loaded:', measurements.length)
            }
          } catch (apiError) {
            console.warn('❌ Backend unavailable, using local:', apiError)
            measurements = syncUtils.getAllMeasurements()?.filter(m => m.customerId === this.customer.id) || []
          }
        }

        // ✅ STEP 2: Transform for display
        this.measurementHistory = measurements.map(measurement => {
          const measurementData = measurement.data || measurement
          return {
            id: measurement.id,
            customerId: measurement.customer_id,
            customerName: measurement.customer_name,
            measurementDate: measurement.measurement_date,
            categories: measurement.categories || [],
            notes: measurement.notes,
            // Flatten for quick display
            chest: measurementData.measurements?.chest || '',
            waist: measurementData.measurements?.waist || '',
            bust: measurementData.measurements?.bust || '',
            shoulder: measurementData.measurements?.shoulder || '',
            nippleToNipple: measurementData.measurements?.nippleToNipple || '',
            roundUpperBust: measurementData.measurements?.roundUpperBust || '',
            roundUnderBust: measurementData.measurements?.roundUnderBust || '',
            shoulderToUnderBust: measurementData.measurements?.shoulderToUnderBust || '',
            shoulderToUpperBust: measurementData.measurements?.shoulderToUpperBust || '',
            shoulderToNipplePoint: measurementData.measurements?.shoulderToNipplePoint || '',
            halfLength: measurementData.measurements?.halfLength || '',
            blouseLength: measurementData.measurements?.blouseLength || '',
            longGownLength: measurementData.measurements?.longGownLength || '',
            shortGownLength: measurementData.measurements?.shortGownLength || '',
            threeQuarterGownLength: measurementData.measurements?.threeQuarterGownLength || '',
            trouserLength: measurementData.measurements?.trouserLength || '',
            roundSleeve: measurementData.measurements?.roundSleeve || '',
            biceps: measurementData.measurements?.biceps || '',
            elbow: measurementData.measurements?.elbow || '',
            longSleeve: measurementData.measurements?.longSleeve || '',
            shortSleeve: measurementData.measurements?.shortSleeve || '',
            threeQuarterSleeve: measurementData.measurements?.threeQuarterSleeve || '',
            longSkirt: measurementData.measurements?.longSkirt || '',
            shortSkirt: measurementData.measurements?.shortSkirt || '',
            threeQuarterSkirt: measurementData.measurements?.threeQuarterSkirt || '',
            band: measurementData.measurements?.band || '',
            thigh: measurementData.measurements?.thigh || '',
            knee: measurementData.measurements?.knee || '',
            inseam: measurementData.measurements?.inseam || '',
            outseam: measurementData.measurements?.outseam || '',
            ankle: measurementData.measurements?.ankle || '',
            crotch: measurementData.measurements?.crotch || '',
            calf: measurementData.measurements?.calf || '',
            agbadaLength: measurementData.measurements?.agbadaLength || '',
            agbadaShoulder: measurementData.measurements?.agbadaShoulder || '',
            agbadaChest: measurementData.measurements?.agbadaChest || '',
            agbadaSleeve: measurementData.measurements?.agbadaSleeve || '',
            topLength: measurementData.measurements?.topLength || '',
            kaftanLength: measurementData.measurements?.kaftanLength || '',
            jalamiaLength: measurementData.measurements?.jalamiaLength || '',
            shirtLength: measurementData.measurements?.shirtLength || '',
            neck: measurementData.measurements?.neck || '',
            bustUpperChest: measurementData.measurements?.bustUpperChest || '',
            stomach: measurementData.measurements?.stomach || '',
            capSize: measurementData.measurements?.capSize || '',
            // Full measurements for modal
            measurements: measurementData.measurements || {},
            rawData: measurement
          }
        })

        // ✅ STEP 3: Sort newest first
        this.measurementHistory.sort((a, b) => {
          const dateA = new Date(a.measurementDate || a.created_at)
          const dateB = new Date(b.measurementDate || b.created_at)
          return dateB - dateA
        })

        // console.log('✅ History loaded:', this.measurementHistory.length, 'records')

      } catch (error) {
        console.error('❌ Error loading history:', error)
        this.measurementHistory = []
      }
    },

    // ✅ FIXED: Save with Backend Priority
    async handleSubmit() {
      this.isSubmitting = true

      try {
        if (!this.formData.measurementDate) {
          alert('Please select a measurement date')
          return
        }
        if (!this.selectedCategory) {
          alert('Please select a category')
          return
        }
        if (!this.customer) {
          alert('Please select a customer')
          return
        }

        const measurementData = {
          customer_id: this.customer.id,
          customer_name: this.customer.name,
          categories: [this.selectedCategory],
          measurement_date: this.formData.measurementDate,
          notes: this.formData.notes,
          measurements: { ...this.formData },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        // ✅ 1. BACKEND FIRST
        let savedToDb = null
        try {
          const response = await fetch("http://localhost:3000/api/v1/measurements", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(measurementData),
          })

          if (response.ok) {
            savedToDb = await response.json()
            // console.log("✅ Saved to DATABASE:", savedToDb)
          }
        } catch (apiError) {
          console.warn("⚠️ Backend failed:", apiError)
        }

        // ✅ 2. Always save LOCAL
        const savedLocally = await syncUtils.saveMeasurement({
          ...measurementData,
          id: savedToDb?.data?.id || Date.now() + Math.random()
        })

        // ✅ 3. Add to HISTORY IMMEDIATELY
        const measurementToAdd = savedToDb?.data || savedLocally
        const displayMeasurement = {
          id: measurementToAdd.id,
          customerId: this.customer.id,
          customerName: this.customer.name,
          measurementDate: measurementData.measurement_date,
          categories: measurementData.categories,
          notes: measurementData.notes,
          chest: measurementData.measurements.chest || '',
          waist: measurementData.measurements.waist || '',
          bust: measurementData.measurements.bust || '',
          shoulder: measurementData.measurements.shoulder || '',
          nippleToNipple: measurementData.measurements.nippleToNipple || '',
          roundUpperBust: measurementData.measurements.roundUpperBust || '',
          roundUnderBust: measurementData.measurements.roundUnderBust || '',
          shoulderToUnderBust: measurementData.measurements.shoulderToUnderBust || '',
          shoulderToUpperBust: measurementData.measurements.shoulderToUpperBust || '',
          shoulderToNipplePoint: measurementData.measurements.shoulderToNipplePoint || '',
          halfLength: measurementData.measurements.halfLength || '',
          blouseLength: measurementData.measurements.blouseLength || '',
          longGownLength: measurementData.measurements.longGownLength || '',
          shortGownLength: measurementData.measurements.shortGownLength || '',
          threeQuarterGownLength: measurementData.measurements.threeQuarterGownLength || '',
          trouserLength: measurementData.measurements.trouserLength || '',
          roundSleeve: measurementData.measurements.roundSleeve || '',
          biceps: measurementData.measurements.biceps || '',
          elbow: measurementData.measurements.elbow || '',
          longSleeve: measurementData.measurements.longSleeve || '',
          shortSleeve: measurementData.measurements.shortSleeve || '',
          threeQuarterSleeve: measurementData.measurements.threeQuarterSleeve || '',
          longSkirt: measurementData.measurements.longSkirt || '',
          shortSkirt: measurementData.measurements.shortSkirt || '',
          threeQuarterSkirt: measurementData.measurements.threeQuarterSkirt || '',
          band: measurementData.measurements.band || '',
          thigh: measurementData.measurements.thigh || '',
          knee: measurementData.measurements.knee || '',
          inseam: measurementData.measurements.inseam || '',
          outseam: measurementData.measurements.outseam || '',
          ankle: measurementData.measurements.ankle || '',
          crotch: measurementData.measurements.crotch || '',
          calf: measurementData.measurements.calf || '',
          agbadaLength: measurementData.measurements.agbadaLength || '',
          agbadaShoulder: measurementData.measurements.agbadaShoulder || '',
          agbadaChest: measurementData.measurements.agbadaChest || '',
          agbadaSleeve: measurementData.measurements.agbadaSleeve || '',
          topLength: measurementData.measurements.topLength || '',
          kaftanLength: measurementData.measurements.kaftanLength || '',
          jalamiaLength: measurementData.measurements.jalamiaLength || '',
          shirtLength: measurementData.measurements.shirtLength || '',
          neck: measurementData.measurements.neck || '',
          bustUpperChest: measurementData.measurements.bustUpperChest || '',
          stomach: measurementData.measurements.stomach || '',
          capSize: measurementData.measurements.capSize || '',
          measurements: measurementData.measurements,
          rawData: measurementToAdd
        }
        this.measurementHistory.unshift(displayMeasurement)

        // ✅ 4. Reset & Emit
        this.resetForm()
        this.selectedCategory = ''
        this.$emit("save", savedToDb?.data || savedLocally)

        Swal.fire({
          icon: savedToDb ? "success" : "warning",
          title: savedToDb ? "Saved & Synced!" : "Saved Locally",
          text: savedToDb ? "Saved to database!" : "Will sync when online.",
          timer: 2000,
          showConfirmButton: false,
        })

      } catch (error) {
        console.error("❌ Error:", error)
        Swal.fire({ icon: "error", title: "Save Failed", text: "Please try again." })
      } finally {
        this.isSubmitting = false
      }
    },

    // ✅ FIXED: Refresh from Backend
    refreshHistory() {
      this.loadMeasurementHistory(true)
      Swal.fire({
        icon: "success",
        title: "Refreshed!",
        text: `${this.measurementHistory.length} records loaded from database`,
        timer: 1500,
        showConfirmButton: false,
      })
    },

    toggleHistory() {
      this.showHistory = !this.showHistory
      if (this.showHistory && !this.measurementHistory.length) {
        this.loadMeasurementHistory()
      }
    },

    viewMeasurement(measurement) {
      // Ensure the measurement object has the correct structure for the modal
      this.measurementToView = {
        id: measurement.id,
        customerId: measurement.customerId,
        customerName: measurement.customerName,
        measurementDate: measurement.measurementDate,
        categories: measurement.categories || [],
        notes: measurement.notes || '',
        measurements: measurement.measurements || {}
      }
      this.showViewModal = true
    },

    editMeasurement(measurement) {
      // Ensure the measurement object has the correct structure for the modal
      this.measurementToEdit = {
        id: measurement.id,
        customerId: measurement.customerId,
        customerName: measurement.customerName,
        measurementDate: measurement.measurementDate,
        categories: measurement.categories || [],
        notes: measurement.notes || '',
        measurements: measurement.measurements || {}
      }
      this.showEditModal = true
    },

    async saveEditedMeasurement(updatedMeasurement) {
      try {
        // 1. TRY BACKEND FIRST
        let savedToDb = null
        try {
          const response = await fetch(`http://localhost:3000/api/v1/measurements/${updatedMeasurement.id}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              // ✅ BACKEND EXPECTS THIS STRUCTURE
              id: updatedMeasurement.id,
              customer_id: updatedMeasurement.customerId,
              customer_name: updatedMeasurement.customerName,
              categories: updatedMeasurement.categories,
              measurement_date: updatedMeasurement.measurementDate,
              notes: updatedMeasurement.notes,
              measurements: updatedMeasurement.measurements  // FULL DATA
            })
          })
          if (response.ok) {
            savedToDb = await response.json()
          }
        } catch (apiError) {
          console.warn('⚠️ Backend unavailable, saving locally:', apiError)
        }

        // 2. ALWAYS SAVE LOCAL
        await syncUtils.saveMeasurement(updatedMeasurement)

        // 3. UPDATE HISTORY WITH FLATTENED DATA
        const historyIndex = this.measurementHistory.findIndex(m => m.id === updatedMeasurement.id)
        if (historyIndex !== -1) {
          this.measurementHistory[historyIndex] = {
            ...updatedMeasurement,
            // Keep flattened for display
            chest: updatedMeasurement.measurements.chest || '',
            waist: updatedMeasurement.measurements.waist || '',
            bust: updatedMeasurement.measurements.bust || '',
            shoulder: updatedMeasurement.measurements.shoulder || '',
            nippleToNipple: updatedMeasurement.measurements.nippleToNipple || '',
            roundUpperBust: updatedMeasurement.measurements.roundUpperBust || '',
            roundUnderBust: updatedMeasurement.measurements.roundUnderBust || '',
            shoulderToUnderBust: updatedMeasurement.measurements.shoulderToUnderBust || '',
            shoulderToUpperBust: updatedMeasurement.measurements.shoulderToUpperBust || '',
            shoulderToNipplePoint: updatedMeasurement.measurements.shoulderToNipplePoint || '',
            halfLength: updatedMeasurement.measurements.halfLength || '',
            blouseLength: updatedMeasurement.measurements.blouseLength || '',
            longGownLength: updatedMeasurement.measurements.longGownLength || '',
            shortGownLength: updatedMeasurement.measurements.shortGownLength || '',
            threeQuarterGownLength: updatedMeasurement.measurements.threeQuarterGownLength || '',
            trouserLength: updatedMeasurement.measurements.trouserLength || '',
            roundSleeve: updatedMeasurement.measurements.roundSleeve || '',
            biceps: updatedMeasurement.measurements.biceps || '',
            elbow: updatedMeasurement.measurements.elbow || '',
            longSleeve: updatedMeasurement.measurements.longSleeve || '',
            shortSleeve: updatedMeasurement.measurements.shortSleeve || '',
            threeQuarterSleeve: updatedMeasurement.measurements.threeQuarterSleeve || '',
            longSkirt: updatedMeasurement.measurements.longSkirt || '',
            shortSkirt: updatedMeasurement.measurements.shortSkirt || '',
            threeQuarterSkirt: updatedMeasurement.measurements.threeQuarterSkirt || '',
            band: updatedMeasurement.measurements.band || '',
            thigh: updatedMeasurement.measurements.thigh || '',
            knee: updatedMeasurement.measurements.knee || '',
            inseam: updatedMeasurement.measurements.inseam || '',
            outseam: updatedMeasurement.measurements.outseam || '',
            ankle: updatedMeasurement.measurements.ankle || '',
            crotch: updatedMeasurement.measurements.crotch || '',
            calf: updatedMeasurement.measurements.calf || '',
            agbadaLength: updatedMeasurement.measurements.agbadaLength || '',
            agbadaShoulder: updatedMeasurement.measurements.agbadaShoulder || '',
            agbadaChest: updatedMeasurement.measurements.agbadaChest || '',
            agbadaSleeve: updatedMeasurement.measurements.agbadaSleeve || '',
            topLength: updatedMeasurement.measurements.topLength || '',
            kaftanLength: updatedMeasurement.measurements.kaftanLength || '',
            jalamiaLength: updatedMeasurement.measurements.jalamiaLength || '',
            shirtLength: updatedMeasurement.measurements.shirtLength || '',
            neck: updatedMeasurement.measurements.neck || '',
            bustUpperChest: updatedMeasurement.measurements.bustUpperChest || '',
            stomach: updatedMeasurement.measurements.stomach || '',
            capSize: updatedMeasurement.measurements.capSize || ''
          }
        }

        // 4. SUCCESS
        Swal.fire({
          icon: savedToDb ? "success" : "warning",
          title: savedToDb ? "Synced!" : "Saved Offline",
          text: savedToDb ? "Saved to database!" : "Will sync when online",
          timer: 2000
        })

      } catch (error) {
        console.error('❌ Offline save failed:', error)
        Swal.fire("Error", "Could not save measurement", "error")
      }
      this.showEditModal = false
    },

    async deleteMeasurement(measurementId) {
      const result = await Swal.fire({
        icon: "warning",
        title: "Delete Measurement",
        text: "Are you sure?",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel"
      })

      if (result.isConfirmed) {
        try {
          await syncUtils.deleteMeasurement(measurementId)
          this.measurementHistory = this.measurementHistory.filter(m => m.id !== measurementId)
          this.$emit('delete', measurementId)
          Swal.fire("Deleted!", "Measurement deleted.", "success")
        } catch (error) {
          console.error('Error deleting:', error)
          Swal.fire("Error", "Could not delete measurement.", "error")
        }
      }
    },

    handleCancel() {
      this.$emit('cancel')
    },

    resetForm() {
      this.formData = {
        agbadaLength: '', topLength: '', kaftanLength: '', jalamiaLength: '', shirtLength: '',
        neck: '', wrist: '', hip: '', hips: '', waistToHipLine: '', waistToHip: '',
        bust: '', shoulderToUnderBust: '', shoulderToUpperBust: '', shoulderToNipplePoint: '',
        nippleToNipple: '', roundUpperBust: '', roundUnderBust: '', shoulder: '',
        halfLength: '', blouseLength: '', longGownLength: '', shortGownLength: '',
        threeQuarterGownLength: '', trouserLength: '', roundSleeve: '', biceps: '',
        elbow: '', longSleeve: '', shortSleeve: '', threeQuarterSleeve: '',
        longSkirt: '', shortSkirt: '', threeQuarterSkirt: '', waist: '', band: '',
        thigh: '', knee: '', inseam: '', outseam: '', ankle: '', crotch: '', calf: '',
        chest: '', bustUpperChest: '', stomach: '', capSize: '',
        measurementDate: '', notes: ''
      }
    },

    formatDate(dateString) {
      return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        .format(new Date(dateString))
    },

    formatCategories(categories) {
      if (!categories || categories.length === 0) return 'No Categories'
      return categories.map(cat => this.getCategoryName(cat)).join(', ')
    }
  }
}
</script>

<style scoped>
.measurement-form {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* margin-bottom: 2rem; */
  position: relative;
  margin-top: 6rem;
}

.alert {
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
}

.alert-info {
  color: #0c5460;
  background-color: #d1ecf1;
  border-color: #bee5eb;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
}

.header-content {
  flex: 1;
}

.form-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-history {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: background 0.3s;
  white-space: nowrap;
}

.btn-history:hover {
  background: #5a6268;
}

.btn-refresh {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: background 0.3s;
  white-space: nowrap;
}

.btn-refresh:hover {
  background: #2980b9;
}

.customer-info {
  color: #6c757d;
  margin: 0;
  font-size: 1rem;
}

.customer-search-filter {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.customer-search-filter h4 {
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
}

.search-container {
  position: relative;
}

.search-input {
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  width: 100%;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.customer-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
}

.customer-option {
  padding: 0.75rem;
  cursor: pointer;
  border-bottom: 1px solid #e9ecef;
  background-color: #ced4da;
  color: black;
}

.customer-option:hover {
  background: #f8f9fa;
}

.customer-option:last-child {
  border-bottom: none;
}

.category-filter {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.category-filter h4 {
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
}

.btn-primary {
  background: #3498db;
  color: white;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background: #2980b9;
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.375rem;
}

.card-header {
  padding: 0.75rem 1.25rem;
  margin-bottom: 0;
  background-color: rgba(0, 0, 0, 0.03);
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}

.card-header h6 {
  margin: 0;
  color: #2c3e50;
}

.card-body {
  flex: 1 1 auto;
  min-height: 1px;
  padding: 1.25rem;
}

.list-group {
  display: flex;
  flex-direction: column;
  padding-left: 0;
  margin-bottom: 0;
  border-radius: 0.375rem;
}

.list-group-item {
  position: relative;
  display: block;
  padding: 0.75rem 1.25rem;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.list-group-item:first-child {
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}

.list-group-item:last-child {
  border-bottom-right-radius: inherit;
  border-bottom-left-radius: inherit;
}

.list-group-item.d-flex {
  display: flex !important;
  align-items: center;
  justify-content: space-between;
}

.btn-link {
  font-weight: 400;
  color: #007bff;
  text-decoration: none;
  background-color: transparent;
  border: none;
  padding: 0;
}

.btn-link:hover {
  color: #0056b3;
  text-decoration: underline;
}

.text-danger {
  color: #dc3545 !important;
}

.measurement-section {
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.measurement-section h4 {
  color: #2c3e50;
  margin: 0 0 1.5rem 0;
  font-size: 1.2rem;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 0.5rem;
}

.measurement-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.measurement-group {
  display: flex;
  flex-direction: column;
}

.measurement-group label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.measurement-input {
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
  background: #fff;
  text-align: right;
}

.measurement-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
}

.form-group label {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-input,
.form-textarea {
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
  background: #fff;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e9ecef;
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

.measurement-history {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #e9ecef;
}

.measurement-history h4 {
  color: #2c3e50;
  margin: 0 0 1.5rem 0;
  font-size: 1.2rem;
}

.history-item {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.date {
  font-weight: 600;
  color: #2c3e50;
}

.history-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-small {
  padding: 0.25rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s;
}


.btn-small:not(.btn-danger) {
  background: #198754;
  color: white;
}

.btn-small:not(.btn-danger):hover {
  background: #246534;
}

.btn-warning:hover {
  background: #fbf70c;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.measurement-summary {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.selected-categories-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-box {
  display: flex;
  align-items: center;
  background-color: #e9f7fe;
  border: 1px solid #bee5eb;
  border-radius: 20px;
  padding: 0.25rem 0.75rem;
}

.category-name {
  font-size: 0.875rem;
  color: #0c5460;
  margin-right: 0.5rem;
}

.remove-category-btn {
  background: none;
  border: none;
  color: #dc3545;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.remove-category-btn:hover {
  background-color: #f8d7da;
}

@media (max-width: 768px) {
  .form-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .form-header h3 {
    font-size: 1.2rem;
  }

  .measurement-grid {
    grid-template-columns: 1fr;
  }

  .measurement-form {
    padding: 1.5rem;
  }

  /* .form-actions {
    flex-direction: column;
  } */

  .history-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .measurement-summary {
    flex-direction: column;
    gap: 0.25rem;
  }

}

/* Override Bootstrap's width: 1% property */
/* .input-group>.form-control,
.input-group>.form-select {
  width: auto !important;
} */
</style>

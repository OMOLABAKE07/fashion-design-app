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
        <button 
          v-if="!isEditing && customer" 
          @click="toggleHistory" 
          class="btn-history"
        >
          {{ showHistory ? 'Hide History' : 'View History' }}
        </button>
        <button 
          v-if="!isEditing && customer && showHistory" 
          @click="refreshHistory" 
          class="btn-refresh"
        >
          Refresh
        </button>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="form">
      <!-- Customer Search Filter -->
      <div class="customer-search-filter">
        <h4>Select Customer</h4>
        <div class="search-container">
          <input
            type="text"
            v-model="customerSearchQuery"
            @input="filterCustomers"
            placeholder="Search customers..."
            class="search-input"
          />
          <div v-if="filteredCustomers.length > 0 && customerSearchQuery" class="customer-dropdown">
            <div
              v-for="customer in filteredCustomers"
              :key="customer.id"
              @click="selectCustomer(customer)"
              class="customer-option"
            >
              {{ customer.name }} - {{ customer.phone }}
            </div>
          </div>
        </div>
      </div>

      <!-- Category Filter with Multiple Selection -->
      <div class="col-md-12 mb-3">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text">Filter by Category</span>
          </div>
          <select v-model="selectedCategory" class="form-control custom-select">
            <option value="">-- choose --</option>
            <option value="bust">Bust Measurements</option>
            <option value="shoulder">Shoulder Measurements</option>
            <option value="length">Length Measurements</option>
            <option value="sleeve">Sleeve Measurements</option>
            <option value="skirt">Skirt Measurements</option>
            <option value="gown">Gown Measurements</option>
            <option value="trouser">Trouser Measurements</option>
            <option value="agbada">Agbada Measurements</option>
            <option value="top">Top Measurements</option>
          </select>
          <div class="input-group-append">
            <button class="btn btn-primary" type="button" @click="addCategory">
              Add
            </button>
          </div>
        </div>
      </div>

      <!-- Display selected categories -->
      <div class="col-md-12 mb-3" v-if="selectedCategories.length > 0">
        <div class="card">
          <div class="card-header">
            <h6>Selected Measurement Categories</h6>
          </div>
          <div class="card-body">
            <div class="selected-categories-container">
              <div 
                v-for="(category, index) in selectedCategories" 
                :key="index"
                class="category-box"
              >
                <span class="category-name">{{ getCategoryName(category) }}</span>
                <button 
                  type="button" 
                  class="remove-category-btn"
                  @click="removeSelectedCategory(index)"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Alert as requested by user -->
      <div class="alert alert-info" v-if="selectedCategories.length === 0">
        <p>You have not yet select a category , kindly select a category</p>
      </div>

      <!-- Measurement Sections - Show all selected categories -->
      <template v-for="category in selectedCategories" :key="category">
        <!-- Bust Measurements Section -->
        <div class="measurement-section" v-if="category === 'bust'">
          <h4>Bust Measurements</h4>
          <div class="measurement-grid">
            <div class="measurement-group">
              <label for="bust">Bust (inches)</label>
              <input
                type="number"
                id="bust"
                v-model="formData.bust"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="shoulderToUnderBust">Shoulder to Under Bust (inches)</label>
              <input
                type="number"
                id="shoulderToUnderBust"
                v-model="formData.shoulderToUnderBust"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="shoulderToUpperBust">Shoulder to Upper Bust (inches)</label>
              <input
                type="number"
                id="shoulderToUpperBust"
                v-model="formData.shoulderToUpperBust"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="shoulderToNipplePoint">Shoulder to Nipple Point (inches)</label>
              <input
                type="number"
                id="shoulderToNipplePoint"
                v-model="formData.shoulderToNipplePoint"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="nippleToNipple">Nipple to Nipple (inches)</label>
              <input
                type="number"
                id="nippleToNipple"
                v-model="formData.nippleToNipple"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="roundUpperBust">Round Upper Bust (inches)</label>
              <input
                type="number"
                id="roundUpperBust"
                v-model="formData.roundUpperBust"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="roundUnderBust">Round Under Bust (inches)</label>
              <input
                type="number"
                id="roundUnderBust"
                v-model="formData.roundUnderBust"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <!-- Shoulder Measurements Section -->
        <div class="measurement-section" v-if="category === 'shoulder'">
          <h4>Shoulder Measurements</h4>
          <div class="measurement-grid">
            <div class="measurement-group">
              <label for="shoulder">Shoulder (inches)</label>
              <input
                type="number"
                id="shoulder"
                v-model="formData.shoulder"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <!-- Length Measurements Section -->
        <div class="measurement-section" v-if="category === 'length'">
          <h4>Length Measurements</h4>
          <div class="measurement-grid">
            <div class="measurement-group">
              <label for="halfLength">Half Length (inches)</label>
              <input
                type="number"
                id="halfLength"
                v-model="formData.halfLength"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="blouseLength">Blouse Length (inches)</label>
              <input
                type="number"
                id="blouseLength"
                v-model="formData.blouseLength"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="longGownLength">Long Gown Length (inches)</label>
              <input
                type="number"
                id="longGownLength"
                v-model="formData.longGownLength"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="shortGownLength">Short Gown Length (inches)</label>
              <input
                type="number"
                id="shortGownLength"
                v-model="formData.shortGownLength"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="threeQuarterGownLength">3/4 Gown Length (inches)</label>
              <input
                type="number"
                id="threeQuarterGownLength"
                v-model="formData.threeQuarterGownLength"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="trouserLength">Trouser Length (inches)</label>
              <input
                type="number"
                id="trouserLength"
                v-model="formData.trouserLength"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <!-- Sleeve Measurements Section -->
        <div class="measurement-section" v-if="category === 'sleeve'">
          <h4>Sleeve Measurements</h4>
          <div class="measurement-grid">
            <div class="measurement-group">
              <label for="roundSleeve">Round Sleeve (inches)</label>
              <input
                type="number"
                id="roundSleeve"
                v-model="formData.roundSleeve"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="biceps">Biceps (inches)</label>
              <input
                type="number"
                id="biceps"
                v-model="formData.biceps"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="elbow">Elbow (inches)</label>
              <input
                type="number"
                id="elbow"
                v-model="formData.elbow"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="longSleeve">Long Sleeve (inches)</label>
              <input
                type="number"
                id="longSleeve"
                v-model="formData.longSleeve"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="shortSleeve">Short Sleeve (inches)</label>
              <input
                type="number"
                id="shortSleeve"
                v-model="formData.shortSleeve"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="threeQuarterSleeve">3/4 Sleeve (inches)</label>
              <input
                type="number"
                id="threeQuarterSleeve"
                v-model="formData.threeQuarterSleeve"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <!-- Skirt Measurements Section -->
        <div class="measurement-section" v-if="category === 'skirt'">
          <h4>Skirt Measurements</h4>
          <div class="measurement-grid">
            <div class="measurement-group">
              <label for="longSkirt">Long Skirt (inches)</label>
              <input
                type="number"
                id="longSkirt"
                v-model="formData.longSkirt"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="shortSkirt">Short Skirt (inches)</label>
              <input
                type="number"
                id="shortSkirt"
                v-model="formData.shortSkirt"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="threeQuarterSkirt">3/4 Skirt (inches)</label>
              <input
                type="number"
                id="threeQuarterSkirt"
                v-model="formData.threeQuarterSkirt"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <!-- Gown Measurements Section -->
        <div class="measurement-section" v-if="category === 'gown'">
          <h4>Gown Measurements</h4>
          <div class="measurement-grid">
            <div class="measurement-group">
              <label for="longGownLength">Long Gown Length (inches)</label>
              <input
                type="number"
                id="longGownLength"
                v-model="formData.longGownLength"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="shortGownLength">Short Gown Length (inches)</label>
              <input
                type="number"
                id="shortGownLength"
                v-model="formData.shortGownLength"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="threeQuarterGownLength">3/4 Gown Length (inches)</label>
              <input
                type="number"
                id="threeQuarterGownLength"
                v-model="formData.threeQuarterGownLength"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <!-- Trouser Measurements Section -->
        <div class="measurement-section" v-if="category === 'trouser'">
          <h4>Trouser Measurements</h4>
          <div class="measurement-grid">
            <div class="measurement-group">
              <label for="trouserLength">Trouser Length (inches)</label>
              <input
                type="number"
                id="trouserLength"
                v-model="formData.trouserLength"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="waist">Waist (inches)</label>
              <input
                type="number"
                id="waist"
                v-model="formData.waist"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="band">Band (inches)</label>
              <input
                type="number"
                id="band"
                v-model="formData.band"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="thigh">Thigh (inches)</label>
              <input
                type="number"
                id="thigh"
                v-model="formData.thigh"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="knee">Knee (inches)</label>
              <input
                type="number"
                id="knee"
                v-model="formData.knee"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="inseam">Inseam (inches)</label>
              <input
                type="number"
                id="inseam"
                v-model="formData.inseam"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="outseam">Outseam (inches)</label>
              <input
                type="number"
                id="outseam"
                v-model="formData.outseam"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="ankle">Ankle (inches)</label>
              <input
                type="number"
                id="ankle"
                v-model="formData.ankle"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="crotch">Crotch (inches)</label>
              <input
                type="number"
                id="crotch"
                v-model="formData.crotch"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="calf">Calf (inches)</label>
              <input
                type="number"
                id="calf"
                v-model="formData.calf"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <!-- Agbada Measurements Section -->
        <div class="measurement-section" v-if="category === 'agbada'">
          <h4>Agbada Measurements</h4>
          <div class="measurement-grid">
            <div class="measurement-group">
              <label for="agbadaLength">Agbada Length (inches)</label>
              <input
                type="number"
                id="agbadaLength"
                v-model="formData.agbadaLength"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="agbadaShoulder">Agbada Shoulder (inches)</label>
              <input
                type="number"
                id="agbadaShoulder"
                v-model="formData.agbadaShoulder"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="agbadaChest">Agbada Chest (inches)</label>
              <input
                type="number"
                id="agbadaChest"
                v-model="formData.agbadaChest"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="agbadaSleeve">Agbada Sleeve (inches)</label>
              <input
                type="number"
                id="agbadaSleeve"
                v-model="formData.agbadaSleeve"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <!-- Top Measurements Section -->
        <div class="measurement-section" v-if="category === 'top'">
          <h4>Top Measurements</h4>
          <div class="measurement-grid">
            <div class="measurement-group">
              <label for="topLength">Top Length (inches)</label>
              <input
                type="number"
                id="topLength"
                v-model="formData.topLength"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="kaftanLength">Kaftan Length (inches)</label>
              <input
                type="number"
                id="kaftanLength"
                v-model="formData.kaftanLength"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="jalamiaLength">Jalamia Length (inches)</label>
              <input
                type="number"
                id="jalamiaLength"
                v-model="formData.jalamiaLength"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="shirtLength">Shirt Length (inches)</label>
              <input
                type="number"
                id="shirtLength"
                v-model="formData.shirtLength"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="shoulder">Shoulder (inches)</label>
              <input
                type="number"
                id="shoulder"
                v-model="formData.shoulder"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="neck">Neck (inches)</label>
              <input
                type="number"
                id="neck"
                v-model="formData.neck"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="chest">Chest (inches)</label>
              <input
                type="number"
                id="chest"
                v-model="formData.chest"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="bustUpperChest">Bust/Upper Chest (inches)</label>
              <input
                type="number"
                id="bustUpperChest"
                v-model="formData.bustUpperChest"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="stomach">Stomach (inches)</label>
              <input
                type="number"
                id="stomach"
                v-model="formData.stomach"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
            <div class="measurement-group">
              <label for="capSize">Cap Size (inches)</label>
              <input
                type="number"
                id="capSize"
                v-model="formData.capSize"
                step="0.25"
                min="0"
                class="measurement-input"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
      </template>

      <!-- Additional Information -->
      <div class="measurement-section" v-if="selectedCategories.length > 0">
        <h4>Additional Information</h4>
        <div class="form-group">
          <label for="measurementDate">Measurement Date</label>
          <input
            type="date"
            id="measurementDate"
            v-model="formData.measurementDate"
            class="form-input"
            required
          />
        </div>
        <div class="form-group">
          <label for="notes">Measurement Notes</label>
          <textarea
            id="notes"
            v-model="formData.notes"
            class="form-textarea"
            rows="3"
            placeholder="Any special notes about these measurements..."
          ></textarea>
        </div>
      </div>

      <div class="form-actions" v-if="selectedCategories.length > 0">
        <button type="button" @click="handleCancel" class="btn-secondary">
          Cancel
        </button>
        <button type="submit" class="btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Measurements' : 'Save Measurements') }}
        </button>
      </div>
    </form>

    <!-- Measurement History -->
    <div v-if="showHistory && measurementHistory.length > 0" class="measurement-history">
      <h4>Measurement History</h4>
      <div class="history-list">
        <div 
          v-for="measurement in measurementHistory" 
          :key="measurement.id"
          class="history-item"
        >
          <div class="history-header">
            <span class="date">{{ formatDate(measurement.measurementDate) }}</span>
            <div class="history-actions">
              <button @click="editMeasurement(measurement)" class="btn-small">Edit</button>
              <button @click="deleteMeasurement(measurement.id)" class="btn-small btn-danger">Delete</button>
            </div>
          </div>
          <div class="measurement-summary">
            <span>Customer: {{ measurement.customerName }}</span>
            <span>Categories: {{ formatCategories(measurement.categories) }}</span>
            <span v-if="measurement.chest">Chest: {{ measurement.chest }}</span>
            <span v-if="measurement.waist">Waist: {{ measurement.waist }}</span>
            <span v-if="measurement.hip">Hip: {{ measurement.hip }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Measurement Edit Modal -->
    <MeasurementModal 
      :is-visible="showEditModal"
      :measurement="measurementToEdit"
      @close="showEditModal = false"
      @save="saveEditedMeasurement"
    />
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import MeasurementModal from './MeasurementModal.vue'
import { syncUtils } from '@/utils/sync.js'

export default {
  name: 'MeasurementForm',
  components: {
    MeasurementModal
  },
  props: {
    customer: {
      type: Object,
      default: null
    },
    measurement: {
      type: Object,
      default: null
    }
  },
  emits: ['save', 'cancel', 'edit', 'delete', 'customer-selected'],
  data() {
    return {
      isSubmitting: false,
      selectedCategory: '', // Single category selection for the dropdown
      selectedCategories: [], // Array to hold multiple selected categories
      showEditModal: false,
      measurementToEdit: null,
      customerSearchQuery: '',
      allCustomers: [],
      filteredCustomers: [],
      showHistory: false,
      formData: {
        // Bust measurements
        bust: '',
        shoulderToUnderBust: '',
        shoulderToUpperBust: '',
        shoulderToNipplePoint: '',
        nippleToNipple: '',
        roundUpperBust: '',
        roundUnderBust: '',
        
        // Shoulder measurements
        shoulder: '',
        
        // Length measurements
        halfLength: '',
        blouseLength: '',
        longGownLength: '',
        shortGownLength: '',
        threeQuarterGownLength: '',
        trouserLength: '',
        
        // Sleeve measurements
        roundSleeve: '',
        biceps: '',
        elbow: '',
        longSleeve: '',
        shortSleeve: '',
        threeQuarterSleeve: '',
        
        // Skirt measurements
        longSkirt: '',
        shortSkirt: '',
        threeQuarterSkirt: '',
        
        // Gown measurements
        longGownLength: '',
        shortGownLength: '',
        threeQuarterGownLength: '',
        
        // Trouser measurements
        trouserLength: '',
        waist: '',
        band: '',
        thigh: '',
        knee: '',
        inseam: '',
        outseam: '',
        ankle: '',
        crotch: '',
        calf: '',
        
        // Agbada measurements
        agbadaLength: '',
        agbadaShoulder: '',
        agbadaChest: '',
        agbadaSleeve: '',
        
        // Top measurements
        topLength: '',
        kaftanLength: '',
        jalamiaLength: '',
        shirtLength: '',
        shoulder: '',
        neck: '',
        chest: '',
        bustUpperChest: '',
        stomach: '',
        capSize: '',
        
        // Additional info
        measurementDate: '',
        notes: ''
      },
      measurementHistory: [],
      showHistory: false
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
            // Bust measurements
            bust: newMeasurement.bust || '',
            shoulderToUnderBust: newMeasurement.shoulderToUnderBust || '',
            shoulderToUpperBust: newMeasurement.shoulderToUpperBust || '',
            shoulderToNipplePoint: newMeasurement.shoulderToNipplePoint || '',
            nippleToNipple: newMeasurement.nippleToNipple || '',
            roundUpperBust: newMeasurement.roundUpperBust || '',
            roundUnderBust: newMeasurement.roundUnderBust || '',
            
            // Shoulder measurements
            shoulder: newMeasurement.shoulder || '',
            
            // Length measurements
            halfLength: newMeasurement.halfLength || '',
            blouseLength: newMeasurement.blouseLength || '',
            longGownLength: newMeasurement.longGownLength || '',
            shortGownLength: newMeasurement.shortGownLength || '',
            threeQuarterGownLength: newMeasurement.threeQuarterGownLength || '',
            trouserLength: newMeasurement.trouserLength || '',
            
            // Sleeve measurements
            roundSleeve: newMeasurement.roundSleeve || '',
            biceps: newMeasurement.biceps || '',
            elbow: newMeasurement.elbow || '',
            longSleeve: newMeasurement.longSleeve || '',
            shortSleeve: newMeasurement.shortSleeve || '',
            threeQuarterSleeve: newMeasurement.threeQuarterSleeve || '',
            
            // Skirt measurements
            longSkirt: newMeasurement.longSkirt || '',
            shortSkirt: newMeasurement.shortSkirt || '',
            threeQuarterSkirt: newMeasurement.threeQuarterSkirt || '',
            
            // Gown measurements
            longGownLength: newMeasurement.longGownLength || '',
            shortGownLength: newMeasurement.shortGownLength || '',
            threeQuarterGownLength: newMeasurement.threeQuarterGownLength || '',
            
            // Trouser measurements
            trouserLength: newMeasurement.trouserLength || '',
            waist: newMeasurement.waist || '',
            band: newMeasurement.band || '',
            thigh: newMeasurement.thigh || '',
            knee: newMeasurement.knee || '',
            inseam: newMeasurement.inseam || '',
            outseam: newMeasurement.outseam || '',
            ankle: newMeasurement.ankle || '',
            crotch: newMeasurement.crotch || '',
            calf: newMeasurement.calf || '',
            
            // Agbada measurements
            agbadaLength: newMeasurement.agbadaLength || '',
            agbadaShoulder: newMeasurement.agbadaShoulder || '',
            agbadaChest: newMeasurement.agbadaChest || '',
            agbadaSleeve: newMeasurement.agbadaSleeve || '',
            
            // Top measurements
            topLength: newMeasurement.topLength || '',
            kaftanLength: newMeasurement.kaftanLength || '',
            jalamiaLength: newMeasurement.jalamiaLength || '',
            shirtLength: newMeasurement.shirtLength || '',
            shoulder: newMeasurement.shoulder || '',
            neck: newMeasurement.neck || '',
            chest: newMeasurement.chest || '',
            bustUpperChest: newMeasurement.bustUpperChest || '',
            stomach: newMeasurement.stomach || '',
            capSize: newMeasurement.capSize || '',
            
            // Additional info
            measurementDate: newMeasurement.measurementDate || new Date().toISOString().split('T')[0],
            notes: newMeasurement.notes || ''
          }
        } else {
          this.resetForm()
        }
      },
      immediate: true
    },
    customer: {
      handler(newCustomer) {
        // Reload measurement history when customer changes
        this.loadMeasurementHistory()
      },
      immediate: true
    }
  },
  mounted() {
    // Load measurement history from localStorage when component mounts
    this.loadMeasurementHistory()
    // Load all customers for search
    this.loadAllCustomers()
  },
  methods: {
    async loadAllCustomers() {
      try {
        this.allCustomers = syncUtils.getAllCustomers()
      } catch (error) {
        console.error('Error loading customers:', error)
        this.allCustomers = []
      }
    },
    filterCustomers() {
      if (!this.customerSearchQuery) {
        this.filteredCustomers = []
        return
      }
      
      const query = this.customerSearchQuery.toLowerCase()
      this.filteredCustomers = this.allCustomers.filter(customer =>
        customer.name.toLowerCase().includes(query) ||
        (customer.phone && customer.phone.toLowerCase().includes(query)) ||
        (customer.email && customer.email.toLowerCase().includes(query))
      )
    },
    selectCustomer(customer) {
      this.$emit('customer-selected', customer)
      this.customerSearchQuery = ''
      this.filteredCustomers = []
    },
    addCategory() {
      // Check if a category is selected
      if (!this.selectedCategory) {
        alert('Please select a category')
        return
      }
      
      // Check if category is already selected
      if (this.selectedCategories.includes(this.selectedCategory)) {
        alert('This category is already selected')
        return
      }
      
      // Add category to selected categories
      this.selectedCategories.push(this.selectedCategory)
      
      // Reset the dropdown
      this.selectedCategory = ''
    },
    removeSelectedCategory(index) {
      this.selectedCategories.splice(index, 1)
    },
    getCategoryName(category) {
      // Handle empty category
      if (!category) {
        return 'No Category Selected'
      }
      
      const categoryNames = {
        'agbada': 'Agbada Measurements',
        'top': 'Top Measurements',
        'sleeve': 'Sleeve Measurements',
        'trouser': 'Trouser Measurements',
        'bust': 'Bust Measurements',
        'shoulder': 'Shoulder Measurements',
        'length': 'Length Measurements',
        'skirt': 'Skirt Measurements',
        'gown': 'Gown Measurements',
        'all': 'All Categories'
      }
      return categoryNames[category] || category
    },
    loadMeasurementHistory() {
      try {
        // Use the sync utilities to get measurements for this customer
        const allMeasurements = syncUtils.getAllMeasurements()
        
        // Filter measurements for this specific customer
        if (this.customer && this.customer.id) {
          this.measurementHistory = allMeasurements.filter(
            measurement => measurement.customerId === this.customer.id
          )
        } else {
          this.measurementHistory = []
        }
      } catch (error) {
        console.error('Error loading measurement history:', error)
        this.measurementHistory = []
      }
    },
    saveMeasurementHistory(measurement) {
      try {
        // Use sync utilities to save the measurement
        if (measurement.id && this.measurementHistory.some(m => m.id === measurement.id)) {
          // Update existing measurement
          syncUtils.updateMeasurement(measurement.id, measurement)
        } else {
          // Add new measurement
          syncUtils.saveMeasurement(measurement)
        }
        
        // Reload the history to ensure consistency
        this.loadMeasurementHistory()
      } catch (error) {
        console.error('Error saving measurement history:', error)
      }
    },
    deleteMeasurementHistory(id) {
      try {
        // Use sync utilities to delete the measurement
        syncUtils.deleteMeasurement(id)
        
        // Reload the history to ensure consistency
        this.loadMeasurementHistory()
      } catch (error) {
        console.error('Error deleting measurement:', error)
      }
    },
    generateId() {
      return Date.now() + Math.floor(Math.random() * 10000)
    },
    getFieldsForCategory(category) {
      // Handle empty category
      if (!category) {
        return []
      }
      
      const fieldGroups = {
        bust: [
          'bust', 'shoulderToUnderBust', 'shoulderToUpperBust', 'shoulderToNipplePoint',
          'nippleToNipple', 'roundUpperBust', 'roundUnderBust'
        ],
        shoulder: [
          'shoulder'
        ],
        length: [
          'halfLength', 'blouseLength', 'longGownLength', 'shortGownLength',
          'threeQuarterGownLength', 'trouserLength'
        ],
        sleeve: [
          'roundSleeve', 'biceps', 'elbow', 'longSleeve', 'shortSleeve', 'threeQuarterSleeve'
        ],
        skirt: [
          'longSkirt', 'shortSkirt', 'threeQuarterSkirt'
        ],
        gown: [
          'longGownLength', 'shortGownLength', 'threeQuarterGownLength'
        ],
        trouser: [
          'trouserLength', 'waist', 'band', 'thigh', 'knee', 'inseam',
          'outseam', 'ankle', 'crotch', 'calf'
        ],
        agbada: [
          'agbadaLength', 'agbadaShoulder', 'agbadaChest', 'agbadaSleeve'
        ],
        top: [
          'topLength', 'kaftanLength', 'jalamiaLength', 'shirtLength',
          'shoulder', 'neck', 'chest', 'bustUpperChest', 'stomach', 'capSize'
        ]
      }
      
      return fieldGroups[category] || []
    },
    editMeasurement(measurement) {
      this.measurementToEdit = measurement
      this.showEditModal = true
    },
    saveEditedMeasurement(updatedMeasurement) {
      // Update the measurement using sync utilities
      this.saveMeasurementHistory(updatedMeasurement)
      
      // Emit edit event
      this.$emit('edit', updatedMeasurement)
    },
    async handleSubmit() {
      this.isSubmitting = true
      
      try {
        // Validate required fields
        if (!this.formData.measurementDate) {
          alert('Please select a measurement date')
          return
        }

        // Check if any categories are selected
        if (this.selectedCategories.length === 0) {
          alert('Please select at least one category')
          return
        }

        // Check if a customer is selected
        if (!this.customer) {
          alert('Please select a customer')
          return
        }

        // Prepare a single measurement data object with all fields
        const measurementData = {
          customerId: this.customer.id,
          customerName: this.customer.name,
          id: this.generateId(),
          categories: [...this.selectedCategories], // Store all selected categories
          measurementDate: this.formData.measurementDate,
          notes: this.formData.notes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        // Include all fields from formData that have values
        const allFields = Object.keys(this.formData)
        allFields.forEach(field => {
          if (field !== 'measurementDate' && field !== 'notes' && 
              this.formData[field] !== '' && this.formData[field] !== undefined) {
            measurementData[field] = parseFloat(this.formData[field]) || this.formData[field]
          }
        })

        // Save using sync utilities
        await syncUtils.saveMeasurement(measurementData)
        
        // Reload measurement history
        this.loadMeasurementHistory()
        
        // Reset form after successful save
        this.resetForm()
        this.selectedCategories = []
        
        // Emit save event
        this.$emit('save')
        
        // Show success message
        Swal.fire({
          icon: "success",
          title: "Saved",
          text: "Measurements saved successfully!",
          timer: 2000,
          showConfirmButton: false
        })
      } catch (error) {
        console.error('Error saving measurements:', error)
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error saving measurements. Please try again."
        })
      } finally {
        this.isSubmitting = false
      }
    },
    handleCancel() {
      this.$emit('cancel')
    },
    resetForm() {
      this.formData = {
        // Bust measurements
        bust: '',
        shoulderToUnderBust: '',
        shoulderToUpperBust: '',
        shoulderToNipplePoint: '',
        nippleToNipple: '',
        roundUpperBust: '',
        roundUnderBust: '',
        
        // Shoulder measurements
        shoulder: '',
        
        // Length measurements
        halfLength: '',
        blouseLength: '',
        longGownLength: '',
        shortGownLength: '',
        threeQuarterGownLength: '',
        trouserLength: '',
        
        // Sleeve measurements
        roundSleeve: '',
        biceps: '',
        elbow: '',
        longSleeve: '',
        shortSleeve: '',
        threeQuarterSleeve: '',
        
        // Skirt measurements
        longSkirt: '',
        shortSkirt: '',
        threeQuarterSkirt: '',
        
        // Gown measurements
        longGownLength: '',
        shortGownLength: '',
        threeQuarterGownLength: '',
        
        // Trouser measurements
        trouserLength: '',
        waist: '',
        band: '',
        thigh: '',
        knee: '',
        inseam: '',
        outseam: '',
        ankle: '',
        crotch: '',
        calf: '',
        
        // Agbada measurements
        agbadaLength: '',
        agbadaShoulder: '',
        agbadaChest: '',
        agbadaSleeve: '',
        
        // Top measurements
        topLength: '',
        kaftanLength: '',
        jalamiaLength: '',
        shirtLength: '',
        shoulder: '',
        neck: '',
        chest: '',
        bustUpperChest: '',
        stomach: '',
        capSize: '',
        
        // Additional info
        measurementDate: '',
        notes: ''
      }
    },
    toggleHistory() {
      this.showHistory = !this.showHistory
    },
    refreshHistory() {
      this.loadMeasurementHistory()
    },
    deleteMeasurement(measurementId) {
      Swal.fire({
        icon: "warning",
        title: "Delete Measurement",
        text: "Are you sure you want to delete this measurement record?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
        cancelButtonColor: "#d92550",
        showCloseButton: true,
        showLoaderOnConfirm: true,
      }).then(async (result) => {
        if (result.value) {
          try {
            // Use sync utilities to delete the measurement
            await syncUtils.deleteMeasurement(measurementId)
            
            // Reload measurement history
            this.loadMeasurementHistory()
            
            this.$emit('delete', measurementId)
            
            Swal.fire({
              icon: "success",
              title: "Deleted",
              text: "Measurement deleted successfully!",
              timer: 2000,
              showConfirmButton: false
            })
          } catch (error) {
            console.error('Error deleting measurement:', error)
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Error deleting measurement. Please try again."
            })
          }
        } else {
          Swal.fire("Cancelled", "Measurement was not deleted", "info")
        }
      })
    },
    formatDate(dateString) {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(new Date(dateString))
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
  position: relative;
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
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
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
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
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

.input-group {
  display: flex;
  align-items: stretch;
}

.input-group-prepend,
.input-group-append {
  display: flex;
}

.input-group-text {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  margin-bottom: 0;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  text-align: center;
  white-space: nowrap;
  background-color: #e9ecef;
  border: 1px solid #ced4da;
  border-radius: 0.375rem 0 0 0.375rem;
}

.form-control,
.custom-select {
  display: block;
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus,
.custom-select:focus {
  color: #495057;
  background-color: #fff;
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.input-group-append .btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  margin-bottom: 0;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
  white-space: nowrap;
  border: 1px solid #ced4da;
  border-radius: 0 0.375rem 0.375rem 0;
  cursor: pointer;
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
  .measurement-grid {
    grid-template-columns: 1fr;
  }
  
  .measurement-form {
    padding: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .history-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .measurement-summary {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .category-select {
    min-width: 100%;
  }
  
  .input-group {
    flex-direction: column;
  }
  
  .input-group-text,
  .form-control,
  .custom-select,
  .input-group-append .btn {
    border-radius: 0.375rem;
    width: 100%;
  }
  
  .input-group-text {
    border-radius: 0.375rem 0.375rem 0 0;
  }
  
  .input-group-append .btn {
    border-radius: 0 0 0.375rem 0.375rem;
  }
}
</style>

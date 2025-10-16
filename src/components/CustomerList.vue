<template>
    <div class="customer-list mt-5">
        <div class="header">
            <h2>Customer List</h2>
            <div class="header-actions">
                <div class="search-box">
                    <input type="text" v-model="searchQuery" placeholder="Search customers..." class="search-input" />
                </div>
                <button @click="showCustomerForm = !showCustomerForm" class="btn-primary">
                    {{ showCustomerForm ? 'Hide Form' : 'Add New Customer' }}
                </button>
            </div>
        </div>

        <!-- Customer Form -->
        <div v-if="showCustomerForm" class="mb-4">
            <CustomerForm :customer="editingCustomer" @save="handleCustomerSave" @cancel="handleFormCancel" />
        </div>

        <div v-if="customers.length === 0" class="empty-state">
            <p>No customers found. Add your first customer to get started!</p>
        </div>

        <div v-else class="customers-grid">
            <div class="card-border mb-3 border-primary mt-4">
                <table class="table table-sm table-striped table-bordered table-hover table-responsive-sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone No.</th>
                            <th>Address</th>
                            <th>Gender</th>
                            <th>Comment</th>
                            <th>Date Added</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        <template v-if="filteredCustomers.length > 0">
                            <tr v-for="(customer, index) in filteredCustomers" :key="customer.id">
                                <td>{{ index + 1 }}</td>
                                <td>{{ customer.name }}</td>
                                <td>{{ customer.email }}</td>
                                <td>{{ customer.phone }}</td>
                                <td>{{ customer.address }}</td>
                                <td>{{ customer.gender }}</td>
                                <td>
                                    <span class="comment" :class="customer.notes ? 'active' : 'pending'">
                                        {{ customer.notes || 'No comments' }}
                                    </span>
                                </td>
                                <td>{{ formatDate(customer.createdAt) }}</td>
                                <td>
                                    <div class="d-flex gap-2 justify-content-center">
                                        <button @click.stop="editCustomer(customer)" class="btn btn-sm btn-success">
                                            Edit
                                        </button>
                                        <button @click.stop="deleteCustomer(customer.id)" class="btn btn-sm btn-danger">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </template>

                        <template v-else>
                            <tr>
                                <td colspan="9" class="text-center">
                                    <div class="alert alert-info m-0">No Record Found</div>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>

        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2'

import CustomerForm from './CustomerForm.vue'
import { syncUtils } from '@/utils/sync.js'

export default {
    name: 'CustomerList',
    components: {
        CustomerForm
    },
    data() {
        return {
            showCustomerForm: false,
            searchQuery: '',
            customers: [],
            editingCustomer: null
        }
    },
    computed: {
        filteredCustomers() {
            if (!this.searchQuery) {
                return this.customers
            }

            const query = this.searchQuery.toLowerCase()
            return this.customers.filter(customer =>
                customer.name.toLowerCase().includes(query) ||
                customer.email.toLowerCase().includes(query) ||
                customer.phone.toLowerCase().includes(query)
            )
        }
    },
    async mounted() {
        await this.loadCustomers()
    },
    methods: {
        selectCustomer(customer) {
            // Navigate to customer detail view or emit event
            this.$emit('customer-selected', customer)
        },
        editCustomer(customer) {
            // Set the customer to edit and show the form
            this.editingCustomer = customer
            this.showCustomerForm = true
        },
        async deleteCustomer(customerId) {
            Swal.fire({
                icon: "warning",
                title: "Delete Customer",
                text: "Are you sure you want to delete this customer record?",
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
                        // Remove from local state
                        const index = this.customers.findIndex(c => c.id === customerId)
                        if (index > -1) {
                            this.customers.splice(index, 1)
                        }

                        // Also delete from local storage and queue for sync
                        const deleted = await syncUtils.deleteCustomer(customerId)
                        
                        if (!deleted) {
                            console.warn('Customer may not have been deleted from storage')
                        }

                        Swal.fire({
                            icon: "success",
                            title: "Deleted",
                            text: "Customer deleted successfully!",
                            timer: 2000,
                            showConfirmButton: false
                        })
                    } catch (error) {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Error deleting customer. Please try again."
                        })
                    }
                } else {
                    Swal.fire("Cancelled", "Customer was not deleted", "info")
                }
            })
        },
        async handleCustomerSave(customerData) {
            // Check if we're editing an existing customer or adding a new one
            if (this.editingCustomer) {
                // For editing, show confirmation dialog
                Swal.fire({
                    icon: "warning",
                    title: "Save Changes",
                    text: "Are you sure you want to save these changes?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, Save Changes",
                    cancelButtonText: "Cancel",
                    cancelButtonColor: "#d92550",
                    showCloseButton: true,
                    showLoaderOnConfirm: true,
                }).then(async (result) => {
                    if (result.value) {
                        try {
                            // Update existing customer in storage
                            const updatedCustomer = await syncUtils.updateCustomer(
                                this.editingCustomer.id,
                                {
                                    ...customerData,
                                    name: `${customerData.firstName} ${customerData.lastName}`.trim(),
                                    updatedAt: new Date().toISOString()
                                }
                            )

                            // Update in local state
                            const index = this.customers.findIndex(c => c.id === this.editingCustomer.id)
                            if (index > -1 && updatedCustomer) {
                                // Replace the entire customer object to ensure consistency
                                this.customers.splice(index, 1, updatedCustomer)
                            }

                            // Reset form state
                            this.showCustomerForm = false
                            this.editingCustomer = null

                            Swal.fire({
                                icon: "success",
                                title: "Saved",
                                text: "Customer updated successfully!",
                                timer: 2000,
                                showConfirmButton: false
                            })
                        } catch (error) {
                            Swal.fire({
                                icon: "error",
                                title: "Error",
                                text: "Error saving customer. Please try again."
                            })
                        }
                    } else {
                        Swal.fire("Cancelled", "Changes were not saved", "info")
                    }
                })
            } else {
                // For adding new customer, show confirmation dialog
                Swal.fire({
                    icon: "warning",
                    title: "Add Customer",
                    text: "Are you sure you want to add this new customer?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, Add Customer",
                    cancelButtonText: "Cancel",
                    cancelButtonColor: "#d92550",
                    showCloseButton: true,
                    showLoaderOnConfirm: true,
                }).then(async (result) => {
                    if (result.value) {
                        try {
                            // Add new customer to storage
                            const newCustomer = await syncUtils.saveCustomer({
                                ...customerData,
                                name: `${customerData.firstName} ${customerData.lastName}`.trim(),
                                status: 'active',
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString()
                            })

                            // Add to local state
                            if (newCustomer) {
                                this.customers.push(newCustomer)
                            }

                            // Reset form state
                            this.showCustomerForm = false
                            this.editingCustomer = null

                            Swal.fire({
                                icon: "success",
                                title: "Saved",
                                text: "Customer added successfully!",
                                timer: 2000,
                                showConfirmButton: false
                            })
                        } catch (error) {
                            Swal.fire({
                                icon: "error",
                                title: "Error",
                                text: "Error adding customer. Please try again."
                            })
                        }
                    } else {
                        Swal.fire("Cancelled", "Customer was not added", "info")
                    }
                })
            }
        },
        handleFormCancel() {
            // Reset form state
            this.showCustomerForm = false
            this.editingCustomer = null
        },
        async loadCustomers() {
            try {
                // Always try to load customers from localStorage through syncUtils
                const storedCustomers = syncUtils.getAllCustomers()
                
                console.log('Loaded customers from syncUtils:', storedCustomers) // Debug log
                
                // Check if we have any stored customers
                if (storedCustomers && storedCustomers.length > 0) {
                    this.customers = storedCustomers
                    console.log('Using stored customers:', this.customers) // Debug log
                } else {
                    // More robust check for localStorage data
                    let hasRealData = false
                    if (typeof localStorage !== 'undefined') {
                        try {
                            const rawData = localStorage.getItem('fashion_app_data')
                            console.log('Raw localStorage data:', rawData) // Debug log
                            if (rawData) {
                                const parsed = JSON.parse(rawData)
                                console.log('Parsed localStorage data:', parsed) // Debug log
                                // Check if there's actual customer data
                                if (parsed && Array.isArray(parsed.customers) && parsed.customers.length > 0) {
                                    hasRealData = true
                                }
                            }
                        } catch (e) {
                            console.error('Error parsing localStorage data:', e)
                        }
                    }
                    
                    console.log('Has real customer data in localStorage:', hasRealData) // Debug log
                    
                    // If localStorage has real customer data, use empty array (will be populated by syncUtils)
                    // Only show sample data if localStorage is truly empty/non-existent
                    if (hasRealData) {
                        this.customers = []
                        console.log('LocalStorage has real data, using empty array') // Debug log
                    } else {
                        this.customers = [
                            {
                                id: 'sample_1',
                                firstName: 'Sarah',
                                lastName: 'Johnson',
                                name: 'Sarah Johnson',
                                email: 'sarah@email.com',
                                phone: '+1 (555) 123-4567',
                                address: '123 Main St',
                                gender: 'female',
                                notes: 'Regular customer',
                                status: 'active',
                                createdAt: new Date('2024-01-15').toISOString(),
                                updatedAt: new Date('2024-01-15').toISOString()
                            },
                            {
                                id: 'sample_2',
                                firstName: 'Michael',
                                lastName: 'Chen',
                                name: 'Michael Chen',
                                email: 'michael@email.com',
                                phone: '+1 (555) 987-6543',
                                address: '456 Oak Ave',
                                gender: 'male',
                                notes: 'Prefers email communication',
                                status: 'active',
                                createdAt: new Date('2024-01-20').toISOString(),
                                updatedAt: new Date('2024-01-20').toISOString()
                            }
                        ]
                        console.log('Using sample customers:', this.customers) // Debug log
                    }
                }
            } catch (error) {
                console.error('Error loading customers:', error)
                // Fallback to sample data with proper structure
                this.customers = [
                    {
                        id: 'fallback_1',
                        firstName: 'Sarah',
                        lastName: 'Johnson',
                        name: 'Sarah Johnson',
                        email: 'sarah@email.com',
                        phone: '+1 (555) 123-4567',
                        address: '123 Main St',
                        gender: 'female',
                        notes: 'Regular customer',
                        status: 'active',
                        createdAt: new Date('2024-01-15').toISOString(),
                        updatedAt: new Date('2024-01-15').toISOString()
                    }
                ]
            }
        },
        formatDate(date) {
            // Handle invalid dates more robustly
            if (!date) {
                return 'Invalid Date'
            }

            // Try to create a Date object
            const dateObj = new Date(date)

            // Check if the date is valid
            if (isNaN(dateObj.getTime())) {
                return 'Invalid Date'
            }

            try {
                return new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                }).format(dateObj)
            } catch (error) {
                // Fallback to basic formatting if Intl fails
                return dateObj.toLocaleDateString()
            }
        }
    }
}
</script>

<style scoped>
.customer-list {
  padding: 1rem;
  max-width: 1200px;
  /* margin: 0 auto; */
  width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h2 {
  color: #2c3e50;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-box {
  position: relative;
}

.search-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  min-width: 250px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.btn-primary {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
  white-space: nowrap;
}

.btn-primary:hover {
  background: #2980b9;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #7f8c8d;
}

.customer-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.customer-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.customer-info h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.customer-info .email,
.customer-info .phone {
  margin: 0.25rem 0;
  color: #6c757d;
}

.customer-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f3f4;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status.active {
  background: #d4edda;
  color: #155724;
}

.status.pending {
  background: #fff3cd;
  color: #856404;
}

.date-added {
  font-size: 0.875rem;
  color: #6c757d;
}

.customer-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-secondary,
.btn-danger {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s;
}

.btn-secondary {
  background: #198754;
  color: white;
}

.btn-secondary:hover {
  background: #246534;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .header-actions {
    justify-content: space-between;
  }
  
  .search-input {
    min-width: auto;
    flex: 1;
  }
}
.table {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
}

.table th {
    background: #3498db;
    color: white;
    text-align: center;
    vertical-align: middle;
}

.table td {
    vertical-align: middle;
}
/* 
.comment.active {
    background-color: #d4edda;
    color: #155724;
    border-radius: 8px;
    padding: 0.25rem 0.5rem;
} */

.comment.pending {
    background-color: #fff3cd;
    color: #856404;
    border-radius: 8px;
    padding: 0.25rem 0.5rem;
}

@media (max-width: 768px) {
    .header {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
    }
    
    .header-actions {
        justify-content: space-between;
    }
    
    .search-input {
        min-width: auto;
        flex: 1;
    }
}
</style>
<template>
  <div class="customers-page">
    <div class="page-header">
      <h2>Customer Management</h2>
    </div>

    <!-- Create Form Modal -->
    <div
      v-if="showCustomerForm && !editingCustomer"
      class="modal-overlay"
      @click="showCustomerForm = false"
    >
      <div class="modal-content" @click.stop>
        <CustomerForm
          :customer="null"
          @save="handleCustomerSave"
          @cancel="showCustomerForm = false"
        />
      </div>
    </div>

    <!-- Edit Form Modal -->
    <div v-if="editingCustomer" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <CustomerForm
          :customer="editingCustomer"
          @save="handleCustomerSave"
          @cancel="closeEditModal"
        />
      </div>
    </div>

    <!-- Customer List Section -->
    <div class="list-section">
      <div class="customer-list">
        <div class="header-actions">
          <div class="search-wrapper">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search customers..."
              class="search-input"
            />
          </div>
          <button
            @click="showCustomerForm = !showCustomerForm"
            class="btn-primary"
          >
            {{ showCustomerForm ? "Hide Form" : "Add New Customer" }}
          </button>
        </div>

        <div v-if="customers.length === 0" class="empty-state">
          <p>No customers found. Add your first customer to get started!</p>
        </div>

        <div v-else class="customers-grid">
          <div class="card-border mb-3 border-primary mt-4 table-container">
            <table
              class="table table-sm table-striped table-bordered table-hover"
            >
              <thead>
                <tr>
                  <th width="4%">#</th>
                  <th width="20%">Name</th>
                  <th width="10%">Email</th>
                  <th width="8%">Phone No.</th>
                  <th width="15%">Address</th>
                  <th width="5%">Gender</th>
                  <th width="20%">Comment</th>
                  <th width="10%">Date Added</th>
                  <th width="8%">Actions</th>
                </tr>
              </thead>

              <tbody>
                <template v-if="filteredCustomers.length > 0">
                  <tr
                    v-for="(customer, index) in filteredCustomers"
                    :key="customer.id"
                    class="customer-row"
                  >
                    <td>{{ index + 1 }}</td>
                    <td>
                      {{
                        customer.name ||
                        `${customer.first_name} ${customer.last_name}`
                      }}
                    </td>
                    <td>{{ customer.email }}</td>
                    <td>{{ customer.phone }}</td>
                    <td>{{ customer.address }}</td>
                    <td>{{ customer.gender }}</td>
                    <td>
                      <span
                        class="comment"
                        :class="customer.notes ? 'active' : 'pending'"
                      >
                        {{ customer.notes || "No comments" }}
                      </span>
                    </td>
                    <td>{{ formatDate(customer.createdAt) }}</td>
                    <td>
                      <div
                        class="d-flex gap-2 justify-content-center action-buttons"
                      >
                        <button
                          @click.stop="editCustomer(customer)"
                          class="btn btn-sm btn-success"
                        >
                          Edit
                        </button>
                        <button
                          @click.stop="deleteCustomer(customer.id)"
                          class="btn btn-sm btn-danger"
                        >
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
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import CustomerForm from "@/components/CustomerForm.vue";
import { customerAPI } from "@/services/api";

export default {
  name: "Customers",
  components: {
    CustomerForm,
  },
  data() {
    return {
      showCustomerForm: false,
      searchQuery: "",
      customers: [],
      editingCustomer: null,
    };
  },
  computed: {
    filteredCustomers() {
      if (!this.searchQuery) return this.customers;
      const query = this.searchQuery.toLowerCase();
      return this.customers.filter(
        (customer) =>
          (customer.name && customer.name.toLowerCase().includes(query)) ||
          (customer.email && customer.email.toLowerCase().includes(query)) ||
          (customer.phone && customer.phone.toLowerCase().includes(query)) ||
          (customer.first_name &&
            customer.first_name.toLowerCase().includes(query)) ||
          (customer.last_name &&
            customer.last_name.toLowerCase().includes(query))
      );
    },
  },
  async mounted() {
    await this.loadCustomers();
  },
  methods: {
    async loadCustomers() {
      try {
        const res = await customerAPI.getAll();

        const customersData = res.data || res;

        if (!Array.isArray(customersData)) {
          console.error("Expected array but got:", customersData);
          this.customers = [];
          return;
        }

        this.customers = customersData.map((c) => ({
          ...c,
          id: c.id,
          first_name: c.first_name || c.firstName || "",
          last_name: c.last_name || c.lastName || "",
          name:
            c.name ||
            `${c.first_name || c.firstName || ""} ${
              c.last_name || c.lastName || ""
            }`.trim(),
          email: c.email || "",
          phone: c.phone || "",
          address: c.address || "",
          gender: c.gender || "",
          notes: c.notes || "",
          createdAt: c.created_at
            ? new Date(c.created_at)
            : c.createdAt
            ? new Date(c.createdAt)
            : null,
          updatedAt: c.updated_at
            ? new Date(c.updated_at)
            : c.updatedAt
            ? new Date(c.updatedAt)
            : null,
        }));
      } catch (error) {
        console.error("Error loading customers:", error);
        this.customers = [];
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load customers. Please try again.",
        });
      }
    },

    async handleCustomerSave(customerData) {
      const payload = {
        ...customerData,
        name:
          customerData.name ||
          `${customerData.first_name} ${customerData.last_name}`.trim(),
      };

      try {
        if (this.editingCustomer) {
          // Update existing customer using API method
          const updatedCustomer = await customerAPI.update(
            this.editingCustomer.id,
            payload
          );

          // Find and update in local array
          const index = this.customers.findIndex(
            (c) => c.id === this.editingCustomer.id
          );

          if (index > -1) {
            this.customers.splice(
              index,
              1,
              this.normalizeCustomer(updatedCustomer)
            );
          }

          this.editingCustomer = null;

          Swal.fire({
            icon: "success",
            title: "Saved",
            text: "Customer updated successfully!",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          // Create new customer using API method
          const newCustomer = await customerAPI.create(payload);

          this.customers.push(this.normalizeCustomer(newCustomer));
          this.showCustomerForm = false;

          Swal.fire({
            icon: "success",
            title: "Saved",
            text: "Customer added successfully!",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        console.error("Error saving customer:", error);

        if (error.response && error.response.status === 422) {
          const errors = error.response.data.errors;
          if (errors.email) {
            Swal.fire({
              icon: "error",
              title: "Email Exists",
              text: errors.email[0],
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Validation Error",
              text: Object.values(errors).flat()[0],
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: this.editingCustomer
              ? "Error updating customer."
              : "Error adding customer.",
          });
        }
      }
    },

    async deleteCustomer(customerId) {
      const result = await Swal.fire({
        icon: "warning",
        title: "Delete Customer",
        text: "Are you sure you want to delete this customer record?",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
      });

      if (result.isConfirmed) {
        try {
          await customerAPI.delete(customerId);

          this.customers = this.customers.filter((c) => c.id !== customerId);

          Swal.fire({
            icon: "success",
            title: "Deleted",
            text: "Customer deleted successfully!",
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error("Error deleting customer:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error deleting customer.",
          });
        }
      }
    },

    editCustomer(customer) {
      this.editingCustomer = customer;
    },

    closeEditModal() {
      this.editingCustomer = null;
    },

    formatDate(date) {
      if (!date) return "Invalid Date";
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return "Invalid Date";
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(dateObj);
    },

    // Helper method to normalize customer data
    normalizeCustomer(c) {
      return {
        ...c,
        id: c.id,
        first_name: c.first_name || c.firstName || "",
        last_name: c.last_name || c.lastName || "",
        name:
          c.name ||
          `${c.first_name || c.firstName || ""} ${
            c.last_name || c.lastName || ""
          }`.trim(),
        email: c.email || "",
        phone: c.phone || "",
        address: c.address || "",
        gender: c.gender || "",
        notes: c.notes || "",
        createdAt: c.created_at
          ? new Date(c.created_at)
          : c.createdAt
          ? new Date(c.createdAt)
          : null,
        updatedAt: c.updated_at
          ? new Date(c.updated_at)
          : c.updatedAt
          ? new Date(c.updatedAt)
          : null,
      };
    },
  },
};
</script>

<style scoped>
.customers-page {
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Customer List Styles */
.customer-list {
  width: 100%;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  margin-bottom: 1.5rem;
}

.search-wrapper {
  flex: 1;
}

.search-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  width: 100%;
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
  padding: 3rem;
  color: #6c757d;
}

.table-container {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.table th,
.table td {
  padding: 0.75rem;
  text-align: left;
  border: 1px solid #dee2e6;
}

.table thead th {
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.table tbody tr:nth-child(odd) {
  background: #f8f9fa;
}

.table tbody tr:hover {
  background: #e9ecef;
}

.comment.active {
  color: #28a745;
}

.comment.pending {
  color: #6c757d;
  font-style: italic;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover {
  background: #218838;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

@media (max-width: 768px) {
  .customers-page {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header-actions {
    flex-direction: row;
  }

  .modal-content {
    max-height: 95vh;
  }

  .table-container {
    overflow-x: auto;
  }

  .table {
    min-width: 800px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 0.25rem !important;
  }

  .btn-sm {
    width: 100%;
    margin-bottom: 0.25rem;
  }
}

@media (max-width: 576px) {
  .page-header h2 {
    font-size: 1.5rem;
  }

  .header-actions {
    flex-direction: row;
  }

  .btn-primary {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .search-input {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
}
</style>

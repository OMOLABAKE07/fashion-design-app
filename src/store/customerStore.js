// src/store/customerStore.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { customerAPI } from "@/services/api";
import { syncUtils } from "@/utils/sync";

export const useCustomerStore = defineStore("customer", () => {
  const customers = ref([]);
  const searchQuery = ref("");
  const loading = ref(false);
  const error = ref(null);

  const filteredCustomers = computed(() => {
    if (!searchQuery.value) return customers.value;
    return customers.value.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });

  // Load customers - try local storage first, then API
  async function loadCustomers() {
    try {
      loading.value = true;
      error.value = null;

      // Try to load from local storage first (offline support)
      const localCustomers = syncUtils.getAllCustomers();
      if (localCustomers && localCustomers.length > 0) {
        customers.value = localCustomers;
      }

      // Try to sync with server if online
      if (navigator.onLine) {
        try {
          const serverCustomers = await customerAPI.getAll();
          customers.value = serverCustomers;
          // Update local storage with server data
          syncUtils.saveAllCustomers(serverCustomers);
        } catch (err) {
          console.warn("Could not sync with server, using local data:", err);
        }
      }
    } catch (err) {
      error.value = err.message;
      console.error("Error loading customers:", err);
    } finally {
      loading.value = false;
    }
  }

  // Add customer - save locally and queue for sync
  async function addCustomer(customer) {
    try {
      loading.value = true;
      error.value = null;

      // Save to local storage immediately for offline support
      const localCustomer = await syncUtils.saveCustomer(customer);
      customers.value.push(localCustomer);

      // Try to sync with server if online
      if (navigator.onLine) {
        try {
          const serverCustomer = await customerAPI.create(customer);
          // Update local customer with server ID if needed
          const index = customers.value.findIndex(
            (c) => c.id === localCustomer.id
          );
          if (index !== -1) {
            customers.value[index] = {
              ...localCustomer,
              ...serverCustomer,
              synced: true,
            };
            syncUtils.updateCustomer(localCustomer.id, {
              ...localCustomer,
              ...serverCustomer,
              synced: true,
            });
          }
        } catch (err) {
          console.warn("Could not sync with server, data saved locally:", err);
        }
      }

      return localCustomer;
    } catch (err) {
      error.value = err.message;
      console.error("Error adding customer:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Update customer - save locally and queue for sync
  async function updateCustomer(id, updatedData) {
    try {
      loading.value = true;
      error.value = null;

      // Update in local storage immediately for offline support
      const localCustomer = await syncUtils.updateCustomer(id, updatedData);
      const index = customers.value.findIndex((c) => c.id === id);
      if (index !== -1)
        customers.value[index] = { ...customers.value[index], ...updatedData };

      // Try to sync with server if online
      if (navigator.onLine) {
        try {
          const serverCustomer = await customerAPI.update(id, updatedData);
          // Mark as synced
          if (index !== -1) {
            customers.value[index] = {
              ...customers.value[index],
              ...serverCustomer,
              synced: true,
            };
            syncUtils.updateCustomer(id, {
              ...customers.value[index],
              synced: true,
            });
          }
        } catch (err) {
          console.warn("Could not sync with server, data saved locally:", err);
        }
      }

      return localCustomer;
    } catch (err) {
      error.value = err.message;
      console.error("Error updating customer:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Delete customer - delete locally and queue for sync
  async function deleteCustomer(id) {
    try {
      loading.value = true;
      error.value = null;

      // Delete from local storage immediately for offline support
      await syncUtils.deleteCustomer(id);
      const deletedCustomer = customers.value.find((c) => c.id === id);
      customers.value = customers.value.filter((c) => c.id !== id);

      // Try to sync with server if online
      if (navigator.onLine) {
        try {
          await customerAPI.delete(id);
          // Mark as synced in local storage
          syncUtils.markAsSynced("customers", id);
        } catch (err) {
          console.warn(
            "Could not sync with server, data deleted locally:",
            err
          );
        }
      }

      return deletedCustomer;
    } catch (err) {
      error.value = err.message;
      console.error("Error deleting customer:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    customers,
    searchQuery,
    loading,
    error,
    filteredCustomers,
    loadCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  };
});

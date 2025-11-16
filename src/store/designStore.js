// src/store/designStore.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { designAPI } from "@/services/api";
import { syncUtils } from "@/utils/sync";

export const useDesignStore = defineStore("design", () => {
  const designs = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Load designs - try local storage first, then API
  async function loadDesigns(customerId = null) {
    try {
      loading.value = true;
      error.value = null;

      // Try to load from local storage first (offline support)
      let localDesigns = syncUtils.getAllDesigns();
      if (customerId) {
        localDesigns = localDesigns.filter((d) => d.customerId === customerId);
      }
      designs.value = localDesigns;

      // Try to sync with server if online
      if (navigator.onLine) {
        try {
          const serverDesigns = customerId
            ? await designAPI.getByCustomerId(customerId)
            : await designAPI.getAll();
          designs.value = serverDesigns;
          // Update local storage with server data
        } catch (err) {
          console.warn("Could not sync with server, using local data:", err);
        }
      }
    } catch (err) {
      error.value = err.message;
      console.error("Error loading designs:", err);
    } finally {
      loading.value = false;
    }
  }

  // Add design - save locally and queue for sync
  async function addDesign(design) {
    try {
      loading.value = true;
      error.value = null;

      // Save to local storage immediately for offline support
      const localDesign = await syncUtils.saveDesign(design);
      designs.value.push(localDesign);

      // Try to sync with server if online
      if (navigator.onLine) {
        try {
          const serverDesign = await designAPI.create(design);
          // Update local design with server ID if needed
          const index = designs.value.findIndex((d) => d.id === localDesign.id);
          if (index !== -1) {
            designs.value[index] = {
              ...localDesign,
              ...serverDesign,
              synced: true,
            };
            syncUtils.updateDesign(localDesign.id, {
              ...localDesign,
              ...serverDesign,
              synced: true,
            });
          }
        } catch (err) {
          console.warn("Could not sync with server, data saved locally:", err);
        }
      }

      return localDesign;
    } catch (err) {
      error.value = err.message;
      console.error("Error adding design:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Update design - save locally and queue for sync
  async function updateDesign(id, updatedData) {
    try {
      loading.value = true;
      error.value = null;

      // Update in local storage immediately for offline support
      const localDesign = await syncUtils.updateDesign(id, updatedData);
      const index = designs.value.findIndex((d) => d.id === id);
      if (index !== -1)
        designs.value[index] = { ...designs.value[index], ...updatedData };

      // Try to sync with server if online
      if (navigator.onLine) {
        try {
          const serverDesign = await designAPI.update(id, updatedData);
          // Mark as synced
          if (index !== -1) {
            designs.value[index] = {
              ...designs.value[index],
              ...serverDesign,
              synced: true,
            };
            syncUtils.updateDesign(id, {
              ...designs.value[index],
              synced: true,
            });
          }
        } catch (err) {
          console.warn("Could not sync with server, data saved locally:", err);
        }
      }

      return localDesign;
    } catch (err) {
      error.value = err.message;
      console.error("Error updating design:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Delete design - delete locally and queue for sync
  async function deleteDesign(id) {
    try {
      loading.value = true;
      error.value = null;

      // Delete from local storage immediately for offline support
      await syncUtils.deleteDesign(id);
      const deletedDesign = designs.value.find((d) => d.id === id);
      designs.value = designs.value.filter((d) => d.id !== id);

      // Try to sync with server if online
      if (navigator.onLine) {
        try {
          await designAPI.delete(id);
          // Mark as synced in local storage
          syncUtils.markAsSynced("designs", id);
        } catch (err) {
          console.warn(
            "Could not sync with server, data deleted locally:",
            err
          );
        }
      }

      return deletedDesign;
    } catch (err) {
      error.value = err.message;
      console.error("Error deleting design:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    designs,
    loading,
    error,
    loadDesigns,
    addDesign,
    updateDesign,
    deleteDesign,
  };
});

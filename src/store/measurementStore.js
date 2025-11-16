// src/store/measurementStore.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { measurementAPI } from "@/services/api";
import { syncUtils } from "@/utils/sync";

export const useMeasurementStore = defineStore("measurement", () => {
  const measurements = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Load measurements - try local storage first, then API
  async function loadMeasurements(customerId = null) {
    try {
      loading.value = true;
      error.value = null;

      // Try to load from local storage first (offline support)
      let localMeasurements = syncUtils.getAllMeasurements();
      if (customerId) {
        localMeasurements = localMeasurements.filter(
          (m) => m.customerId === customerId
        );
      }
      measurements.value = localMeasurements;

      // Try to sync with server if online
      if (navigator.onLine) {
        try {
          const serverMeasurements = customerId
            ? await measurementAPI.getByCustomerId(customerId)
            : await measurementAPI.getAll();
          measurements.value = serverMeasurements;
          // Update local storage with server data
          // Note: This would need to be implemented in syncUtils
        } catch (err) {
          console.warn("Could not sync with server, using local data:", err);
        }
      }
    } catch (err) {
      error.value = err.message;
      console.error("Error loading measurements:", err);
    } finally {
      loading.value = false;
    }
  }

  // Add measurement - save locally and queue for sync
  async function addMeasurement(measurement) {
    try {
      loading.value = true;
      error.value = null;

      // Save to local storage immediately for offline support
      const localMeasurement = await syncUtils.saveMeasurement(measurement);
      measurements.value.push(localMeasurement);

      // Try to sync with server if online
      if (navigator.onLine) {
        try {
          const serverMeasurement = await measurementAPI.create(measurement);
          // Update local measurement with server ID if needed
          const index = measurements.value.findIndex(
            (m) => m.id === localMeasurement.id
          );
          if (index !== -1) {
            measurements.value[index] = {
              ...localMeasurement,
              ...serverMeasurement,
              synced: true,
            };
            syncUtils.updateMeasurement(localMeasurement.id, {
              ...localMeasurement,
              ...serverMeasurement,
              synced: true,
            });
          }
        } catch (err) {
          console.warn("Could not sync with server, data saved locally:", err);
        }
      }

      return localMeasurement;
    } catch (err) {
      error.value = err.message;
      console.error("Error adding measurement:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Update measurement - save locally and queue for sync
  async function updateMeasurement(id, updatedData) {
    try {
      loading.value = true;
      error.value = null;

      // Update in local storage immediately for offline support
      const localMeasurement = await syncUtils.updateMeasurement(
        id,
        updatedData
      );
      const index = measurements.value.findIndex((m) => m.id === id);
      if (index !== -1)
        measurements.value[index] = {
          ...measurements.value[index],
          ...updatedData,
        };

      // Try to sync with server if online
      if (navigator.onLine) {
        try {
          const serverMeasurement = await measurementAPI.update(
            id,
            updatedData
          );
          // Mark as synced
          if (index !== -1) {
            measurements.value[index] = {
              ...measurements.value[index],
              ...serverMeasurement,
              synced: true,
            };
            syncUtils.updateMeasurement(id, {
              ...measurements.value[index],
              synced: true,
            });
          }
        } catch (err) {
          console.warn("Could not sync with server, data saved locally:", err);
        }
      }

      return localMeasurement;
    } catch (err) {
      error.value = err.message;
      console.error("Error updating measurement:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Delete measurement - delete locally and queue for sync
  async function deleteMeasurement(id) {
    try {
      loading.value = true;
      error.value = null;

      // Delete from local storage immediately for offline support
      await syncUtils.deleteMeasurement(id);
      const deletedMeasurement = measurements.value.find((m) => m.id === id);
      measurements.value = measurements.value.filter((m) => m.id !== id);

      // Try to sync with server if online
      if (navigator.onLine) {
        try {
          await measurementAPI.delete(id);
          // Mark as synced in local storage
          syncUtils.markAsSynced("measurements", id);
        } catch (err) {
          console.warn(
            "Could not sync with server, data deleted locally:",
            err
          );
        }
      }

      return deletedMeasurement;
    } catch (err) {
      error.value = err.message;
      console.error("Error deleting measurement:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    measurements,
    loading,
    error,
    loadMeasurements,
    addMeasurement,
    updateMeasurement,
    deleteMeasurement,
  };
});

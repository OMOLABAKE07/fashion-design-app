// src/store/messageStore.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { messageAPI } from "@/services/api";
import { syncUtils } from "@/utils/sync";

export const useMessageStore = defineStore("message", () => {
  const messages = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Load messages - try local storage first, then API
  async function loadMessages(customerId = null) {
    try {
      loading.value = true;
      error.value = null;

      // Try to load from local storage first (offline support)
      let localMessages = syncUtils.getAllMessages();
      if (customerId) {
        localMessages = localMessages.filter(
          (m) => m.customerId === customerId
        );
      }
      messages.value = localMessages;

      // Try to sync with server if online
      if (navigator.onLine) {
        try {
          const serverMessages = customerId
            ? await messageAPI.getByCustomerId(customerId)
            : await messageAPI.getAll();
          messages.value = serverMessages;
          // Update local storage with server data
        } catch (err) {
          console.warn("Could not sync with server, using local data:", err);
        }
      }
    } catch (err) {
      error.value = err.message;
      console.error("Error loading messages:", err);
    } finally {
      loading.value = false;
    }
  }

  // Add message - save locally and queue for sync
  async function addMessage(message) {
    try {
      loading.value = true;
      error.value = null;

      // Save to local storage immediately for offline support
      const localMessage = await syncUtils.saveMessage(message);
      messages.value.push(localMessage);

      // Try to sync with server if online
      if (navigator.onLine) {
        try {
          const serverMessage = await messageAPI.create(message);
          // Update local message with server ID if needed
          const index = messages.value.findIndex(
            (m) => m.id === localMessage.id
          );
          if (index !== -1) {
            messages.value[index] = {
              ...localMessage,
              ...serverMessage,
              synced: true,
            };
            syncUtils.updateMessage(localMessage.id, {
              ...localMessage,
              ...serverMessage,
              synced: true,
            });
          }
        } catch (err) {
          console.warn("Could not sync with server, data saved locally:", err);
        }
      }

      return localMessage;
    } catch (err) {
      error.value = err.message;
      console.error("Error adding message:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Update message - save locally and queue for sync
  async function updateMessage(id, updatedData) {
    try {
      loading.value = true;
      error.value = null;

      // Update in local storage immediately for offline support
      const localMessage = await syncUtils.updateMessage(id, updatedData);
      const index = messages.value.findIndex((m) => m.id === id);
      if (index !== -1)
        messages.value[index] = { ...messages.value[index], ...updatedData };

      // Try to sync with server if online
      if (navigator.onLine) {
        try {
          const serverMessage = await messageAPI.update(id, updatedData);
          // Mark as synced
          if (index !== -1) {
            messages.value[index] = {
              ...messages.value[index],
              ...serverMessage,
              synced: true,
            };
            syncUtils.updateMessage(id, {
              ...messages.value[index],
              synced: true,
            });
          }
        } catch (err) {
          console.warn("Could not sync with server, data saved locally:", err);
        }
      }

      return localMessage;
    } catch (err) {
      error.value = err.message;
      console.error("Error updating message:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Delete message - delete locally and queue for sync
  async function deleteMessage(id) {
    try {
      loading.value = true;
      error.value = null;

      // Delete from local storage immediately for offline support
      await syncUtils.deleteMessage(id);
      const deletedMessage = messages.value.find((m) => m.id === id);
      messages.value = messages.value.filter((m) => m.id !== id);

      // Try to sync with server if online
      if (navigator.onLine) {
        try {
          await messageAPI.delete(id);
          // Mark as synced in local storage
          syncUtils.markAsSynced("messages", id);
        } catch (err) {
          console.warn(
            "Could not sync with server, data deleted locally:",
            err
          );
        }
      }

      return deletedMessage;
    } catch (err) {
      error.value = err.message;
      console.error("Error deleting message:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    messages,
    loading,
    error,
    loadMessages,
    addMessage,
    updateMessage,
    deleteMessage,
  };
});

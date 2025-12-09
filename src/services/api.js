// API service for connecting to the backend

import axios from "axios";

// const API_BASE_URL = "https://api-effizy.giftedsociety.org/api/v1/";
const API_BASE_URL = "http://localhost:8000/api/v1";

// Generic API call function using axios
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await axios({
      url: `${API_BASE_URL}${endpoint}`,
      method: options.method || 'GET',
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      data: options.body ? JSON.parse(options.body) : undefined,
      ...options,
    });

    // Axios automatically handles JSON parsing
    // Handle 204 No Content or empty responses
    if (response.status === 204 || !response.data) {
      return { message: 'Success' };
    }

    return response.data;
  } catch (error) {
    console.error(`API call error for ${endpoint}:`, error);
    throw error;
  }
};

// Design API functions - UPDATED FOR LARAVEL BACKEND WITH FILE UPLOADS
export const designAPI = {
  getAll: () => apiCall("/designs"),

  getByCustomerId: (customerId) => apiCall(`/designs/customer/${customerId}`),

  getById: (id) => apiCall(`/designs/${id}`),

  create: (designData) => {
    // For file uploads, we need to use FormData
    if (designData instanceof FormData) {
      return axios.post(`${API_BASE_URL}/designs`, designData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }).then(response => response.data);
    }

    // For regular JSON data
    return apiCall("/designs", {
      method: "POST",
      body: JSON.stringify(designData),
    });
  },

  update: (id, designData) => {
    // For file uploads, we need to use FormData
    if (designData instanceof FormData) {
      designData.append("_method", "PUT");

      return axios.post(`${API_BASE_URL}/designs/${id}`, designData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }).then(response => response.data);
    }

    // For regular JSON data
    return apiCall(`/designs/${id}`, {
      method: "PUT",
      body: JSON.stringify(designData),
    });
  },

  delete: (id) =>
    apiCall(`/designs/${id}`, {
      method: "DELETE",
    }),

  deletePhoto: (photoId) => {
    return axios.delete(`${API_BASE_URL}/designs/design-photos/${photoId}`)
      .then(response => response.data || { message: 'Success' });
  },
};

// Customer API functions
export const customerAPI = {
  getAll: (search = "") => {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    return apiCall(`/customers${query}`);
  },

  getById: (id) => apiCall(`/customers/${id}`),

  create: (customerData) =>
    apiCall("/customers", {
      method: "POST",
      body: JSON.stringify(customerData),
    }),

  update: (id, customerData) =>
    apiCall(`/customers/${id}`, {
      method: "PUT",
      body: JSON.stringify(customerData),
    }),

  delete: (id) =>
    apiCall(`/customers/${id}`, {
      method: "DELETE",
    }),
};

// Measurement API functions
export const measurementAPI = {
  getAll: () => apiCall("/measurements"),

  getByCustomerId: (customerId) =>
    apiCall(`/measurements/customer/${customerId}`),

  getById: (id) => apiCall(`/measurements/${id}`),

  create: (measurementData) =>
    apiCall("/measurements", {
      method: "POST",
      body: JSON.stringify(measurementData),
    }),

  update: (id, measurementData) =>
    apiCall(`/measurements/${id}`, {
      method: "PUT",
      body: JSON.stringify(measurementData),
    }),

  delete: (id) =>
    apiCall(`/measurements/${id}`, {
      method: "DELETE",
    }),
};

// Message API functions
export const messageAPI = {
  getAll: () => apiCall("/messages"),

  getByCustomerId: (customerId) => apiCall(`/messages/customer/${customerId}`),

  getById: (id) => apiCall(`/messages/${id}`),

  create: (messageData) =>
    apiCall("/messages", {
      method: "POST",
      body: JSON.stringify(messageData),
    }),

  update: (id, messageData) =>
    apiCall(`/messages/${id}`, {
      method: "PUT",
      body: JSON.stringify(messageData),
    }),

  delete: (id) =>
    apiCall(`/messages/${id}`, {
      method: "DELETE",
    }),
};

export const syncQueueAPI = {
  getAll: () => apiCall('/sync-queue'),

  create: (syncData) => apiCall('/sync-queue', {
    method: 'POST',
    body: JSON.stringify(syncData)
  }),

  update: (id, syncData) => apiCall(`/sync-queue/${id}`, {
    method: 'PUT',
    body: JSON.stringify(syncData)
  }),

  delete: (id) => apiCall(`/sync-queue/${id}`, {
    method: 'DELETE'
  })
};

export default {
  customerAPI,
  measurementAPI,
  designAPI,
  messageAPI,
  syncQueueAPI
};
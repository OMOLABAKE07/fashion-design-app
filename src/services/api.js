// API service for connecting to the backend
const API_BASE_URL = "http://localhost:8000/api/v1"; // ✅ FIXED: Laravel port + /v1

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(
        `API call failed: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`API call error for ${endpoint}:`, error);
    throw error;
  }
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

// Design API functions - UPDATED FOR LARAVEL BACKEND WITH FILE UPLOADS
export const designAPI = {
  getAll: () => apiCall("/designs"),

  getByCustomerId: (customerId) => apiCall(`/designs/customer/${customerId}`),

  getById: (id) => apiCall(`/designs/${id}`),

  create: (designData) => {
    // For file uploads, we need to use FormData
    if (designData instanceof FormData) {
      return fetch(`${API_BASE_URL}/designs`, {
        method: "POST",
        body: designData,
        // Don't set Content-Type header, let browser set it with boundary for FormData
      }).then((response) => {
        if (!response.ok) {
          throw new Error(
            `API call failed: ${response.status} ${response.statusText}`
          );
        }
        return response.json();
      });
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
      // Add _method field for Laravel to recognize PUT requests with file uploads
      if (designData instanceof FormData) {
        designData.append("_method", "PUT");
      }

      return fetch(`${API_BASE_URL}/designs/${id}`, {
        method: "POST", // Laravel uses POST with _method for file uploads
        body: designData,
        // Don't set Content-Type header, let browser set it with boundary for FormData
      }).then((response) => {
        if (!response.ok) {
          throw new Error(
            `API call failed: ${response.status} ${response.statusText}`
          );
        }
        return response.json();
      });
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
    return fetch(`${API_BASE_URL}/designs/photo/${photoId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error(
          `API call failed: ${response.status} ${response.statusText}`
        );
      }
      return response.json();
    });
  },
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

export default {
  customerAPI,
  measurementAPI,
  designAPI,
  messageAPI,
};

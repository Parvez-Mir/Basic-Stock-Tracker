import { useState } from 'react';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;


export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApi = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json();
      
      if (!response.ok) {
        if (data.errors) {
          // Join multiple validation errors into a single message
          throw new Error(data.errors.map(e => e.message).join('. '));
        }
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, data) => {
    return fetchApi(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  };

  const deleteProduct = async (id, data) => {
    return fetchApi(`/products/${id}`, {
      method: 'DELETE',
      body: JSON.stringify(data)
    });
  };

  return {
    fetchApi,
    updateProduct,
    deleteProduct,
    loading,
    error
  };
}
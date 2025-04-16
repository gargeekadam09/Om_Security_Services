const API_URL = process.env.REACT_APP_API_URL;

export const getAllServices = async () => {
  const response = await fetch(`${API_URL}/services`);
  if (!response.ok) {
    throw new Error('Failed to fetch services');
  }
  const data = await response.json();
  return data;
};

export const getServiceById = async (id) => {
  const response = await fetch(`${API_URL}/services/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch service');
  }
  const data = await response.json();
  return data;
};

export const createService = async (serviceData) => {
  const response = await fetch(`${API_URL}/services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(serviceData),
  });
  const data = await response.json();
  return data;
};

export const updateService = async (id, updatedData) => {
  const response = await fetch(`${API_URL}/services/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });
  const data = await response.json();
  return data;
};

export const deleteService = async (id) => {
  const response = await fetch(`${API_URL}/services/${id}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  return data;
};

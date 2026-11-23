const API_BASE = '/api';

export const getAuthToken = () => localStorage.getItem('ecotrace_token');
export const setAuthToken = (token: string) => localStorage.setItem('ecotrace_token', token);
export const removeAuthToken = () => localStorage.removeItem('ecotrace_token');

const authHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error((await res.json()).detail || 'Login failed');
    return res.json();
  },

  register: async (data: any) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).detail || 'Registration failed');
    return res.json();
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
  },

  // Bins & IoT
  getBins: async () => {
    const res = await fetch(`${API_BASE}/bins`, { headers: authHeaders() });
    return res.json();
  },

  simulateIoTStep: async () => {
    const res = await fetch(`${API_BASE}/iot/simulate-step`, {
      method: 'POST',
      headers: authHeaders()
    });
    return res.json();
  },

  // AI
  classifyWaste: async (imageBase64?: string) => {
    const res = await fetch(`${API_BASE}/ai/classify-waste`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ image_base64: imageBase64 })
    });
    return res.json();
  },

  forecastWaste: async (area = 'Hostel Zone', days = 5) => {
    const res = await fetch(`${API_BASE}/ai/forecast-waste?area=${encodeURIComponent(area)}&days=${days}`, {
      headers: authHeaders()
    });
    return res.json();
  },

  // Batches / Digital Plastic Passport
  getBatches: async () => {
    const res = await fetch(`${API_BASE}/batches`, { headers: authHeaders() });
    return res.json();
  },

  createBatch: async (data: any) => {
    const res = await fetch(`${API_BASE}/batches`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  trackBatch: async (batchCode: string) => {
    const res = await fetch(`${API_BASE}/batches/track/${batchCode}`);
    if (!res.ok) throw new Error('Batch not found');
    return res.json();
  },

  updateBatchStatus: async (batchId: number, data: any) => {
    const res = await fetch(`${API_BASE}/batches/${batchId}/status`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Collections & Pickups
  getPickups: async () => {
    const res = await fetch(`${API_BASE}/pickups`, { headers: authHeaders() });
    return res.json();
  },

  createPickup: async (data: any) => {
    const res = await fetch(`${API_BASE}/pickups`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updatePickupStatus: async (pickupId: number, status: string) => {
    const res = await fetch(`${API_BASE}/pickups/${pickupId}/status?status=${status}`, {
      method: 'PATCH',
      headers: authHeaders()
    });
    return res.json();
  },

  getOptimizedRoute: async () => {
    const res = await fetch(`${API_BASE}/collections/optimized-route`, { headers: authHeaders() });
    return res.json();
  },

  // Rewards
  getWallet: async () => {
    const res = await fetch(`${API_BASE}/rewards/wallet`, { headers: authHeaders() });
    return res.json();
  },

  getTransactions: async () => {
    const res = await fetch(`${API_BASE}/rewards/transactions`, { headers: authHeaders() });
    return res.json();
  },

  getLeaderboard: async () => {
    const res = await fetch(`${API_BASE}/rewards/leaderboard`, { headers: authHeaders() });
    return res.json();
  },

  // Marketplace
  getListings: async (materialType?: string) => {
    const url = materialType ? `${API_BASE}/marketplace/listings?material_type=${materialType}` : `${API_BASE}/marketplace/listings`;
    const res = await fetch(url, { headers: authHeaders() });
    return res.json();
  },

  createListing: async (data: any) => {
    const res = await fetch(`${API_BASE}/marketplace/listings`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  placeOrder: async (data: any) => {
    const res = await fetch(`${API_BASE}/marketplace/orders`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Complaints
  getComplaints: async () => {
    const res = await fetch(`${API_BASE}/complaints`, { headers: authHeaders() });
    return res.json();
  },

  createComplaint: async (data: any) => {
    const res = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  resolveComplaint: async (id: number, notes: string) => {
    const res = await fetch(`${API_BASE}/complaints/${id}/resolve?resolution_notes=${encodeURIComponent(notes)}`, {
      method: 'PATCH',
      headers: authHeaders()
    });
    return res.json();
  },

  // Analytics
  getEnvironmentalImpact: async () => {
    const res = await fetch(`${API_BASE}/analytics/environmental-impact`, { headers: authHeaders() });
    return res.json();
  },

  getDashboardSummary: async () => {
    const res = await fetch(`${API_BASE}/analytics/dashboard-summary`, { headers: authHeaders() });
    return res.json();
  }
};

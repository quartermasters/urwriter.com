const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3007/api/v1';

export class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken();
          window.location.href = '/signin';
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ access_token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    userType: 'CLIENT' | 'FREELANCER';
  }) {
    return this.request<{ access_token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // User endpoints
  async getCurrentUser() {
    return this.request<any>('/me');
  }

  async updateProfile(profileData: any) {
    return this.request<any>('/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Jobs endpoints
  async getJobs(params?: {
    category?: string;
    search?: string;
    minBudget?: number;
    maxBudget?: number;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/jobs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{ jobs: any[]; total: number; page: number }>( endpoint);
  }

  async getJob(id: string) {
    return this.request<any>(`/jobs/${id}`);
  }

  async createJob(jobData: any) {
    return this.request<any>('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  // Proposals endpoints
  async getProposals(jobId?: string) {
    const endpoint = jobId ? `/proposals?jobId=${jobId}` : '/proposals';
    return this.request<any[]>(endpoint);
  }

  async createProposal(proposalData: any) {
    return this.request<any>('/proposals', {
      method: 'POST',
      body: JSON.stringify(proposalData),
    });
  }

  // Messages endpoints
  async getConversations() {
    return this.request<any[]>('/messages/conversations');
  }

  async getMessages(conversationId: string) {
    return this.request<any[]>(`/messages/${conversationId}`);
  }

  async sendMessage(data: { recipientId: string; content: string; contractId?: string }) {
    return this.request<any>('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();

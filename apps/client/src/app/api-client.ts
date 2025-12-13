import axios, { AxiosInstance } from 'axios';

// api-client.ts
class ApiClient {
  private _client: AxiosInstance;
  private readonly _protectedPaths = ['/user-chart', '/embed'];
  private _accessToken: string | null = null;

  constructor() {
    this._client = axios.create({
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Called by auth layer (react-oidc-context)
   */
  setAccessToken(token: string | null) {
    this._accessToken = token;
  }

  private setupInterceptors() {
    this._client.interceptors.request.use(
      (config) => {
        if (this.requiresAuth(config.url)) {
          if (!this._accessToken) {
            window.location.href = '/login';
            return Promise.reject(new Error('No access token'));
          }

          config.headers.Authorization = `Bearer ${this._accessToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    this._client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (
          error.response?.status === 401 &&
          this.requiresAuth(error.config?.url)
        ) {
          // OIDC client will auto-refresh if possible
          window.location.href = '/login';
        }

        return Promise.reject(error);
      }
    );
  }

  private requiresAuth(url?: string): boolean {
    if (!url) return false;
    return this._protectedPaths.some((p) => url.includes(p));
  }

  get instance(): AxiosInstance {
    return this._client;
  }
}

export const api = new ApiClient(); //singleton class.

import { HttpClient } from '../client';
import {
  ApiKey,
  CreateApiKeyRequest,
  UpdateApiKeyRequest,
  ApiKeyUsage,
  ApiKeyRequestsResponse,
  ApiResponse,
  PaginatedResponse,
  LimitInfo,
  RequestOptions,
} from '../types';

/**
 * Module for managing API Keys
 */
export class ApiKeysModule {
  constructor(private client: HttpClient) {}

  /**
   * Lists all API Keys for the authenticated owner
   */
  async list(options?: RequestOptions): Promise<PaginatedResponse<ApiKey>> {
    return this.client.get<PaginatedResponse<ApiKey>>('/keys', options);
  }

  /**
   * Creates a new API Key
   */
  async create(
    data: CreateApiKeyRequest,
    options?: RequestOptions
  ): Promise<ApiResponse<ApiKey & { limitInfo?: LimitInfo }>> {
    return this.client.post<ApiResponse<ApiKey & { limitInfo?: LimitInfo }>>('/keys', data, options);
  }

  /**
   * Gets a specific API Key by ID
   */
  async get(keyId: string, options?: RequestOptions): Promise<ApiResponse<ApiKey>> {
    return this.client.get<ApiResponse<ApiKey>>(`/keys/${keyId}`, options);
  }

  /**
   * Updates an existing API Key
   */
  async update(
    keyId: string,
    data: UpdateApiKeyRequest,
    options?: RequestOptions
  ): Promise<ApiResponse<ApiKey>> {
    return this.client.put<ApiResponse<ApiKey>>(`/keys/${keyId}`, data, options);
  }

  /**
   * Deletes an API Key (soft delete)
   */
  async delete(keyId: string, options?: RequestOptions): Promise<ApiResponse<{ message: string }>> {
    return this.client.delete<ApiResponse<{ message: string }>>(`/keys/${keyId}`, options);
  }

  /**
   * Regenerates an existing API Key
   */
  async regenerate(
    keyId: string,
    options?: RequestOptions
  ): Promise<ApiResponse<ApiKey>> {
    return this.client.post<ApiResponse<ApiKey>>(`/keys/${keyId}/regenerate`, undefined, options);
  }

  /**
   * Gets usage statistics for an API Key
   */
  async getUsage(keyId: string, options?: RequestOptions): Promise<ApiResponse<ApiKeyUsage>> {
    return this.client.get<ApiResponse<ApiKeyUsage>>(`/keys/${keyId}/usage`, options);
  }

  /**
   * Gets detailed request history for an API Key
   */
  async getRequests(
    keyId: string,
    options?: RequestOptions
  ): Promise<ApiResponse<ApiKeyRequestsResponse>> {
    return this.client.get<ApiResponse<ApiKeyRequestsResponse>>(`/keys/${keyId}/requests`, options);
  }
} 
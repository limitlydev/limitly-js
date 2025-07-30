import { HttpClient } from '../client';
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserUsage,
  ApiKey,
  ApiResponse,
  PaginatedResponse,
  RequestOptions,
} from '../types';

/**
 * Module for managing Users
 */
export class UsersModule {
  constructor(private client: HttpClient) {}

  /**
   * Lists all users for the client
   */
  async list(options?: RequestOptions): Promise<PaginatedResponse<User>> {
    return this.client.get<PaginatedResponse<User>>('/users', options);
  }

  /**
   * Creates a new user
   */
  async create(
    data: CreateUserRequest,
    options?: RequestOptions
  ): Promise<ApiResponse<User>> {
    return this.client.post<ApiResponse<User>>('/users', data, options);
  }

  /**
   * Gets a specific user by ID
   */
  async get(userId: number, options?: RequestOptions): Promise<ApiResponse<User>> {
    return this.client.get<ApiResponse<User>>(`/users/${userId}`, options);
  }

  /**
   * Updates an existing user
   */
  async update(
    userId: number,
    data: UpdateUserRequest,
    options?: RequestOptions
  ): Promise<ApiResponse<User>> {
    return this.client.put<ApiResponse<User>>(`/users/${userId}`, data, options);
  }

  /**
   * Deletes a user
   */
  async delete(userId: number, options?: RequestOptions): Promise<ApiResponse<{ message: string }>> {
    return this.client.delete<ApiResponse<{ message: string }>>(`/users/${userId}`, options);
  }

  /**
   * Gets usage for a specific user
   */
  async getUsage(userId: number, options?: RequestOptions): Promise<ApiResponse<UserUsage>> {
    return this.client.get<ApiResponse<UserUsage>>(`/users/${userId}/usage`, options);
  }

  /**
   * Gets all API Keys assigned to a specific user
   */
  async getKeys(userId: number, options?: RequestOptions): Promise<PaginatedResponse<ApiKey>> {
    return this.client.get<PaginatedResponse<ApiKey>>(`/users/${userId}/keys`, options);
  }

  /**
   * Creates a new API Key for a specific user
   */
  async createKey(
    userId: number,
    data: { name: string },
    options?: RequestOptions
  ): Promise<ApiResponse<ApiKey>> {
    return this.client.post<ApiResponse<ApiKey>>(`/users/${userId}/keys`, data, options);
  }
} 
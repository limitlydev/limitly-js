import { HttpClient } from '../client';
import {
  Plan,
  CreatePlanRequest,
  UpdatePlanRequest,
  PlanUsage,
  PlanUsersResponse,
  PlanKeysResponse,
  ApiResponse,
  PaginatedResponse,
  RequestOptions,
} from '../types';

/**
 * Module for managing Plans
 */
export class PlansModule {
  constructor(private client: HttpClient) {}

  /**
   * Lists all plans for the client
   */
  async list(options?: RequestOptions): Promise<PaginatedResponse<Plan>> {
    return this.client.get<PaginatedResponse<Plan>>('/plans', options);
  }

  /**
   * Creates a new plan
   */
  async create(
    data: CreatePlanRequest,
    options?: RequestOptions
  ): Promise<ApiResponse<Plan>> {
    return this.client.post<ApiResponse<Plan>>('/plans', data, options);
  }

  /**
   * Gets a specific plan by ID
   */
  async get(planId: string, options?: RequestOptions): Promise<ApiResponse<Plan>> {
    return this.client.get<ApiResponse<Plan>>(`/plans/${planId}`, options);
  }

  /**
   * Updates an existing plan
   */
  async update(
    planId: string,
    data: UpdatePlanRequest,
    options?: RequestOptions
  ): Promise<ApiResponse<Plan>> {
    return this.client.put<ApiResponse<Plan>>(`/plans/${planId}`, data, options);
  }

  /**
   * Deletes a plan
   */
  async delete(planId: string, options?: RequestOptions): Promise<ApiResponse<{ message: string }>> {
    return this.client.delete<ApiResponse<{ message: string }>>(`/plans/${planId}`, options);
  }

  /**
   * Gets usage statistics for a plan
   */
  async getUsage(planId: string, options?: RequestOptions): Promise<ApiResponse<PlanUsage>> {
    return this.client.get<ApiResponse<PlanUsage>>(`/plans/${planId}/usage`, options);
  }

  /**
   * Gets all users assigned to a plan
   */
  async getUsers(planId: string, options?: RequestOptions): Promise<ApiResponse<PlanUsersResponse>> {
    return this.client.get<ApiResponse<PlanUsersResponse>>(`/plans/${planId}/users`, options);
  }

  /**
   * Gets all API Keys directly assigned to a plan
   */
  async getKeys(planId: string, options?: RequestOptions): Promise<ApiResponse<PlanKeysResponse>> {
    return this.client.get<ApiResponse<PlanKeysResponse>>(`/plans/${planId}/keys`, options);
  }
} 
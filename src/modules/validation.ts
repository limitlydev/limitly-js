import { HttpClient } from '../client';
import {
  ValidateRequestRequest,
  ValidateRequestResponse,
  RequestOptions,
} from '../types';

/**
 * Module for validating requests
 */
export class ValidationModule {
  constructor(private client: HttpClient) {}

  /**
   * Validates a user request using their API Key
   */
  async validateRequest(
    data: ValidateRequestRequest,
    options?: RequestOptions
  ): Promise<ValidateRequestResponse> {
    return this.client.post<ValidateRequestResponse>('/validate', data, options);
  }

  /**
   * Convenience method to validate a request with individual parameters
   */
  async validate(
    apiKey: string,
    endpoint: string,
    method: string,
    options?: RequestOptions
  ): Promise<ValidateRequestResponse> {
    return this.validateRequest(
      {
        api_key: apiKey,
        endpoint,
        method,
      },
      options
    );
  }
} 
import { HttpClient } from './client';
import { ApiKeysModule } from './modules/api-keys';
import { PlansModule } from './modules/plans';
import { UsersModule } from './modules/users';
import { ValidationModule } from './modules/validation';
import { LimitlyConfig } from './types';

/**
 * Main Limitly SDK client
 * 
 * @example
 * ```typescript
 * import { Limitly } from '@limitly/sdk';
 * 
 * const limitly = new Limitly({
 *   apiKey: 'your_limitly_api_key'
 * });
 * 
 * // Validate a request
 * const result = await limitly.validation.validate(
 *   'user_api_key',
 *   '/api/users',
 *   'GET'
 * );
 * 
 * if (result.success) {
 *   console.log('Request allowed');
 * } else {
 *   console.log('Request denied:', result.error);
 * }
 * ```
 */
export class Limitly {
  public readonly apiKeys: ApiKeysModule;
  public readonly plans: PlansModule;
  public readonly users: UsersModule;
  public readonly validation: ValidationModule;

  private client: HttpClient;

  constructor(config: LimitlyConfig) {
    this.client = new HttpClient(config);
    
    this.apiKeys = new ApiKeysModule(this.client);
    this.plans = new PlansModule(this.client);
    this.users = new UsersModule(this.client);
    this.validation = new ValidationModule(this.client);
  }

  /**
   * Gets the internal HTTP client
   * Useful for debugging and testing
   */
  getClient(): HttpClient {
    return this.client;
  }
}

// Exportar tipos
export * from './types';

// Exportar clases individuales para uso avanzado
export { HttpClient } from './client';
export { ApiKeysModule } from './modules/api-keys';
export { PlansModule } from './modules/plans';
export { UsersModule } from './modules/users';
export { ValidationModule } from './modules/validation';

// Exportar la clase principal como default
export default Limitly; 
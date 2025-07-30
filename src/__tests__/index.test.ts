import { Limitly } from '../index';
import { LimitlyError } from '../types';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Limitly SDK', () => {
  let limitly: Limitly;

  beforeEach(() => {
    limitly = new Limitly({
      apiKey: 'test-api-key'
    });
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should create a valid instance', () => {
      expect(limitly).toBeInstanceOf(Limitly);
      expect(limitly.apiKeys).toBeDefined();
      expect(limitly.plans).toBeDefined();
      expect(limitly.users).toBeDefined();
      expect(limitly.validation).toBeDefined();
    });

    it('should use the default base URL', () => {
      const client = limitly.getClient();
      expect(client).toBeDefined();
    });
  });

  describe('Request Validation', () => {
    it('should validate a request correctly', async () => {
      const mockResponse = {
        success: true,
        message: 'Request allowed',
        details: {
          current_usage: 45,
          limit: 1000,
          plan_name: 'Plan Pro',
          period_start: '2024-01-01T00:00:00Z',
          period_end: '2024-02-01T00:00:00Z'
        }
      };

      (mockedAxios as any).mockResolvedValueOnce({
        data: mockResponse,
        status: 200,
        statusText: 'OK'
      });

      const result = await limitly.validation.validate(
        'user-api-key',
        '/api/users',
        'GET'
      );

      expect(result).toEqual(mockResponse);
      expect(mockedAxios).toHaveBeenCalledWith(
        'https://xfkyofkqbukqtxcuapvf.supabase.co/functions/v1/validate',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-api-key',
            'Content-Type': 'application/json'
          }),
          data: {
            api_key: 'user-api-key',
            endpoint: '/api/users',
            method: 'GET'
          }
        })
      );
    });

    it('should handle validation errors', async () => {
      const mockError = {
        success: false,
        error: 'Rate limit exceeded',
        details: {
          current_usage: 1000,
          limit: 1000,
          plan_name: 'Plan Básico',
          period_start: '2024-01-01T00:00:00Z',
          period_end: '2024-02-01T00:00:00Z'
        }
      };

      (mockedAxios as any).mockRejectedValueOnce({
        response: {
          data: mockError,
          status: 429,
          statusText: 'Too Many Requests'
        }
      });

      await expect(
        limitly.validation.validate('user-api-key', '/api/users', 'GET')
      ).rejects.toThrow(LimitlyError);
    });
  });

  describe('API Keys', () => {
    it('should list API Keys', async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            id: 'key-1',
            name: 'Test API Key',
            status: 'active',
            created_at: '2024-01-01T00:00:00Z'
          }
        ],
        count: 1
      };

      (mockedAxios as any).mockResolvedValueOnce({
        data: mockResponse,
        status: 200,
        statusText: 'OK'
      });

      const result = await limitly.apiKeys.list();

      expect(result).toEqual(mockResponse);
      expect(mockedAxios).toHaveBeenCalledWith(
        'https://xfkyofkqbukqtxcuapvf.supabase.co/functions/v1/keys',
        expect.objectContaining({
          method: 'GET'
        })
      );
    });

    it('should create an API Key', async () => {
      const mockResponse = {
        success: true,
        data: {
          id: 'key-1',
          name: 'Nueva API Key',
          api_key: 'encrypted-api-key',
          status: 'active',
          created_at: '2024-01-01T00:00:00Z'
        },
        message: 'API Key created successfully'
      };

      (mockedAxios as any).mockResolvedValueOnce({
        data: mockResponse,
        status: 200,
        statusText: 'OK'
      });

      const result = await limitly.apiKeys.create({
        name: 'Nueva API Key',
        user_id: 123
      });

      expect(result).toEqual(mockResponse);
    });
  });

  describe('Plans', () => {
    it('should create a plan', async () => {
      const mockResponse = {
        success: true,
        data: {
          id: 'plan-1',
          name: 'Plan Básico',
          description: 'Plan para usuarios básicos',
          max_requests: 10000,
          request_period: 'month',
          is_active: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      };

      (mockedAxios as any).mockResolvedValueOnce({
        data: mockResponse,
        status: 200,
        statusText: 'OK'
      });

      const result = await limitly.plans.create({
        name: 'Plan Básico',
        description: 'Plan para usuarios básicos',
        max_requests: 10000,
        request_period: 'month'
      });

      expect(result).toEqual(mockResponse);
    });
  });

  describe('Users', () => {
    it('should create a user', async () => {
      const mockResponse = {
        success: true,
        data: {
          user_id: 1,
          name: 'Juan Pérez',
          email: 'juan@example.com',
          is_disabled: false,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      };

      (mockedAxios as any).mockResolvedValueOnce({
        data: mockResponse,
        status: 200,
        statusText: 'OK'
      });

      const result = await limitly.users.create({
        name: 'Juan Pérez',
        email: 'juan@example.com'
      });

      expect(result).toEqual(mockResponse);
    });
  });
}); 
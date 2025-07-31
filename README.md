# @limitly/limitly-js

Official Node.js SDK for [Limitly](https://www.limitly.dev) - API Key management, plans, users and request validation.

## 🚀 Installation

```bash
npm install @limitly/limitly-js
```

## 📖 Basic Usage

### Initialization

```typescript
import { Limitly } from '@limitly/limitly-js';

const limitly = new Limitly({
  apiKey: 'your_limitly_api_key'
});
```

### Request Validation

The most common use case is validating your users' requests:

```typescript
// Validate a request
const result = await limitly.validation.validate(
  'user_api_key',
  '/api/users',
  'GET'
);

if (result.success) {
  console.log('Request allowed');
  console.log('Current usage:', result.details?.current_usage);
  console.log('Limit:', result.details?.limit);
} else {
  console.log('Request denied:', result.error);
}
```

### API Key Management

```typescript
// List all API Keys
const keys = await limitly.apiKeys.list();
console.log('API Keys:', keys.data);

// Create a new API Key
const newKey = await limitly.apiKeys.create({
  name: 'New API Key',
  user_id: 123
});
console.log('New API Key:', newKey.data?.api_key);

// Get usage for an API Key
const usage = await limitly.apiKeys.getUsage('key-id');
console.log('Usage:', usage.data);
```

### Plan Management

```typescript
// Create a plan
const plan = await limitly.plans.create({
  name: 'Basic Plan',
  description: 'Plan for basic users',
  max_requests: 10000,
  request_period: 'month'
});

// Get plan usage statistics
const planUsage = await limitly.plans.getUsage(plan.data?.id);
console.log('Plan usage:', planUsage.data);
```

### User Management

```typescript
// Create a user
const user = await limitly.users.create({
  name: 'John Doe',
  email: 'john@example.com',
  plan_id: 'plan-id'
});

// Get user usage
const userUsage = await limitly.users.getUsage(user.data?.user_id);
console.log('User usage:', userUsage.data);
```

## 🔧 Configuration

### Configuration Options

```typescript
const limitly = new Limitly({
  apiKey: 'your_limitly_api_key',
  baseUrl: 'https://your-project.supabase.co/functions/v1', // optional
  timeout: 30000 // optional, default: 30000ms
});
```

### Request Options

You can pass additional options to any method:

```typescript
const result = await limitly.apiKeys.list({
  timeout: 10000,
  headers: {
    'X-Custom-Header': 'value'
  }
});
```

## 📚 Complete API

### Request Validation

#### `validation.validate(apiKey, endpoint, method, options?)`
Validates a user request.

```typescript
const result = await limitly.validation.validate(
  'user_api_key',
  '/api/users',
  'GET'
);
```

#### `validation.validateRequest(data, options?)`
Validates a request with data object.

```typescript
const result = await limitly.validation.validateRequest({
  api_key: 'user_api_key',
  endpoint: '/api/users',
  method: 'GET'
});
```

### API Keys

#### `apiKeys.list(options?)`
Lists all API Keys.

#### `apiKeys.create(data, options?)`
Creates a new API Key.

```typescript
const key = await limitly.apiKeys.create({
  name: 'New API Key',
  user_id: 123, // optional
  plan_id: 'plan-id', // optional
  status: 'active' // optional
});
```

#### `apiKeys.get(keyId, options?)`
Gets a specific API Key.

#### `apiKeys.update(keyId, data, options?)`
Updates an API Key.

#### `apiKeys.delete(keyId, options?)`
Deletes an API Key (soft delete).

#### `apiKeys.regenerate(keyId, options?)`
Regenerates an API Key.

#### `apiKeys.getUsage(keyId, options?)`
Gets usage statistics for an API Key.

#### `apiKeys.getRequests(keyId, options?)`
Gets request history for an API Key.

### Plans

#### `plans.list(options?)`
Lists all plans.

#### `plans.create(data, options?)`
Creates a new plan.

```typescript
const plan = await limitly.plans.create({
  name: 'Basic Plan',
  description: 'Plan for basic users',
  max_requests: 10000,
  request_period: 'month', // 'day', 'week', 'month', 'year'
  is_active: true
});
```

#### `plans.get(planId, options?)`
Gets a specific plan.

#### `plans.update(planId, data, options?)`
Updates a plan.

#### `plans.delete(planId, options?)`
Deletes a plan.

#### `plans.getUsage(planId, options?)`
Gets usage statistics for a plan.

#### `plans.getUsers(planId, options?)`
Gets all users assigned to a plan.

#### `plans.getKeys(planId, options?)`
Gets all API Keys assigned to a plan.

### Users

#### `users.list(options?)`
Lists all users.

#### `users.create(data, options?)`
Creates a new user.

```typescript
const user = await limitly.users.create({
  name: 'John Doe',
  email: 'john@example.com', // optional
  plan_id: 'plan-id', // optional
  custom_start: '2024-01-01T00:00:00.000Z' // optional
});
```

#### `users.get(userId, options?)`
Gets a specific user.

#### `users.update(userId, data, options?)`
Updates a user.

#### `users.delete(userId, options?)`
Deletes a user.

#### `users.getUsage(userId, options?)`
Gets user usage.

#### `users.getKeys(userId, options?)`
Gets all API Keys for a user.

#### `users.createKey(userId, data, options?)`
Creates a new API Key for a user.

```typescript
const key = await limitly.users.createKey(123, {
  name: 'API Key for John'
});
```

## 🛠️ Error Handling

The SDK throws specific errors that you can catch:

```typescript
try {
  const result = await limitly.validation.validate(
    'invalid_api_key',
    '/api/users',
    'GET'
  );
} catch (error) {
  if (error instanceof LimitlyError) {
    console.log('Limitly error:', error.message);
    console.log('Status code:', error.statusCode);
    console.log('Full response:', error.response);
  } else {
    console.log('Unexpected error:', error);
  }
}
```

## 🔍 Advanced Examples

### Express Middleware

```typescript
import { Limitly } from '@limitly/limitly-js';
import express from 'express';

const app = express();
const limitly = new Limitly({
  apiKey: process.env.LIMITLY_API_KEY
});

// Validation middleware
app.use(async (req, res, next) => {
  const apiKey = req.headers.authorization?.replace('Bearer ', '');
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API Key required' });
  }

  try {
    const result = await limitly.validation.validate(
      apiKey,
      req.path,
      req.method
    );

    if (!result.success) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        details: result.details
      });
    }

    next();
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ error: 'Internal error' });
  }
});
```

### Usage Monitoring

```typescript
// Monitor API Key usage
async function monitorUsage() {
  const keys = await limitly.apiKeys.list();
  
  for (const key of keys.data || []) {
    const usage = await limitly.apiKeys.getUsage(key.id);
    
    if (usage.data && usage.data.percentageUsed > 80) {
      console.log(`⚠️ API Key ${key.name} is at ${usage.data.percentageUsed}% usage`);
    }
  }
}
```

### Automatic Plan Management

```typescript
// Create predefined plans
async function setupDefaultPlans() {
  const plans = [
    {
      name: 'Basic Plan',
      description: 'For new users',
      max_requests: 1000,
      request_period: 'month'
    },
    {
      name: 'Pro Plan',
      description: 'For advanced users',
      max_requests: 10000,
      request_period: 'month'
    },
    {
      name: 'Enterprise Plan',
      description: 'Unlimited',
      max_requests: -1,
      request_period: 'month'
    }
  ];

  for (const planData of plans) {
    await limitly.plans.create(planData);
  }
}
```

## 📦 Project Structure

```
src/
├── index.ts          # Main SDK class
├── client.ts         # Base HTTP client
├── types/            # TypeScript type definitions
│   └── index.ts
└── modules/          # Specific modules
    ├── api-keys.ts
    ├── plans.ts
    ├── users.ts
    └── validation.ts
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## 🆘 Support

- 📧 Email: hi@limitly.dev
- 💻 Limitly: https://www.limitly.dev
- 📖 Documentation: https://docs.limitly.com
- 🐛 Issues: https://github.com/limitlydev/limitly-js/issues 
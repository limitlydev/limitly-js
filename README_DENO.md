# @limitly/limitly-js for Deno

Official Deno SDK for [Limitly](https://www.limitly.dev) - API Key management, plans, users and request validation.

## 🚀 Installation

```bash
deno add @limitly/limitly-js
```

Or import directly:

```typescript
import { Limitly } from "https://deno.land/x/limitly_js@v1.0.2/mod.ts";
```

## 📖 Basic Usage

### Initialization

```typescript
import { Limitly } from "https://deno.land/x/limitly_js@v1.0.2/mod.ts";

const limitly = new Limitly({
  apiKey: 'your_limitly_api_key'
});
```

### Request Validation

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

## 🔧 Configuration

```typescript
const limitly = new Limitly({
  apiKey: 'your_limitly_api_key',
  baseUrl: 'https://your-project.supabase.co/functions/v1', // optional
  timeout: 30000 // optional, default: 30000ms
});
```

## 📚 API Reference

See the main [README.md](./README.md) for complete API documentation.

## 🛠️ Development

```bash
# Run tests
deno task test

# Format code
deno fmt

# Lint code
deno lint
```

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details. 
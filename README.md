# @limitly/sdk

SDK oficial de Node.js para Limitly - Gestión de API Keys, planes, usuarios y validación de requests.

## 🚀 Instalación

```bash
npm install @limitly/sdk
```

## 📖 Uso Básico

### Inicialización

```typescript
import { Limitly } from '@limitly/sdk';

const limitly = new Limitly({
  apiKey: 'tu_api_key_de_limitly'
});
```

### Validación de Requests

El caso de uso más común es validar requests de tus usuarios:

```typescript
// Validar una request
const result = await limitly.validation.validate(
  'api_key_del_usuario',
  '/api/users',
  'GET'
);

if (result.success) {
  console.log('Request permitida');
  console.log('Uso actual:', result.details?.current_usage);
  console.log('Límite:', result.details?.limit);
} else {
  console.log('Request denegada:', result.error);
}
```

### Gestión de API Keys

```typescript
// Listar todas las API Keys
const keys = await limitly.apiKeys.list();
console.log('API Keys:', keys.data);

// Crear una nueva API Key
const newKey = await limitly.apiKeys.create({
  name: 'Nueva API Key',
  user_id: 123
});
console.log('Nueva API Key:', newKey.data?.api_key);

// Obtener uso de una API Key
const usage = await limitly.apiKeys.getUsage('key-id');
console.log('Uso:', usage.data);
```

### Gestión de Planes

```typescript
// Crear un plan
const plan = await limitly.plans.create({
  name: 'Plan Básico',
  description: 'Plan para usuarios básicos',
  max_requests: 10000,
  request_period: 'month'
});

// Obtener estadísticas de uso del plan
const planUsage = await limitly.plans.getUsage(plan.data?.id);
console.log('Uso del plan:', planUsage.data);
```

### Gestión de Usuarios

```typescript
// Crear un usuario
const user = await limitly.users.create({
  name: 'Juan Pérez',
  email: 'juan@example.com',
  plan_id: 'plan-id'
});

// Obtener uso de un usuario
const userUsage = await limitly.users.getUsage(user.data?.user_id);
console.log('Uso del usuario:', userUsage.data);
```

## 🔧 Configuración

### Opciones de Configuración

```typescript
const limitly = new Limitly({
  apiKey: 'tu_api_key_de_limitly',
  baseUrl: 'https://tu-proyecto.supabase.co/functions/v1', // opcional
  timeout: 30000 // opcional, default: 30000ms
});
```

### Opciones de Request

Puedes pasar opciones adicionales a cualquier método:

```typescript
const result = await limitly.apiKeys.list({
  timeout: 10000,
  headers: {
    'X-Custom-Header': 'value'
  }
});
```

## 📚 API Completa

### Validación de Requests

#### `validation.validate(apiKey, endpoint, method, options?)`
Valida una request de un usuario.

```typescript
const result = await limitly.validation.validate(
  'api_key_del_usuario',
  '/api/users',
  'GET'
);
```

#### `validation.validateRequest(data, options?)`
Valida una request con objeto de datos.

```typescript
const result = await limitly.validation.validateRequest({
  api_key: 'api_key_del_usuario',
  endpoint: '/api/users',
  method: 'GET'
});
```

### API Keys

#### `apiKeys.list(options?)`
Lista todas las API Keys.

#### `apiKeys.create(data, options?)`
Crea una nueva API Key.

```typescript
const key = await limitly.apiKeys.create({
  name: 'Nueva API Key',
  user_id: 123, // opcional
  plan_id: 'plan-id', // opcional
  status: 'active' // opcional
});
```

#### `apiKeys.get(keyId, options?)`
Obtiene una API Key específica.

#### `apiKeys.update(keyId, data, options?)`
Actualiza una API Key.

#### `apiKeys.delete(keyId, options?)`
Elimina una API Key (soft delete).

#### `apiKeys.regenerate(keyId, options?)`
Regenera una API Key.

#### `apiKeys.getUsage(keyId, options?)`
Obtiene estadísticas de uso de una API Key.

#### `apiKeys.getRequests(keyId, options?)`
Obtiene el historial de requests de una API Key.

### Planes

#### `plans.list(options?)`
Lista todos los planes.

#### `plans.create(data, options?)`
Crea un nuevo plan.

```typescript
const plan = await limitly.plans.create({
  name: 'Plan Básico',
  description: 'Plan para usuarios básicos',
  max_requests: 10000,
  request_period: 'month', // 'day', 'week', 'month', 'year'
  is_active: true
});
```

#### `plans.get(planId, options?)`
Obtiene un plan específico.

#### `plans.update(planId, data, options?)`
Actualiza un plan.

#### `plans.delete(planId, options?)`
Elimina un plan.

#### `plans.getUsage(planId, options?)`
Obtiene estadísticas de uso de un plan.

#### `plans.getUsers(planId, options?)`
Obtiene todos los usuarios asignados a un plan.

#### `plans.getKeys(planId, options?)`
Obtiene todas las API Keys asignadas a un plan.

### Usuarios

#### `users.list(options?)`
Lista todos los usuarios.

#### `users.create(data, options?)`
Crea un nuevo usuario.

```typescript
const user = await limitly.users.create({
  name: 'Juan Pérez',
  email: 'juan@example.com', // opcional
  plan_id: 'plan-id', // opcional
  custom_start: '2024-01-01T00:00:00.000Z' // opcional
});
```

#### `users.get(userId, options?)`
Obtiene un usuario específico.

#### `users.update(userId, data, options?)`
Actualiza un usuario.

#### `users.delete(userId, options?)`
Elimina un usuario.

#### `users.getUsage(userId, options?)`
Obtiene el uso de un usuario.

#### `users.getKeys(userId, options?)`
Obtiene todas las API Keys de un usuario.

#### `users.createKey(userId, data, options?)`
Crea una nueva API Key para un usuario.

```typescript
const key = await limitly.users.createKey(123, {
  name: 'API Key para Juan'
});
```

## 🛠️ Manejo de Errores

El SDK lanza errores específicos que puedes capturar:

```typescript
try {
  const result = await limitly.validation.validate(
    'api_key_invalida',
    '/api/users',
    'GET'
  );
} catch (error) {
  if (error instanceof LimitlyError) {
    console.log('Error de Limitly:', error.message);
    console.log('Código de estado:', error.statusCode);
    console.log('Respuesta completa:', error.response);
  } else {
    console.log('Error inesperado:', error);
  }
}
```

## 🔍 Ejemplos Avanzados

### Middleware para Express

```typescript
import { Limitly } from '@limitly/sdk';
import express from 'express';

const app = express();
const limitly = new Limitly({
  apiKey: process.env.LIMITLY_API_KEY
});

// Middleware de validación
app.use(async (req, res, next) => {
  const apiKey = req.headers.authorization?.replace('Bearer ', '');
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API Key requerida' });
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
    console.error('Error de validación:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});
```

### Monitoreo de Uso

```typescript
// Monitorear uso de API Keys
async function monitorUsage() {
  const keys = await limitly.apiKeys.list();
  
  for (const key of keys.data || []) {
    const usage = await limitly.apiKeys.getUsage(key.id);
    
    if (usage.data && usage.data.percentageUsed > 80) {
      console.log(`⚠️ API Key ${key.name} está al ${usage.data.percentageUsed}% de uso`);
    }
  }
}
```

### Gestión Automática de Planes

```typescript
// Crear planes predefinidos
async function setupDefaultPlans() {
  const plans = [
    {
      name: 'Plan Básico',
      description: 'Para usuarios nuevos',
      max_requests: 1000,
      request_period: 'month'
    },
    {
      name: 'Plan Pro',
      description: 'Para usuarios avanzados',
      max_requests: 10000,
      request_period: 'month'
    },
    {
      name: 'Plan Enterprise',
      description: 'Sin límites',
      max_requests: -1,
      request_period: 'month'
    }
  ];

  for (const planData of plans) {
    await limitly.plans.create(planData);
  }
}
```

## 📦 Estructura del Proyecto

```
src/
├── index.ts          # Clase principal del SDK
├── client.ts         # Cliente HTTP base
├── types/            # Definiciones de tipos TypeScript
│   └── index.ts
└── modules/          # Módulos específicos
    ├── api-keys.ts
    ├── plans.ts
    ├── users.ts
    └── validation.ts
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

- 📧 Email: support@limitly.com
- 📖 Documentación: https://docs.limitly.com
- 🐛 Issues: https://github.com/limitly/sdk-node/issues 
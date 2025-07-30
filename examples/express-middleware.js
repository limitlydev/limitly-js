const express = require('express');
const { Limitly } = require('../dist/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize the Limitly SDK
const limitly = new Limitly({
  apiKey: process.env.LIMITLY_API_KEY || 'lk_9OQ70zfdjjj1ScVcUYgVNdDe9kWLU5IN-veV3uF9Uc4='
});

// Middleware to parse JSON
app.use(express.json());

/**
 * Limitly validation middleware
 * Validates user requests using their API Keys
 */
const limitlyMiddleware = async (req, res, next) => {
  // Get the API Key from the Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      error: 'API Key required',
      message: 'Include your API Key in the Authorization header: Bearer <your_api_key>'
    });
  }

  // Extract the API Key from the header
  const apiKey = authHeader.replace('Bearer ', '');
  
  if (!apiKey) {
    return res.status(401).json({
      error: 'Invalid API Key',
      message: 'The format must be: Authorization: Bearer <your_api_key>'
    });
  }

  try {
    // Validate the request with Limitly
    const result = await limitly.validation.validate(
      apiKey,
      req.path,
      req.method
    );

    if (!result.success) {
      // Request denied due to rate limit exceeded
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: result.error,
        details: result.details,
        retryAfter: result.details?.period_end
      });
    }

    // Request allowed, add usage information to the request
    req.limitly = {
      usage: result.details,
      apiKey: apiKey
    };

    // Add headers with usage information
    res.set({
      'X-RateLimit-Limit': result.details?.limit,
      'X-RateLimit-Remaining': result.details?.limit - result.details?.current_usage,
      'X-RateLimit-Reset': result.details?.period_end,
      'X-RateLimit-Plan': result.details?.plan_name
    });

    next();
  } catch (error) {
    console.error('Limitly validation error:', error);
    
    // Handle different types of errors
    if (error.statusCode === 401) {
      return res.status(401).json({
        error: 'Invalid API Key',
        message: 'The provided API Key is not valid'
      });
    }
    
    if (error.statusCode === 403) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'The API Key does not have permission to access this resource'
      });
    }

    // Internal server error
    return res.status(500).json({
      error: 'Internal error',
      message: 'Error validating the request'
    });
  }
};

// Apply middleware to all routes
app.use(limitlyMiddleware);

// Example routes
app.get('/api/users', (req, res) => {
  // The request has already been validated by the middleware
  console.log('Usage information:', req.limitly?.usage);
  
  res.json({
    message: 'User list',
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ],
    usage: req.limitly?.usage
  });
});

app.post('/api/users', (req, res) => {
  res.json({
    message: 'User created',
    user: req.body,
    usage: req.limitly?.usage
  });
});

app.get('/api/products', (req, res) => {
  res.json({
    message: 'Product list',
    products: [
      { id: 1, name: 'Product 1', price: 100 },
      { id: 2, name: 'Product 2', price: 200 }
    ],
    usage: req.limitly?.usage
  });
});

// Route to get usage information
app.get('/api/usage', (req, res) => {
  res.json({
    message: 'Current usage information',
    usage: req.limitly?.usage
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 Limitly middleware active`);
  console.log(`🔑 Make sure to include your API Key in the Authorization header`);
});

module.exports = { app, limitlyMiddleware }; 
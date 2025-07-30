const Limitly = require('./dist').default;

// Configuración del SDK
const limitly = new Limitly({
  apiKey: 'lk_9OQ70zfdjjj1ScVcUYgVNdDe9kWLU5IN-veV3uF9Uc4=',
  baseUrl: 'https://xfkyofkqbukqtxcuapvf.supabase.co/functions/v1'
});

// API key de usuario para probar validación
const userApiKey = 'YQSMVNVRBUYXEFVTHJBHWJOYUURRHQFJ';

async function testRealExample() {
  console.log('🚀 Real example with your Limitly data');
  console.log('=====================================\n');

  try {
    // 1. Listar API Keys
    console.log('📋 Listing API Keys...');
    const apiKeys = await limitly.apiKeys.list();
    console.log(`✅ Found ${apiKeys.data.length} API keys`);
    if (apiKeys.data.length > 0) {
      console.log(`   First key: ${apiKeys.data[0].id} (${apiKeys.data[0].name})`);
    }
    console.log('');

    // 2. Listar Planes
    console.log('📋 Listing Plans...');
    const plans = await limitly.plans.list();
    console.log(`✅ Found ${plans.data.length} plans`);
    if (plans.data.length > 0) {
      console.log(`   First plan: ${plans.data[0].id} (${plans.data[0].name})`);
    }
    console.log('');

    // 3. Listar Usuarios
    console.log('📋 Listing Users...');
    const users = await limitly.users.list();
    console.log(`✅ Found ${users.data.length} users`);
    if (users.data.length > 0) {
      console.log(`   First user: ${users.data[0].id} (${users.data[0].name})`);
    }
    console.log('');

    // 4. Probar validación con la API key de usuario real
    console.log('🔍 Testing validation with real user API key...');
    console.log(`   Using key: ${userApiKey}`);
    
    const validation = await limitly.validation.validate({
      api_key: userApiKey,
      endpoint: '/test-endpoint',
      method: 'GET'
    });
    
    console.log('✅ Validation successful!');
    console.log(`   Rate limit: ${validation.data.rate_limit}`);
    console.log(`   Remaining: ${validation.data.remaining}`);
    console.log(`   Reset time: ${validation.data.reset_time}`);
    console.log('');

    // 5. Obtener uso de la API key de usuario
    console.log('📊 Getting usage for user API key...');
    const usage = await limitly.apiKeys.getUsage(userApiKey);
    console.log('✅ Usage retrieved successfully!');
    console.log(`   Total requests: ${usage.data.total_requests}`);
    console.log(`   This month: ${usage.data.this_month}`);
    console.log(`   This week: ${usage.data.this_week}`);
    console.log(`   Today: ${usage.data.today}`);
    console.log('');

    console.log('🎉 Real example completed successfully!');
    console.log('📊 Your Limitly account is working perfectly with the SDK');

  } catch (error) {
    console.error('❌ Error in real example:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testRealExample(); 
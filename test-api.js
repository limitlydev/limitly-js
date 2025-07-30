const { Limitly } = require('./dist/index');

// Test with your API key
const limitly = new Limitly({
  apiKey: 'lk_9OQ70zfdjjj1ScVcUYgVNdDe9kWLU5IN-veV3uF9Uc4='
});

async function testAPI() {
  console.log('🔍 Testing Limitly API connectivity...\n');

  try {
    // Test 1: Check if we can reach the base URL
    console.log('1. Testing base URL connectivity...');
    const client = limitly.getClient();
    console.log('   Base URL:', 'https://xfkyofkqbukqtxcuapvf.supabase.co/functions/v1');
    console.log('   API Key:', 'lk_9OQ70zfdjjj1ScVcUYgVNdDe9kWLU5IN-veV3uF9Uc4=');
    console.log('✅ Client initialized');

    // Test 2: Try to list API Keys (this should work if the API is accessible)
    console.log('\n2. Testing API Keys endpoint...');
    try {
      const keys = await limitly.apiKeys.list();
      console.log('✅ API Keys endpoint working');
      console.log('   Response:', keys);
    } catch (error) {
      console.log('❌ API Keys endpoint failed:', error.message);
      console.log('   Status:', error.statusCode);
      console.log('   Response:', error.response);
    }

    // Test 3: Try to list plans
    console.log('\n3. Testing Plans endpoint...');
    try {
      const plans = await limitly.plans.list();
      console.log('✅ Plans endpoint working');
      console.log('   Response:', plans);
    } catch (error) {
      console.log('❌ Plans endpoint failed:', error.message);
      console.log('   Status:', error.statusCode);
      console.log('   Response:', error.response);
    }

    // Test 4: Try to list users
    console.log('\n4. Testing Users endpoint...');
    try {
      const users = await limitly.users.list();
      console.log('✅ Users endpoint working');
      console.log('   Response:', users);
    } catch (error) {
      console.log('❌ Users endpoint failed:', error.message);
      console.log('   Status:', error.statusCode);
      console.log('   Response:', error.response);
    }

    // Test 5: Try validation endpoint specifically
    console.log('\n5. Testing Validation endpoint...');
    try {
      const validation = await limitly.validation.validate(
        'ae64b5a6-83ef-4fb1-94ce-f12f65e68acf', // Use one of your actual API keys
        '/api/test',
        'GET'
      );
      console.log('✅ Validation endpoint working');
      console.log('   Response:', validation);
    } catch (error) {
      console.log('❌ Validation endpoint failed:', error.message);
      console.log('   Status:', error.statusCode);
      console.log('   Response:', error.response);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testAPI(); 
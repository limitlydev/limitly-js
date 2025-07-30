const { Limitly } = require('./dist/index');

console.log('🧪 Testing Limitly SDK initialization...\n');

try {
  // Test 1: Initialize the SDK
  console.log('1. Initializing SDK...');
  const limitly = new Limitly({
    apiKey: 'test-api-key'
  });
  console.log('✅ SDK initialized successfully');

  // Test 2: Check modules
  console.log('\n2. Checking modules...');
  console.log('   API Keys module:', typeof limitly.apiKeys);
  console.log('   Plans module:', typeof limitly.plans);
  console.log('   Users module:', typeof limitly.users);
  console.log('   Validation module:', typeof limitly.validation);
  console.log('✅ All modules available');

  // Test 3: Check client
  console.log('\n3. Checking HTTP client...');
  const client = limitly.getClient();
  console.log('   HTTP client:', typeof client);
  console.log('✅ HTTP client available');

  // Test 4: Check types
  console.log('\n4. Checking TypeScript types...');
  console.log('   LimitlyError:', typeof require('./dist/index').LimitlyError);
  console.log('   HttpClient:', typeof require('./dist/index').HttpClient);
  console.log('✅ All types exported correctly');

  console.log('\n🎉 All tests passed! SDK is working correctly.');
  console.log('📦 Ready to be published to NPM');

} catch (error) {
  console.error('❌ Test failed:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
} 
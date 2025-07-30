const { Limitly } = require('../dist/index');

// Initialize the SDK
const limitly = new Limitly({
  apiKey: process.env.LIMITLY_API_KEY || 'lk_9OQ70zfdjjj1ScVcUYgVNdDe9kWLU5IN-veV3uF9Uc4='
});

async function basicExample() {
  try {
    console.log('🚀 Basic example of the Limitly SDK\n');

    // 1. Validate a request
    console.log('1. Validating a request...');
    const validation = await limitly.validation.validate(
      'YQSMVNVRBUYXEFVTHJBHWJOYUURRHQFJ', // Use one of your actual API keys
      '/api/users',
      'GET'
    );

    if (validation.success) {
      console.log('✅ Request allowed');
      console.log(`   Current usage: ${validation.details?.current_usage}`);
      console.log(`   Limit: ${validation.details?.limit}`);
      console.log(`   Plan: ${validation.details?.plan_name}`);
    } else {
      console.log('❌ Request denied:', validation.error);
    }

    // 2. List API Keys
    console.log('\n2. Listing API Keys...');
    const keys = await limitly.apiKeys.list();
    console.log(`   Found ${keys.count || 0} API Keys`);

    // 3. Create a new API Key
    console.log('\n3. Creating new API Key...');
    const newKey = await limitly.apiKeys.create({
      name: 'Example API Key',
      user_id: 3
    });

    if (newKey.success) {
      console.log('✅ API Key created');
      console.log(`   ID: ${newKey.data?.id}`);
      console.log(`   Name: ${newKey.data?.name}`);
      console.log(`   API Key: ${newKey.data?.api_key}`);
    }

    // 4. List plans
    console.log('\n4. Listing plans...');
    const plans = await limitly.plans.list();
    console.log(`   Found ${plans.count || 0} plans`);

    // 5. Create a plan
    console.log('\n5. Creating new plan...');
    const plan = await limitly.plans.create({
      name: 'Example Plan',
      description: 'Plan created from SDK',
      max_requests: 5000,
      request_period: 'month'
    });

    if (plan.success) {
      console.log('✅ Plan created');
      console.log(`   ID: ${plan.data?.id}`);
      console.log(`   Name: ${plan.data?.name}`);
      console.log(`   Limit: ${plan.data?.max_requests} requests/${plan.data?.request_period}`);
    }

    // 6. Create a user
    console.log('\n6. Creating user...');
    const user = await limitly.users.create({
      name: 'Example User',
      email: 'user@example.com',
      plan_id: plan.data?.id
    });

    if (user.success) {
      console.log('✅ User created');
      console.log(`   ID: ${user.data?.user_id}`);
      console.log(`   Name: ${user.data?.name}`);
      console.log(`   Email: ${user.data?.email}`);
    }

    // 7. Get user usage
    console.log('\n7. Getting user usage...');
    const usage = await limitly.users.getUsage(user.data?.user_id);
    
    if (usage.success && usage.data) {
      if (usage.data.is_unlimited) {
        console.log('✅ User with unlimited plan');
      } else {
        console.log(`   Current usage: ${usage.data.current_usage}`);
        console.log(`   Limit: ${usage.data.limit}`);
        console.log(`   Percentage used: ${usage.data.percentage_used}%`);
      }
    }

    console.log('\n🎉 Example completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.statusCode) {
      console.error(`   Status code: ${error.statusCode}`);
    }
    if (error.response) {
      console.error(`   Response:`, error.response);
    }
  }
}

// Run the example
if (require.main === module) {
  basicExample();
}

module.exports = { basicExample }; 
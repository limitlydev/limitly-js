const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building Limitly SDK...\n');

try {
  // Clean dist directory
  if (fs.existsSync('dist')) {
    console.log('🧹 Cleaning dist directory...');
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Install dependencies if not installed
  if (!fs.existsSync('node_modules')) {
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  }

  // Compile TypeScript
  console.log('⚙️ Compiling TypeScript...');
  execSync('npx tsc', { stdio: 'inherit' });

  // Verify generated files
  const distFiles = [
    'dist/index.js',
    'dist/index.d.ts',
    'dist/client.js',
    'dist/types/index.js',
    'dist/modules/api-keys.js',
    'dist/modules/plans.js',
    'dist/modules/users.js',
    'dist/modules/validation.js'
  ];

  console.log('\n✅ Verifying generated files...');
  for (const file of distFiles) {
    if (fs.existsSync(file)) {
      console.log(`   ✅ ${file}`);
    } else {
      console.log(`   ❌ ${file} - NOT FOUND`);
      process.exit(1);
    }
  }

  // Run tests
  console.log('\n🧪 Running tests...');
  execSync('npm test', { stdio: 'inherit' });

  console.log('\n🎉 Build successful!');
  console.log('📦 SDK is ready to be published');
  console.log('📁 Generated files in: dist/');

} catch (error) {
  console.error('\n❌ Error during build:', error.message);
  process.exit(1);
} 
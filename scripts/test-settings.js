import axios from 'axios';

const BACKEND_URL = process.env.API_BASE_URL || 'http://localhost:3000';

async function testSettingsEndpoints() {
  console.log('🧪 Testing Settings Endpoints...\n');

  try {
    // Test GET /settings/volunteer (sans auth - devrait retourner 401)
    console.log('1. Testing GET /settings/volunteer (no auth)...');
    try {
      await axios.get(`${BACKEND_URL}/settings/volunteer`);
      console.log('❌ Should have returned 401');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly returned 401 (unauthorized)');
      } else {
        console.log('❌ Unexpected error:', error.response?.status);
      }
    }

    // Test PUT /settings/volunteer (sans auth - devrait retourner 401)
    console.log('\n2. Testing PUT /settings/volunteer (no auth)...');
    try {
      await axios.put(`${BACKEND_URL}/settings/volunteer`, {
        profileVisibility: false
      });
      console.log('❌ Should have returned 401');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly returned 401 (unauthorized)');
      } else {
        console.log('❌ Unexpected error:', error.response?.status);
      }
    }

    // Test GET /settings/association (sans auth - devrait retourner 401)
    console.log('\n3. Testing GET /settings/association (no auth)...');
    try {
      await axios.get(`${BACKEND_URL}/settings/association`);
      console.log('❌ Should have returned 401');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly returned 401 (unauthorized)');
      } else {
        console.log('❌ Unexpected error:', error.response?.status);
      }
    }

    // Test PUT /settings/association (sans auth - devrait retourner 401)
    console.log('\n4. Testing PUT /settings/association (no auth)...');
    try {
      await axios.put(`${BACKEND_URL}/settings/association`, {
        profileVisibility: false
      });
      console.log('❌ Should have returned 401');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly returned 401 (unauthorized)');
      } else {
        console.log('❌ Unexpected error:', error.response?.status);
      }
    }

    console.log('\n🎉 All tests completed!');
    console.log('📝 Note: These tests verify that endpoints are protected by auth.');
    console.log('📝 To test with real auth, you need a valid Firebase token.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
testSettingsEndpoints();

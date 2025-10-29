// Script to test API endpoints
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000/api/v1';

const testAPI = async () => {
  try {
    console.log('Testing Fashion Design App API...\n');

    // Test health check endpoint
    console.log('1. Testing health check endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    // console.log('Health check response:', healthResponse.data);
    // console.log('✅ Health check passed\n');

    // Test customers endpoint
    console.log('2. Testing customers endpoint...');
    const customersResponse = await axios.get(`${API_BASE_URL}/customers`);
    console.log(`Customers count: ${customersResponse.data.length}`);
    console.log('✅ Customers endpoint passed\n');

    // Test measurements endpoint
    console.log('3. Testing measurements endpoint...');
    const measurementsResponse = await axios.get(`${API_BASE_URL}/measurements`);
    console.log(`Measurements count: ${measurementsResponse.data.length}`);
    console.log('✅ Measurements endpoint passed\n');

    // Test designs endpoint
    console.log('4. Testing designs endpoint...');
    const designsResponse = await axios.get(`${API_BASE_URL}/designs`);
    console.log(`Designs count: ${designsResponse.data.length}`);
    console.log('✅ Designs endpoint passed\n');

    // Test messages endpoint
    console.log('5. Testing messages endpoint...');
    const messagesResponse = await axios.get(`${API_BASE_URL}/messages`);
    console.log(`Messages count: ${messagesResponse.data.length}`);
    console.log('✅ Messages endpoint passed\n');

    console.log('🎉 All API tests passed!');
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
};

testAPI();
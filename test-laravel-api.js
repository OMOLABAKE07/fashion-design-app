// Simple test script to check Laravel API connectivity
async function testLaravelAPI() {
  try {
    // console.log('Testing Laravel API connectivity...');
    
    // Test the base URL
    const response = await fetch('http://localhost:8000/api/v1/designs', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    // console.log('Response status:', response.status);
    // console.log('Response headers:', [...response.headers.entries()]);
    
    if (response.ok) {
      const data = await response.json();
      // console.log('API response:', data);
      // console.log('Laravel API is working correctly!');
    } else {
      console.error('API returned error status:', response.status);
      console.error('Error text:', await response.text());
    }
  } catch (error) {
    console.error('Failed to connect to Laravel API:', error);
    console.error('Make sure your Laravel backend is running on port 8000');
  }
}

// Run the test
testLaravelAPI();
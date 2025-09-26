// Test the webhook server locally
const fetch = require('node-fetch');

const testEmailContent = `
Vendor Order Number: PB-2024-TEST-001
Vendor Name: Phoenix Books
Vendor Phone: 802-448-3350
Vendor Email: orders@phoenixbooks.com
Vendor Address: 191 Bank Street, Burlington, VT 05401

Customer Name: Sarah Johnson
Customer Phone: 802-555-1234
Customer Email: sarah@example.com
Delivery Address: 123 Church Street, Burlington, VT 05401

Delivery Type: RAPID
Order Value: $62.97

Special Instructions: Test order from webhook integration
`;

async function testWebhook() {
  try {
    console.log('🧪 Testing webhook server...');

    // First check if server is running
    const healthResponse = await fetch('http://localhost:3001/health');
    if (!healthResponse.ok) {
      throw new Error('Webhook server not running. Start it with: npm run webhook');
    }

    console.log('✅ Server is running');

    // Test email processing
    const response = await fetch('http://localhost:3001/test/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailContent: testEmailContent
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ Email processed successfully!');
      console.log(`   Order #: ${result.order.order_number}`);
      console.log(`   Vendor: ${result.order.vendor_name}`);
      console.log(`   Local Impact: $${result.order.local_impact}`);
    } else {
      console.log('❌ Email processing failed:', result.error);
    }

  } catch (error) {
    console.log('💥 Test failed:', error.message);
    console.log('\n💡 To start the webhook server:');
    console.log('   npm run webhook');
  }
}

testWebhook();
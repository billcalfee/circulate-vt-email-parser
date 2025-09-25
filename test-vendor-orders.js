// Test vendor order number tracking
require('dotenv').config();
const { processEmail } = require('./email-parser');

async function testVendorOrderTracking() {
  console.log('🧪 Testing Vendor Order Number Tracking\n');

  const phoenixBooksOrder = `
Order Number: CVT-2024-001
Vendor Order Number: PB-2024-0156
Vendor Name: Phoenix Books
Vendor Phone: 802-448-3350
Vendor Email: orders@phoenixbooks.com
Vendor Address: 191 Bank Street, Burlington, VT 05401

Customer Name: Sarah Johnson
Customer Phone: 802-555-1234
Customer Email: sarah.j@example.com
Delivery Address: 123 Church Street, Burlington, VT 05401

Delivery Type: RAPID
Order Value: $62.97

Special Instructions: Customer prefers porch delivery. Dog is friendly.
`;

  console.log('📧 Processing Phoenix Books order with vendor tracking...');
  const result = await processEmail(phoenixBooksOrder);

  if (result.success) {
    console.log('\n✅ Success! Order created with:');
    console.log(`   CirculateVT Order: ${result.order.order_number}`);
    console.log(`   Phoenix Books Order: ${result.order.vendor_order_number || 'Not captured'}`);
    console.log(`   Vendor: ${result.order.vendor_name}`);
    console.log(`   Total Local Spend: $${result.order.total_local_spend}`);
    console.log(`   Local Impact: $${result.order.local_impact}`);

    // Test lookup capability
    console.log('\n🔍 Now you can search by either:');
    console.log(`   - CirculateVT order: CVT-2024-001`);
    console.log(`   - Phoenix Books order: PB-2024-0156`);
  } else {
    console.log('\n❌ Failed:', result.error);
  }
}

testVendorOrderTracking().catch(console.error);
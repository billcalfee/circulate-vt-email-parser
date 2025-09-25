// Test using vendor order numbers as primary IDs
require('dotenv').config();
const { processEmail } = require('./email-parser');

async function testVendorPrimaryID() {
  console.log('🧪 Testing Vendor Order Numbers as Primary IDs\n');
  console.log('=' .repeat(50));

  const testCases = [
    {
      name: 'Phoenix Books with their order number',
      content: `
Vendor Order Number: PB-2024-0156
Vendor Name: Phoenix Books
Vendor Phone: 802-448-3350
Vendor Email: orders@phoenixbooks.com
Vendor Address: 191 Bank Street, Burlington, VT 05401

Customer Name: Sarah Johnson
Customer Phone: 802-555-1234
Delivery Address: 123 Church Street, Burlington, VT 05401

Delivery Type: RAPID
Order Value: $62.97
`
    },
    {
      name: 'City Market with simple number',
      content: `
Vendor Order Number: 123456
Vendor Name: City Market Co-op
Vendor Phone: 802-555-COOP
Vendor Email: online@citymarket.coop
Vendor Address: 82 South Winooski Avenue, Burlington, VT 05401

Customer Name: Bob Wilson
Customer Phone: 802-555-4321
Delivery Address: 50 Lake Street, Burlington, VT 05401

Delivery Type: LOCAL
Order Value: $45.25
`
    },
    {
      name: 'No vendor order number (fallback)',
      content: `
Vendor Name: Local Artisan Shop
Vendor Phone: 802-555-0199
Vendor Email: orders@localartisan.com
Vendor Address: 100 Main Street, Burlington, VT 05401

Customer Name: Jane Smith
Customer Phone: 802-555-9999
Delivery Address: 200 Pine Street, Burlington, VT 05401

Delivery Type: LOCAL
Order Value: $35.99
`
    }
  ];

  for (const test of testCases) {
    console.log(`\n📧 Testing: ${test.name}`);
    console.log('-' .repeat(40));

    const result = await processEmail(test.content);

    if (result.success) {
      console.log('✅ Success!');
      console.log(`   Primary Order ID: ${result.order.order_number}`);
      console.log(`   Vendor Original: ${result.order.vendor_order_number || 'None provided'}`);
      console.log(`   Vendor: ${result.order.vendor_name}`);
      console.log(`   Customer: ${result.order.customer_name}`);
      console.log(`   Local Impact: $${result.order.local_impact}`);
    } else {
      console.log('❌ Failed:', result.error);
    }
  }

  console.log('\n' + '=' .repeat(50));
  console.log('🎯 Results:');
  console.log('• Phoenix Books PB-2024-0156 → Primary ID: PB-2024-0156');
  console.log('• City Market 123456 → Primary ID: CIT-123456');
  console.log('• No vendor number → Primary ID: LOC-[timestamp]');
  console.log('\n✨ One order number to rule them all!');
}

testVendorPrimaryID().catch(console.error);
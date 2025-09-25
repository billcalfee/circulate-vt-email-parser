// Test with unique order numbers to avoid duplicates
require('dotenv').config();
const { processEmail } = require('./email-parser');

async function testUniqueOrders() {
  console.log('🧪 Testing CirculateVT Email Parser (Unique Orders)\n');
  console.log('=' .repeat(50));

  const timestamp = Date.now();

  const testEmails = [
    {
      name: 'Phoenix Books RAPID Order',
      content: `
Order Number: PB-${timestamp}-1
Vendor Order Number: PB-2024-0${Math.floor(Math.random() * 1000)}
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

Special Instructions: Please leave on front porch if no answer. Dog is friendly.
`
    },
    {
      name: 'VCET LOCAL Order with What3Words',
      content: `
Order Number: VCET-${timestamp}-2
Vendor Order Number: VCET-CAFE-${Math.floor(Math.random() * 1000)}
Vendor Name: VCET Cafe
Vendor Phone: 802-555-VCET
Vendor Email: cafe@vcet.org
Vendor Address: 266 Main Street, Burlington, VT 05401

Customer Name: Alex Thompson
Customer Phone: 802-555-5678
Delivery Address: 100 Bank Street, Apt 3B, Burlington, VT 05401
What3Words: fancy.torch.senior

Delivery Type: LOCAL
Order Value: $28.50

Special Instructions: 3rd floor, blue door. Entry code 4521#
`
    }
  ];

  for (const test of testEmails) {
    console.log(`\n📧 Testing: ${test.name}`);
    console.log('-' .repeat(40));

    const result = await processEmail(test.content);

    if (result.success) {
      console.log('✅ Success!');
      console.log(`   CirculateVT Order #: ${result.order.order_number}`);
      console.log(`   Vendor Order #: ${result.order.vendor_order_number || 'None provided'}`);
      console.log(`   Customer: ${result.order.customer_name}`);
      console.log(`   Total Spend: $${result.order.total_local_spend}`);
      console.log(`   Local Impact: $${result.order.local_impact}`);
      console.log(`   Jobs Supported: ${result.order.jobs_supported}`);
    } else {
      console.log('❌ Failed:', result.error);
    }
  }

  console.log('\n' + '=' .repeat(50));
  console.log('🏁 Tests Complete! Check your Supabase orders table.');
}

testUniqueOrders().catch(console.error);
// Test the email parser with various scenarios
require('dotenv').config();
const { processEmail } = require('./email-parser');

// Test cases
const testEmails = [
  {
    name: 'Phoenix Books RAPID Order',
    content: `
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
Order Number: VCET-2024-001
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
  },
  {
    name: 'City Market Order (Minimal Info)',
    content: `
Vendor Name: City Market Co-op
Vendor Phone: 802-555-COOP
Vendor Email: online@citymarket.coop
Vendor Address: 82 South Winooski Avenue, Burlington, VT 05401

Customer Name: Bob Wilson
Customer Phone: 802-555-4321
Delivery Address: 50 Lake Street, Burlington, VT 05401

Delivery Type: LOCAL
Order Value: $156.25
`
  }
];

// Run all tests
async function runTests() {
  console.log('🧪 Running CirculateVT Email Parser Tests\n');
  console.log('=' .repeat(50));

  for (const test of testEmails) {
    console.log(`\n📧 Testing: ${test.name}`);
    console.log('-' .repeat(40));

    const result = await processEmail(test.content);

    if (result.success) {
      console.log('✅ Success!');
      console.log(`   Order #: ${result.order.order_number}`);
      console.log(`   Customer: ${result.order.customer_name}`);
      console.log(`   Total Spend: $${result.order.total_local_spend}`);
      console.log(`   Local Impact: $${result.order.local_impact}`);
      console.log(`   Jobs Supported: ${result.order.jobs_supported}`);
    } else {
      console.log('❌ Failed:', result.error);
    }
  }

  console.log('\n' + '=' .repeat(50));
  console.log('🏁 Tests Complete!');
}

// Run the tests
runTests().catch(console.error);
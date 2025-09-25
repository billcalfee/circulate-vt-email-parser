// CirculateVT Email Parser - Converts vendor emails to database orders
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Email format parser based on the spec
class OrderParser {
  constructor() {
    this.requiredFields = [
      'vendor_name', 'vendor_phone', 'vendor_email', 'vendor_address',
      'customer_name', 'customer_phone', 'delivery_address',
      'delivery_type', 'order_value'
    ];
  }

  // Parse email content into order object
  parseEmailContent(emailBody) {
    const order = {};
    const lines = emailBody.split('\n');

    lines.forEach(line => {
      const trimmed = line.trim();

      // Parse each field
      if (trimmed.startsWith('Order Number:')) {
        order.order_number = trimmed.replace('Order Number:', '').trim();
      } else if (trimmed.startsWith('Vendor Order Number:')) {
        order.vendor_order_number = trimmed.replace('Vendor Order Number:', '').trim();
      } else if (trimmed.startsWith('Vendor Name:')) {
        order.vendor_name = trimmed.replace('Vendor Name:', '').trim();
      } else if (trimmed.startsWith('Vendor Phone:')) {
        order.vendor_phone = trimmed.replace('Vendor Phone:', '').trim();
      } else if (trimmed.startsWith('Vendor Email:')) {
        order.vendor_email = trimmed.replace('Vendor Email:', '').trim();
      } else if (trimmed.startsWith('Vendor Address:')) {
        order.vendor_address = trimmed.replace('Vendor Address:', '').trim();
      } else if (trimmed.startsWith('Customer Name:')) {
        order.customer_name = trimmed.replace('Customer Name:', '').trim();
      } else if (trimmed.startsWith('Customer Phone:')) {
        order.customer_phone = trimmed.replace('Customer Phone:', '').trim();
      } else if (trimmed.startsWith('Customer Email:')) {
        order.customer_email = trimmed.replace('Customer Email:', '').trim();
      } else if (trimmed.startsWith('Delivery Address:')) {
        order.delivery_address = trimmed.replace('Delivery Address:', '').trim();
      } else if (trimmed.startsWith('Delivery Type:')) {
        order.delivery_type = trimmed.replace('Delivery Type:', '').trim().toUpperCase();
      } else if (trimmed.startsWith('Order Value:')) {
        const value = trimmed.replace('Order Value:', '').trim();
        order.order_value = parseFloat(value.replace('$', '').replace(',', ''));
      } else if (trimmed.startsWith('Special Instructions:')) {
        order.special_instructions = trimmed.replace('Special Instructions:', '').trim();
      } else if (trimmed.startsWith('What3Words:')) {
        order.what3words = trimmed.replace('What3Words:', '').trim();
      }
    });

    // Extract zip code from address
    const zipMatch = order.delivery_address?.match(/\b\d{5}\b/);
    if (zipMatch) {
      order.delivery_zip = zipMatch[0];
    }

    // Set delivery charge based on type
    if (order.delivery_type === 'RAPID') {
      order.delivery_charge = 9.99;
    } else if (order.delivery_type === 'LOCAL') {
      order.delivery_charge = 4.99;
    }

    // Set vendor_id from vendor_name (simplified for MVP)
    order.vendor_id = order.vendor_name?.toLowerCase().replace(/\s+/g, '-');

    // Use vendor's order number as our primary order number
    // Format: [vendor-code]-[their-number] or just their number if already formatted
    if (order.vendor_order_number) {
      // If vendor provides their order number, use it as our primary ID
      const vendorCode = order.vendor_id?.substring(0, 3).toUpperCase() || 'VND';

      // If their number already includes vendor code, use as-is
      if (order.vendor_order_number.includes('-') || order.vendor_order_number.length > 8) {
        order.order_number = order.vendor_order_number;
      } else {
        // Otherwise, prefix with vendor code
        order.order_number = `${vendorCode.toUpperCase()}-${order.vendor_order_number}`;
      }

      // Store their original number separately for reference
      // (in case we need both formats)
    } else if (!order.order_number) {
      // Fallback: generate our own number if neither is provided
      const vendorCode = order.vendor_id?.substring(0, 3).toUpperCase() || 'ORD';
      order.order_number = `${vendorCode}-${Date.now()}`;
    }

    // Default package size for MVP
    order.package_size = 'ONE_HAND';

    return order;
  }

  // Validate required fields
  validateOrder(order) {
    const missing = [];

    this.requiredFields.forEach(field => {
      if (!order[field]) {
        missing.push(field);
      }
    });

    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    // Validate delivery type
    if (!['RAPID', 'LOCAL'].includes(order.delivery_type)) {
      throw new Error('Delivery type must be RAPID or LOCAL');
    }

    // Validate order value
    if (isNaN(order.order_value) || order.order_value <= 0) {
      throw new Error('Order value must be a positive number');
    }

    return true;
  }
}

// Process email and insert into database
async function processEmail(emailContent) {
  const parser = new OrderParser();

  try {
    // Parse email content
    const order = parser.parseEmailContent(emailContent);
    console.log('Parsed order:', order);

    // Validate order
    parser.validateOrder(order);
    console.log('Order validated successfully');

    // Insert into database
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select();

    if (error) {
      throw error;
    }

    console.log('Order inserted successfully:', data[0]);

    // Return the created order with calculated impact
    return {
      success: true,
      order: data[0],
      message: `Order ${order.order_number} created. Local impact: $${data[0].local_impact}`
    };

  } catch (error) {
    console.error('Error processing email:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Test function with sample email
async function testParser() {
  const sampleEmail = `
Order Number: 4522
Vendor Name: Phoenix Books
Vendor Phone: 802-448-3350
Vendor Email: orders@phoenixbooks.com
Vendor Address: 191 Bank Street, Burlington, VT 05401

Customer Name: Jane Smith
Customer Phone: 802-555-9876
Customer Email: jane.smith@example.com
Delivery Address: 266 Main Street, Burlington, VT 05401
What3Words: switch.agreed.misty

Delivery Type: RAPID
Order Value: $47.99

Special Instructions: VCET building - call first, door is locked. Leave with reception.
`;

  console.log('Testing email parser with sample email...\n');
  const result = await processEmail(sampleEmail);

  if (result.success) {
    console.log('\n✅ Success!', result.message);
    console.log('Order details:', result.order);
  } else {
    console.log('\n❌ Failed:', result.error);
  }
}

// Export for use in other files
module.exports = {
  OrderParser,
  processEmail,
  testParser
};

// Run test if called directly
if (require.main === module) {
  if (process.env.TEST_MODE === 'true') {
    console.log('Running in test mode...');
    testParser();
  } else {
    console.log('Email parser ready. Use processEmail() function to parse emails.');
  }
}
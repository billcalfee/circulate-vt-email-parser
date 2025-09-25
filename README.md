# CirculateVT Email Parser

Converts vendor order emails into database entries with automatic economic impact calculations.

## Setup

1. **Add your Supabase credentials to `.env`:**
```
SUPABASE_URL=your_project_url_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
```

Get these from your Supabase dashboard: Settings > API

2. **Install dependencies:**
```bash
npm install
```

## Email Format

Vendors should send emails with this format:

```
Vendor Name: Phoenix Books
Vendor Phone: 802-448-3350
Vendor Email: orders@phoenixbooks.com
Vendor Address: 191 Bank Street, Burlington, VT 05401

Customer Name: Sarah Johnson
Customer Phone: 802-555-1234
Customer Email: sarah@example.com
Delivery Address: 123 Church Street, Burlington, VT 05401
What3Words: truck.statue.pages (optional)

Delivery Type: RAPID (or LOCAL)
Order Value: $62.97

Special Instructions: Leave on porch if no answer
```

## Testing

Run the test suite to verify everything works:

```bash
npm test
```

This will:
- Test Phoenix Books, VCET, and City Market sample orders
- Insert test orders into your database
- Show calculated economic impact

## Usage in Production

### Option 1: Manual Processing
```javascript
const { processEmail } = require('./email-parser');

const emailContent = "...email body...";
const result = await processEmail(emailContent);

if (result.success) {
  console.log('Order created:', result.order);
  console.log('Local impact:', result.order.local_impact);
}
```

### Option 2: Email Integration (Coming Soon)
- Forward emails to wecare@myti.com
- Use email service webhook to trigger parser
- Automatic database insertion

## What Gets Calculated Automatically

For every order:
- **Total Local Spend**: Order value + Delivery fee
- **Local Impact**: Total × 0.73 (Michigan multiplier)
- **Jobs Supported**: Local impact ÷ $50,000
- **Delivery Charge**: $9.99 (RAPID) or $4.99 (LOCAL)

## Database Fields Created

- Order tracking number
- All vendor details
- All customer details
- Delivery address with zip extraction
- What3Words location (if provided)
- Economic impact calculations
- Status: READY_FOR_PICKUP

## Next Steps

1. Connect to email service (Gmail API, SendGrid, etc.)
2. Add webhook endpoint for automatic processing
3. Send confirmation emails back to vendors
4. Notify drivers of new orders
// ProximyTi Email Webhook Server
// Receives emails from MailSlurp and processes them automatically

require('dotenv').config();
const express = require('express');
const { processEmail } = require('./email-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'ProximyTi Email Processor',
    timestamp: new Date().toISOString()
  });
});

// Main webhook endpoint for MailSlurp
app.post('/webhook/email', async (req, res) => {
  try {
    console.log('📧 Received webhook from MailSlurp');

    // MailSlurp sends email data in this format
    const emailData = req.body;

    // Extract email content
    const emailContent = emailData.body || emailData.textBody || '';
    const subject = emailData.subject || '';
    const fromEmail = emailData.from || '';

    console.log(`From: ${fromEmail}`);
    console.log(`Subject: ${subject}`);
    console.log('Processing email content...');

    // Process the email through our parser
    const result = await processEmail(emailContent);

    if (result.success) {
      console.log('✅ Order created successfully:');
      console.log(`   Order #: ${result.order.order_number}`);
      console.log(`   Vendor: ${result.order.vendor_name}`);
      console.log(`   Customer: ${result.order.customer_name}`);
      console.log(`   Local Impact: $${result.order.local_impact}`);

      // Send success response to MailSlurp
      res.status(200).json({
        success: true,
        message: `Order ${result.order.order_number} created successfully`,
        orderNumber: result.order.order_number,
        localImpact: result.order.local_impact
      });

      // TODO: Send confirmation email back to vendor
      // TODO: Notify driver of new pickup

    } else {
      console.log('❌ Failed to process email:', result.error);

      // Send error response
      res.status(400).json({
        success: false,
        error: result.error,
        emailFrom: fromEmail,
        subject: subject
      });

      // TODO: Send error notification to admin
    }

  } catch (error) {
    console.error('💥 Webhook error:', error);

    res.status(500).json({
      success: false,
      error: 'Internal server error processing email',
      details: error.message
    });
  }
});

// Endpoint to manually test email processing
app.post('/test/email', async (req, res) => {
  try {
    const { emailContent } = req.body;

    if (!emailContent) {
      return res.status(400).json({
        success: false,
        error: 'emailContent is required'
      });
    }

    const result = await processEmail(emailContent);
    res.json(result);

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 ProximyTi Email Webhook Server running on port ${PORT}`);
  console.log(`📧 Webhook endpoint: http://localhost:${PORT}/webhook/email`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/test/email`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
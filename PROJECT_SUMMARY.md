# ProximyTi (CirculateVT) - Project Summary
**Last Updated**: September 26, 2024
**Status**: Core Infrastructure Complete, Email Integration In Progress

---

## 🎯 **Project Vision**

**ProximyTi** is a Vermont-focused delivery platform that keeps dollars circulating in the local economy. Every order calculates and displays its economic impact, showing customers exactly how much money stays in Vermont vs. leaving to Amazon.

**Tagline**: "Every order is a vote for Vermont's economy"

---

## ✅ **What's Complete and Working**

### **1. Database Infrastructure (100% Complete)**
- ✅ **Supabase PostgreSQL** fully operational
- ✅ **8 tables** with complete schema:
  - `orders` - Main order tracking with auto-calculated economic impact
  - `vendor_locations` - Precise pickup information (what3words, floor levels, doors)
  - `customer_locations` - Saved delivery spots with precision
  - `service_areas` - 11 Vermont zip codes (Chittenden County)
  - `billing_configuration` - Fixed rates ($4.99 local, $9.99 rapid)
  - `driver_feedback`, `vendor_feedback`, `customer_feedback` - Stakeholder input
- ✅ **Economic impact auto-calculation**: Raw spending × 0.73 = Vermont impact
- ✅ **Vendor order number tracking**: Primary ID system (e.g., PB-2024-0156)
- ✅ **Location precision**: what3words + floor levels + specific doors

### **2. Email Parser (100% Complete)**
- ✅ **Parses vendor emails** into database orders
- ✅ **Automatic field extraction**: vendor info, customer details, delivery type
- ✅ **Economic impact calculations** on every order
- ✅ **Test suite** with Phoenix Books, VCET, City Market examples
- ✅ **GitHub repository**: https://github.com/billcalfee/circulate-vt-email-parser
- ✅ **Clean code structure** ready for webhook integration

### **3. Webhook Server (100% Complete)**
- ✅ **Express.js server** built and tested
- ✅ **Health check endpoint** for monitoring
- ✅ **Test endpoint** for manual email testing
- ✅ **Error handling** and logging
- ✅ **Ready for MailSlurp integration**

### **4. Wireframes (100% Complete)**
- ✅ **Customer tracking page** with economic impact education
- ✅ **Driver app interface** with precise location details
- ✅ **Vendor portal** for order submission
- ✅ **Admin dashboard** for management
- ✅ **Proper Myti branding** with actual trademarked logo
- ✅ **Mobile responsive** designs

---

## 🚧 **In Progress**

### **1. Email Integration (80% Complete)**
**Status**: Setting up MailSlurp inbox for `deliver@proximyti.com`

**What's Done:**
- ✅ Domain acquired: `proximyti.com`
- ✅ MailSlurp account created
- ✅ Specific inbox created (not catchall)
- ⏳ **Current**: Configuring DNS MX records in Namecheap (TTL 600 = 10 min)
- ⏳ **Next**: Set up webhook URL in MailSlurp
- ⏳ **Testing**: Phoenix Books test email

**Remaining Steps:**
1. Add MX records to Namecheap DNS
2. Configure MailSlurp webhook to point to server
3. Deploy webhook server to production
4. Test end-to-end: Email → Webhook → Database
5. Send test email from Phoenix Books format

### **2. Monday.com Vendor Management (60% Complete)**
**Status**: Board structure designed, columns being configured

**What's Done:**
- ✅ Board structure planned (main items = shops, subitems = additional contacts)
- ✅ Column specifications with descriptions and validation
- ✅ Dropdown design for cities/zip codes (service area enforcement)
- ✅ Integration strategy: Monday → Supabase (daily sync)
- ⏳ **Current**: Adding 15 columns with proper formatting

**Board Name**: "ProximyTi Vendors"

**Columns to Add**:
1. Vendor Code (text: "phoenix-books")
2. Shop Name (text: "Phoenix Books")
3. Address (text: "191 Bank Street")
4. City (dropdown: Burlington, South Burlington, etc.)
5. State (dropdown: VT)
6. Zip Code (dropdown: 05401, 05403, etc.)
7. What3Words (text: "switch.agreed.misty")
8. Pickup Door (long text: "Front entrance on Bank Street")
9. Floor Level (dropdown: Ground, 2nd floor, etc.)
10. Pickup Instructions (long text)
11. Access Code (text)
12. Business Hours (long text)
13. Primary Contact (text)
14. Primary Phone (phone)
15. Active Status (checkbox)

**Remaining Steps:**
1. Complete column setup in Monday
2. Import initial vendor data
3. Build sync script (Monday API → Supabase)
4. Schedule daily automated sync
5. Test with manual sync first

---

## 📋 **Next Immediate Tasks**

### **Priority 1: Complete Email Integration (Today)**
1. ✅ Create specific `deliver@proximyti.com` inbox in MailSlurp
2. ⏳ Add MX records to Namecheap (in progress - TTL 600)
3. ⏳ Configure webhook in MailSlurp dashboard
4. ⏳ Test webhook with local server
5. ⏳ Deploy webhook server to production (Vercel/Railway)
6. ⏳ Send test email from Phoenix Books format

### **Priority 2: Finish Monday Board (Today/Tomorrow)**
1. ⏳ Add all 15 columns with descriptions
2. ⏳ Set up dropdowns for city/state/zip
3. ⏳ Create template first row
4. ⏳ Import initial vendors (Phoenix Books, VCET, City Market)

### **Priority 3: Build Monday Sync (Tomorrow)**
1. Build Monday API integration script
2. Map Monday columns → Supabase fields
3. Test with manual sync
4. Schedule daily automated sync (11 PM)
5. Add manual trigger option

---

## 🏗️ **Technical Architecture**

```
Vendor Email Flow:
┌─────────────────┐
│ Phoenix Books   │
│ Email Order     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ deliver@proximyti.com   │
│ (MailSlurp)             │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Webhook Server          │
│ Express.js :3001        │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Email Parser            │
│ Extract order data      │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Supabase Database       │
│ • Auto-calc impact      │
│ • Vendor tracking       │
│ • Location precision    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Applications            │
│ • Driver App            │
│ • Customer Tracking     │
│ • Vendor Portal         │
│ • Admin Dashboard       │
└─────────────────────────┘
```

**Vendor Management Flow:**
```
Monday.com Board → Daily Sync → Supabase vendor_locations → All Applications
(Team-friendly UI)              (Source of truth)            (Auto-updated)
```

---

## 🎯 **Key Features**

### **Economic Impact Tracking**
- Every order calculates Vermont economic impact
- **Formula**: (Order Value + Delivery Fee) × 0.73 = Local Impact
- **Example**: $62.97 order + $9.99 delivery = $72.96 × 0.73 = **$53.26 stays in Vermont**
- Comparison shown to customers: "vs. $0 with Amazon"

### **Location Precision**
- **what3words integration**: 3m × 3m precision (switch.agreed.misty)
- **Floor levels**: Ground, 2nd floor, Basement, etc.
- **Specific doors**: "Front entrance on Bank Street" vs "Loading dock rear"
- **Access codes**: Door codes, entry instructions
- Solves multi-story building challenges

### **Vendor Order Tracking**
- Vendors use their own order numbers
- **Phoenix Books PB-2024-0156** → ProximyTi uses **PB-2024-0156**
- No cross-referencing needed
- One number system for everyone

### **Service Area Management**
- 11 Chittenden County zip codes loaded
- Dropdown validation in Monday.com
- Prevents out-of-area orders
- Easy expansion to new areas

---

## 💰 **Pricing & Billing**

### **Customer Pricing (Fixed)**
- **LOCAL (3-4 days)**: $4.99
- **RAPID (24 hours)**: $9.99
- **Package size**: ONE_HAND only (MVP)

### **Economic Impact Example**
```
Order: $62.97 (books from Phoenix Books)
Delivery: $9.99 (RAPID)
────────────────────────────
Total Local Spend: $72.96
Vermont Impact (×0.73): $53.26
Jobs Supported: 0.0011
────────────────────────────
vs. Amazon delivery: $0 stays local
```

---

## 📊 **Service Area (Current)**

### **Chittenden County, Vermont**
**Fully Within Service:**
- 05401 - Burlington (32,724 population)
- 05402 - Burlington South (8,500)
- 05405 - Burlington North (15,200)
- 05408 - Burlington East (5,200)
- 05404 - Winooski (7,267)
- 05403 - South Burlington (19,367)
- 05452 - Essex Junction (10,761)

**Partially Within Service:**
- 05446 - Colchester (17,524)
- 05495 - Williston (10,103)
- 05482 - Shelburne (7,717)
- 05451 - Essex (21,613)

**Total Coverage**: ~156,000 people in 11 zip codes

---

## 🔧 **Technology Stack**

### **Backend**
- **Database**: Supabase (PostgreSQL)
- **Email Processing**: MailSlurp + Express.js
- **Email Parser**: Node.js
- **API**: Supabase REST API

### **Frontend (Planned)**
- **Framework**: Next.js 14 + TypeScript
- **UI Library**: Tailwind CSS
- **Hosting**: Vercel
- **PWA**: Driver mobile app

### **Integrations**
- **Monday.com**: Vendor management
- **MailSlurp**: Email inbox webhooks
- **what3words**: Location precision
- **Twilio**: SMS notifications (future)
- **Resend**: Confirmation emails (future)

### **Development**
- **Version Control**: Git + GitHub
- **Repository**: https://github.com/billcalfee/circulate-vt-email-parser
- **IDE**: VS Code
- **Testing**: Custom test suites

---

## 👥 **Team & Roles**

- **Bill**: Backend, database, infrastructure, Claude Code expert
- **Gibbs**: Frontend development (awaiting GitHub invitation)
- **IT Company**: Email/domain setup support
- **Tim (IT)**: Recommended MailSlurp for webhook integration

---

## 📝 **Email Format for Vendors**

Vendors send emails to `deliver@proximyti.com` with this format:

```
Vendor Order Number: PB-2024-0156
Vendor Name: Phoenix Books
Vendor Phone: 802-448-3350
Vendor Email: orders@phoenixbooks.com
Vendor Address: 191 Bank Street, Burlington, VT 05401

Customer Name: Sarah Johnson
Customer Phone: 802-555-1234
Customer Email: sarah@example.com
Delivery Address: 123 Church Street, Burlington, VT 05401
What3Words: truck.statue.pages

Delivery Type: RAPID
Order Value: $62.97

Special Instructions: Leave on front porch if no answer. Dog is friendly.
```

**System automatically:**
- Creates order with ID: PB-2024-0156
- Calculates delivery charge: $9.99 (RAPID)
- Calculates total local spend: $72.96
- Calculates Vermont impact: $53.26 (×0.73)
- Sets status: READY_FOR_PICKUP
- Stores all location details

---

## 🚀 **Launch Readiness**

### **Ready to Launch:**
- ✅ Database schema and calculations
- ✅ Email parser with vendor order tracking
- ✅ Webhook server infrastructure
- ✅ Wireframes for all user interfaces
- ✅ Economic impact messaging
- ✅ Location precision system

### **Blocking Issues:**
1. ⏳ DNS propagation for email (TTL 600 = 10 minutes)
2. ⏳ Monday.com board completion
3. ⏳ Webhook deployment to production

### **Estimated Launch Timeline:**
- **Email integration**: 1-2 hours (DNS propagation)
- **Monday board**: 1-2 hours (column setup)
- **Monday sync script**: 2-4 hours (development + testing)
- **Total to MVP**: 1-2 days

---

## 🎯 **Success Metrics (Future)**

### **Economic Impact**
- Total local spending captured
- Vermont dollars retained vs. lost to Amazon
- Jobs supported calculation
- Vendor participation rate

### **Operational**
- Orders processed per day
- Average delivery time (RAPID vs LOCAL)
- Customer satisfaction ratings
- Driver efficiency metrics

### **Growth**
- New vendors onboarded
- Service area expansion
- Customer adoption rate
- Repeat order percentage

---

## 🔐 **Security & Access**

- **Supabase credentials**: Stored in 1Password
- **Environment variables**: `.env` files (excluded from Git)
- **Service role key**: Rotate after development phase
- **GitHub access**: Bill (owner), Gibbs (pending invitation)
- **Monday.com**: Team access for vendor management
- **MailSlurp**: Bill's account with deliver@proximyti.com

---

## 📚 **Documentation**

### **Repository Files**
- `email-parser.js` - Core email parsing logic
- `webhook-server.js` - Express webhook endpoint
- `test-parser.js` - Test suite for email parsing
- `test-webhook.js` - Webhook integration testing
- `PROJECT_STATUS.md` - Detailed status (this file)
- `README.md` - Developer documentation
- `add-vendor-order-field.sql` - Database migration for vendor tracking

### **Wireframes Location**
`/Users/bill/workspace/Logistics platform project scope/wireframes/`
- `customer-tracking-full-v2.html` - Customer experience
- `driver-app-wireframe-v1.html` - Driver mobile app
- `vendor-portal-wireframe-v1.html` - Vendor order submission
- `admin-dashboard-wireframe-v1.html` - Admin analytics

---

## 💡 **Key Decisions Made**

1. **Rebranded to ProximyTi** (better clarity than CirculateVT)
2. **Vendor order numbers as primary IDs** (no cross-referencing)
3. **what3words for location precision** (solves address ambiguity)
4. **Monday.com for team collaboration** (vendor management UI)
5. **MailSlurp for reliable email processing** (per IT recommendation)
6. **Specific inbox over catchall** (spam prevention)
7. **Fixed billing rates** ($4.99/$9.99 - simple for MVP)
8. **ONE_HAND packages only** (simplify for launch)
9. **0.73 economic multiplier** (Michigan studies)
10. **Daily sync Monday → Supabase** (manual trigger available)

---

## 🎉 **What's Exciting**

- **Fully automated order intake**: Email → Database in seconds
- **Real economic impact**: Every order shows Vermont value retained
- **Location precision**: Drivers know exact pickup/delivery spots
- **Vendor-friendly**: Use their own order numbers
- **Team-friendly**: Monday.com for easy vendor management
- **Scalable**: Clean architecture ready for growth
- **Movement-focused**: Every order is a vote for Vermont's economy

---

**The foundation is rock-solid. Email integration is the final piece to start accepting real orders from Phoenix Books!** 🚀🎯
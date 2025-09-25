-- Add vendor_order_number field to orders table
-- This stores the vendor's original order number for tracking

ALTER TABLE orders
ADD COLUMN vendor_order_number VARCHAR(100);

-- Add index for fast vendor order lookups
CREATE INDEX idx_orders_vendor_order ON orders(vendor_id, vendor_order_number);
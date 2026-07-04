-- Migration: Enhanced order status management
-- Run this in Supabase SQL Editor

-- Drop existing status constraint and replace with expanded statuses
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE orders ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('pending', 'attending', 'in_progress', 'completed', 'cancelled'));

-- Add notes field for shop owners to leave notes on orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes text;

-- Update any existing 'contacted' status to 'attending' 
UPDATE orders SET status = 'attending' WHERE status = 'contacted';

/*
  # Fix stock adjustment trigger timing

  1. Problem
    - The AFTER INSERT trigger on `orders` fires before `order_items` are inserted
    - So `adjust_stock_for_order` finds no items and does nothing

  2. Solution
    - Remove the INSERT trigger from `orders`
    - Add a new AFTER INSERT trigger on `order_items` that decrements stock per item
    - Keep the UPDATE trigger on `orders` for cancellation/refund stock restore
    - Add a new function `handle_order_item_stock_trigger` for per-item stock adjustment

  3. Changes
    - Drop `trigger_order_stock_on_insert` from orders
    - Create `handle_order_item_stock_trigger()` on order_items AFTER INSERT
    - The new trigger checks the parent order status; if not cancelled/refunded, it decrements
*/

-- Remove the old insert trigger that fires too early
DROP TRIGGER IF EXISTS trigger_order_stock_on_insert ON orders;

-- New trigger function: fires per order_item row inserted
CREATE OR REPLACE FUNCTION handle_order_item_stock_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_status text;
BEGIN
  IF NEW.product_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT status INTO v_order_status FROM orders WHERE id = NEW.order_id;

  IF v_order_status NOT IN ('cancelled', 'refunded') THEN
    UPDATE products
    SET stock_quantity = stock_quantity - NEW.quantity,
        updated_at = now()
    WHERE id = NEW.product_id
      AND track_inventory = true;
  END IF;

  RETURN NEW;
END;
$$;

-- Create the trigger on order_items
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_order_item_stock_on_insert'
  ) THEN
    CREATE TRIGGER trigger_order_item_stock_on_insert
      AFTER INSERT ON order_items
      FOR EACH ROW
      EXECUTE FUNCTION handle_order_item_stock_trigger();
  END IF;
END $$;

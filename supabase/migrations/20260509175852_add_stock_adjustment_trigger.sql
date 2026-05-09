/*
  # Add automatic stock adjustment on order status changes

  1. New Functions
    - `adjust_stock_for_order(order_id uuid, direction text)` - adjusts product stock_quantity
      based on order_items. direction is 'decrement' or 'increment'.
    - `handle_order_stock_trigger()` - trigger function that:
      - On INSERT (new order): decrements stock for all order items
      - On UPDATE when status changes TO 'cancelled' or 'refunded': restores stock
      - On UPDATE when status changes FROM 'cancelled'/'refunded' to another active status: decrements stock again

  2. New Triggers
    - `trigger_order_stock_on_insert` - AFTER INSERT on orders
    - `trigger_order_stock_on_update` - AFTER UPDATE on orders

  3. Important Notes
    - Only adjusts products where track_inventory = true
    - Uses order_items to determine quantities per product
    - Stock can go negative if allow_backorder = true (no floor enforced)
*/

CREATE OR REPLACE FUNCTION adjust_stock_for_order(p_order_id uuid, p_direction text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_direction = 'decrement' THEN
    UPDATE products
    SET stock_quantity = stock_quantity - oi.quantity,
        updated_at = now()
    FROM order_items oi
    WHERE oi.order_id = p_order_id
      AND oi.product_id = products.id
      AND products.track_inventory = true;
  ELSIF p_direction = 'increment' THEN
    UPDATE products
    SET stock_quantity = stock_quantity + oi.quantity,
        updated_at = now()
    FROM order_items oi
    WHERE oi.order_id = p_order_id
      AND oi.product_id = products.id
      AND products.track_inventory = true;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION handle_order_stock_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.status NOT IN ('cancelled', 'refunded') THEN
      PERFORM adjust_stock_for_order(NEW.id, 'decrement');
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF OLD.status = NEW.status THEN
      RETURN NEW;
    END IF;

    IF NEW.status IN ('cancelled', 'refunded') AND OLD.status NOT IN ('cancelled', 'refunded') THEN
      PERFORM adjust_stock_for_order(NEW.id, 'increment');
    END IF;

    IF OLD.status IN ('cancelled', 'refunded') AND NEW.status NOT IN ('cancelled', 'refunded') THEN
      PERFORM adjust_stock_for_order(NEW.id, 'decrement');
    END IF;

    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_order_stock_on_insert'
  ) THEN
    CREATE TRIGGER trigger_order_stock_on_insert
      AFTER INSERT ON orders
      FOR EACH ROW
      EXECUTE FUNCTION handle_order_stock_trigger();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_order_stock_on_update'
  ) THEN
    CREATE TRIGGER trigger_order_stock_on_update
      AFTER UPDATE ON orders
      FOR EACH ROW
      EXECUTE FUNCTION handle_order_stock_trigger();
  END IF;
END $$;

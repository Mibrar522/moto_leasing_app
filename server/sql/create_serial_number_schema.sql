ALTER TABLE product_catalog
    ADD COLUMN IF NOT EXISTS serial_number VARCHAR(220),
    ADD COLUMN IF NOT EXISTS registration_number VARCHAR(120),
    ADD COLUMN IF NOT EXISTS chassis_number VARCHAR(160),
    ADD COLUMN IF NOT EXISTS engine_number VARCHAR(160);

ALTER TABLE stock_orders
    ADD COLUMN IF NOT EXISTS serial_number VARCHAR(260);

ALTER TABLE stock_orders
    ALTER COLUMN quantity SET DEFAULT 1;

UPDATE stock_orders
SET quantity = 1
WHERE quantity IS NULL OR quantity < 1;

ALTER TABLE vehicles
    ADD COLUMN IF NOT EXISTS serial_number VARCHAR(260),
    ADD COLUMN IF NOT EXISTS source_stock_order_id UUID REFERENCES stock_orders(id) ON DELETE SET NULL;

UPDATE product_catalog
SET serial_number = CONCAT(
    'STK',
    REGEXP_REPLACE(UPPER(COALESCE(brand, '')), '[^A-Z0-9]+', '', 'g'),
    REGEXP_REPLACE(UPPER(COALESCE(color, '')), '[^A-Z0-9]+', '', 'g'),
    REGEXP_REPLACE(UPPER(COALESCE(model, '')), '[^A-Z0-9]+', '', 'g'),
    REGEXP_REPLACE(UPPER(COALESCE(chassis_number, '')), '[^A-Z0-9]+', '', 'g'),
    REGEXP_REPLACE(UPPER(COALESCE(engine_number, '')), '[^A-Z0-9]+', '', 'g')
)
WHERE COALESCE(TRIM(serial_number), '') = '';

WITH ranked_product_serials AS (
    SELECT
        id,
        UPPER(serial_number) AS normalized_serial,
        ROW_NUMBER() OVER (
            PARTITION BY UPPER(serial_number)
            ORDER BY created_at ASC, id ASC
        ) AS row_number
    FROM product_catalog
    WHERE COALESCE(TRIM(serial_number), '') <> ''
)
UPDATE product_catalog pc
SET serial_number = CONCAT(ranked_product_serials.normalized_serial, '-', ranked_product_serials.row_number)
FROM ranked_product_serials
WHERE pc.id = ranked_product_serials.id
  AND ranked_product_serials.row_number > 1;

UPDATE stock_orders so
SET serial_number = COALESCE(
    NULLIF(TRIM(so.serial_number), ''),
    NULLIF(TRIM(pc.serial_number), '')
)
FROM product_catalog pc
WHERE so.product_id = pc.id
  AND COALESCE(TRIM(so.serial_number), '') = '';

UPDATE vehicles v
SET serial_number = COALESCE(
    NULLIF(TRIM(v.serial_number), ''),
    CONCAT(
        'STK',
        REGEXP_REPLACE(UPPER(COALESCE(v.brand, '')), '[^A-Z0-9]+', '', 'g'),
        REGEXP_REPLACE(UPPER(COALESCE(v.color, '')), '[^A-Z0-9]+', '', 'g'),
        REGEXP_REPLACE(UPPER(COALESCE(v.model, '')), '[^A-Z0-9]+', '', 'g'),
        REGEXP_REPLACE(UPPER(COALESCE(NULLIF(TRIM(v.chassis_number), ''), v.id::text)), '[^A-Z0-9]+', '', 'g'),
        REGEXP_REPLACE(UPPER(COALESCE(NULLIF(TRIM(v.engine_number), ''), v.id::text)), '[^A-Z0-9]+', '', 'g')
    )
)
FROM product_catalog pc
WHERE UPPER(COALESCE(pc.brand, '')) = UPPER(COALESCE(v.brand, ''))
  AND UPPER(COALESCE(pc.model, '')) = UPPER(COALESCE(v.model, ''))
  AND UPPER(COALESCE(pc.vehicle_type, '')) = UPPER(COALESCE(v.vehicle_type, ''))
  AND COALESCE(TRIM(v.serial_number), '') = '';

UPDATE vehicles v
SET source_stock_order_id = so.id
FROM stock_orders so
WHERE v.source_stock_order_id IS NULL
  AND v.registration_number LIKE CONCAT('STK-', REPLACE(UPPER(so.id::text), '-', ''), '-%');

WITH ranked_vehicle_serials AS (
    SELECT
        id,
        UPPER(serial_number) AS normalized_serial,
        ROW_NUMBER() OVER (
            PARTITION BY UPPER(serial_number)
            ORDER BY created_at ASC NULLS LAST, id ASC
        ) AS row_number
    FROM vehicles
    WHERE COALESCE(TRIM(serial_number), '') <> ''
)
UPDATE vehicles v
SET serial_number = CONCAT(ranked_vehicle_serials.normalized_serial, '-', ranked_vehicle_serials.row_number)
FROM ranked_vehicle_serials
WHERE v.id = ranked_vehicle_serials.id
  AND ranked_vehicle_serials.row_number > 1;

CREATE UNIQUE INDEX IF NOT EXISTS product_catalog_serial_number_unique_idx
ON product_catalog (UPPER(serial_number))
WHERE COALESCE(TRIM(serial_number), '') <> '';

CREATE UNIQUE INDEX IF NOT EXISTS product_catalog_chassis_number_unique_idx
ON product_catalog (UPPER(chassis_number))
WHERE COALESCE(TRIM(chassis_number), '') <> '';

CREATE UNIQUE INDEX IF NOT EXISTS product_catalog_engine_number_unique_idx
ON product_catalog (UPPER(engine_number))
WHERE COALESCE(TRIM(engine_number), '') <> '';

CREATE UNIQUE INDEX IF NOT EXISTS product_catalog_registration_number_unique_idx
ON product_catalog (UPPER(registration_number))
WHERE COALESCE(TRIM(registration_number), '') <> '';

CREATE UNIQUE INDEX IF NOT EXISTS vehicles_serial_number_unique_idx
ON vehicles (UPPER(serial_number))
WHERE COALESCE(TRIM(serial_number), '') <> '';

CREATE UNIQUE INDEX IF NOT EXISTS vehicles_chassis_number_unique_idx
ON vehicles (UPPER(chassis_number))
WHERE COALESCE(TRIM(chassis_number), '') <> '';

CREATE UNIQUE INDEX IF NOT EXISTS vehicles_engine_number_unique_idx
ON vehicles (UPPER(engine_number))
WHERE COALESCE(TRIM(engine_number), '') <> '';

CREATE UNIQUE INDEX IF NOT EXISTS vehicles_registration_number_unique_idx
ON vehicles (UPPER(registration_number))
WHERE COALESCE(TRIM(registration_number), '') <> '';

CREATE INDEX IF NOT EXISTS stock_orders_serial_number_idx
ON stock_orders (UPPER(serial_number))
WHERE COALESCE(TRIM(serial_number), '') <> '';

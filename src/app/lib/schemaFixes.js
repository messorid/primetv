// ─────────────────────────────────────────────────────────────────────────────
// Column TYPE migrations.
//
// `ALTER TABLE ... ADD COLUMN IF NOT EXISTS x INT` is a no-op when the column
// already exists with a different type — it does not correct it, and it does
// not complain. cable_concealment lived through exactly that: it started life
// as the BOOLEAN behind a yes/no toggle, and when the form became a quantity
// picker the new INT declaration was silently ignored. Postgres accepted 0 and
// 1 as boolean for months, so nothing looked wrong until the first customer
// asked for two cable runs and the insert was rejected with
// `invalid input syntax for type boolean: "2"`.
//
// Type changes therefore need an explicit, conditional migration. Each one here
// checks information_schema first, so it is safe to run on every request and
// does nothing once applied.
// ─────────────────────────────────────────────────────────────────────────────

export async function applySchemaFixes(sql) {
  // cable_concealment: BOOLEAN -> INT (number of hidden cable runs).
  // true becomes 1 — the original toggle could only ever mean "one run".
  await sql`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'bookings'
          AND column_name = 'cable_concealment'
          AND data_type = 'boolean'
      ) THEN
        ALTER TABLE bookings ALTER COLUMN cable_concealment DROP DEFAULT;
        ALTER TABLE bookings
          ALTER COLUMN cable_concealment TYPE INTEGER
          USING (CASE WHEN cable_concealment THEN 1 ELSE 0 END);
        ALTER TABLE bookings ALTER COLUMN cable_concealment SET DEFAULT 0;
      END IF;
    END $$;
  `
}

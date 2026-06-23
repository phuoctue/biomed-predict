#!/usr/bin/env python3
"""check_db.py - Show existing tables and flyway history in Supabase."""
import psycopg2

HOST     = "db.hszcipdxyhednqknunpa.supabase.co"
PORT     = 5432
DBNAME   = "postgres"
USER     = "postgres"
PASSWORD = "biomed-predict123"
SSLMODE  = "require"

conn = psycopg2.connect(host=HOST, port=PORT, dbname=DBNAME,
                        user=USER, password=PASSWORD, sslmode=SSLMODE)
cur = conn.cursor()

# List all tables in public schema
cur.execute("""
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename;
""")
tables = [r[0] for r in cur.fetchall()]
print("=== Tables in public schema ===")
for t in tables:
    print(f"  {t}")

# Check flyway history
if "flyway_schema_history" in tables:
    cur.execute("SELECT version, description, success FROM flyway_schema_history ORDER BY installed_rank;")
    rows = cur.fetchall()
    print("\n=== Flyway history ===")
    for r in rows:
        print(f"  V{r[0]} - {r[1]} - {'OK' if r[2] else 'FAILED'}")
else:
    print("\n  (no flyway_schema_history table found)")

cur.close()
conn.close()

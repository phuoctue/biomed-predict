#!/usr/bin/env python3
"""Verify key columns needed by JPA entities exist in the database."""
import psycopg2

conn = psycopg2.connect(
    host="db.hszcipdxyhednqknunpa.supabase.co", port=5432,
    dbname="postgres", user="postgres",
    password="biomed-predict123", sslmode="require"
)
cur = conn.cursor()

checks = [
    # (table, column)
    ("patients",     "patient_code"),
    ("patients",     "gender"),
    ("patients",     "height_cm"),
    ("patients",     "weight_kg"),
    ("patients",     "diagnosis"),
    ("patients",     "allergies"),
    ("drugs",        "drug_code"),
    ("drugs",        "generic_name"),
    ("drugs",        "brand_name"),
    ("drugs",        "instruction"),
    ("drug_interactions", "drug_a_id"),
    ("drug_interactions", "drug_b_id"),
    ("evaluations",  "suitability_score"),
    ("evaluations",  "risk_level"),
    ("patient_drugs","patient_id"),
    ("patient_drugs","drug_id"),
    ("users",        "password"),
    ("users",        "role_id"),
]

print("=== Schema checks ===")
ok = fail = 0
for table, col in checks:
    cur.execute("""
        SELECT 1 FROM information_schema.columns
        WHERE table_schema='public' AND table_name=%s AND column_name=%s
    """, (table, col))
    found = cur.fetchone() is not None
    status = "✓" if found else "✗ MISSING"
    print(f"  {status:12} {table}.{col}")
    if found: ok += 1
    else:      fail += 1

print(f"\n{ok} OK, {fail} missing")
cur.close()
conn.close()

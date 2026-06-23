#!/usr/bin/env python3
"""Dump actual columns for key tables."""
import psycopg2

conn = psycopg2.connect(
    host="db.hszcipdxyhednqknunpa.supabase.co", port=5432,
    dbname="postgres", user="postgres",
    password="biomed-predict123", sslmode="require"
)
cur = conn.cursor()

for table in ["users","patients","drugs","drug_interactions","evaluations","patient_drugs"]:
    cur.execute("""
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema='public' AND table_name=%s
        ORDER BY ordinal_position
    """, (table,))
    rows = cur.fetchall()
    print(f"\n=== {table} ===")
    for col, dtype, nullable in rows:
        print(f"  {col:<35} {dtype:<20} {'NULL' if nullable=='YES' else 'NOT NULL'}")

cur.close()
conn.close()

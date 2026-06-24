#!/usr/bin/env python3
"""
setup_db.py
  1. Baselines V1-V6 into flyway_schema_history (tables already exist).
  2. Runs V7, V8, V9 (new tables) if not already present.
"""
import os, sys, time, psycopg2
from pathlib import Path

HOST     = "db.hszcipdxyhednqknunpa.supabase.co"
PORT     = 5432
DBNAME   = "postgres"
USER     = "postgres"
PASSWORD = "biomed-predict123"
SSLMODE  = "require"

MIGRATIONS_DIR = Path(__file__).parent.parent / "backend" / "src" / "main" / \
                 "resources" / "db" / "migration"

# Tables that prove a migration already ran (no need to re-execute)
EXISTING_TABLES = {
    "V1__initial_schema.sql":                     "users",
    "V2__create_drugs_and_lab_tables.sql":         "drugs",
    "V3__create_prescriptions_and_ai_tables.sql":  "prescriptions",
    "V4__create_decision_and_related_tables.sql":  "doctor_decisions",
    "V5__create_audit_and_system_tables.sql":      "audit_logs",
    "V6__seed_initial_data.sql":                   None,   # seed — baseline only
    "V7__create_evaluations_table.sql":            "evaluations",
    "V8__create_patient_drugs_table.sql":          "patient_drugs",
    "V9__extend_patients_table.sql":               "patients",  # ALTER TABLE, always baseline if patients exists
}

def connect():
    return psycopg2.connect(
        host=HOST, port=PORT, dbname=DBNAME,
        user=USER, password=PASSWORD, sslmode=SSLMODE
    )

def get_existing_tables(cur):
    cur.execute("SELECT tablename FROM pg_tables WHERE schemaname='public'")
    return {r[0] for r in cur.fetchall()}

def get_applied_scripts(cur):
    try:
        cur.execute("SELECT script FROM flyway_schema_history WHERE success=true")
        return {r[0] for r in cur.fetchall()}
    except Exception:
        return set()

def baseline_record(cur, rank, version, description, script):
    cur.execute("""
        INSERT INTO flyway_schema_history
            (installed_rank, version, description, type, script,
             installed_by, execution_time, success)
        VALUES (%s,%s,%s,'SQL',%s,'setup_db.py',0,true)
        ON CONFLICT (installed_rank) DO NOTHING
    """, (rank, version, description, script))
    print(f"  [BASELINE] {script}")

def run_sql(cur, conn, rank, version, description, script_name, sql):
    t0 = time.time()
    cur.execute(sql)
    ms = int((time.time() - t0) * 1000)
    cur.execute("""
        INSERT INTO flyway_schema_history
            (installed_rank, version, description, type, script,
             installed_by, execution_time, success)
        VALUES (%s,%s,%s,'SQL',%s,'setup_db.py',%s,true)
        ON CONFLICT (installed_rank) DO NOTHING
    """, (rank, version, description, script_name, ms))
    conn.commit()
    print(f"  [APPLIED]  {script_name} ({ms}ms)")

def main():
    sql_files = sorted(MIGRATIONS_DIR.glob("V*.sql"))
    print(f"Found {len(sql_files)} migration files in {MIGRATIONS_DIR}\n")

    conn = connect()
    conn.autocommit = False
    cur  = conn.cursor()

    existing_tables = get_existing_tables(cur)
    applied_scripts = get_applied_scripts(cur)

    print(f"DB has {len(existing_tables)} tables, {len(applied_scripts)} tracked migrations\n")

    for sql_file in sql_files:
        name  = sql_file.name
        parts = name.replace(".sql","").split("__", 1)
        ver   = parts[0][1:]           # strip 'V'
        desc  = parts[1].replace("_"," ") if len(parts)>1 else name
        rank  = int(ver.split(".")[0])

        if name in applied_scripts:
            print(f"  [SKIP]     {name} (already in flyway history)")
            continue

        # ── Baseline: migration already physically applied ──────────────────
        if name in EXISTING_TABLES:
            proof_table = EXISTING_TABLES[name]
            if proof_table is None or proof_table in existing_tables:
                baseline_record(cur, rank, ver, desc, name)
                conn.commit()
                continue

        # ── New migration: actually run it ──────────────────────────────────
        sql = sql_file.read_text(encoding="utf-8")
        print(f"  [RUN]      {name} ...", end=" ", flush=True)
        try:
            run_sql(cur, conn, rank, ver, desc, name, sql)
        except Exception as e:
            conn.rollback()
            print(f"\n  FAILED: {e}")
            raise SystemExit(f"Migration {name} failed.") from e

    print("\n✓ Database is up to date.")
    cur.close()
    conn.close()

if __name__ == "__main__":
    main()

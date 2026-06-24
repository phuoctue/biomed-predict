#!/usr/bin/env python3
"""Reset all user passwords to password123 using BE API (so Spring BCrypt hashes them correctly)."""
import psycopg2, requests, json

HOST = "db.hszcipdxyhednqknunpa.supabase.co"
API  = "http://localhost:8081/api"

conn = psycopg2.connect(host=HOST,port=5432,dbname="postgres",user="postgres",password="biomed-predict123",sslmode="require")
cur  = conn.cursor()

# Get admin token
r = requests.post(f"{API}/auth/login", json={"email":"admin@mediai.local","password":"admin12345"})
token = r.json()["accessToken"]
headers = {"Authorization": f"Bearer {token}"}

# Get all users
cur.execute("SELECT id::text, email, role FROM users")
users = cur.fetchall()
print(f"Found {len(users)} users")

# Reset password via API for each user (except the 2 seeded by DataSeeder which already work)
skip = {"admin@mediai.local", "doctor@mediai.local"}
fixed = 0
for uid, email, role in users:
    if email in skip:
        print(f"  [SKIP] {email}")
        continue
    resp = requests.put(f"{API}/users/{uid}/password", json={"newPassword":"password123"}, headers=headers)
    if resp.status_code in (200, 204):
        print(f"  [OK]   {email} ({role})")
        fixed += 1
    else:
        print(f"  [ERR]  {email}: {resp.status_code} {resp.text[:80]}")

conn.close()
print(f"\n✓ Reset {fixed} passwords to 'password123'")

import psycopg2
conn = psycopg2.connect(host='db.hszcipdxyhednqknunpa.supabase.co',port=5432,
    dbname='postgres',user='postgres',password='biomed-predict123',sslmode='require')
cur = conn.cursor()
cur.execute("SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename IN ('activity_logs','audit_logs')")
print('Tables:', cur.fetchall())
cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name='audit_logs' ORDER BY ordinal_position LIMIT 15")
print('audit_logs cols:', [r[0] for r in cur.fetchall()])
cur.execute("SELECT COUNT(*) FROM audit_logs"); print('audit_logs count:', cur.fetchone()[0])
conn.close()

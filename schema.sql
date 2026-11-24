CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  business TEXT,
  services TEXT NOT NULL,
  engagement TEXT,
  budget TEXT,
  timeline TEXT,
  details TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'website',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE TABLE IF NOT EXISTS lead_rate_limits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bucket_key TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_lead_rate_bucket ON lead_rate_limits(bucket_key,created_at);

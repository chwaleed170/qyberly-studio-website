-- QYBERLY CRM upgrade: private follow-up dates and internal notes.
-- Run once in the qyberly-leads D1 database before deploying the CRM API update.
ALTER TABLE leads ADD COLUMN follow_up_at TEXT;
ALTER TABLE leads ADD COLUMN internal_notes TEXT NOT NULL DEFAULT '';
CREATE INDEX IF NOT EXISTS idx_leads_follow_up ON leads(follow_up_at);

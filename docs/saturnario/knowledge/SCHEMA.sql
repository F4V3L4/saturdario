-- Saturnario knowledge base, SQLite 3
-- Public schema only. Personal/private observations must stay in a local database
-- excluded from Git. Enable PRAGMA foreign_keys = ON on every connection.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN
    ('primary','dataset','systematic_review','review','book','article','other')),
  author TEXT,
  publisher TEXT,
  url TEXT,
  published_at TEXT,
  accessed_at TEXT,
  notes TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata_json)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS records (
  id TEXT PRIMARY KEY,
  record_type TEXT NOT NULL CHECK (record_type IN
    ('claim','observation','hypothesis','interpretation','question','model','experiment','principle')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  domain TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN
    ('draft','exploring','planned','active','supported','mixed','unsupported','refuted','revised','archived')),
  confidence TEXT NOT NULL DEFAULT 'not_assessed' CHECK (confidence IN
    ('not_assessed','low','moderate','high')),
  scope TEXT,
  method TEXT,
  limitations TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata_json)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS record_sources (
  record_id TEXT NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  source_id TEXT NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  relation TEXT NOT NULL CHECK (relation IN ('supports','challenges','context','derived_from')),
  note TEXT,
  PRIMARY KEY (record_id, source_id, relation)
);

CREATE TABLE IF NOT EXISTS relations (
  id TEXT PRIMARY KEY,
  from_record_id TEXT NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  to_record_id TEXT NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  relation_type TEXT NOT NULL,
  rationale TEXT,
  strength TEXT CHECK (strength IN ('speculative','weak','moderate','strong')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  CHECK (from_record_id <> to_record_id)
);

CREATE TABLE IF NOT EXISTS experiments (
  id TEXT PRIMARY KEY REFERENCES records(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  hypothesis TEXT,
  protocol_json TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(protocol_json)),
  results_json TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(results_json)),
  outcome TEXT CHECK (outcome IN ('not_run','inconclusive','supports','challenges','mixed')),
  run_at TEXT
);

CREATE TABLE IF NOT EXISTS revisions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  record_id TEXT NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  previous_status TEXT,
  new_status TEXT,
  change_note TEXT NOT NULL,
  evidence_snapshot_json TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(evidence_snapshot_json)),
  revised_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS principles (
  record_id TEXT PRIMARY KEY REFERENCES records(id) ON DELETE CASCADE,
  practical_guidance TEXT NOT NULL,
  when_useful TEXT,
  when_not_to_use TEXT,
  risk_level TEXT NOT NULL DEFAULT 'low' CHECK (risk_level IN ('low','medium','high')),
  review_due TEXT
);

CREATE INDEX IF NOT EXISTS idx_records_domain_status ON records(domain, status);
CREATE INDEX IF NOT EXISTS idx_records_type ON records(record_type);
CREATE INDEX IF NOT EXISTS idx_record_sources_source ON record_sources(source_id);
CREATE INDEX IF NOT EXISTS idx_relations_from ON relations(from_record_id);
CREATE INDEX IF NOT EXISTS idx_relations_to ON relations(to_record_id);
CREATE INDEX IF NOT EXISTS idx_revisions_record ON revisions(record_id, revised_at);

-- Flexible exploratory data is welcome. The record_type/status fields make its
-- epistemic role visible; they are not a gate that prevents saving an idea.

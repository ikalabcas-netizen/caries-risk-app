-- Caries Risk Assessment Schema
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS assessments (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT now() NOT NULL,

  -- Student & Survey Info
  personal_id        TEXT,
  school             TEXT,
  survey_round       INTEGER DEFAULT 1,

  -- General Information
  patient_name       TEXT NOT NULL,
  gender             TEXT,
  occupation         TEXT,
  dob                DATE,
  age_years          INTEGER,
  age_months         INTEGER,

  -- Part 1: Economic/Social
  current_occ        TEXT,
  current_occ_specify TEXT,
  housing            TEXT,
  income             TEXT,

  -- Part 2: Medical
  chronic_disease    TEXT,
  saliva_medication  TEXT,

  -- Part 3: Behavioral
  sugar_frequency    TEXT,
  brushing_freq      TEXT,
  fluoride_use       TEXT,

  -- Part 4: Oral Health
  active_decay       TEXT,
  decay_tooth_number TEXT,
  plaque_16b         NUMERIC(3,1),
  plaque_11la        NUMERIC(3,1),
  plaque_26b         NUMERIC(3,1),
  plaque_46li        NUMERIC(3,1),
  plaque_31la        NUMERIC(3,1),
  plaque_36li        NUMERIC(3,1),
  calculated_sohi    NUMERIC(3,1),
  appliances         TEXT,
  condition_improved TEXT,

  -- Part 5 & 6: Salivary & Plaque Tests
  saliva_amount      TEXT,
  buffer_capacity    TEXT,
  plaque_acid        TEXT,

  -- Result
  risk_level         TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessments_risk_level ON assessments(risk_level);
CREATE INDEX IF NOT EXISTS idx_assessments_personal_id ON assessments(personal_id);
CREATE INDEX IF NOT EXISTS idx_assessments_school ON assessments(school);

-- RLS
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON assessments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous reads" ON assessments
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous deletes" ON assessments
  FOR DELETE USING (true);

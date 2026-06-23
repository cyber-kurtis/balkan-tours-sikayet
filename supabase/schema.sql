-- SQL Script to initialize the PostgreSQL database inside Supabase

-- NOTE: If your database is already running, run the following ALTER TABLE queries 
-- in your Supabase SQL Editor to update your existing table structure:
-- 
-- ALTER TABLE balkan_sikayetleri ADD COLUMN IF NOT EXISTS sikayetci_adi TEXT;
-- ALTER TABLE balkan_sikayetleri ADD COLUMN IF NOT EXISTS acenta_adi TEXT;
-- ALTER TABLE balkan_sikayetleri ADD COLUMN IF NOT EXISTS tur_adi TEXT;
-- ALTER TABLE balkan_sikayetleri ADD COLUMN IF NOT EXISTS tur_tarihi TEXT;
-- ALTER TABLE balkan_sikayetleri ADD COLUMN IF NOT EXISTS sikayet_url TEXT;

-- Create balkan_sikayetleri table
CREATE TABLE IF NOT EXISTS balkan_sikayetleri (
    id BIGSERIAL PRIMARY KEY,
    sikayet_id TEXT UNIQUE NOT NULL,
    tarih TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    kaynak_site TEXT NOT NULL,
    baslik TEXT NOT NULL,
    icerik TEXT NOT NULL,
    anahtar_kelime TEXT,
    ai_kategori TEXT CHECK (ai_kategori IN ('Ulaşım', 'Rehber', 'Otel', 'Program Kayması', 'Alakasız')),
    ai_duygu_skoru TEXT CHECK (ai_duygu_skoru IN ('Kritik', 'Orta', 'Düşük')),
    durum TEXT DEFAULT 'Aktif' CHECK (durum IN ('Aktif', 'Arşiv')),
    sikayetci_adi TEXT,
    acenta_adi TEXT,
    tur_adi TEXT,
    tur_tarihi TEXT,
    sikayet_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for durum since we toggle between 'Aktif' and 'Arşiv'
CREATE INDEX IF NOT EXISTS idx_balkan_sikayetleri_durum ON balkan_sikayetleri(durum);

-- Index for tarih for cron archiving and ordering complaints by date
CREATE INDEX IF NOT EXISTS idx_balkan_sikayetleri_tarih ON balkan_sikayetleri(tarih);

-- Enable Row Level Security (RLS) if needed, or create policies
ALTER TABLE balkan_sikayetleri ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON balkan_sikayetleri
    FOR SELECT USING (true);

-- Allow public insert/update (or authenticated webhook insertion)
CREATE POLICY "Allow public inserts" ON balkan_sikayetleri
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public updates" ON balkan_sikayetleri
    FOR UPDATE USING (true);

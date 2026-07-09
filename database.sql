-- Buat tipe data enum untuk Kategori dan Status
CREATE TYPE license_category AS ENUM ('Software', 'Izin Usaha & Legalitas', 'Sertifikasi Profesi');
CREATE TYPE license_status AS ENUM ('Aktif', 'Akan Kadaluarsa', 'Kadaluarsa', 'Non-aktif');

-- Buat tabel licenses
CREATE TABLE licenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category license_category NOT NULL,
  license_number TEXT NOT NULL,
  owner TEXT NOT NULL,
  vendor TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  status license_status NOT NULL,
  notes TEXT,
  file_url TEXT,
  file_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Buat function untuk otomatis update kolom updated_at setiap ada perubahan data
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW; 
END;
$$ language 'plpgsql';

CREATE TRIGGER update_licenses_modtime
BEFORE UPDATE ON licenses
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();


-- Masukkan 12 data awal tiruan persis seperti di aplikasi (mockData)
INSERT INTO licenses (name, category, license_number, owner, vendor, issue_date, expiry_date, status, notes, file_url, file_name)
VALUES 
('Microsoft 365 Business Premium', 'Software', 'MS365-BP-2024-001', 'Divisi IT', 'Microsoft Corporation', '2025-01-15', '2026-01-15', 'Aktif', 'Lisensi untuk 50 user. Mencakup Office Apps, Teams, dan OneDrive.', '#', 'MS365_License_2025.pdf'),
('Adobe Creative Cloud Enterprise', 'Software', 'ADOBE-CC-ENT-2024-045', 'Divisi Marketing', 'Adobe Inc.', '2025-03-01', '2026-07-20', 'Akan Kadaluarsa', '10 seat license. Photoshop, Illustrator, Premiere Pro.', '#', 'Adobe_CC_Agreement.pdf'),
('Nomor Induk Berusaha (NIB)', 'Izin Usaha & Legalitas', 'NIB-9120412340001', 'Divisi Legal', 'OSS Kementerian Investasi', '2023-06-10', '2028-06-10', 'Aktif', 'NIB berlaku selama perusahaan beroperasi. Wajib update data berkala.', '#', 'NIB_Certificate.pdf'),
('Surat Izin Usaha Perdagangan (SIUP)', 'Izin Usaha & Legalitas', 'SIUP-503/11.74/PK/X/2022', 'Divisi Legal', 'Dinas Penanaman Modal DKI Jakarta', '2022-10-20', '2026-07-10', 'Akan Kadaluarsa', 'SIUP Menengah. Perlu perpanjangan segera.', '#', 'SIUP_2022.pdf'),
('Sertifikasi PMP - Budi Santoso', 'Sertifikasi Profesi', 'PMP-2847561', 'Budi Santoso - Divisi PMO', 'Project Management Institute (PMI)', '2024-02-14', '2027-02-14', 'Aktif', 'Sertifikasi Project Management Professional. Perlu 60 PDU untuk renewal.', '#', 'PMP_BudiSantoso.pdf'),
('Sertifikasi ISO 27001 Lead Auditor - Rina Wati', 'Sertifikasi Profesi', 'ISO27001-LA-ID-2023-188', 'Rina Wati - Divisi IT Security', 'IRCA / BSI Group', '2023-08-01', '2026-08-01', 'Aktif', 'Lead Auditor ISO 27001:2022. Berlaku 3 tahun.', '#', 'ISO27001_LA_RinaWati.pdf'),
('Slack Business+ Subscription', 'Software', 'SLK-BIZ-2024-077', 'Divisi IT', 'Salesforce (Slack)', '2025-04-01', '2026-04-01', 'Aktif', 'Langganan tahunan untuk 200 user.', '#', 'Slack_Invoice_2025.pdf'),
('Izin Mendirikan Bangunan (IMB) Gedung Kantor', 'Izin Usaha & Legalitas', 'IMB-01/1.784.51/2019', 'Divisi GA', 'Dinas CIPTA KARYA DKI Jakarta', '2019-03-15', '2029-03-15', 'Aktif', 'IMB untuk gedung kantor pusat 5 lantai. Berlaku permanen selama bangunan berdiri.', NULL, NULL),
('AutoCAD LT - Single License', 'Software', 'ACAD-LT-2024-032', 'Divisi Engineering', 'Autodesk Inc.', '2024-11-01', '2025-11-01', 'Kadaluarsa', 'Lisensi sudah expired. Perlu evaluasi apakah akan diperpanjang.', NULL, NULL),
('Sertifikasi AWS Solutions Architect - Dian P.', 'Sertifikasi Profesi', 'AWS-SAA-C03-2024-5512', 'Dian Permata - Divisi IT', 'Amazon Web Services', '2024-05-20', '2027-05-20', 'Aktif', 'AWS Certified Solutions Architect - Associate. Berlaku 3 tahun.', '#', 'AWS_SAA_DianPermata.pdf'),
('Tanda Daftar Perusahaan (TDP)', 'Izin Usaha & Legalitas', 'TDP-09.05.1.46.12345', 'Divisi Legal', 'Dinas Perindustrian dan Perdagangan', '2021-07-01', '2026-07-01', 'Kadaluarsa', 'TDP sudah expired per 1 Juli 2026. Segera perpanjang!', NULL, NULL),
('Jira Software Cloud Premium', 'Software', 'JIRA-PREM-2025-019', 'Divisi IT', 'Atlassian', '2025-06-01', '2026-06-01', 'Aktif', 'Premium plan untuk 100 user. Termasuk Advanced Roadmaps.', '#', 'Jira_Premium_Invoice.pdf');

-- Setup RLS (Row Level Security) agar tabel bisa diakses melalui Supabase anon key
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;

-- Untuk MVP: Izinkan semua orang membaca dan menulis data
CREATE POLICY "Allow public read access" ON licenses FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON licenses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON licenses FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON licenses FOR DELETE USING (true);

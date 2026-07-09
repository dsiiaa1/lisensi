const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const url = urlMatch ? urlMatch[1].trim() : '';
const key = keyMatch ? keyMatch[1].trim() : '';

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(url, key);

const mockLicenses = [
  { name: 'Microsoft 365 Business Premium', category: 'Software', license_number: 'MS365-BP-2024-001', owner: 'Divisi IT', vendor: 'Microsoft Corporation', issue_date: '2025-01-15', expiry_date: '2026-01-15', status: 'Aktif', notes: 'Lisensi untuk 50 user. Mencakup Office Apps, Teams, dan OneDrive.', file_url: '#', file_name: 'MS365_License_2025.pdf' },
  { name: 'Adobe Creative Cloud Enterprise', category: 'Software', license_number: 'ADOBE-CC-ENT-2024-045', owner: 'Divisi Marketing', vendor: 'Adobe Inc.', issue_date: '2025-03-01', expiry_date: '2026-07-20', status: 'Akan Kadaluarsa', notes: '10 seat license. Photoshop, Illustrator, Premiere Pro.', file_url: '#', file_name: 'Adobe_CC_Agreement.pdf' },
  { name: 'Nomor Induk Berusaha (NIB)', category: 'Izin Usaha & Legalitas', license_number: 'NIB-9120412340001', owner: 'Divisi Legal', vendor: 'OSS Kementerian Investasi', issue_date: '2023-06-10', expiry_date: '2028-06-10', status: 'Aktif', notes: 'NIB berlaku selama perusahaan beroperasi. Wajib update data berkala.', file_url: '#', file_name: 'NIB_Certificate.pdf' },
  { name: 'Surat Izin Usaha Perdagangan (SIUP)', category: 'Izin Usaha & Legalitas', license_number: 'SIUP-503/11.74/PK/X/2022', owner: 'Divisi Legal', vendor: 'Dinas Penanaman Modal DKI Jakarta', issue_date: '2022-10-20', expiry_date: '2026-07-10', status: 'Akan Kadaluarsa', notes: 'SIUP Menengah. Perlu perpanjangan segera.', file_url: '#', file_name: 'SIUP_2022.pdf' },
  { name: 'Sertifikasi PMP - Budi Santoso', category: 'Sertifikasi Profesi', license_number: 'PMP-2847561', owner: 'Budi Santoso - Divisi PMO', vendor: 'Project Management Institute (PMI)', issue_date: '2024-02-14', expiry_date: '2027-02-14', status: 'Aktif', notes: 'Sertifikasi Project Management Professional. Perlu 60 PDU untuk renewal.', file_url: '#', file_name: 'PMP_BudiSantoso.pdf' },
  { name: 'Sertifikasi ISO 27001 Lead Auditor - Rina Wati', category: 'Sertifikasi Profesi', license_number: 'ISO27001-LA-ID-2023-188', owner: 'Rina Wati - Divisi IT Security', vendor: 'IRCA / BSI Group', issue_date: '2023-08-01', expiry_date: '2026-08-01', status: 'Aktif', notes: 'Lead Auditor ISO 27001:2022. Berlaku 3 tahun.', file_url: '#', file_name: 'ISO27001_LA_RinaWati.pdf' },
  { name: 'Slack Business+ Subscription', category: 'Software', license_number: 'SLK-BIZ-2024-077', owner: 'Divisi IT', vendor: 'Salesforce (Slack)', issue_date: '2025-04-01', expiry_date: '2026-04-01', status: 'Aktif', notes: 'Langganan tahunan untuk 200 user.', file_url: '#', file_name: 'Slack_Invoice_2025.pdf' },
  { name: 'Izin Mendirikan Bangunan (IMB) Gedung Kantor', category: 'Izin Usaha & Legalitas', license_number: 'IMB-01/1.784.51/2019', owner: 'Divisi GA', vendor: 'Dinas CIPTA KARYA DKI Jakarta', issue_date: '2019-03-15', expiry_date: '2029-03-15', status: 'Aktif', notes: 'IMB untuk gedung kantor pusat 5 lantai. Berlaku permanen selama bangunan berdiri.' },
  { name: 'AutoCAD LT - Single License', category: 'Software', license_number: 'ACAD-LT-2024-032', owner: 'Divisi Engineering', vendor: 'Autodesk Inc.', issue_date: '2024-11-01', expiry_date: '2025-11-01', status: 'Kadaluarsa', notes: 'Lisensi sudah expired. Perlu evaluasi apakah akan diperpanjang.' },
  { name: 'Sertifikasi AWS Solutions Architect - Dian P.', category: 'Sertifikasi Profesi', license_number: 'AWS-SAA-C03-2024-5512', owner: 'Dian Permata - Divisi IT', vendor: 'Amazon Web Services', issue_date: '2024-05-20', expiry_date: '2027-05-20', status: 'Aktif', notes: 'AWS Certified Solutions Architect - Associate. Berlaku 3 tahun.', file_url: '#', file_name: 'AWS_SAA_DianPermata.pdf' },
  { name: 'Tanda Daftar Perusahaan (TDP)', category: 'Izin Usaha & Legalitas', license_number: 'TDP-09.05.1.46.12345', owner: 'Divisi Legal', vendor: 'Dinas Perindustrian dan Perdagangan', issue_date: '2021-07-01', expiry_date: '2026-07-01', status: 'Kadaluarsa', notes: 'TDP sudah expired per 1 Juli 2026. Segera perpanjang!' },
  { name: 'Jira Software Cloud Premium', category: 'Software', license_number: 'JIRA-PREM-2025-019', owner: 'Divisi IT', vendor: 'Atlassian', issue_date: '2025-06-01', expiry_date: '2026-06-01', status: 'Aktif', notes: 'Premium plan untuk 100 user. Termasuk Advanced Roadmaps.', file_url: '#', file_name: 'Jira_Premium_Invoice.pdf' },
  { name: 'Lisensi Kaspersky Endpoint Security', category: 'Software', license_number: 'KAS-EP-2025-883', owner: 'Divisi IT Security', vendor: 'Kaspersky Lab', issue_date: '2025-02-10', expiry_date: '2026-02-10', status: 'Aktif', notes: 'Antivirus dan endpoint protection untuk 150 perangkat.', file_url: '#', file_name: 'Kaspersky_License.pdf' },
  { name: 'Sertifikasi CEH - Ahmad Ridwan', category: 'Sertifikasi Profesi', license_number: 'ECC-CEH-391002', owner: 'Ahmad Ridwan - Divisi IT Security', vendor: 'EC-Council', issue_date: '2023-10-15', expiry_date: '2026-10-15', status: 'Aktif', notes: 'Certified Ethical Hacker v12.' },
  { name: 'Surat Izin Tempat Usaha (SITU)', category: 'Izin Usaha & Legalitas', license_number: 'SITU-503/44/2021', owner: 'Divisi GA', vendor: 'Pemerintah Daerah', issue_date: '2021-08-01', expiry_date: '2026-08-01', status: 'Akan Kadaluarsa', notes: 'SITU Kantor Cabang Bandung. Perlu diurus perpanjangannya bulan depan.' },
  { name: 'Sertifikat Laik Fungsi (SLF) Gedung', category: 'Izin Usaha & Legalitas', license_number: 'SLF-002/11/2020', owner: 'Divisi GA', vendor: 'Dinas Penanaman Modal', issue_date: '2020-11-20', expiry_date: '2025-11-20', status: 'Kadaluarsa', notes: 'Masa berlaku SLF habis, sedang dalam proses perpanjangan dengan konsultan.' },
  { name: 'Zoom Workplace Pro', category: 'Software', license_number: 'ZM-PRO-2025-412', owner: 'Divisi IT', vendor: 'Zoom Video Communications', issue_date: '2025-01-05', expiry_date: '2026-01-05', status: 'Aktif', notes: '20 Host License untuk keperluan meeting online.' },
  { name: 'Lisensi Cpanel/WHM', category: 'Software', license_number: 'CP-PREM-1120', owner: 'Divisi IT Infrastructure', vendor: 'cPanel, L.L.C.', issue_date: '2025-04-12', expiry_date: '2026-04-12', status: 'Aktif', notes: 'Lisensi Premier (up to 100 Accounts) untuk web server internal.' },
  { name: 'Sertifikasi Cisco CCNA - Surya', category: 'Sertifikasi Profesi', license_number: 'CSCO-11223344', owner: 'Surya Pratama - Divisi IT', vendor: 'Cisco Systems', issue_date: '2022-12-10', expiry_date: '2025-12-10', status: 'Kadaluarsa', notes: 'Sertifikasi CCNA sudah expired.' },
  { name: 'Izin Penyelenggaraan Sistem Elektronik (PSE)', category: 'Izin Usaha & Legalitas', license_number: 'PSE-KOMINFO-2023-010', owner: 'Divisi Legal', vendor: 'Kementerian Kominfo', issue_date: '2023-05-18', expiry_date: '2028-05-18', status: 'Aktif', notes: 'Tanda Daftar Penyelenggara Sistem Elektronik (TDPSE) untuk layanan digital perusahaan.' }
];

async function seed() {
  console.log('Clearing existing licenses...');
  const { error: delError } = await supabase.from('licenses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delError) console.error('Delete error:', delError);
  
  console.log('Inserting new licenses...');
  const { error: insError } = await supabase.from('licenses').insert(mockLicenses);
  if (insError) console.error('Insert error:', insError);
  else console.log('Seed complete!');
}
seed();

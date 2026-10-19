// Kode error validasi dari Data Contract v1 (jalur file dan API).
export const ValidationErrorCode = {
  REQUIRED: 'E001', // Kolom wajib kosong
  INVALID_FORMAT: 'E002', // Tipe atau format salah
  OUT_OF_RANGE: 'E003', // Nilai di luar rentang atau enum
  UNKNOWN_EMPLOYEE: 'E004', // employee_id tidak dikenal
  DUPLICATE_KEY: 'E005', // Kunci duplikat dalam file
  UNKNOWN_COLUMN: 'E006', // Kolom tidak dikenal atau hilang
} as const

// Kode error tingkat HTTP. USULAN: belum tercantum di Data Contract v1,
// perlu dikonfirmasi dan ditambahkan ke dokumen (kenaikan MINOR).
export const HttpErrorCode = {
  UNAUTHORIZED: 'E401',
  FORBIDDEN: 'E403',
  NOT_FOUND: 'E404',
  RATE_LIMITED: 'E429',
  INTERNAL: 'E500',
} as const

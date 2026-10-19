// Validation error codes from Data Contract v1 (file and API paths).
export const ValidationErrorCode = {
  REQUIRED: 'E001', // Required column is empty
  INVALID_FORMAT: 'E002', // Wrong type or format
  OUT_OF_RANGE: 'E003', // Value outside the range or enum
  UNKNOWN_EMPLOYEE: 'E004', // Unknown employee_id
  DUPLICATE_KEY: 'E005', // Duplicate key in file
  UNKNOWN_COLUMN: 'E006', // Unknown or missing column
} as const

// HTTP-level error codes. PROPOSAL: not yet listed in Data Contract v1; they need to be
// confirmed and added to the document (MINOR bump).
export const HttpErrorCode = {
  UNAUTHORIZED: 'E401',
  FORBIDDEN: 'E403',
  NOT_FOUND: 'E404',
  RATE_LIMITED: 'E429',
  INTERNAL: 'E500',
} as const

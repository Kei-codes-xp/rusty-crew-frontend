export interface KioskQRPayload {
  token:      string;   // random UUID — embedded in QR
  signature:  string;   // HMAC-SHA256(token + expires_at, APP_KEY)
  expires_at: string;   // ISO datetime — QR valid until this time
  issued_at:  string;   // ISO datetime — for display / debug
  kiosk_id:   string;   // identifies this kiosk device
}
 
// ── Scan result pushed from backend after employee scans QR ──────────────────
export interface ScanResult {
  id:          string;
  employeeName: string;
  action:      'clock_in' | 'clock_out';
  time:        string;   // formatted e.g. "08:41 AM"
  avatarColor: string;   // hex background for initials avatar
}
 
// ── Kiosk security badge ──────────────────────────────────────────────────────
export interface SecurityBadge {
  label: string;
  ok:    boolean;
}
 
// ── QR fetch state ────────────────────────────────────────────────────────────
export type QRStatus = 'loading' | 'ready' | 'refreshing' | 'error';
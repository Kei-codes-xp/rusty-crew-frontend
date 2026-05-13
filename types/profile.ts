// ── Profile extension fields added to Employee ────────────────────────────────
// These are new fields — add them to the existing Employee interface

export interface EmployeeProfile {
  // Avatar
  avatarUrl:       string | null;   // URL to uploaded image, null = use initials

  // Personalisation
  displayName:     string | null;   // preferred display name (overrides firstName)
  nickname:        string | null;   // informal name shown in greetings
  bio:             string | null;   // "About me" paragraph
  themeColor:      string | null;   // hex e.g. "#f5a623" — personalised accent

  // Contact
  phone:           string;
  emergency:       string;
}

// ── Profile update form ───────────────────────────────────────────────────────
export interface ProfileUpdateForm {
  displayName:  string;
  nickname:     string;
  bio:          string;
  themeColor:   string;
  phone:        string;
  emergency:    string;
}

// ── Password change form ──────────────────────────────────────────────────────
export interface PasswordChangeForm {
  currentPassword:      string;
  newPassword:          string;
  newPasswordConfirm:   string;
}

// ── Avatar upload state ───────────────────────────────────────────────────────
export type AvatarUploadStatus =
  | 'idle'
  | 'dragging'
  | 'previewing'
  | 'uploading'
  | 'success'
  | 'error';

export interface AvatarState {
  status:      AvatarUploadStatus;
  previewUrl:  string | null;   // local blob URL before upload
  savedUrl:    string | null;   // server URL after successful upload
  error:       string | null;
  file:        File   | null;
}

// ── Theme preset options ──────────────────────────────────────────────────────
export interface ThemePreset {
  label: string;
  value: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  { label: 'Amber',    value: '#f5a623' },
  { label: 'Emerald',  value: '#4ade80' },
  { label: 'Sky',      value: '#38bdf8' },
  { label: 'Violet',   value: '#a78bfa' },
  { label: 'Rose',     value: '#fb7185' },
  { label: 'Orange',   value: '#fb923c' },
  { label: 'Teal',     value: '#2dd4bf' },
  { label: 'Indigo',   value: '#818cf8' },
];



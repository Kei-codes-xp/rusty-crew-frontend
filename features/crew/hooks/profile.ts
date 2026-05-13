'use client';

import { useState, useCallback, useRef } from 'react';
import api from '@/lib/api';
import { Employee }           from '@/types';
import { ProfileUpdateForm, PasswordChangeForm, AvatarState } from '@/types/profile';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

interface UseProfileReturn {
  // State
  avatar:       AvatarState;
  saving:       boolean;
  savingPass:   boolean;
  error:        string | null;
  success:      string | null;
  passError:    string | null;
  passSuccess:  string | null;

  // Avatar actions
  onFileSelect:  (file: File) => void;
  onDrop:        (e: React.DragEvent) => void;
  onDragOver:    (e: React.DragEvent) => void;
  onDragLeave:   (e: React.DragEvent) => void;
  uploadAvatar:  () => Promise<void>;
  removeAvatar:  () => Promise<void>;
  cancelPreview: () => void;

  // Profile actions
  saveProfile:   (form: ProfileUpdateForm) => Promise<void>;
  changePassword:(form: PasswordChangeForm) => Promise<void>;
}

export function useProfile(
  employee: Employee,
  onUpdate: (updated: Partial<Employee>) => void,
): UseProfileReturn {

  // ── Avatar state ──────────────────────────────────────────────────────────
  const [avatar, setAvatar] = useState<AvatarState>({
    status:     'idle',
    previewUrl: null,
    savedUrl:   employee.avatarUrl,
    error:      null,
    file:       null,
  });

  // ── Form state ────────────────────────────────────────────────────────────
  const [saving,      setSaving]      = useState(false);
  const [savingPass,  setSavingPass]  = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [success,     setSuccess]     = useState<string | null>(null);
  const [passError,   setPassError]   = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);

  const prevBlobRef = useRef<string | null>(null);

  // ── Validate file ─────────────────────────────────────────────────────────
  function validateFile(file: File): string | null {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Only JPG, PNG, WebP, or GIF images are allowed.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'Image must be under 5 MB.';
    }
    return null;
  }

  // ── File selected (input or drop) ─────────────────────────────────────────
  const onFileSelect = useCallback((file: File) => {
    const err = validateFile(file);
    if (err) {
      setAvatar((prev) => ({ ...prev, status: 'error', error: err, file: null }));
      return;
    }

    // Revoke previous blob to avoid memory leak
    if (prevBlobRef.current) {
      URL.revokeObjectURL(prevBlobRef.current);
    }

    const previewUrl = URL.createObjectURL(file);
    prevBlobRef.current = previewUrl;

    setAvatar({
      status:     'previewing',
      previewUrl,
      savedUrl:   employee.avatarUrl,
      error:      null,
      file,
    });
  }, [employee.avatarUrl]);

  // ── Drag-and-drop ─────────────────────────────────────────────────────────
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAvatar((prev) => ({ ...prev, status: 'dragging' }));
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAvatar((prev) =>
      prev.status === 'dragging' ? { ...prev, status: 'idle' } : prev
    );
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  // ── Upload avatar to backend ──────────────────────────────────────────────
  const uploadAvatar = useCallback(async () => {
    if (!avatar.file) return;

    setAvatar((prev) => ({ ...prev, status: 'uploading', error: null }));

    try {
      const formData = new FormData();
      formData.append('avatar', avatar.file);

      const res = await api.post<{ avatarUrl: string }>(
        '/profile/avatar',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const savedUrl = res.data.avatarUrl;

      setAvatar({
        status:     'success',
        previewUrl: null,
        savedUrl,
        error:      null,
        file:       null,
      });

      onUpdate({ avatarUrl: savedUrl });

      // Revoke blob
      if (prevBlobRef.current) {
        URL.revokeObjectURL(prevBlobRef.current);
        prevBlobRef.current = null;
      }

    } catch (e: any) {
      setAvatar((prev) => ({
        ...prev,
        status: 'error',
        error: e?.response?.data?.message ?? 'Upload failed. Please try again.',
      }));
    }
  }, [avatar.file, onUpdate]);

  // ── Remove avatar ─────────────────────────────────────────────────────────
  const removeAvatar = useCallback(async () => {
    setAvatar((prev) => ({ ...prev, status: 'uploading', error: null }));
    try {
      await api.delete('/profile/avatar');
      setAvatar({
        status:     'idle',
        previewUrl: null,
        savedUrl:   null,
        error:      null,
        file:       null,
      });
      onUpdate({ avatarUrl: null });
    } catch (e: any) {
      setAvatar((prev) => ({
        ...prev,
        status: 'error',
        error: e?.response?.data?.message ?? 'Could not remove avatar.',
      }));
    }
  }, [onUpdate]);

  // ── Cancel preview ────────────────────────────────────────────────────────
  const cancelPreview = useCallback(() => {
    if (prevBlobRef.current) {
      URL.revokeObjectURL(prevBlobRef.current);
      prevBlobRef.current = null;
    }
    setAvatar((prev) => ({
      ...prev,
      status:     'idle',
      previewUrl: null,
      file:       null,
      error:      null,
    }));
  }, []);

  // ── Save profile info ─────────────────────────────────────────────────────
  const saveProfile = useCallback(async (form: ProfileUpdateForm) => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await api.patch<Employee>('/profile', form);
      onUpdate(res.data);
      setSuccess('Profile updated successfully.');
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  }, [onUpdate]);

  // ── Change password ───────────────────────────────────────────────────────
  const changePassword = useCallback(async (form: PasswordChangeForm) => {
    setPassError(null);
    setPassSuccess(null);

    if (form.newPassword !== form.newPasswordConfirm) {
      setPassError('New passwords do not match.');
      return;
    }
    if (form.newPassword.length < 8) {
      setPassError('New password must be at least 8 characters.');
      return;
    }

    setSavingPass(true);
    try {
      await api.patch('/profile/password', {
        current_password:      form.currentPassword,
        password:              form.newPassword,
        password_confirmation: form.newPasswordConfirm,
      });
      setPassSuccess('Password changed successfully.');
    } catch (e: any) {
      setPassError(e?.response?.data?.message ?? 'Failed to change password.');
    } finally {
      setSavingPass(false);
    }
  }, []);

  return {
    avatar,
    saving,
    savingPass,
    error,
    success,
    passError,
    passSuccess,
    onFileSelect,
    onDrop,
    onDragOver,
    onDragLeave,
    uploadAvatar,
    removeAvatar,
    cancelPreview,
    saveProfile,
    changePassword,
  };
}
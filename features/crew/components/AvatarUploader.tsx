'use client';

import { useRef }    from 'react';
import Avatar        from '@/components/Avatar';
import { Employee }  from '@/types';
import { AvatarState } from '@/types/profile';

interface AvatarUploaderProps {
  employee:      Employee;
  avatar:        AvatarState;
  onFileSelect:  (file: File) => void;
  onDrop:        (e: React.DragEvent) => void;
  onDragOver:    (e: React.DragEvent) => void;
  onDragLeave:   (e: React.DragEvent) => void;
  onUpload:      () => void;
  onRemove:      () => void;
  onCancel:      () => void;
}

export default function AvatarUploader({
  employee,
  avatar,
  onFileSelect,
  onDrop,
  onDragOver,
  onDragLeave,
  onUpload,
  onRemove,
  onCancel,
}: AvatarUploaderProps) {
  const inputRef   = useRef<HTMLInputElement>(null);
  const isUploading = avatar.status === 'uploading';
  const isPreviewing = avatar.status === 'previewing';
  const isDragging   = avatar.status === 'dragging';
  const accent       = employee.themeColor ?? '#f5a623';

  // The employee shown in the preview reflects the blob URL
  const previewEmployee: Employee = {
    ...employee,
    avatarUrl: avatar.previewUrl ?? avatar.savedUrl,
  };

  return (
    <div className="flex flex-col items-center gap-5">

      {/* ── Large avatar preview ── */}
      <div className="relative">
        <Avatar
          emp={previewEmployee}
          size={96}
          editable={!isUploading}
          loading={isUploading}
          onClick={() => inputRef.current?.click()}
        />

        {/* Remove button — shown when there's a saved avatar and not uploading */}
        {avatar.savedUrl && !isPreviewing && !isUploading && (
          <button
            onClick={onRemove}
            title="Remove photo"
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-200 hover:scale-110"
            style={{
              background: '#3d1a1a',
              border:     '1px solid #5a1a1a',
              color:      '#f87171',
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Drop zone ── */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !isUploading && inputRef.current?.click()}
        className="w-full rounded-xl transition-all duration-200 cursor-pointer select-none"
        style={{
          border:     `1.5px dashed ${isDragging ? accent : 'rgba(255,255,255,0.12)'}`,
          background: isDragging
            ? `rgba(${hexRgb(accent)}, 0.06)`
            : 'rgba(255,255,255,0.02)',
          padding:    '18px 16px',
          textAlign:  'center',
        }}
      >
        {isPreviewing ? (
          // Preview state — show file ready to upload
          <div className="flex flex-col items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatar.previewUrl!}
              alt="Preview"
              className="w-16 h-16 rounded-full object-cover mx-auto"
              style={{ border: `2px solid ${accent}` }}
            />
            <p className="text-xs font-semibold" style={{ color: accent }}>
              Looking good! Save this photo?
            </p>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {avatar.file?.name} · {formatSize(avatar.file?.size ?? 0)}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="text-2xl opacity-40">🖼</div>
            <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {isDragging ? 'Drop your photo here' : 'Drag & drop or tap to upload'}
            </p>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
              JPG, PNG, WebP, GIF · Max 5 MB
            </p>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
          e.target.value = ''; // reset so same file can be re-selected
        }}
      />

      {/* ── Error message ── */}
      {avatar.error && (
        <div
          className="w-full px-3 py-2.5 rounded-lg text-xs font-medium"
          style={{
            background: 'rgba(248,113,113,0.1)',
            border:     '1px solid rgba(248,113,113,0.25)',
            color:      '#f87171',
          }}
        >
          ⚠ {avatar.error}
        </div>
      )}

      {/* ── Success message ── */}
      {avatar.status === 'success' && (
        <div
          className="w-full px-3 py-2.5 rounded-lg text-xs font-medium"
          style={{
            background: 'rgba(74,222,128,0.08)',
            border:     '1px solid rgba(74,222,128,0.2)',
            color:      '#4ade80',
          }}
        >
          ✔ Profile photo updated
        </div>
      )}

      {/* ── Action buttons ── */}
      {isPreviewing && (
        <div className="flex gap-2 w-full">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg text-xs font-semibold transition-colors"
            style={{
              background: '#1e1e1e',
              border:     '1px solid #2a2a2a',
              color:      '#ccc',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onUpload}
            disabled={isUploading}
            className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
            style={{
              background: accent,
              color:      '#0f0f0f',
              border:     'none',
              opacity:    isUploading ? 0.6 : 1,
            }}
          >
            {isUploading ? 'Uploading…' : 'Save photo'}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatSize(bytes: number): string {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function hexRgb(hex: string): string {
  const c = hex.replace('#', '');
  return `${parseInt(c.slice(0,2),16)}, ${parseInt(c.slice(2,4),16)}, ${parseInt(c.slice(4,6),16)}`;
}
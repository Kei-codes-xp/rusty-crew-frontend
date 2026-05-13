'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/features/crew/hooks/profile';
import AvatarUploader from '@/features/crew/components/AvatarUploader';
import Avatar from '@/components/Avatar';
import RoleBadge from '@/components/RoleBadge';
import StatusBadge from '@/components/StatusBadge';
import { Employee } from '@/types';
import { THEME_PRESETS } from '@/types/profile';
import type { ProfileUpdateForm, PasswordChangeForm } from '@/types/profile';
import LogoutIcon from '@/components/LogoutIcon';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

// ── Style tokens matching project design ─────────────────────────────────────
const S = {
    section: {
        background: '#1a1a1a',
        border: '1px solid #252525',
        borderRadius: 14,
        padding: '18px 20px',
    } as React.CSSProperties,
    sectionTitle: {
        fontSize: 11,
        fontWeight: 700,
        color: '#555',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.1em',
        marginBottom: 16,
    },
    label: {
        fontSize: 10,
        fontWeight: 700,
        color: 'rgba(255,255,255,0.3)',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.1em',
        display: 'block',
        marginBottom: 6,
    },
    input: {
        width: '100%',
        padding: '10px 13px',
        borderRadius: 9,
        background: '#111',
        border: '1px solid rgba(255,255,255,0.08)',
        color: 'rgba(255,255,255,0.85)',
        fontSize: 13,
        fontFamily: 'inherit',
        outline: 'none',
        transition: 'border-color 0.15s',
    } as React.CSSProperties,
    textarea: {
        width: '100%',
        padding: '10px 13px',
        borderRadius: 9,
        background: '#111',
        border: '1px solid rgba(255,255,255,0.08)',
        color: 'rgba(255,255,255,0.85)',
        fontSize: 13,
        fontFamily: 'inherit',
        outline: 'none',
        resize: 'vertical' as const,
        minHeight: 80,
    } as React.CSSProperties,
    divider: {
        height: '1px',
        background: 'rgba(255,255,255,0.05)',
        margin: '20px 0',
    } as React.CSSProperties,
};



function FieldGroup({ children }: { children: React.ReactNode }) {
    return <div style={{ marginBottom: 14 }}>{children}</div>;
}

function SaveButton({
    onClick, loading, accent, children,
}: {
    onClick: () => void;
    loading: boolean;
    accent: string;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            style={{
                background: loading ? `${accent}66` : accent,
                color: '#0f0f0f',
                border: 'none',
                borderRadius: 9,
                padding: '10px 20px',
                fontSize: 13,
                fontWeight: 700,
                fontFamily: 'inherit',
                cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: '0.04em',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
            }}
        >
            {loading && (
                <span
                    style={{
                        width: 12, height: 12,
                        border: '2px solid rgba(0,0,0,0.25)',
                        borderTop: '2px solid rgba(0,0,0,0.7)',
                        borderRadius: '50%',
                        display: 'inline-block',
                        animation: 'spin 0.7s linear infinite',
                    }}
                />
            )}
            {children}
        </button>
    );
}

function FeedbackMsg({ msg, ok }: { msg: string; ok: boolean }) {
    return (
        <div style={{
            padding: '9px 13px',
            borderRadius: 9,
            fontSize: 12,
            fontWeight: 600,
            background: ok ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)',
            border: `1px solid ${ok ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.22)'}`,
            color: ok ? '#4ade80' : '#f87171',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
        }}>
            {ok ? '✔' : '⚠'} {msg}
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ProfilePage() {
    const { user, updateUser } = useAuth();




    function handleUpdate(updated: Partial<Employee>) {
        if (!user) return;
        updateUser(updated);
    }

    if (!user) return null;

    return (
        <ProfilePageInner
            employee={user}
            onUpdate={handleUpdate}
        />
    );
}

function ProfilePageInner({
    employee,
    onUpdate,
}: {
    employee: Employee;
    onUpdate: (u: Partial<Employee>) => void;
}) {
    const accent = employee.themeColor ?? '#f5a623';

    const profile = useProfile(employee, onUpdate);

    // ── Profile form state ────────────────────────────────────────────────────
    const [profileForm, setProfileForm] = useState<ProfileUpdateForm>({
        displayName: employee.displayName ?? '',
        nickname: employee.nickname ?? '',
        bio: employee.bio ?? '',
        themeColor: employee.themeColor ?? '#f5a623',
        phone: employee.phone ?? '',
        emergency: employee.emergency ?? '',
    });

    // ── Password form state ───────────────────────────────────────────────────
    const [passForm, setPassForm] = useState<PasswordChangeForm>({
        currentPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
    });
    const [showPass, setShowPass] = useState(false);

    const { logout } = useAuth();
    const router = useRouter();

    async function handleLogout() {
        try {
            await api.post('/auth/logout');
        } catch { }
        logout();
        router.push('/login');
    }

    return (
        <>
            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus, textarea:focus, select:focus {
          border-color: ${accent}80 !important;
          box-shadow: 0 0 0 3px ${accent}14 !important;
        }
      `}</style>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 32 }}>

                {/* ── Page header ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
                        My Profile
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <RoleBadge role={employee.role} />
                        <StatusBadge status={employee.status} />
                        <button onClick={handleLogout}>
                            <LogoutIcon />

                        </button>
                    </div>
                </div>

                {/* ── Identity card ── */}
                <div style={{
                    ...S.section,
                    background: `linear-gradient(135deg, #1a1a1a, #161616)`,
                    border: `1px solid rgba(255,255,255,0.07)`,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <Avatar emp={employee} size={56} />
                        <div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.9)', lineHeight: 1.2 }}>
                                {employee.displayName ?? employee.firstName} {employee.lastName}
                            </div>
                            {employee.nickname && (
                                <div style={{ fontSize: 12, color: accent, marginTop: 2 }}>
                                    "{employee.nickname}"
                                </div>
                            )}
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>
                                {employee.email}
                            </div>
                        </div>
                    </div>
                    {employee.bio && (
                        <div style={{
                            marginTop: 14,
                            paddingTop: 14,
                            borderTop: '1px solid rgba(255,255,255,0.05)',
                            fontSize: 13,
                            color: 'rgba(255,255,255,0.45)',
                            lineHeight: 1.6,
                        }}>
                            {employee.bio}
                        </div>
                    )}
                </div>

                {/* ── Avatar upload ── */}
                <div style={S.section}>
                    <div style={S.sectionTitle}>Profile Photo</div>
                    <AvatarUploader
                        employee={employee}
                        avatar={profile.avatar}
                        onFileSelect={profile.onFileSelect}
                        onDrop={profile.onDrop}
                        onDragOver={profile.onDragOver}
                        onDragLeave={profile.onDragLeave}
                        onUpload={profile.uploadAvatar}
                        onRemove={profile.removeAvatar}
                        onCancel={profile.cancelPreview}
                    />
                </div>

                {/* ── Personal info ── */}
                <div style={S.section}>
                    <div style={S.sectionTitle}>Personal Info</div>

                    {profile.success && <div style={{ marginBottom: 14 }}><FeedbackMsg msg={profile.success} ok /></div>}
                    {profile.error && <div style={{ marginBottom: 14 }}><FeedbackMsg msg={profile.error} ok={false} /></div>}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <FieldGroup>
                            <label style={S.label}>Display name</label>
                            <input
                                style={S.input}
                                placeholder={employee.firstName}
                                value={profileForm.displayName}
                                onChange={(e) => setProfileForm((p) => ({ ...p, displayName: e.target.value }))}
                            />
                        </FieldGroup>
                        <FieldGroup>
                            <label style={S.label}>Nickname</label>
                            <input
                                style={S.input}
                                placeholder="e.g. Mia"
                                value={profileForm.nickname}
                                onChange={(e) => setProfileForm((p) => ({ ...p, nickname: e.target.value }))}
                            />
                        </FieldGroup>
                    </div>

                    <FieldGroup>
                        <label style={S.label}>About me</label>
                        <textarea
                            style={S.textarea}
                            placeholder="Tell your team a little about yourself…"
                            value={profileForm.bio}
                            onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))}
                        />
                    </FieldGroup>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <FieldGroup>
                            <label style={S.label}>Phone</label>
                            <input
                                style={S.input}
                                type="tel"
                                placeholder="+63 9XX XXX XXXX"
                                value={profileForm.phone}
                                onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                            />
                        </FieldGroup>
                        <FieldGroup>
                            <label style={S.label}>Emergency contact</label>
                            <input
                                style={S.input}
                                type="tel"
                                placeholder="+63 9XX XXX XXXX"
                                value={profileForm.emergency}
                                onChange={(e) => setProfileForm((p) => ({ ...p, emergency: e.target.value }))}
                            />
                        </FieldGroup>
                    </div>

                    {/* ── Theme colour picker ── */}
                    <FieldGroup>
                        <label style={S.label}>Accent colour</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                            {THEME_PRESETS.map((preset) => {
                                const isSelected = profileForm.themeColor === preset.value;
                                return (
                                    <button
                                        key={preset.value}
                                        title={preset.label}
                                        onClick={() => setProfileForm((p) => ({ ...p, themeColor: preset.value }))}
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            background: preset.value,
                                            border: isSelected
                                                ? `2.5px solid rgba(255,255,255,0.9)`
                                                : '2.5px solid transparent',
                                            outline: isSelected
                                                ? `2px solid ${preset.value}`
                                                : 'none',
                                            outlineOffset: 2,
                                            cursor: 'pointer',
                                            transition: 'transform 0.15s',
                                            transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                                        }}
                                    />
                                );
                            })}
                            {/* Custom hex input */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 4 }}>
                                <input
                                    type="color"
                                    value={profileForm.themeColor}
                                    onChange={(e) => setProfileForm((p) => ({ ...p, themeColor: e.target.value }))}
                                    style={{
                                        width: 32, height: 32,
                                        borderRadius: '50%',
                                        border: 'none',
                                        padding: 0,
                                        background: 'none',
                                        cursor: 'pointer',
                                    }}
                                    title="Custom colour"
                                />
                                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
                                    {profileForm.themeColor}
                                </span>
                            </div>
                        </div>
                    </FieldGroup>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                        <SaveButton
                            onClick={() => profile.saveProfile(profileForm)}
                            loading={profile.saving}
                            accent={accent}
                        >
                            Save changes
                        </SaveButton>
                    </div>
                </div>

                {/* ── Password ── */}
                <div style={S.section}>
                    <div style={S.sectionTitle}>Change Password</div>

                    {profile.passSuccess && <div style={{ marginBottom: 14 }}><FeedbackMsg msg={profile.passSuccess} ok /></div>}
                    {profile.passError && <div style={{ marginBottom: 14 }}><FeedbackMsg msg={profile.passError} ok={false} /></div>}

                    <FieldGroup>
                        <label style={S.label}>Current password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPass ? 'text' : 'password'}
                                style={{ ...S.input, paddingRight: 40 }}
                                placeholder="Enter current password"
                                value={passForm.currentPassword}
                                onChange={(e) => setPassForm((p) => ({ ...p, currentPassword: e.target.value }))}
                            />
                            <button
                                onClick={() => setShowPass((v) => !v)}
                                style={{
                                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: 'rgba(255,255,255,0.25)', fontSize: 13, padding: 0, lineHeight: 1,
                                }}
                            >{showPass ? '🙈' : '👁'}</button>
                        </div>
                    </FieldGroup>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <FieldGroup>
                            <label style={S.label}>New password</label>
                            <input
                                type="password"
                                style={S.input}
                                placeholder="Min. 8 characters"
                                value={passForm.newPassword}
                                onChange={(e) => setPassForm((p) => ({ ...p, newPassword: e.target.value }))}
                            />
                        </FieldGroup>
                        <FieldGroup>
                            <label style={S.label}>Confirm new password</label>
                            <input
                                type="password"
                                style={S.input}
                                placeholder="Repeat new password"
                                value={passForm.newPasswordConfirm}
                                onChange={(e) => setPassForm((p) => ({ ...p, newPasswordConfirm: e.target.value }))}
                            />
                        </FieldGroup>
                    </div>

                    {/* Password strength bar */}
                    {passForm.newPassword && (
                        <PasswordStrength password={passForm.newPassword} accent={accent} />
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                        <SaveButton
                            onClick={() => profile.changePassword(passForm)}
                            loading={profile.savingPass}
                            accent={accent}
                        >
                            Update password
                        </SaveButton>
                    </div>
                </div>

                {/* ── Read-only info ── */}
                <div style={S.section}>
                    <div style={S.sectionTitle}>Account details</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {[
                            { label: 'Employee ID', value: `#${employee.id}` },
                            { label: 'Email', value: employee.email },
                            { label: 'Role', value: employee.role },
                            { label: 'Status', value: employee.status },
                            { label: 'Leave balance', value: `${employee.leaveBalance} days` },
                            { label: 'Pay type', value: employee.isSalaried ? 'Salaried' : 'Hourly' },
                        ].map(({ label, value }) => (
                            <div
                                key={label}
                                style={{
                                    background: '#111',
                                    borderRadius: 8,
                                    padding: '9px 12px',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                }}
                            >
                                <div style={{ fontSize: 9, color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 3 }}>
                                    {label}
                                </div>
                                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
                                    {value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

// ── Password strength indicator ───────────────────────────────────────────────
function PasswordStrength({ password, accent }: { password: string; accent: string }) {
    const score = [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[0-9]/.test(password),
        /[^A-Za-z0-9]/.test(password),
    ].filter(Boolean).length;

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['', '#f87171', '#fbbf24', '#60a5fa', '#4ade80'];

    return (
        <div style={{ marginTop: 8, marginBottom: 4 }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        style={{
                            flex: 1,
                            height: 3,
                            borderRadius: 2,
                            background: i <= score ? colors[score] : 'rgba(255,255,255,0.1)',
                            transition: 'background 0.3s',
                        }}
                    />
                ))}
            </div>
            <div style={{ fontSize: 10, color: colors[score] ?? '#555', fontWeight: 600 }}>
                {labels[score]}
            </div>
        </div>
    );
}
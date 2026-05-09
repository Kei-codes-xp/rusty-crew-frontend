'use client';

import { useEmployeeNotifications } from '@/features/notification/useCrewNotification';

const S = {
  card: {
    background: '#1a1a1a',
    border: '1px solid #252525',
    borderRadius: 12,
    padding: '14px 16px',
  } as React.CSSProperties,

  btnSm: {
    background: '#1e1e1e',
    color: '#ccc',
    border: '1px solid #2a2a2a',
    borderRadius: 6,
    padding: '5px 12px',
    fontSize: 11,
    cursor: 'pointer',
    fontFamily: 'inherit',
  } as React.CSSProperties,
};

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    dismiss,
    markAllRead,
    ICONS,
  } = useEmployeeNotifications();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 15, fontWeight: 700 }}>
          Notifications
          {unreadCount > 0 && (
            <span
              style={{
                background: '#f5a623',
                color: '#000',
                borderRadius: 10,
                padding: '1px 7px',
                fontSize: 11,
                fontWeight: 700,
                marginLeft: 6,
              }}
            >
              {unreadCount}
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button style={S.btnSm} onClick={markAllRead}>
            Mark all read
          </button>
        )}
      </div>

      {/* Empty state */}
      {notifications.length === 0 ? (
        <div
          style={{
            ...S.card,
            textAlign: 'center',
            color: '#444',
            fontSize: 13,
            padding: '3rem',
          }}
        >
          🔔 No notifications yet
        </div>
      ) : (
        notifications.map((n) => (
          <div
            key={n.id}
            style={{
              ...S.card,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              background: n.read ? '#1a1a1a' : '#1e180f',
              border: `1px solid ${n.read ? '#252525' : '#3d2a0a'}`,
            }}
          >
            {/* Icon */}
            <span style={{ fontSize: 22, flexShrink: 0 }}>
              {ICONS[n.type] ?? '🔔'}
            </span>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 13,
                  color: n.read ? '#888' : '#e8e8e8',
                  fontWeight: n.read ? 400 : 600,
                  marginBottom: 3,
                }}
              >
                {n.message}
              </div>
              <div style={{ fontSize: 11, color: '#444' }}>{n.time}</div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {!n.read && (
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#f5a623',
                  }}
                />
              )}

              {!n.read && (
                <button style={S.btnSm} onClick={() => dismiss(n.id)}>
                  Dismiss
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
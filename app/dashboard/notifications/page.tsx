"use client"
import { useState } from "react";
import { S } from "@/styles/dashboardStyles";
import { INITIAL_NOTIFICATIONS } from "@/features/notification/notification.data";
import { AppNotification } from "@/types/notification";



const NotificationsPage = () => {
    const [notifs, setNotifs] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>Notifications</div>
                <button style={S.btnSm} onClick={() => setNotifs(prev => prev.map(n => ({ ...n, read: true })))}>Mark all read</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {notifs.map(n => (
                    <div key={n.id} style={{
                        ...S.card, display: 'flex', alignItems: 'center', gap: 14,
                        borderColor: n.read ? '#1e1e1e' : '#3d2a0a',
                        background: n.read ? '#1a1a1a' : '#1e180f',
                    }}>
                        <div style={{ fontSize: 20 }}>
                            {n.type === 'late' ? '⏰' : n.type === 'swap' ? '🔄' : n.type === 'leave' ? '🏖' : n.type === 'shift' ? '📅' : '🔔'}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, color: n.read ? '#888' : '#e8e8e8', fontWeight: n.read ? 400 : 600 }}>{n.message}</div>
                            <div style={{ fontSize: 11, color: '#444', marginTop: 3 }}>{n.time}</div>
                        </div>
                        {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f5a623', flexShrink: 0 }} />}
                        <button style={S.btnSm} onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}>Dismiss</button>
                    </div>
                ))}
            </div>
        </div>

    );
}

export default NotificationsPage;
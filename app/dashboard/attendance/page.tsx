"use client"
import RoleBadge from "@/components/RoleBadge";
import StatusBadge from "@/components/StatusBadge";
import { useState } from "react";
import { useAttendance } from "@/features/attendance/useAttendance";
import { useDashboard } from "../useDashboard";
import { TODAY } from "@/constants/calendar";
import { S } from "@/styles/dashboardStyles";
import Avatar from "@/components/Avatar";



const AttendancePage = () => {
    const [manualEmpId, setManualEmpId] = useState('');
    const [manualTime, setManualTime] = useState('');
    const [manualType, setManualType] = useState<'in' | 'out'>('in');
    const attendanceHook = useAttendance();
    const { employees, activeEmployees } = useDashboard();
    const [showClockIn, setShowClockIn] = useState(false);


    const { timeLogs, setTimeLogs } = attendanceHook;




    function manualClock() {
        const emp = employees.find(e => e.id === parseInt(manualEmpId) && e.status === 'Active');
        if (!emp || !manualTime) return;
        setTimeLogs(prev => [...prev, {
            id: Date.now(), employeeId: emp.id, date: TODAY,
            clockIn: manualType === 'in' ? manualTime : null,
            clockOut: manualType === 'out' ? manualTime : null,
            hoursWorked: 0, overtime: 0, status: 'On time', method: 'Manual'
        }]);
    }


    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>Attendance Tracking</div>
                <button style={S.btn} onClick={() => setShowClockIn(true)}>QR Clock-in</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                {/* Manual entry */}
                <div style={S.card}>
                    <div style={S.h2}>Manual Time Entry</div>
                    <div style={S.fGroup}>
                        <label style={S.label}>Employee</label>
                        <select style={S.input} value={manualEmpId} onChange={e => setManualEmpId(e.target.value)}>
                            <option value="">Select employee</option>
                            {activeEmployees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
                        </select>
                    </div>
                    <div style={{ ...S.grid2, marginBottom: 14 }}>
                        <div><label style={S.label}>Time</label><input type="time" style={S.input} value={manualTime} onChange={e => setManualTime(e.target.value)} /></div>
                        <div><label style={S.label}>Type</label>
                            <select style={S.input} value={manualType} onChange={e => setManualType(e.target.value as 'in' | 'out')}>
                                <option value="in">Clock In</option><option value="out">Clock Out</option>
                            </select>
                        </div>
                    </div>
                    <button style={S.btn} onClick={manualClock}>Record</button>
                </div>

                {/* Today summary */}
                <div style={S.card}>
                    <div style={S.h2}>Today's Summary</div>
                    {[
                        { label: 'Clocked In', val: timeLogs.filter(l => l.date === TODAY && l.clockIn).length, color: '#4ade80' },
                        { label: 'On Time', val: timeLogs.filter(l => l.date === TODAY && l.status === 'On time').length, color: '#4ade80' },
                        { label: 'Late', val: timeLogs.filter(l => l.date === TODAY && l.status === 'Late').length, color: '#fb923c' },
                        { label: 'Not clocked', val: activeEmployees.length - timeLogs.filter(l => l.date === TODAY).length, color: '#f87171' },
                    ].map(s => (
                        <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1e1e1e' }}>
                            <span style={{ fontSize: 13, color: '#888' }}>{s.label}</span>
                            <span style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{s.val}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Logs table */}
            <div style={S.card}>
                <div style={S.h2}>Daily Attendance Log — {TODAY}</div>
                <table style={S.table}>
                    <thead><tr>
                        <th style={S.th}>Employee</th><th style={S.th}>Role</th>
                        <th style={S.th}>Clock In</th><th style={S.th}>Clock Out</th>
                        <th style={S.th}>Hours</th><th style={S.th}>Overtime</th>
                        <th style={S.th}>Method</th><th style={S.th}>Status</th>
                    </tr></thead>
                    <tbody>
                        {timeLogs.filter(l => l.date === TODAY).map(log => {
                            const emp = employees.find(e => e.id === log.employeeId);
                            if (!emp) return null;
                            return (
                                <tr key={log.id}>
                                    <td style={S.td}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Avatar emp={emp} size={24} />{emp.firstName} {emp.lastName}</div></td>
                                    <td style={S.td}><RoleBadge role={emp.role} /></td>
                                    <td style={S.td}>{log.clockIn || '—'}</td>
                                    <td style={S.td}>{log.clockOut || <span style={{ color: '#f5a623' }}>Active</span>}</td>
                                    <td style={S.td}>{log.hoursWorked > 0 ? `${log.hoursWorked.toFixed(1)}h` : '—'}</td>
                                    <td style={S.td}><span style={{ color: log.overtime > 0 ? '#fbbf24' : '#555' }}>{log.overtime > 0 ? `+${log.overtime.toFixed(1)}h` : '—'}</span></td>
                                    <td style={S.td}><span style={{ fontSize: 11, background: log.method === 'QR' ? '#1a2d1a' : '#2a2a1a', color: log.method === 'QR' ? '#4ade80' : '#fbbf24', padding: '2px 8px', borderRadius: 20 }}>{log.method}</span></td>
                                    <td style={S.td}><StatusBadge status={log.status} /></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendancePage; 
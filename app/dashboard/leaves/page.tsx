"use client"
import { S } from "@/styles/dashboardStyles";
import { useDashboard } from "../useDashboard";
import { TODAY } from "@/constants/calendar";
import { useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import Avatar from "@/components/Avatar";
import { useLeave } from "@/features/leave/useLeave";
import type { LeaveType } from "@/types/leave";

const LeavesPage = () => {
    const {
        employees,
        activeEmployees
    } = useDashboard();

    const {
        leaves,
        leaveForm,
        setLeaveForm,
        fileLeave,
        updateLeave,
        resetForm
    } = useLeave();
    const [addLeave, setAddLeave] = useState(false);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>Leave Management</div>
                <button style={S.btn} onClick={() => setAddLeave(true)}>+ File Leave</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 16 }}>
                {[
                    { label: 'Pending', val: leaves.filter(l => l.status === 'Pending').length, color: '#fbbf24' },
                    { label: 'Approved', val: leaves.filter(l => l.status === 'Approved').length, color: '#4ade80' },
                    { label: 'Denied', val: leaves.filter(l => l.status === 'Denied').length, color: '#f87171' },
                ].map(m => (
                    <div key={m.label} style={S.metric}>
                        <div style={{ fontSize: 11, color: '#555', marginBottom: 4 }}>{m.label}</div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: m.color }}>{m.val}</div>
                    </div>
                ))}
            </div>

            <div style={S.card}>
                <table style={S.table}>
                    <thead><tr>
                        <th style={S.th}>Employee</th><th style={S.th}>Type</th>
                        <th style={S.th}>From</th><th style={S.th}>To</th>
                        <th style={S.th}>Reason</th><th style={S.th}>Status</th><th style={S.th}>Action</th>
                    </tr></thead>
                    <tbody>
                        {leaves.map(l => {
                            const emp = employees.find(e => e.id === l.employeeId);
                            return (
                                <tr key={l.id}>
                                    <td style={S.td}>{emp?.firstName} {emp?.lastName}</td>
                                    <td style={S.td}><span style={{ fontSize: 11, background: '#1a1a2d', color: '#818cf8', padding: '2px 8px', borderRadius: 20 }}>{l.type}</span></td>
                                    <td style={S.td}>{l.from}</td>
                                    <td style={S.td}>{l.to}</td>
                                    <td style={S.td}><span style={{ color: '#555' }}>{l.reason}</span></td>
                                    <td style={S.td}><StatusBadge status={l.status} /></td>
                                    <td style={S.td}>
                                        {l.status === 'Pending' && (
                                            <div style={{ display: 'flex', gap: 5 }}>
                                                <button style={S.btn} onClick={() => updateLeave(l.id, 'Approved')}>Approve</button>
                                                <button style={S.btnDanger} onClick={() => updateLeave(l.id, 'Denied')}>Deny</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Leave balance per employee */}
            <div style={{ ...S.card, marginTop: 16 }}>
                <div style={S.h2}>Leave Balance</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
                    {activeEmployees.map(emp => (
                        <div key={emp.id} style={{ background: '#111', borderRadius: 8, padding: '10px 12px', border: '1px solid #1e1e1e' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                <Avatar emp={emp} size={24} />
                                <span style={{ fontSize: 12, fontWeight: 600 }}>{emp.firstName} {emp.lastName}</span>
                            </div>
                            <div style={{ fontSize: 11, color: '#555' }}>Remaining: <span style={{ color: '#4ade80', fontWeight: 700 }}>{emp.leaveBalance} days</span></div>
                        </div>
                    ))}
                </div>
            </div>

            {addLeave && (
                <div style={S.modal} onClick={() => setAddLeave(false)}>
                    <div style={S.mCard} onClick={e => e.stopPropagation()}>
                        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>File Leave Request</div>
                        <div style={S.fGroup}><label style={S.label}>Leave Type</label>
                            <select
                                style={S.input}
                                value={leaveForm.type}
                                onChange={e =>
                                    setLeaveForm(prev => ({
                                        ...prev,
                                        type: e.target.value as LeaveType
                                    }))
                                }
                            >
                                <option>Vacation</option><option>Sick</option><option>Emergency</option>
                            </select>
                        </div>
                        <div style={{ ...S.grid2, marginBottom: 14 }}>
                            <div><label style={S.label}>From</label><input type="date" style={S.input} value={leaveForm.from} onChange={e => setLeaveForm({ ...leaveForm, from: e.target.value })} /></div>
                            <div><label style={S.label}>To</label><input type="date" style={S.input} value={leaveForm.to} onChange={e => setLeaveForm({ ...leaveForm, to: e.target.value })} /></div>
                        </div>
                        <div style={S.fGroup}><label style={S.label}>Reason</label>
                            <input style={S.input} placeholder="Brief reason..." value={leaveForm.reason} onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })} />
                        </div>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
                            <button style={S.btnSm} onClick={() => setAddLeave(false)}>Cancel</button>
                            <button
                                style={S.btn}
                                onClick={() => {
                                    const emp = employees.find(e => e.status === 'Active');
                                    if (!emp) return;

                                    fileLeave(emp);
                                }}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}



export default LeavesPage;
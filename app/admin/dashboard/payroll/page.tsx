"use client"

import Avatar from "@/components/Avatar";
import RoleBadge from "@/components/RoleBadge";
import { Employee } from "@/types/employee";
import { useState } from "react";
import { S } from "@/styles/dashboardStyles";
import { useDashboard } from "../useDashboard";
import { TODAY } from "@/constants/calendar";
import { getPayroll } from "@/utils/payroll";



const PayrollPage = () => {
  const [showPayslip, setShowPayslip] = useState<Employee | null>(null);
  const payslipEmp = showPayslip;
  const payslipData = payslipEmp ? getPayroll(payslipEmp) : null;

  const {
    timeLogs,
    activeEmployees,
  } = useDashboard();

  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Payroll & Salary</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Total payroll est.', val: `₱${activeEmployees.reduce((s, e) => s + getPayroll(e).gross, 0).toLocaleString()}` },
          { label: 'Total hours', val: `${timeLogs?.reduce((s, l) => s + l.hoursWorked, 0).toFixed(0)}h` },
          { label: 'Overtime hours', val: `${timeLogs?.reduce((s, l) => s + l.overtime, 0).toFixed(1)}h` },
        ].map(m => (
          <div key={m.label} style={S.metric}>
            <div style={{ fontSize: 11, color: '#555', marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#f5a623' }}>{m.val}</div>
          </div>
        ))}
      </div>

      <div style={S.card}>
        <table style={S.table}>
          <thead><tr>
            <th style={S.th}>Employee</th><th style={S.th}>Role</th>
            <th style={S.th}>Type</th><th style={S.th}>Rate</th>
            <th style={S.th}>Hrs</th><th style={S.th}>Base</th>
            <th style={S.th}>OT Pay</th><th style={S.th}>Gross</th>
            <th style={S.th}>Payslip</th>
          </tr></thead>
          <tbody>
            {activeEmployees.map(emp => {
              const p = getPayroll(emp);
              return (
                <tr key={emp.id}>
                  <td style={S.td}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Avatar emp={emp} size={24} />{emp.firstName} {emp.lastName}</div></td>
                  <td style={S.td}><RoleBadge role={emp.role} /></td>
                  <td style={S.td}><span style={{ color: '#888', fontSize: 11 }}>{emp.isSalaried ? 'Salaried' : 'Hourly'}</span></td>
                  <td style={S.td}>{emp.isSalaried ? `₱${emp.monthlySalary.toLocaleString()}/mo` : `₱${emp.hourlyRate}/hr`}</td>
                  <td style={S.td}>{p.totalHrs.toFixed(1)}h</td>
                  <td style={S.td}>₱{p.base.toLocaleString()}</td>
                  <td style={S.td}><span style={{ color: p.otPay > 0 ? '#fbbf24' : '#444' }}>{p.otPay > 0 ? `₱${p.otPay.toFixed(0)}` : '-'}</span></td>
                  <td style={S.td}><span style={{ color: '#4ade80', fontWeight: 700 }}>₱{p.gross.toLocaleString()}</span></td>
                  <td style={S.td}><button style={S.btnSm} onClick={() => setShowPayslip(emp)}>View</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Payslip modal */}
      {payslipEmp && payslipData && (
        <div style={S.modal} onClick={() => setShowPayslip(null)}>
          <div style={{ ...S.mCard, width: 360 }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #222' }}>
              <div style={{ fontSize: 18 }}>☕</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginTop: 4 }}>BrewCrew</div>
              <div style={{ color: '#555', fontSize: 11 }}>PAYSLIP — {TODAY.slice(0, 7)}</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: '#f5a623' }}>{payslipEmp.firstName} {payslipEmp.lastName}</div>
            <div style={{ fontSize: 11, color: '#555', marginBottom: 16 }}>{payslipEmp.role} · {payslipEmp.isSalaried ? 'Salaried' : 'Hourly'}</div>
            {[
              ['Hours worked', `${payslipData.totalHrs.toFixed(1)}h`, '#888'],
              ['Overtime hours', `${payslipData.otHrs.toFixed(1)}h`, '#fbbf24'],
              ['Base pay', `₱${payslipData.base.toLocaleString()}`, '#ccc'],
              ['Overtime pay', `₱${payslipData.otPay.toFixed(0)}`, '#fbbf24'],
              ['Gross pay', `₱${payslipData.gross.toLocaleString()}`, '#4ade80'],
            ].map(([k, v, c]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #1e1e1e' }}>
                <span style={{ fontSize: 12, color: '#555' }}>{k}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: c }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button style={S.btnSm} onClick={() => setShowPayslip(null)}>Close</button>
              <button style={S.btn} onClick={() => alert('PDF export — connect to /api/payroll/payslip/{id}')}>Export PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollPage;
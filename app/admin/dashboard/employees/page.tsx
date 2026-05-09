"use client"
import { useState } from "react";
import { S } from "@/styles/dashboardStyles";

import Avatar from "@/components/Avatar";
import RoleBadge from "@/components/RoleBadge";
import StatusBadge from "@/components/StatusBadge";
import { Employee, NewEmployeeForm } from "@/types/employee";
import { useEmployees } from "@/features/employees/useEmployees";
import AddEmployeeModal from "@/features/employees/AddEmployeeModal";
import QrModal from "@/features/employees/QrModal";

const EmployeesPage = () => {

  const {
    employees,
    resignEmployee,
    addEmployee,
    fetchQr,
    qrUrl,
    showQrModal,
    setShowQrModal,

  } = useEmployees();
  const [editEmp, setEditEmp] = useState<Employee | null>(null);
  const [showAddEmp, setShowAddEmp] = useState(false);

  const [newEmp, setNewEmp] = useState<NewEmployeeForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    emergency: "",
    role: "Barista",
    hourlyRate: 80,
    isSalaried: false,
    monthlySalary: 0,
    pin: "",
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700 }}>Employees</div>
        <button style={S.btn} onClick={() => setShowAddEmp(true)}>+ Add Employee</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 12 }}>
        {employees.map(emp => (
          <div key={emp.id} style={{ ...S.card, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <Avatar emp={emp} size={42} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#e8e8e8' }}>{emp.firstName} {emp.lastName}</div>
                <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>{emp.email}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
              <RoleBadge role={emp.role} />
              <StatusBadge status={emp.status} />
            </div>
            <div style={{ fontSize: 12, color: '#555', lineHeight: 1.9 }}>
              <div>📱 {emp.phone}</div>
              <div>🆘 {emp.emergency}</div>
              <div>💰 {emp.isSalaried ? `₱${emp.monthlySalary.toLocaleString()}/mo` : `₱${emp.hourlyRate}/hr`}</div>
              <div>🏖 {emp.leaveBalance} leave days left</div>
              <div>🔑 QR: <span style={{ color: '#f5a623', fontFamily: 'monospace' }}>{emp.qrToken}</span></div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, paddingTop: 10, borderTop: '1px solid #222' }}>
              <button style={S.btnSm} onClick={() => setEditEmp(emp)}>Edit</button>
              {emp.status === 'Active' && (
                <button
                  style={S.btnDanger}
                  onClick={() => resignEmployee(emp.id)}
                >
                  Resign
                </button>
              )}
              <button
                onClick={() => fetchQr(emp.id)}
                className="flex-1 text-gray-50 text-xs border border-[#3A3A3A] rounded-lg py-1.5 hover:bg-gray-500 text-center"
              >
                QR code
              </button>

            </div>
          </div>
        ))}
      </div>
      <AddEmployeeModal
        show={showAddEmp}
        setShow={setShowAddEmp}
        newEmp={newEmp}
        setNewEmp={setNewEmp}
        addEmployee={addEmployee}
      />

      <QrModal
        qrUrl={qrUrl}
        show={showQrModal}
        onClose={() => setShowQrModal(false)}

      />
    </div>
  )
};


export default EmployeesPage;
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
  const [search, setSearch] = useState("");

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

  const filtered = employees.filter(emp =>
    `${emp.firstName} ${emp.lastName} ${emp.email} ${emp.role}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const activeCount = employees.filter(e => e.status === "Active").length;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Header ── */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: 24,
        gap: 16,
        flexWrap: "wrap",
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: "#555", textTransform: "uppercase", marginBottom: 4 }}>
            Team Management
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#e8e8e8", lineHeight: 1.1 }}>
            Employees
          </div>
          <div style={{ fontSize: 12, color: "#555", marginTop: 5 }}>
            <span style={{ color: "#4ade80", fontWeight: 600 }}>{activeCount}</span> active &nbsp;·&nbsp; {employees.length} total
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          {/* Search */}
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
              fontSize: 13, color: "#555", pointerEvents: "none",
            }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search employees…"
              style={{
                background: "#111",
                border: "1px solid #2a2a2a",
                borderRadius: 8,
                color: "#e8e8e8",
                fontSize: 12,
                padding: "7px 12px 7px 30px",
                width: 200,
                outline: "none",
              }}
            />
          </div>

          <button
            onClick={() => setShowAddEmp(true)}
            style={{
              background: "linear-gradient(135deg, #f5a623, #e8920f)",
              border: "none",
              borderRadius: 8,
              color: "#111",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.04em",
              padding: "8px 16px",
              whiteSpace: "nowrap",
              boxShadow: "0 2px 12px rgba(245,166,35,0.25)",
            }}
          >
            + Add Employee
          </button>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        gap: 10,
        marginBottom: 24,
      }}>
        {[
          { label: "Active", value: employees.filter(e => e.status === "Active").length, color: "#4ade80" },
          { label: "Resigned", value: employees.filter(e => e.status !== "Active").length, color: "#f87171" },
          { label: "Salaried", value: employees.filter(e => e.isSalaried).length, color: "#60a5fa" },
          { label: "Hourly", value: employees.filter(e => !e.isSalaried).length, color: "#f5a623" },
        ].map(stat => (
          <div key={stat.label} style={{
            background: "#111",
            border: "1px solid #1e1e1e",
            borderRadius: 10,
            padding: "12px 16px",
          }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 10, color: "#555", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Employee Cards ── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", color: "#444", fontSize: 13, padding: "60px 0" }}>
          No employees found.
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))",
          gap: 14,
        }}>
          {filtered.map(emp => (
            <div
              key={emp.id}
              style={{
                background: "#111",
                border: "1px solid #1e1e1e",
                borderRadius: 14,
                padding: 18,
                position: "relative",
                transition: "border-color 0.2s, box-shadow 0.2s",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "#2e2e2e";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.4)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "#1e1e1e";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              {/* Status dot */}
              <div style={{
                position: "absolute", top: 16, right: 16,
                width: 8, height: 8, borderRadius: "50%",
                background: emp.status === "Active" ? "#4ade80" : "#f87171",
                boxShadow: emp.status === "Active" ? "0 0 6px #4ade80" : "0 0 6px #f87171",
              }} />

              {/* Avatar + Name */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <Avatar emp={emp} size={44} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#e8e8e8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {emp.firstName} {emp.lastName}
                  </div>
                  <div style={{ fontSize: 11, color: "#444", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {emp.email}
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                <RoleBadge role={emp.role} />
                <StatusBadge status={emp.status} />
              </div>

              {/* Info rows */}
              <div style={{
                background: "#0d0d0d",
                border: "1px solid #1a1a1a",
                borderRadius: 8,
                padding: "10px 12px",
                marginBottom: 14,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}>
                {[
                  { icon: "📱", value: emp.phone },
                  { icon: "🆘", value: emp.emergency },
                  {
                    icon: "💰",
                    value: emp.isSalaried
                      ? `₱${emp.monthlySalary.toLocaleString()}/mo`
                      : `₱${emp.hourlyRate}/hr`,
                    highlight: true,
                  },
                  { icon: "🏖", value: `${emp.leaveBalance} leave days left` },
                ].map((row, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11.5 }}>
                    <span style={{ fontSize: 13 }}>{row.icon}</span>
                    <span style={{ color: row.highlight ? "#f5a623" : "#4a4a4a", fontWeight: row.highlight ? 600 : 400 }}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* QR token */}
              {/* <div style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 14,
                padding: "6px 10px",
                background: "rgba(245,166,35,0.06)",
                border: "1px solid rgba(245,166,35,0.15)",
                borderRadius: 6,
              }}>
                <span style={{ fontSize: 11, color: "#555" }}>🔑 QR</span>
                <span style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  color: "#f5a623",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flex: 1,
                }}>
                  {emp.qrToken}
                </span>
              </div> */}

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                <button
                  onClick={() => setEditEmp(emp)}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "1px solid #2a2a2a",
                    borderRadius: 7,
                    color: "#aaa",
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "7px 0",
                    transition: "border-color 0.15s, color 0.15s",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#444";
                    (e.currentTarget as HTMLButtonElement).style.color = "#e8e8e8";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a2a";
                    (e.currentTarget as HTMLButtonElement).style.color = "#aaa";
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => fetchQr(emp.id)}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "1px solid rgba(245,166,35,0.3)",
                    borderRadius: 7,
                    color: "#f5a623",
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "7px 0",
                    transition: "background 0.15s, border-color 0.15s",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(245,166,35,0.08)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#f5a623";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(245,166,35,0.3)";
                  }}
                >
                  QR Code
                </button>

                {emp.status === "Active" && (
                  <button
                    onClick={() => resignEmployee(emp.id)}
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: "1px solid rgba(248,113,113,0.3)",
                      borderRadius: 7,
                      color: "#f87171",
                      cursor: "pointer",
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "7px 0",
                      transition: "background 0.15s, border-color 0.15s",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(248,113,113,0.08)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "#f87171";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(248,113,113,0.3)";
                    }}
                  >
                    Resign
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

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
  );
};

export default EmployeesPage;
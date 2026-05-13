"use client";

import React, { useState } from "react";
import { useDashboard } from "@/app/admin/dashboard/useDashboard";

import Avatar from "@/components/Avatar";
import RoleBadge from "@/components/RoleBadge";
import StatusBadge from "@/components/StatusBadge";
import { S } from "@/styles/dashboardStyles";
import { useSchedule } from "@/features/schedule/useSchedule";
import { getWeekDates } from "@/utils/date";


const DashboardPage = () => {

  const {
    employees,
    timeLogs,
    todayLogs,
    totalHoursWeek,
    activeEmployees,
    weekDates,
    weekStart,

  } = useDashboard();

  console.log("timeLogs", timeLogs)

  const {
    swaps,
    handleSwap,
  } = useSchedule(weekStart);

  const TODAY = new Date().toISOString().slice(0, 10);
  const safeEmployees = Array.isArray(employees) ? employees : [];


  return (
    <div>
      {/* Metrics */}
      <div style={S.grid4}>
        {[
          {
            label: "Total staff",
            val: safeEmployees.length,
            sub: `${activeEmployees.length} active · ${safeEmployees.filter(e => e.status === "Resigned").length
              } resigned`,
          },
          {
            label: "On shift today",
            val: todayLogs?.filter(l => !l.clockOut).length ?? 0,
            sub: "Currently clocked in",
          },
          {
            label: "Hours this week",
            val: Math.round(totalHoursWeek),
            sub: "Across all staff",
          },
          {
            label: "Pending swaps",
            val: swaps.filter(s => s.status === "Pending").length,
            sub: "Needs approval",
          },
        ].map(m => (
          <div key={m.label} style={S.metric}>
            <div style={{ fontSize: 12, color: "#555", marginBottom: 6 }}>
              {m.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#e8e8e8" }}>
              {m.val}
            </div>
            <div style={{ fontSize: 11, color: "#444", marginTop: 4 }}>
              {m.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Today's Shifts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={S.card}>
          <div style={S.h2}>Today's Shifts</div>

          {todayLogs?.length === 0 && (
            <div style={{ color: "#FFFFFF", fontSize: 13 }}>
              No clock-ins today
            </div>
          )}

          {todayLogs?.map(log => {
            const emp = safeEmployees.find(e => e.id === log.employeeId);
            if (!emp) return null;

            return (
              <div key={log.id} style={{ ...S.row, gap: 12 }}>
                <Avatar emp={emp} size={34} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "white", }}>
                    {emp.firstName} {emp.lastName}
                  </div>
                  <div style={{ fontSize: 11, color: "#555" }}>
                    {log.clockIn} – {log.clockOut || "active"}
                  </div>
                </div>
                <RoleBadge role={emp.role} />
              </div>
            );
          })}
        </div>
        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Pending Swaps */}
          <div style={S.card}>
            <div style={S.h2}>Pending Shift Swaps</div>

            {swaps.filter(s => s.status === "Pending").map(swap => {
              const req = safeEmployees.find(e => e.id === swap.requesterId);
              const tgt = safeEmployees.find(e => e.id === swap.targetId);
              if (!req || !tgt) return null;

              return (
                <div
                  key={swap.id}
                  style={{
                    ...S.row,
                    gap: 10,
                    alignItems: "flex-start",
                    paddingBottom: 10,
                  }}
                >
                  <Avatar emp={req} size={30} />

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#e8e8e8" }}>
                      {req.firstName} → {tgt.firstName}
                    </div>
                    <div style={{ fontSize: 11, color: "#555" }}>
                      {swap.date} · {swap.shiftType}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 5 }}>
                    <button
                      style={S.btn}
                      onClick={() => handleSwap(swap.id, "Approved")}
                    >
                      Approve
                    </button>

                    <button
                      style={S.btnDanger}
                      onClick={() => handleSwap(swap.id, "Denied")}
                    >
                      Deny
                    </button>
                  </div>
                </div>
              );
            })}

            {swaps.filter(s => s.status === "Pending").length === 0 && (
              <div style={{ color: "#444", fontSize: 13 }}>
                No pending swaps
              </div>
            )}
          </div>

          {/* Recent Clock-ins */}
          <div style={S.card}>
            <div style={S.h2}>Recent Clock-ins</div>

            {todayLogs?.slice(0, 3).map(log => {
              const emp = safeEmployees.find(e => e.id === log.employeeId);
              if (!emp) return null;

              return (
                <div key={log.id} style={{ ...S.row, gap: 10 }}>
                  <Avatar emp={emp} size={30} />

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#e8e8e8" }}>
                      {emp.firstName} {emp.lastName}
                    </div>
                    <div style={{ fontSize: 11, color: "#555" }}>
                      Clocked in · {log.clockIn} via {log.method}
                    </div>
                  </div>

                  <StatusBadge status={log.status} />
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Performance */}
      <div style={{ ...S.card, marginTop: 16 }}>
        <div style={S.h2}>Employee Performance Overview</div>

        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Employee</th>
              <th style={S.th}>Role</th>
              <th style={S.th}>Hrs Worked</th>
              <th style={S.th}>Status</th>
            </tr>
          </thead>

          <tbody>
            {activeEmployees.map(emp => {
              const logs = timeLogs?.filter(l => l.employeeId === emp.id);
              const hrs = logs?.reduce((s, l) => s + l.hoursWorked, 0) ?? 0;

              return (
                <tr key={emp.id}>
                  <td style={S.td}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Avatar emp={emp} size={26} />
                      {emp.firstName} {emp.lastName}
                    </div>
                  </td>
                  <td style={S.td}>
                    <RoleBadge role={emp.role} />
                  </td>
                  <td style={S.td}>{hrs.toFixed(1)}h</td>
                  <td style={S.td}>
                    <StatusBadge status={emp.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
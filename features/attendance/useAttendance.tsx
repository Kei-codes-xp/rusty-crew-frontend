import { useState } from "react";
import { TimeLog } from "@/types/attendance";
import { TODAY, INITIAL_TIMELOGS } from "@/app/dashboard/data";

export function useAttendance() {
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>(INITIAL_TIMELOGS);

  function clock(empId: number) {
    const existing = timeLogs.find(
      l => l.employeeId === empId && l.date === TODAY && !l.clockOut
    );

    if (existing) {
      setTimeLogs(prev =>
        prev.map(l =>
          l.id === existing.id
            ? { ...l, clockOut: "17:00", hoursWorked: 8 }
            : l
        )
      );
    } else {
      setTimeLogs(prev => [
        ...prev,
        {
          id: Date.now(),
          employeeId: empId,
          date: TODAY,
          clockIn: "08:00",
          clockOut: null,
          hoursWorked: 0,
          overtime: 0,
          status: "On time",
          method: "QR",
        },
      ]);
    }
  }

  return { timeLogs, clock, setTimeLogs };
}
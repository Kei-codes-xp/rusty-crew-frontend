'use client';
import { NewEmployeeForm, Role } from "@/types/employee";
import { S } from "@/styles/dashboardStyles";

type Props = {
  show: boolean;
  setShow: (v: boolean) => void;
  newEmp: NewEmployeeForm;
  setNewEmp: React.Dispatch<React.SetStateAction<NewEmployeeForm>>;
  addEmployee: (emp: NewEmployeeForm) => void;
};

export default function AddEmployeeModal({
  show,
  setShow,
  newEmp,
  setNewEmp,
  addEmployee,
}: Props) {
  if (!show) return null;

  return (
    <div style={S.modal} onClick={() => setShow(false)}>
      <div style={S.mCard} onClick={(e) => e.stopPropagation()}>

        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>
          Add New Employee
        </div>

        <div style={S.grid2}>
          <div style={S.fGroup}>
            <label style={S.label}>First name</label>
            <input
              style={S.input}
              value={newEmp.firstName}
              onChange={(e) =>
                setNewEmp({ ...newEmp, firstName: e.target.value })
              }
            />
          </div>

          <div style={S.fGroup}>
            <label style={S.label}>Last name</label>
            <input
              style={S.input}
              value={newEmp.lastName}
              onChange={(e) =>
                setNewEmp({ ...newEmp, lastName: e.target.value })
              }
            />
          </div>
        </div>

        <div style={S.fGroup}><label style={S.label}>Email</label><input type="email" style={S.input} value={newEmp.email} onChange={e => setNewEmp({ ...newEmp, email: e.target.value })} placeholder="ana@brewcrew.ph" /></div>
        <div style={S.grid2}>
          <div style={S.fGroup}><label style={S.label}>Phone</label><input style={S.input} value={newEmp.phone} onChange={e => setNewEmp({ ...newEmp, phone: e.target.value })} placeholder="+63 9XX..." /></div>
          <div style={S.fGroup}><label style={S.label}>Emergency contact</label><input style={S.input} value={newEmp.emergency} onChange={e => setNewEmp({ ...newEmp, emergency: e.target.value })} placeholder="+63 9XX..." /></div>
        </div>
        <div style={S.grid2}>
          <div style={S.fGroup}><label style={S.label}>Role</label>
            <select style={S.input} value={newEmp.role} onChange={e => setNewEmp({ ...newEmp, role: e.target.value as Role })}>
              <option>Barista</option><option>Cashier</option><option>Manager</option><option>Admin</option>
            </select>
          </div>
          <div style={S.fGroup}><label style={S.label}>Pay type</label>
            <select style={S.input} value={newEmp.isSalaried ? 'salaried' : 'hourly'} onChange={e => setNewEmp({ ...newEmp, isSalaried: e.target.value === 'salaried' })}>
              <option value="hourly">Hourly</option><option value="salaried">Salaried</option>
            </select>
          </div>
        </div>
        {newEmp.isSalaried
          ? <div style={S.fGroup}><label style={S.label}>Monthly salary (₱)</label><input type="number" style={S.input} value={newEmp.monthlySalary} onChange={e => setNewEmp({ ...newEmp, monthlySalary: +e.target.value })} /></div>
          : <div style={S.fGroup}><label style={S.label}>Hourly rate (₱)</label><input type="number" style={S.input} value={newEmp.hourlyRate} onChange={e => setNewEmp({ ...newEmp, hourlyRate: +e.target.value })} /></div>
        }
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}></div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button style={S.btnSm} onClick={() => setShow(false)}>
            Cancel
          </button>

          <button style={S.btn} onClick={() => addEmployee(newEmp)}>
            Add Employee
          </button>
        </div>

      </div>
    </div>
  );
}
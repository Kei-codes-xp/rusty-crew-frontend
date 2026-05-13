import { useEffect, useState } from "react";
import { Employee, NewEmployeeForm } from "@/types/employee";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { PayrollEntry } from "@/types/payroll";
import { getHalfMonthRange } from "@/utils/date";


export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeesPayroll, setEmployeesPayroll] = useState<PayrollEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const { from, to } = getHalfMonthRange();


  // useEffect(() => {
  //   api.get("/employees")
  //     .then(res => {
  //       setEmployees(res.data); // ✅ IMPORTANT FIX
  //       console.log("data", res.data.data);
  //     })
  //     .catch(err => {
  //       console.log("EMPLOYEES ERROR:", err);
  //       setEmployees([]); // fallback safe array
  //     })
  //     .finally(() => setLoading(false));
  // }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/employees");
        setEmployees(res.data);
        console.log("data", res.data);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);


  // /payroll/weekly


  const fetchQr = async (id: number) => {
    const res = await api.get(`/employees/${id}/qr`, {
      responseType: "blob",
    });

    const url = URL.createObjectURL(res.data);
    setQrUrl(url);
    setShowQrModal(true);
  };


  async function addEmployee(emp: NewEmployeeForm) {
    try {
      const payload = {
        firstName: emp.firstName,
        lastName: emp.lastName,
        email: emp.email,
        phone: emp.phone,
        emergency: emp.emergency,
        role: emp.role,
        hourlyRate: emp.hourlyRate,
        isSalaried: emp.isSalaried,
        monthlySalary: emp.monthlySalary,
        pin: emp.pin,
      };

      const res = await api.post("/employees", payload);

      const newEmployee = res.data.data ?? res.data;

      setEmployees(prev => [...prev, newEmployee]);

      toast.success("Employee added successfully 🎉");

      return newEmployee;
    } catch (err: any) {
      const data = err.response?.data;

      console.log("CREATE EMPLOYEE ERROR:", data);

      // Laravel validation errors
      if (data?.errors) {
        Object.values(data.errors)
          .flat()
          .forEach((msg: any) => toast.error(msg));
      } else {
        toast.error(data?.message || "Failed to create employee");
      }

      throw err;
    }
  }

  function updateEmployee(id: number, data: Partial<Employee>) {
    setEmployees(prev =>
      prev.map(e => (e.id === id ? { ...e, ...data } : e))
    );
  }

  function resignEmployee(id: number) {
    setEmployees(prev =>
      prev.map(e =>
        e.id === id ? { ...e, status: "Resigned" } : e
      )
    );
  }
  return {
    employees,
    loading,
    addEmployee,
    resignEmployee,
    fetchQr,
    qrUrl,
    showQrModal,
    setShowQrModal,
    updateEmployee,
    employeesPayroll,
    
  };
}
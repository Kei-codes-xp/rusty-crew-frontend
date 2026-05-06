import { Role } from "@/types/employee";

export default function RoleBadge({ role }: { role: Role }) {
  const map: Record<Role,[string,string]> = {
    Barista: ['#1a3d2b','#4ade80'],
    Cashier: ['#1a2d3d','#60a5fa'],
    Manager: ['#3d2d0a','#fbbf24'],
    Admin:   ['#2d1a3d','#c084fc'],
  };

  const [bg,fg] = map[role];

  return (
    <span style={{
      background:bg,
      color:fg,
      fontSize:11,
      padding:'2px 8px',
      borderRadius:20,
      fontWeight:600,
      fontFamily:'monospace'
    }}>
      {role}
    </span>
  );
}
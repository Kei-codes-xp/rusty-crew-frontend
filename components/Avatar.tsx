'use client'
import { Employee } from "@/types/employee";
import { avatarBg, avatarFg, initials } from "@/utils/employee";

export default function Avatar({ emp, size=32 }: { emp: Employee; size?: number }) {
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%',
      background: avatarBg(emp), color: avatarFg(emp),
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize: size * 0.34, fontWeight:600, flexShrink:0,
      fontFamily:'monospace', letterSpacing:0,
    }}>
      {initials(emp)}
    </div>
  );
}
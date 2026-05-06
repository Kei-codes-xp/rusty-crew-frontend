type Status =
  | 'Active'
  | 'Inactive'
  | 'Resigned'
  | 'On time'
  | 'Late'
  | 'Undertime'
  | 'Absent'
  | 'Pending'
  | 'Approved'
  | 'Denied';

export default function StatusBadge({ status }: { status: Status }) {
  const map: Record<string,[string,string]> = {
    Active:['#1a3d2b','#4ade80'],
    Inactive:['#2a2a2a','#888'],
    Resigned:['#3d1a1a','#f87171'],
    'On time':['#1a3d2b','#4ade80'],
    Late:['#3d2a1a','#fb923c'],
    Undertime:['#3d2d1a','#fbbf24'],
    Absent:['#3d1a1a','#f87171'],
    Pending:['#3d2d0a','#fbbf24'],
    Approved:['#1a3d2b','#4ade80'],
    Denied:['#3d1a1a','#f87171'],
  };

  const [bg,fg] = map[status] || ['#222','#888'];

  return (
    <span style={{
      background:bg,
      color:fg,
      fontSize:11,
      padding:'2px 8px',
      borderRadius:20,
      fontWeight:600
    }}>
      {status}
    </span>
  );
}
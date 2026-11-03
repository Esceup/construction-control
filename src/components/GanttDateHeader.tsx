import type { ReactNode } from 'react';
type Scale = 'days' | 'weeks' | 'months';
type Props = { scale: Scale; start: Date; maxEnd: Date; days: number; px: number };
const DAY = 86400000;
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
export function GanttDateHeader({ scale, start, maxEnd, days, px }: Props) {
 const cells: ReactNode[] = [];
 if (scale === 'months') {
  let cursor = new Date(start);
  while (cursor <= maxEnd) {
   const monthEnd = new Date(cursor.getFullYear(),cursor.getMonth()+1,0);
   const span = Math.min(Math.round((monthEnd.getTime()-cursor.getTime())/DAY)+1,Math.round((maxEnd.getTime()-cursor.getTime())/DAY)+1);
   const label = cursor.toLocaleDateString('ru-RU',{month:'short'}).replace('.','')+' '+String(cursor.getFullYear()).slice(-2);
   const left=Math.round((cursor.getTime()-start.getTime())/DAY*px);
   cells.push(<div className="month-cell" style={{position:'absolute',left,width:span*px}} key={iso(cursor)}>{label}</div>);
   cursor = new Date(cursor.getFullYear(),cursor.getMonth()+1,1);
  }
  return <>{cells}</>;
 }
 if (scale === 'weeks') {
  for (let offset=0; offset<days; offset+=7) {
   const first = new Date(start.getTime()+offset*DAY), span = Math.min(7,days-offset), last = new Date(first.getTime()+(span-1)*DAY);
   const firstLabel=first.toLocaleDateString('ru-RU',{day:'2-digit',month:'short'}).replace('.','');
   const lastLabel=last.toLocaleDateString('ru-RU',{day:'2-digit',month:'short'}).replace('.','');
   const label=first.getMonth()===last.getMonth()? `${String(first.getDate()).padStart(2,'0')}–${String(last.getDate()).padStart(2,'0')} ${first.toLocaleDateString('ru-RU',{month:'short'}).replace('.','')}` : `${firstLabel}–${lastLabel}`;
   cells.push(<div className="tick week-tick" key={offset} style={{left:offset*px,width:span*px}}>{label}</div>);
  }
  return <>{cells}</>;
 }
 const step=Math.max(1,Math.ceil(54/px));
 for(let offset=0;offset<days;offset+=step){
  const d=new Date(start.getTime()+offset*DAY),span=Math.min(step,days-offset);
  cells.push(<div className="tick day-tick" key={offset} style={{left:offset*px,width:span*px}}>{d.toLocaleDateString('ru-RU',{day:'2-digit',month:'2-digit'})}</div>);
 }
 return <>{cells}</>;
}

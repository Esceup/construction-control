import type { ReactNode } from 'react';
type Scale = 'days' | 'weeks' | 'months' | 'quarters';
type Props = { scale: Scale; start: Date; maxEnd: Date; days: number; px: number };
const DAY = 86400000;
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
export function GanttDateHeader({ scale, start, maxEnd, days, px }: Props) {
 const cells: ReactNode[] = [];
 if (scale === 'quarters') {
  let cursor = new Date(start.getFullYear(),Math.floor(start.getMonth()/3)*3,1);
  while(cursor<=maxEnd){
   const quarterEnd=new Date(cursor.getFullYear(),cursor.getMonth()+3,0);
   const visibleStart=cursor<start?start:cursor,visibleEnd=quarterEnd>maxEnd?maxEnd:quarterEnd;
   const left=Math.max(0,Math.round((visibleStart.getTime()-start.getTime())/DAY*px));
   const span=Math.round((visibleEnd.getTime()-visibleStart.getTime())/DAY)+1;
   const quarter=Math.floor(cursor.getMonth()/3)+1;
   cells.push(<div className="quarter-cell" key={iso(cursor)} style={{position:'absolute',left,top:0,width:span*px,height:20}}>{quarter} кв. {String(cursor.getFullYear()).slice(-2)}</div>);
   let monthCursor=new Date(cursor);
   while(monthCursor<=visibleEnd){
    const monthEnd=new Date(monthCursor.getFullYear(),monthCursor.getMonth()+1,0);
    const monthVisibleStart=monthCursor<start?start:monthCursor;
    const monthVisibleEnd=monthEnd>visibleEnd?visibleEnd:monthEnd;
    const monthLeft=Math.max(0,Math.round((monthVisibleStart.getTime()-start.getTime())/DAY*px));
    const monthSpan=Math.round((monthVisibleEnd.getTime()-monthVisibleStart.getTime())/DAY)+1;
    const monthLabel=monthCursor.toLocaleDateString('ru-RU',{month:'short'}).replace('.','');
    if(monthVisibleEnd>=monthVisibleStart){
     cells.push(<div className="quarter-month-cell" key={iso(monthCursor)} style={{position:'absolute',left:monthLeft,top:20,width:monthSpan*px,height:20}}>{monthLabel}</div>);
    }
    monthCursor=new Date(monthCursor.getFullYear(),monthCursor.getMonth()+1,1);
   }
   cursor=new Date(cursor.getFullYear(),cursor.getMonth()+3,1);
  }
  return <>{cells}</>;
 }
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

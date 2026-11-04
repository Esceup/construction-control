import { ChevronDown, ChevronRight, Pencil } from 'lucide-react';
export type RowTask = {id:string;name:string;start:string;end:string;actualStart?:string;actualEnd?:string;progress:number;budget:number;paid:number;contractor:string;people:number};
export type RowStage = {id:string;name:string;tasks:RowTask[]};
type Columns = {number:boolean;name:boolean;workforce:boolean;progress:boolean;money:boolean};
type Props = {kind:'stage'|'task';stage:RowStage;task:RowTask;collapsed:boolean;onToggle:()=>void;onSelect:()=>void;onRename:()=>void;columns:Columns;tableOnly?:boolean};
const money=(n:number)=>new Intl.NumberFormat('ru-RU',{maximumFractionDigits:0}).format(n)+' ₽';
const fmt=(s:string)=>date(s).toLocaleDateString('ru-RU');
const fmtRange=(start:string,end:string)=>`${fmt(start)} — ${fmt(end)}`;
const fmtOptionalRange=(start?:string,end?:string)=>start&&end?fmtRange(start,end):start?`${fmt(start)} — …`:end?`… — ${fmt(end)}`:'—';
const date=(s:string)=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const status=(t:RowTask)=>t.progress===100?'done':t.progress>0?'doing':date(t.end)<new Date(new Date().toDateString())?'late':'todo';
const statusName=(t:RowTask)=>({done:'Завершено',doing:'Выполняется',late:'Просрочено',todo:'Не начато'} as Record<string,string>)[status(t)];
export function GanttStageRow({kind,stage,task,collapsed,onToggle,onSelect,onRename,columns,tableOnly=false}:Props){
 return <div className={`data-row ${kind==='stage'?'stage-row':''}`} onClick={()=>kind==='stage'?onToggle():onSelect()}>
  <div className={columns.number ? "col-num gantt-column-mobile-hidden" : "col-num gantt-column-mobile-hidden gantt-column-hidden"}>{columns.number&&(kind==='stage'?<div className="stage-number"><span>{stage.id}</span><button className="collapse" aria-label={collapsed?'Развернуть этап':'Свернуть этап'} onClick={e=>{e.stopPropagation();onToggle()}}>{collapsed?<ChevronRight size={15}/>:<ChevronDown size={15}/>}</button></div>:<span className="task-num">{task.id}</span>)}</div>
  <div className={columns.name ? "col-name" : "col-name gantt-column-hidden"}>{columns.name&&<>{kind==='task'?<><span title={task.name} className="child-name">{task.name}</span>{!tableOnly&&<small className="mobile-sub">{money(task.budget)} · {task.progress}% · {task.contractor}</small>}</>:<><span title={task.name}>{task.name}</span><div className="stage-actions"><button className="stage-action-btn" aria-label="Управление этапом" title="Управление этапом" onClick={e=>{e.stopPropagation();onRename()}}><Pencil size={13}/></button></div></>}</>}</div>
  {tableOnly&&<><div className="col-planned"><span>{fmtRange(task.start,task.end)}</span></div><div className="col-actual"><span className={task.actualStart||task.actualEnd?'has-actual':'empty-value'}>{fmtOptionalRange(task.actualStart,task.actualEnd)}</span></div></>}
  <div className={columns.workforce ? "col-workforce gantt-column-mobile-hidden" : "col-workforce gantt-column-mobile-hidden gantt-column-hidden"}>{columns.workforce&&(tableOnly?<span title={task.contractor}>{task.contractor} · {task.people} чел.</span>:<><span title={task.contractor}>{task.contractor}</span><small>{task.people} чел.</small></>)}</div>
  <div className={columns.progress ? "col-progress gantt-column-mobile-hidden" : "col-progress gantt-column-mobile-hidden gantt-column-hidden"}>{columns.progress&&<><b>{task.progress}%</b><span className={`status-pill ${status(task)}`}>{statusName(task)}</span></>}</div>
  <div className={columns.money ? "col-money gantt-column-mobile-hidden" : "col-money gantt-column-mobile-hidden gantt-column-hidden"}>{columns.money&&<><b>{money(task.paid)}</b>{tableOnly?<small>/ {money(task.budget)}</small>:<small>из {money(task.budget)}</small>}</>}</div>
 </div>;
}
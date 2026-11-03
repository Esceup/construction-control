import { ChevronDown, ChevronRight, Plus, Pencil } from 'lucide-react';
export type RowTask = {id:string;name:string;start:string;end:string;progress:number;budget:number;paid:number;contractor:string;people:number};
export type RowStage = {id:string;name:string;tasks:RowTask[]};
type Columns = {number:boolean;name:boolean;progress:boolean;money:boolean};
type Props = {kind:'stage'|'task';stage:RowStage;task:RowTask;collapsed:boolean;editMode:boolean;selected:boolean;onToggle:()=>void;onSelect:()=>void;onSelectToggle:(checked:boolean)=>void;onAdd:()=>void;onRename:()=>void;columns:Columns};
const money=(n:number)=>new Intl.NumberFormat('ru-RU',{maximumFractionDigits:0}).format(n)+' ₽';
const date=(s:string)=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const status=(t:RowTask)=>t.progress===100?'done':t.progress>0?'doing':date(t.end)<new Date(new Date().toDateString())?'late':'todo';
const statusName=(t:RowTask)=>({done:'Завершено',doing:'Выполняется',late:'Просрочено',todo:'Не начато'} as Record<string,string>)[status(t)];
export function GanttStageRow({kind,stage,task,collapsed,editMode,selected,onToggle,onSelect,onSelectToggle,onAdd,onRename,columns}:Props){
 return <div className={`data-row ${kind==='stage'?'stage-row':''}`} onClick={()=>kind==='stage'?onToggle():onSelect()}>
  <div className="col-check">{kind==='task'&&editMode&&<input type="checkbox" checked={selected} onClick={e=>e.stopPropagation()} onChange={e=>onSelectToggle(e.target.checked)}/>}</div>
  <div className="col-num">{columns.number&&(kind==='stage'?<button className="collapse" onClick={e=>{e.stopPropagation();onToggle()}}>{collapsed?<ChevronRight size={16}/>:<ChevronDown size={16}/>}</button>:<span className="task-num">{task.id}</span>)}</div>
  <div className="col-name">{columns.name&&<>{kind==='task'?<><span title={task.name} className="child-name">{task.name}</span><small className="desktop-sub">{task.contractor} · {task.people} чел.</small><small className="mobile-sub">{money(task.budget)} · {task.progress}% · {task.contractor}</small></>:<><span title={task.name}>{task.name}</span><div className="stage-actions"><button className="stage-action-btn" aria-label="Переименовать этап" title="Переименовать этап" onClick={e=>{e.stopPropagation();onRename()}}><Pencil size={13}/></button><button className="add-stage-task" aria-label={`Добавить работу в этап ${stage.name}`} title="Добавить работу в этап" onClick={e=>{e.stopPropagation();onAdd()}}><Plus size={16}/></button></div></>}</>}</div>
  <div className="col-progress">{columns.progress&&<><b>{task.progress}%</b><span className={`status-pill ${status(task)}`}>{statusName(task)}</span></>}</div>
  <div className="col-money">{columns.money&&<><b>{money(task.paid)}</b><small>из {money(task.budget)}</small></>}</div>
 </div>;
}
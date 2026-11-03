import { ChevronDown, ChevronRight, Plus, Pencil } from 'lucide-react';
export type RowTask = {id:string;name:string;start:string;end:string;progress:number;budget:number;paid:number;contractor:string;people:number};
export type RowStage = {id:string;name:string;tasks:RowTask[]};
type Props = {kind:'stage'|'task';stage:RowStage;task:RowTask;collapsed:boolean;editMode:boolean;selected:boolean;onToggle:()=>void;onSelect:()=>void;onSelectToggle:(checked:boolean)=>void;onAdd:()=>void;onRename:()=>void;columns:{number:boolean;name:boolean;people:boolean;contractor:boolean;budget:boolean}};
const money=(n:number)=>new Intl.NumberFormat('ru-RU',{maximumFractionDigits:0}).format(n)+' ₽';
const date=(s:string)=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const status=(t:RowTask)=>t.progress===100?'done':t.progress>0?'doing':date(t.end)<new Date(new Date().toDateString())?'late':'todo';
const statusName=(t:RowTask)=>({done:'Завершено',doing:'Выполняется',late:'Просрочено',todo:'Не начато'} as Record<string,string>)[status(t)];
export function GanttStageRow({kind,stage,task,collapsed,editMode,selected,onToggle,onSelect,onSelectToggle,onAdd,onRename,columns}:Props){
 return <div className={`data-row ${kind==='stage'?'stage-row':''}`} onClick={()=>kind==='stage'?onToggle():onSelect()}>
  <div className="col-check">{kind==='task'&&editMode&&<input type="checkbox" checked={selected} onClick={e=>e.stopPropagation()} onChange={e=>onSelectToggle(e.target.checked)}/>}</div>
  <div className="col-num" style={{display:columns.number?undefined:"none"}}>{kind==='stage'?<button className="collapse" onClick={e=>{e.stopPropagation();onToggle()}}>{collapsed?<ChevronRight size={16}/>:<ChevronDown size={16}/>}</button>:<span className="task-num">{task.id}</span>}</div>
  <div className="col-name" style={{display:columns.name?undefined:"none"}}><span title={task.name} className={kind==='task'?'child-name':''}>{task.name}</span>{kind==='stage'&&<div className="stage-actions"><button className="stage-action-btn" aria-label="Переименовать этап" onClick={e=>{e.stopPropagation();onRename()}}><Pencil size={13}/></button><button className="add-stage-task" aria-label="Добавить работу в этап" onClick={e=>{e.stopPropagation();onAdd()}}><Plus size={16}/></button></div>}</div>
  <div className="col-contractor" style={{display:columns.contractor?undefined:"none"}}><span>{kind==='task'?task.contractor:'—'}</span>{kind==='task'&&<small>{task.people} чел.</small>}</div>
  <div className="col-budget" style={{display:columns.budget?undefined:"none"}}>{money(task.budget)}</div>
 </div>;
}
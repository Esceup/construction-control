import type { RowTask } from './GanttStageRow';
type Props={kind:'stage'|'task';task:RowTask;left:number;width:number;showName?:boolean;onSelect:()=>void};
const date=(s:string)=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const fmt=(s:string)=>date(s).toLocaleDateString('ru-RU');
const status=(t:RowTask)=>t.progress===100?'done':t.progress>0?'doing':date(t.end)<new Date(new Date().toDateString())?'late':'todo';
export function GanttBarRow({kind,task,left,width,showName=false,onSelect}:Props){
 const state=status(task);
 const labelCenter=left+width/2;
 return <div className={`bar-row ${kind==='stage'?'stage-bar-row':''} ${showName?'bar-row-with-name':''}`}>
  {showName
   ? <div className={`bar-task-label ${kind==='stage'?'stage-task-label':''}`} style={{left:labelCenter,transform:`translateX(max(-50%, calc(4px - ${labelCenter}px)))`}} title={task.name}>{task.name} — {task.progress}%</div>
   : <div className="bar-progress-label" style={{left:labelCenter,transform:`translateX(max(-50%, calc(4px - ${labelCenter}px)))`}} aria-label={`Выполнено ${task.progress}%`}>{task.progress}%</div>}
  <div className={`bar ${state}`} title={`${task.name}: ${fmt(task.start)} — ${fmt(task.end)} · Выполнено: ${task.progress}%`} style={{left,width}} onClick={onSelect}>
   <div className={`bar-fill ${state}`} style={{width:`${task.progress}%`}}/>
  </div>
 </div>;
}
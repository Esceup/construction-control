import type { RowTask } from './GanttStageRow';
type Props={kind:'stage'|'task';task:RowTask;left:number;width:number;onSelect:()=>void};
const money=(n:number)=>new Intl.NumberFormat('ru-RU',{maximumFractionDigits:0}).format(n)+' ₽';
const date=(s:string)=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const fmt=(s:string)=>date(s).toLocaleDateString('ru-RU');
const status=(t:RowTask)=>t.progress===100?'done':t.progress>0?'doing':date(t.end)<new Date(new Date().toDateString())?'late':'todo';
export function GanttBarRow({kind,task,left,width,onSelect}:Props){
 const state=status(task);
 return <div className={`bar-row ${kind==='stage'?'stage-bar-row':''}`}><span className="bar-budget" style={{left:Math.max(2,left-82)}}>{money(task.budget)}</span><div className={`bar ${state}`} title={`${task.name}: ${fmt(task.start)} — ${fmt(task.end)}`} style={{left,width}} onClick={onSelect}><div className={`bar-fill ${state}`} style={{width:`${task.progress}%`}}/></div><span className="bar-percent" style={{left:left+width+7}}>{task.progress}%</span></div>;
}
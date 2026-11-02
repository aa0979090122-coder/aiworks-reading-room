const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const external=(url,label)=>/^https?:\/\//i.test(String(url))?`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`:'';
export const laneLabels={event:'新聞與事件',feature:'功能與工具',case:'導入案例',discussion:'社群在聊什麼'};
export function briefRead(topic,feedback){return !!feedback.items?.[topic.url]?.briefReadRevisions?.[topic.revision]?.read;}
export function interestedIn(topic,feedback){const s=feedback.items?.[topic.url]||{};return !!s.interested||Object.values(s.curiosityQuestions||{}).some(q=>q.topicId===topic.id&&q.interested);}
// Reading an introduction, following a question and saving a source are independent actions.
export function updateCuriosity(feedback,topic,action,{questionId,checked,now=new Date().toISOString()}={}){
 const question=questionId?topic.questions.find(q=>q.id===questionId):null;
 if(!['brief','interest','question'].includes(action)||(action==='question'&&!question))return false;
 feedback.items||={};const s=feedback.items[topic.url]||={};
 if(action==='brief'){s.briefReadRevisions||={};s.briefReadRevisions[topic.revision]={read:!!checked,topicId:topic.id,title:topic.title,updatedAt:now};}
 if(action==='interest')s.interested=!s.interested;
 if(action==='question'){s.curiosityQuestions||={};const old=s.curiosityQuestions[questionId];s.curiosityQuestions[questionId]={interested:!old?.interested,topicId:topic.id,question:question.question,updatedAt:now};}
 s.updatedAt=now;return true;
}
export function selectCuriosity(topics,feedback,{lane='all',view='latest',now}={}){
 return topics.filter(t=>(view==='removed'?isRemoved(feedback,t.url):!isRemoved(feedback,t.url))&&(!now||view==='removed'||view==='interested'||inRecentWindow(topicDate(t),now))&&(lane==='all'||t.lane===lane)&&(view==='interested'?interestedIn(t,feedback):view==='read'?briefRead(t,feedback):view==='unread'?!briefRead(t,feedback):true)).sort((a,b)=>view==='latest'?(topicDate(b)||'').localeCompare(topicDate(a)||'')||(a.priority??5)-(b.priority??5):0);
}
function refs(urls,topic){return (urls||[]).map(u=>{const s=topic.sources.find(x=>x.url===u);return external(u,s?.label||'原始依據');}).join(' ');}
function sourceMarkup(source,feedback){const read=!!feedback.items?.[source.url]?.read;return `<li><div class="curiosity-source-heading">${external(source.url,source.label)}<label class="read-check"><input type="checkbox" data-source-read="${esc(source.url)}" ${read?'checked':''}>看過原文</label></div><p>${esc(source.reason)}</p><small>${esc(source.date||'')} · ${esc(source.kind||'原始資料')}</small></li>`;}
export function curiosityCard(topic,feedback){
 const s=feedback.items?.[topic.url]||{},removed=isRemoved(feedback,topic.url),read=briefRead(topic,feedback),earlier=Object.values(s.briefReadRevisions||{}).some(x=>x.topicId===topic.id&&x.read),recommended=topic.sources.filter(x=>x.recommended).slice(0,3),more=topic.sources.filter(x=>!recommended.includes(x));
 return `<article class="curiosity-card" id="curiosity-${esc(topic.id)}" data-curiosity-card="${esc(topic.id)}"><div class="curiosity-meta"><span>${esc(laneLabels[topic.lane]||'近期話題')}</span><time>${esc(topicDate(topic))} · 整理 ${esc(topic.updatedAt)}${earlier&&!read?' · 有新整理':''}</time></div><h2>${esc(topic.title)}</h2><p class="curiosity-intro">${esc(topic.intro)}</p><p class="curiosity-update"><strong>${esc(topic.trigger.date)} 的進展</strong> ${esc(topic.trigger.text)} ${refs(topic.trigger.urls,topic)}</p><div class="curiosity-topic-actions"><button class="remove-button" data-remove-url="${esc(topic.url)}">${removed?'復原':'刪除'}</button><label class="read-check"><input type="checkbox" data-brief-read="${esc(topic.id)}" ${read?'checked':''}>看過這份簡介</label><button class="curiosity-interest" data-curiosity-action="interest" data-topic="${esc(topic.id)}" aria-pressed="${!!s.interested}">${s.interested?'★ 有興趣':'☆ 有興趣'}</button></div><div class="curiosity-questions"><h3>想多了解</h3>${topic.questions.map(q=>{const active=!!s.curiosityQuestions?.[q.id]?.interested;return `<div class="curiosity-question-row"><details data-curiosity-detail="${esc(topic.id+'-'+q.id)}"><summary>${esc(q.question)}</summary><div class="curiosity-answer"><span class="answer-status">${esc({supported:'已有依據',partial:'部分有依據',open:'還待確認',analysis:'依現有資料推論'}[q.status]||'還待確認')}</span><p>${esc(q.answer)}</p><div class="curiosity-evidence">${refs(q.urls,topic)}</div>${q.next?`<p class="curiosity-next">還可以往下問：${esc(q.next)}</p>`:''}</div></details><button class="question-interest" data-curiosity-action="question" data-topic="${esc(topic.id)}" data-question="${esc(q.id)}" aria-pressed="${active}" aria-label="${esc((active?'取消追問：':'我想追問：')+q.question)}">${active?'★ 已記下想追':'＋ 我想追這題'}</button></div>`;}).join('')}</div><section class="curiosity-reading"><h3>延伸閱讀</h3><ol>${recommended.map(x=>sourceMarkup(x,feedback)).join('')}</ol></section><details class="curiosity-background" data-curiosity-detail="${esc(topic.id+'-background')}"><summary>事件脈絡與其他延伸閱讀</summary><ol class="curiosity-timeline">${(topic.timeline||[]).map(x=>`<li><time>${esc(x.date)}</time><div>${esc(x.text)} ${refs(x.urls,topic)}</div></li>`).join('')}</ol>${more.length?`<ul class="curiosity-other-sources">${more.map(x=>sourceMarkup(x,feedback)).join('')}</ul>`:''}<p class="evidence-limit">${esc(topic.limit)}</p></details></article>`;
}
export function renderCuriosity(host,topics,feedback,filters){
 const opened=new Set([...host.querySelectorAll('details[open][data-curiosity-detail]')].map(x=>x.dataset.curiosityDetail));const focus=document.activeElement;const focusKey=focus?.dataset?.question||focus?.dataset?.briefRead||focus?.dataset?.sourceRead||focus?.dataset?.topic;
 const matches=selectCuriosity(topics,feedback,filters),items=filters.view==='latest'&&filters.lane==='all'?matches.slice(0,5):matches;host.innerHTML=(items.map(t=>curiosityCard(t,feedback)).join('')||'<p class="empty-state">目前沒有符合條件的話題。</p>')+(matches.length>items.length?`<button class="text-button" data-curiosity-show-all>查看近 14 天全部 ${matches.length} 個話題 →</button>`:'');
 host.querySelectorAll('details[data-curiosity-detail]').forEach(x=>{if(opened.has(x.dataset.curiosityDetail))x.open=true});
 if(focusKey){[...host.querySelectorAll('button,input')].find(x=>(x.dataset.question||x.dataset.briefRead||x.dataset.sourceRead||x.dataset.topic)===focusKey)?.focus({preventScroll:true});}
}

// Calendar dates use Taipei time; editorial check dates never make old news recent.
export function calendarDay(now=new Date()) {
 return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
}
export function datesIn(value,year) {
 const text=String(value||'').replace(/(\d{4}) 年\s*(\d{1,2}) 月\s*(\d{1,2}) 日/g,'$1-$2-$3');
 const full=[...text.matchAll(/(\d{4})-(\d{1,2})-(\d{1,2})/g)].map(m=>`${m[1]}-${m[2].padStart(2,'0')}-${m[3].padStart(2,'0')}`);
 if(full.length)return full;
 return [...text.matchAll(/(?:^|[^\d])(\d{1,2})\/(\d{1,2})(?!\d)/g)].map(m=>`${year}-${m[1].padStart(2,'0')}-${m[2].padStart(2,'0')}`);
}
export function sourceDay(item) {
 if(item.publishedAt){const d=new Date(item.publishedAt);if(!Number.isNaN(+d))return calendarDay(d);}
 return datesIn(item.date||item.sourceDate,'')[0]||'';
}
export function topicDate(topic) {
 const year=topic.updatedAt?.slice(0,4)||String(new Date().getFullYear());
 return [...datesIn(topic.trigger?.date,year),...(topic.sources||[]).flatMap(s=>datesIn(s.date,year))].sort().at(-1)||'';
}
export function windowStart(now=new Date()) {
 return new Date(Date.parse(calendarDay(now)+'T00:00:00Z')-13*86400000).toISOString().slice(0,10);
}
export function inRecentWindow(day,now=new Date()) {return !!day&&day>=windowStart(now)&&day<=calendarDay(now);}
export function isRemoved(feedback,url) {const s=feedback.items?.[url]||{};return !!(s.removed||s.rejected);}
export function setRemoved(feedback,url,removed,now=new Date().toISOString()) {
 if(!/^https?:\/\//.test(url))return false;
 feedback.items||={};const state=feedback.items[url]||={};state.removed=removed;
 if(!removed)state.rejected=false;
 state.removedAt=now;state.updatedAt=now;return true;
}
export function selectMaterials(items,feedback,{now=new Date(),query='',kind='all',view='all'}={}) {
 const q=query.trim().toLowerCase();
 return items.filter(x=>(view==='removed'?isRemoved(feedback,x.url):!isRemoved(feedback,x.url))&&
 (view==='removed'||view==='interested'||inRecentWindow(sourceDay(x),now))&&
 (kind==='all'||x.kind===kind)&&
 (view!=='interested'||feedback.items?.[x.url]?.interested)&&
 (view!=='read'||feedback.items?.[x.url]?.read)&&
 (!q||[x.title,x.zh,x.what,x.lead,x.context,x.author,x.source,...(x.points||x.takeaways||[])].join(' ').toLowerCase().includes(q)))
 .sort((a,b)=>sourceDay(b).localeCompare(sourceDay(a)));
}

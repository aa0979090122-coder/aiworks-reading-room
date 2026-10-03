const hashUrl=url=>{let h=2166136261;for(const c of url)h=Math.imul(h^c.charCodeAt(0),16777619);return (h>>>0).toString(36)};
// Source-backed organization. Editorial annotations take priority over fallback matching.
export const chapters = [
  {id:'workflow',title:'工作流程與導入',question:'AI 放在哪一段工作？誰一起設計與驗證？',pattern:/工作流程|流程重設|導入|部署|workflow|pod|供應鏈|客服|會計/i},
  {id:'evaluation',title:'成效、評估與失敗',question:'成果怎麼量？哪裡失敗，後來怎麼修正？',pattern:/評估|衡量|測試|品質|失敗|幻覺|錯誤|修正|生產力|成功率|ROI|metr|eval|alignment rate/i},
  {id:'scaling',title:'規模化與成本',question:'用量增加後，成本與可靠度如何維持？',pattern:/成本|規模|擴大|快取|token|cache|software factory|多代理|multi.agent/i},
  {id:'governance',title:'資料、權限與治理',question:'代理能讀什麼、做什麼？何時需要人介入？',pattern:/治理|權限|安全|信任|審核|審查|風險|privacy|security|identity/i},
  {id:'adoption',title:'組織與員工採用',question:'工作角色、技能與協作方式怎麼變？',pattern:/員工|採用|培訓|學習|組織|職務|職能|人才|管理者|團隊|adoption/i},
  {id:'market',title:'市場、報告與策略',question:'這項案例能代表什麼？市場資料支持到哪裡？',pattern:/市場|報告|調查|投資|商業模式|採購|策略|市場|競爭|McKinsey|Stanford|survey|index/i},
  {id:'other',title:'待歸類',question:'資料不足時先保留，累積後再整理。',pattern:null}
];
export const outcomeLabels = {case:'實作案例',failure:'失敗與修正',mixed:'結果與限制',research:'研究與報告',perspective:'觀點與新知'};
export function allItems(content) {
  const seen=new Set();
  return ['posts','podcasts','news','deepDives'].flatMap(key=>(content[key]||[]).map(item=>({...item,kind:key}))).filter(item=>{if(seen.has(item.url))return false;seen.add(item.url);return true;});
}
export function itemTitle(item) { return item.title || `${item.author || '來源'}｜${(item.zh || item.excerpt || '').slice(0,40)}`; }
export function classify(item) {
  const curated=item.knowledge || {};
  const text=[itemTitle(item),item.zh,item.what,item.lead,item.context,...(item.points||[]),...(item.takeaways||[]),...(item.caseDetails||[]).map(x=>x.text)].filter(Boolean).join(' ');
  const ranked=chapters.filter(c=>c.pattern).map(c=>({id:c.id,score:(text.match(new RegExp(c.pattern.source,'gi'))||[]).length})).filter(c=>c.score>0).sort((a,b)=>b.score-a.score);
  const themes=(curated.themes || ranked.slice(0,3).map(c=>c.id)).filter(id=>chapters.some(c=>c.id===id));
  const primary=chapters.some(c=>c.id===curated.primary)?curated.primary:themes[0]||'other';
  if(!themes.includes(primary))themes.unshift(primary);
  return {primary,themes,concepts:curated.concepts||[],outcome:outcomeLabels[curated.outcome]?curated.outcome:item.topic==='case'?'case':'perspective',curated:!!item.knowledge};
}
export function noteFor(item) {
  return {
    summary:item.knowledge?.summary || item.zh || item.what || item.lead || item.context || '',
    points:item.knowledge?.points || item.takeaways || item.points || (item.caseDetails||[]).map(x=>`${x.label}：${x.text}`),
    question:item.knowledge?.question || item.angle || '',
    limit:item.knowledge?.limit || item.caveat || item.transcriptNote || '',
    sources:[{url:item.url,label:item.source||item.author||item.series||'原始來源'},...(item.sources||[]),...(item.evidenceUrl?[{url:item.evidenceUrl,label:item.evidenceLabel||'延伸證據'}]:[])].filter((s,i,a)=>a.findIndex(t=>t.url===s.url)===i)
  };
}
export function savedItems(content,feedback) {
  const available=allItems(content), byUrl=new Map(available.map(x=>[x.url,x]));
  return Object.entries(feedback.items||{}).filter(([,s])=>s.saved).map(([url,state])=>{
    const item=byUrl.get(url)||state.snapshot||{url,title:url};
    const info=classify(item);
    const primary=chapters.some(c=>c.id===state.chapter)?state.chapter:info.primary;
    return {...item,info:{...info,primary},note:noteFor(item),state};
  }).sort((a,b)=>(b.state.savedAt||b.state.updatedAt||'').localeCompare(a.state.savedAt||a.state.updatedAt||''));
}
export function relatedTo(item,items) {
  return items.filter(x=>x.url!==item.url).map(other=>{
    const concepts=item.info.concepts.filter(c=>other.info.concepts.includes(c));
    const themes=item.info.themes.filter(c=>other.info.themes.includes(c));
    const explicit=(item.knowledge?.related||[]).find(r=>r.url===other.url)||(other.knowledge?.related||[]).find(r=>r.url===item.url);
    const contrast=themes.length && [item.info.outcome,other.info.outcome].includes('failure') && item.info.outcome!==other.info.outcome;
    return {item:other,score:(explicit?20:0)+concepts.length*4+themes.length+(contrast?2:0),reason:explicit?.reason || (contrast?'對照失敗條件':concepts.length?`共同問題：${concepts.join('、')}`:`共同主題：${themes.map(t=>chapters.find(c=>c.id===t)?.title).join('、')}`)};
  }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||itemTitle(a.item).localeCompare(itemTitle(b.item))).slice(0,4);
}
export function exportMarkdown(content,feedback,documents={}) {
  const items=savedItems(content,feedback);
  const lines=['# 我的知識庫','',`匯出日期：${new Date().toLocaleDateString('zh-TW')}`,'',feedback.generalNote||''];
  for(const chapter of chapters){
    const group=items.filter(x=>x.info.primary===chapter.id);
    if(!group.length&&!feedback.chapterNotes?.[chapter.id])continue;
    lines.push('',`## ${chapter.title}`,'',feedback.chapterNotes?.[chapter.id]||'');
    for(const item of group){
      lines.push('',`<a id="${'note-'+hashUrl(item.url)}"></a>`,`### ${itemTitle(item)}`,'');
      if(documents[item.url])lines.push(documents[item.url].body);else lines.push(item.note.summary,...item.note.points.map(p=>`- ${p}`));
      if(item.note.question)lines.push('',`待追問：${item.note.question}`);
      if(item.note.limit)lines.push('',`資料限制：${item.note.limit}`);
      if(item.state.note)lines.push('',`我的筆記：${item.state.note}`);
      lines.push('',...item.note.sources.map(s=>`- [${s.label}](${s.url})`));
      const related=relatedTo(item,items).filter(r=>r.score>=20);
      if(!documents[item.url]&&related.length)lines.push('',...related.map(r=>`${r.reason}。可對照 [${itemTitle(r.item)}](#note-${hashUrl(r.item.url)}) 的筆記：${r.item.note.summary}`));
    }
  }
  return lines.join('\n');
}
// Restore adds records and only takes a newer version of a conflicting record.
export function mergeBackup(current,incoming) {
  if(!incoming || typeof incoming.items!=='object' || Array.isArray(incoming.items))throw new Error('檔案不含閱讀紀錄');
  const merged={...current,items:{...current.items},chapterNotes:{...current.chapterNotes}};
  for(const [url,s] of Object.entries(incoming.items)){
    if(!/^https?:\/\//.test(url)||!s||typeof s!=='object'||Array.isArray(s))continue;
    const old=merged.items[url];
    if(!old||(s.updatedAt||'')>(old.updatedAt||''))merged.items[url]={...s,note:typeof s.note==='string'?s.note:''};
  }
  if(!merged.generalNote&&typeof incoming.generalNote==='string')merged.generalNote=incoming.generalNote;
  for(const [id,note] of Object.entries(incoming.chapterNotes||{}))if(!merged.chapterNotes[id]&&typeof note==='string')merged.chapterNotes[id]=note;
  return merged;
}

// Curated deep readings win over short versions of the same source; originals remain in content.
export function readingItems(content,feedback,{history=false,current=()=>true}={}) {
  const byUrl=new Map();
  const type={posts:'x-posts',podcasts:'podcasts',news:'news',deepDives:'deep-dives'};
  for(const kind of ['deepDives','news','podcasts','posts'])for(const item of content[kind]||[]) {
    const state=feedback.items?.[item.url]||{};
    if(state.saved||byUrl.has(item.url))continue;
    if(!history&&(state.read||state.rejected||(kind!=='deepDives'&&!current(type[kind],item))))continue;
    byUrl.set(item.url,{...item,kind});
  }
  return [...byUrl.values()];
}

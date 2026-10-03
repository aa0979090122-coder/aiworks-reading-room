import {chapters, outcomeLabels, allItems, itemTitle, classify, savedItems, relatedTo, exportMarkdown, mergeBackup, noteFor, readingItems} from "./knowledge.js?v=20261003-2";
const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const dataUrl = value => esc(value);
const safeUrl = url => /^https?:\/\//i.test(String(url)) ? String(url) : "#";
const link = (url, label) => `<a class="source-link" href="${esc(safeUrl(url))}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`;
const dateLabel = value => new Intl.DateTimeFormat("zh-TW", {year:"numeric",month:"long",day:"numeric",timeZone:"Asia/Taipei"}).format(new Date(`${value}T12:00:00+08:00`));
const storageKey = "aiworks-reading-room-feedback-v1";
let content;
let feedback = {items:{}, generalNote:""};
let activeTab = "reading";
let readingChapter="all";
let readingQuery="";
let readingHistory=false;
let knowledgeChapter="all";
let knowledgeQuery="";
let knowledgeOutcome="all";
let deepFilter="all";
const historyView = {"x-posts":false,"podcasts":false,"news":false,"deep-dives":false};
const topicView = {"x-posts":"all","podcasts":"all","news":"all"};
const topicLabels = {all:"全部",case:"公司案例",product:"新功能",trend:"趨勢與新詞"};
const topicTag = item => `<span class="topic-tag">${esc(topicLabels[item.topic] || topicLabels.trend)}</span>`;
try { feedback = {...feedback, ...JSON.parse(localStorage.getItem(storageKey) || "{}")}; } catch { /* The page remains readable without storage. */ }
feedback.items ||= {};
feedback.chapterNotes ||= {};

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(feedback)); document.getElementById("save-status").textContent = ""; }
  catch { document.getElementById("save-status").textContent = "這個瀏覽器目前無法儲存筆記"; }
}
function stateFor(url) { return feedback.items[url] || {}; }
function ageInDays(date) { return Math.floor((Date.now() - new Date(`${date}T00:00:00+08:00`).getTime()) / 86400000); }
function withinSixMonths(date) {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 6);
  cutoff.setHours(0,0,0,0);
  return new Date(`${date}T00:00:00+08:00`) >= cutoff;
}
function isCurrent(type, item) {
  const state = stateFor(item.url);
  const withinWindow = type === "podcasts" || (type === "x-posts" && item.topic === "case" ? ageInDays(item.date) >= 0 && withinSixMonths(item.date) : ageInDays(item.date) >= 0 && ageInDays(item.date) < 14);
  return withinWindow && !state.saved && !state.read && !state.rejected;
}
function selectedItems(type, items) { return items.filter(item => !stateFor(item.url).saved && (historyView[type] ? !isCurrent(type,item) : isCurrent(type,item))); }
function actions(item) {
  const s = stateFor(item.url);
  const url = dataUrl(item.url);
  return `<div class="actions" aria-label="閱讀狀態">
    <button type="button" data-action="read" data-url="${url}" class="action-button ${s.read?'is-active':''}" aria-pressed="${!!s.read}" title="標記已讀"><span aria-hidden="true">✓</span> 已讀</button>
    <button type="button" data-action="reject" data-url="${url}" class="action-button ${s.rejected?'is-active':''}" aria-pressed="${!!s.rejected}" title="這篇沒有幫助"><span aria-hidden="true">✕</span> 沒幫助</button>
    <button type="button" data-action="save" data-url="${url}" class="action-button ${s.saved?'is-saved':''}" aria-pressed="${!!s.saved}" title="收藏"><span aria-hidden="true">${s.saved?'★':'☆'}</span> ${s.saved?'移回閱讀列表':'收藏'}</button>
    <details class="item-note"><summary>寫筆記</summary><textarea data-note-url="${url}" aria-label="這篇的筆記" placeholder="想法、問題、文章角度…">${esc(s.note || "")}</textarea></details>
  </div>`;
}
function originalPanel(body,label="閱讀原文與詳細資料") {return `<details class="source-details"><summary>${label}</summary><div class="source-body">${body}</div></details>`;}
function postCard(post) {
  const replies=post.replyObservation?`<div class="reply-observation"><h3>留言觀察 · 公開可見 ${post.replyObservation.count} 則</h3><p>${esc(post.replyObservation.summary)}</p><p class="reply-limit">只根據目前可見的回覆整理，完整討論請開啟 X。</p></div>`:"";
  const details=post.caseDetails?.length?`<dl class="case-details">${post.caseDetails.map(({label,text})=>`<div><dt>${esc(label)}</dt><dd>${esc(text)}</dd></div>`).join("")}</dl>`:"";
  return `<article class="post-card"><div class="item-meta">${esc(post.author)} <span class="handle">${esc(post.handle)}</span><span>${topicTag(post)} · <time datetime="${esc(post.date)}">${dateLabel(post.date)}</time></span></div><h2>${esc(itemTitle(post))}</h2><p class="post-summary">${esc(post.zh)}</p>${originalPanel(`<div class="column-label">${post.originalIsFull?"英文原文":"英文原文節錄"}</div><blockquote lang="en">${esc(post.excerpt)}</blockquote>${link(post.url,"閱讀 X 原文與留言")}${details}${post.evidenceUrl?link(post.evidenceUrl,post.evidenceLabel||"參考原始資料"):""}${replies}`)}${actions(post)}</article>`;
}
function podcastCard(show) {
  const media=show.youtubeId?`<button type="button" class="video-trigger" data-video="${esc(show.youtubeId)}" data-video-title="${esc(show.title)}" aria-label="播放 ${esc(show.title)} 影片"><img src="https://i.ytimg.com/vi/${esc(show.youtubeId)}/hqdefault.jpg" alt="" loading="lazy"><span>▶ 播放影片</span></button>`:`<a class="podcast-art" href="${esc(safeUrl(show.url))}" target="_blank" rel="noopener noreferrer"><img src="${esc(show.cover)}" alt="${esc(show.series)} 節目封面" loading="lazy"><span>開啟原始節目 ↗</span></a>`;
  return `<article class="podcast-card"><div class="podcast-body"><div class="item-meta">${esc(show.series)} · ${dateLabel(show.date)} ${topicTag(show)}</div><h2>${esc(show.title)}</h2><p class="context">${esc(show.context)}</p><ul>${show.points.map(p=>`<li>${esc(p)}</li>`).join("")}</ul>${originalPanel(`<div class="podcast-media">${media}</div>${show.originalTitle?`<h3>${esc(show.originalTitle)}</h3>`:""}${show.originalExcerpt?`<blockquote lang="${show.originalLanguage==="zh"?"zh-Hant":"en"}">${esc(show.originalExcerpt)}</blockquote>`:""}${link(show.url,"閱讀原始節目頁")}${show.transcriptUrl?`<p>${esc(show.transcriptNote||"可在原始節目頁閱讀英文逐字稿。")}</p>${link(show.transcriptUrl,"官方逐字稿")}${show.altTranscriptUrl?link(show.altTranscriptUrl,"YouTube 自動轉錄稿"):""}`:""}${show.chapters?.length?`<h3>可以從這裡聽</h3><ul>${show.chapters.map(c=>`<li>${esc(c)}</li>`).join("")}</ul>`:""}`,"節目原文、影片與逐字稿")}${actions(show)}</div></article>`;
}
function newsCard(item) {
  return `<article class="news-card"><div class="item-meta">${esc(item.source)} · ${dateLabel(item.date)} ${topicTag(item)}</div><h2>${esc(item.title)}</h2><p>${esc(item.what)}</p><ul>${item.points.map(p=>`<li>${esc(p)}</li>`).join("")}</ul>${originalPanel(`<h3 lang="en">${esc(item.originalTitle||item.title)}</h3>${item.originalExcerpt?`<blockquote lang="en">${esc(item.originalExcerpt)}</blockquote>`:""}${link(item.url,"閱讀原始來源")}`)}${actions(item)}</article>`;
}
function deepCard(item) {
  return `<article class="deep-card"><div class="deep-meta"><span>${esc(item.type)}</span><span>${esc(item.sourceDate)}</span></div><h2>${esc(item.title)}</h2><p class="deep-lead">${esc(item.lead)}</p><div class="deep-sections"><section><h3>流程與證據</h3><ul>${item.takeaways.map(p=>`<li>${esc(p)}</li>`).join("")}</ul></section><section><h3>文章角度</h3><p>${esc(item.angle)}</p><h3>資料限制</h3><p>${esc(item.caveat)}</p></section></div><div class="deep-sources">${item.sources.map(s=>link(s.url,s.label)).join("")}</div>${actions(item)}</article>`;
}
const kindLabels={posts:"X 觀點",podcasts:"Podcast",news:"新聞",deepDives:"深度選題"};
function readingPool() {return readingItems(content,feedback,{history:readingHistory,current:isCurrent});}
function briefCard(item,index,featured=false) {
  const n=noteFor(item), info=classify(item);
  return `<article class="brief-card ${featured?"is-featured":""}" id="${featured?"featured":"reading"}-${knowledgeId(item.url)}"><div class="brief-meta"><span>${featured?String(index+1).padStart(2,"0"):kindLabels[item.kind]}</span><span>${esc(item.sourceDate||item.date||"")}</span></div><h3><button data-open-reading="${esc(item.url)}">${esc(itemTitle(item))}<span aria-hidden="true">↗</span></button></h3><p class="brief-summary">${esc(n.summary)}</p><div class="concepts">${(info.concepts.length?info.concepts:[chapters.find(c=>c.id===info.primary)?.title]).map(c=>`<span>${esc(c)}</span>`).join("")}</div>${featured&&n.limit?`<p class="brief-limit"><strong>資料限制</strong>${esc(n.limit)}</p>`:""}<div class="brief-bottom">${link(item.url,item.source||item.author||item.series||"原始來源")}${actions(item)}</div></article>`;
}
function renderReading() {
  const pool=readingPool(), deep=pool.filter(x=>x.kind==='deepDives');
  const featured=deep.slice(0,3);
  document.getElementById('featured-list').innerHTML=featured.length?featured.map((x,i)=>briefCard(x,i,true)).join(''):'<div class="empty-state">這次精選已讀完，可探索其他來源或查看收藏。</div>';
  document.getElementById('reading-count').textContent=pool.length;
  const q=readingQuery.trim().toLocaleLowerCase();
  const items=pool.filter(x=>(readingChapter==='all'||classify(x).themes.includes(readingChapter))&&(!q||[itemTitle(x),...Object.values(noteFor(x)).flat().filter(v=>typeof v==='string'),...classify(x).concepts,x.source,x.author,x.series].join(' ').toLocaleLowerCase().includes(q)));
  document.getElementById('reading-nav').innerHTML=`<button data-reading-chapter="all" aria-pressed="${readingChapter==='all'}">全部資料 <span>${pool.length}</span></button>`+chapters.filter(c=>c.id!=='other'||pool.some(x=>classify(x).primary==='other')).map(c=>`<button data-reading-chapter="${c.id}" aria-pressed="${readingChapter===c.id}">${esc(c.title)}<span>${pool.filter(x=>classify(x).themes.includes(c.id)).length}</span></button>`).join('');
  document.getElementById('explore-summary').textContent=`${items.length} 篇${readingHistory?'（含歷史與已讀）':'待讀資料'}${readingChapter==='all'?'':' · '+chapters.find(c=>c.id===readingChapter).title}`;
  document.getElementById('explore-list').innerHTML=items.length?items.map((x,i)=>briefCard(x,i)).join(''):'<div class="empty-state">沒有符合條件的資料。可更換主題、搜尋詞，或納入歷史與已讀。</div>';
  const linked=items.map(x=>({item:x,relation:x.knowledge?.related?.find(r=>pool.some(y=>y.url===r.url))})).find(x=>x.relation);
  document.getElementById('reading-connections').innerHTML=linked&&readingChapter!=='all'&&!q?`<aside class="connection"><p class="eyebrow">READ TOGETHER</p><h3>把兩份證據放在一起讀</h3><p>${esc(linked.relation.reason)}</p><div><button data-open-reading="${esc(linked.item.url)}">${esc(itemTitle(linked.item))} ↗</button><button data-open-reading="${esc(linked.relation.url)}">${esc(itemTitle(pool.find(x=>x.url===linked.relation.url)))} ↗</button></div></aside>`:'';
}
function openReadingItem(url) {
  if(stateFor(url).saved){openKnowledgeItem(url);return;}
  const item=readingItems(content,feedback,{history:true,current:isCurrent}).find(x=>x.url===url);
  if(!item)return;
  const type={posts:'x-posts',podcasts:'podcasts',news:'news',deepDives:'deep-dives'}[item.kind];
  if(type==='deep-dives'){deepFilter='all';historyView[type]=!!(stateFor(url).read||stateFor(url).rejected);renderDeep();}
  else{topicView[type]='all';historyView[type]=!isCurrent(type,item);render(type);}
  activateTab(type);
  requestAnimationFrame(()=>{const target=[...document.querySelectorAll(`#${type} article`)].find(a=>a.querySelector('[data-url]')?.dataset.url===url);target?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});});
}
const categories = {"x-posts":["posts","posts-list","x-count",postCard],"podcasts":["podcasts","podcasts-list","podcast-count",podcastCard],"news":["news","news-list","news-count",newsCard]};
function render(type) {
  const [key, listId, countId, card] = categories[type];
  const sorted = [...content[key]].sort((a,b) => {
    const byDate = b.date.localeCompare(a.date);
    if (byDate || type !== 'x-posts') return byDate;
    const aId = BigInt(a.url.match(/status\/(\d+)/)?.[1] || 0);
    const bId = BigInt(b.url.match(/status\/(\d+)/)?.[1] || 0);
    return aId === bId ? 0 : aId > bId ? -1 : 1;
  });
  const available = selectedItems(type, sorted);
  const items = available.filter(item => topicView[type] === "all" || item.topic === topicView[type]);
  const topicHost = document.querySelector(`[data-topics="${type}"]`);
  topicHost.innerHTML = Object.entries(topicLabels).filter(([topic]) => topic === "all" || content[key].some(item => item.topic === topic)).map(([topic,label]) => `<button type="button" class="topic-button" data-topic="${topic}" data-topic-tab="${type}" aria-pressed="${topicView[type] === topic}">${esc(label)}</button>`).join("");
  const list = document.getElementById(listId);
  list.innerHTML = items.length ? items.map(card).join("") : `<div class="empty-state">${topicView[type] !== "all" ? "這個主題目前沒有待閱讀內容。" : historyView[type] ? "這裡還沒有其他內容。" : "目前沒有待閱讀內容。收藏可在「我的知識庫」閱讀。"}</div>`;

  document.getElementById(countId).textContent = available.length;
  const button = document.querySelector(`[data-view="${type}"]`);
  button.textContent = historyView[type] ? "返回待閱讀" : "查看已讀與其他內容";
}
function renderFeedback() {
  const all = [...content.posts, ...content.podcasts, ...content.news, ...(content.deepDives || [])];
  const changed = Object.entries(feedback.items).filter(([,s]) => s.read || s.rejected || s.saved || s.note?.trim());
  const host = document.getElementById("feedback-list");
  host.innerHTML = changed.length ? `<h3>已記錄的判斷與筆記</h3>${changed.map(([url,s]) => { const item = all.find(x=>x.url===url); return `<div class="feedback-item"><strong>${esc(item?.title || item?.author || url)}</strong><span>${[s.read?'已讀':'',s.rejected?'沒幫助':'',s.saved?'已收藏':''].filter(Boolean).join(' · ')}</span>${s.note ? `<p>${esc(s.note)}</p>`:''}</div>`; }).join('')}` : "";
}
function activateTab(type, focus=false) {
  if (!categories[type] && !['reading','deep-dives','knowledge'].includes(type)) type = "reading";
  activeTab = type;
  document.querySelectorAll('.tabs button').forEach(tab => { const on=tab.dataset.tab===type; tab.setAttribute("aria-pressed",String(on)); if(on&&focus)tab.focus(); });
  document.querySelectorAll('.panel').forEach(panel=>{panel.hidden=panel.id!==type});
  if (type === 'knowledge') renderKnowledge();
  if (type === 'reading') renderReading();
  if (location.hash !== `#view-${type}`) history.replaceState(null,"",`#view-${type}`);
}
function updateItem(url, action) {
  const s = feedback.items[url] ||= {};
  if (action === "read") {s.read=!s.read; if(s.read)s.rejected=false;}
  if (action === "reject") {s.rejected=!s.rejected; if(s.rejected)s.read=false;}
  if (action === "save") {
    s.saved=!s.saved;
    if(!s.saved){s.read=false;s.rejected=false;}
    if(s.saved){s.savedAt=new Date().toISOString();s.snapshot=allItems(content).find(x=>x.url===url)||s.snapshot;}
    document.getElementById('reading-status').innerHTML=s.saved?'已整理到 <button type="button" class="text-button" data-open-knowledge>我的知識庫 →</button>':'已移回閱讀列表，筆記仍保留。';
  }
  s.updatedAt = new Date().toISOString();
  save(); Object.keys(categories).forEach(render); renderDeep(); renderReading(); renderKnowledge(); renderFeedback();
}
function renderDeep() {
  const available = (content.deepDives || []).filter(item=>{const s=stateFor(item.url);return !s.saved && (historyView['deep-dives'] ? s.read||s.rejected : !s.read&&!s.rejected)});
  const items=available.filter(item=>deepFilter==='all'||classify(item).outcome===deepFilter);
  document.querySelector('[data-view="deep-dives"]').textContent=historyView['deep-dives']?'返回待閱讀':'查看已讀與其他內容';
  document.querySelectorAll('[data-deep-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.deepFilter===deepFilter)));
  document.getElementById('deep-list').innerHTML = items.length ? items.map(deepCard).join('') : '<div class="empty-state">目前沒有深度選題。</div>';
  document.getElementById('deep-count').textContent = available.length;
}
async function copyFeedback() {
  const all=[...content.posts,...content.podcasts,...content.news,...(content.deepDives || [])];
  const lines=["Aiworks 資訊情報站回饋",`日期：${new Date().toLocaleDateString('zh-TW')}`,`總筆記：${feedback.generalNote || '（無）'}`];
  for (const [url,s] of Object.entries(feedback.items)) {
    if (!s.read && !s.rejected && !s.saved && !s.note?.trim()) continue;
    const item=all.find(x=>x.url===url);
    lines.push('',`${item?.title || item?.author || '內容'}｜${item?.date || ''}`,`狀態：${[s.read?'已讀':'',s.rejected?'沒幫助':'',s.saved?'收藏':''].filter(Boolean).join('、') || '有筆記'}`,`連結：${url}`,`筆記：${s.note || '（無）'}`);
  }
  try { await navigator.clipboard.writeText(lines.join('\n')); document.getElementById('save-status').textContent='回饋已複製，可貼到對話中'; }
  catch { document.getElementById('save-status').textContent='瀏覽器未允許複製，筆記仍保存在這台裝置'; }
}
function download(name,text,type) {
  const url=URL.createObjectURL(new Blob([text],{type}));
  const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function knowledgeId(url) { let hash=2166136261;for(const c of url)hash=Math.imul(hash^c.charCodeAt(0),16777619);return 'note-'+(hash>>>0).toString(36); }
function openKnowledgeItem(url) {
  knowledgeChapter='all';knowledgeQuery='';knowledgeOutcome='all';
  document.getElementById('knowledge-search').value='';document.getElementById('knowledge-outcome').value='all';
  activateTab('knowledge');
  requestAnimationFrame(()=>{const target=document.getElementById(knowledgeId(url));target?.scrollIntoView({behavior:'smooth',block:'start'});target?.focus({preventScroll:true})});
}
function knowledgeCard(item,all) {
  const related=relatedTo(item,all);
  return `<article id="${knowledgeId(item.url)}" class="knowledge-card" tabindex="-1"><div class="knowledge-meta"><span>${esc(outcomeLabels[item.info.outcome])}</span><span>${esc(item.date || item.sourceDate || '')}</span></div><h3>${esc(itemTitle(item))}</h3><p class="knowledge-abstract">${esc(item.note.summary)}</p>${item.note.points.length?`<ul>${item.note.points.map(p=>`<li>${esc(p)}</li>`).join('')}</ul>`:''}${item.note.limit?`<p class="knowledge-limit"><strong>資料限制</strong> ${esc(item.note.limit)}</p>`:''}${item.note.question?`<details class="knowledge-question"><summary>值得追問</summary><p>${esc(item.note.question)}</p></details>`:''}<div class="knowledge-sources">${item.note.sources.map(s=>link(s.url,s.label)).join('')}</div><div class="knowledge-taxonomy"><label>收進章節 <select data-reclassify="${esc(item.url)}" aria-label="調整 ${esc(itemTitle(item))} 的章節">${chapters.map(c=>`<option value="${c.id}" ${c.id===item.info.primary?'selected':''}>${esc(c.title)}</option>`).join('')}</select></label>${item.info.concepts.map(c=>`<span>${esc(c)}</span>`).join('')}</div>${related.length?`<div class="knowledge-related"><h4>相關筆記</h4>${related.map(r=>`<button type="button" data-related="${esc(r.item.url)}"><span>${esc(itemTitle(r.item))} ↗</span><small>${esc(r.reason)}</small></button>`).join('')}</div>`:''}${actions(item)}</article>`;
}
function renderKnowledge() {
  const all=savedItems(content,feedback);
  document.getElementById('knowledge-count').textContent=all.length;
  document.getElementById('knowledge-summary').textContent=all.length?`${all.length} 篇收藏，隨新收藏持續歸類與連結。`:'讀到值得留下的內容，按收藏就會整理到這裡。';
  const chapterCounts=Object.fromEntries(chapters.map(c=>[c.id,all.filter(x=>x.info.primary===c.id).length]));
  document.getElementById('knowledge-nav').innerHTML=`<button data-chapter="all" aria-pressed="${knowledgeChapter==='all'}">全部收藏 <span>${all.length}</span></button>`+chapters.filter(c=>chapterCounts[c.id]||feedback.chapterNotes[c.id]).map(c=>`<button data-chapter="${c.id}" aria-pressed="${knowledgeChapter===c.id}">${esc(c.title)} <span>${chapterCounts[c.id]}</span></button>`).join('');
  const query=knowledgeQuery.trim().toLocaleLowerCase();
  const filtered=all.filter(x=>(knowledgeChapter==='all'||x.info.primary===knowledgeChapter)&&(knowledgeOutcome==='all'||x.info.outcome===knowledgeOutcome)&&(!query||[itemTitle(x),x.note.summary,...x.note.points,x.state.note,...x.info.concepts].join(' ').toLocaleLowerCase().includes(query)));
  document.getElementById('knowledge-list').innerHTML=chapters.filter(c=>filtered.some(x=>x.info.primary===c.id)||(knowledgeChapter===c.id&&feedback.chapterNotes[c.id])).map(c=>`<section class="knowledge-chapter"><header><h2>${esc(c.title)}</h2><p>${esc(c.question)}</p></header><details class="chapter-notes"><summary>我的章節筆記</summary><textarea data-chapter-note="${c.id}" aria-label="${esc(c.title)}的章節筆記" placeholder="把這一組資料串成自己的觀點…">${esc(feedback.chapterNotes[c.id]||'')}</textarea></details>${filtered.filter(x=>x.info.primary===c.id).map(x=>knowledgeCard(x,all)).join('')}</section>`).join('') || `<div class="empty-state">${all.length?'沒有符合條件的收藏。':'收藏後會自動產生閱讀筆記與來源連結；既有收藏也會移入。'}</div>`;
}
async function init() {
  try {
    const response = await fetch('./content.json?v=20261003-2',{cache:'no-store'});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    content = await response.json();
    for(const item of allItems(content)){const s=stateFor(item.url);if(s.saved&&!s.snapshot)s.snapshot=item;}
    save();
    document.getElementById('edition-date').textContent = `內容更新 ${dateLabel(content.editionDate)}`;
    document.getElementById('reading-notes').value = feedback.generalNote || '';
    Object.keys(categories).forEach(render);
    renderDeep();
    renderReading();
    renderKnowledge();
    renderFeedback();
    activateTab(location.hash.slice(1).replace(/^view-/,''));
    requestAnimationFrame(()=>window.scrollTo(0,0));
    window.addEventListener('hashchange',()=>activateTab(location.hash.slice(1).replace(/^view-/,'')));
    document.querySelectorAll('.tabs button').forEach(tab=>tab.addEventListener('click',()=>{activateTab(tab.dataset.tab);window.scrollTo({top:0,behavior:'auto'})}));
    document.querySelector('.tabs').addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight'].includes(event.key))return;
      event.preventDefault(); const keys=['reading',...Object.keys(categories),'deep-dives','knowledge']; const shift=event.key==='ArrowRight'?1:-1;
      activateTab(keys[(keys.indexOf(activeTab)+shift+keys.length)%keys.length],true);
    });
    document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{historyView[button.dataset.view]=!historyView[button.dataset.view];button.dataset.view==='deep-dives'?renderDeep():render(button.dataset.view)}));
    document.querySelector('.content').addEventListener('click',event=>{const topic=event.target.closest('[data-topic]');if(topic){topicView[topic.dataset.topicTab]=topic.dataset.topic;render(topic.dataset.topicTab)}});
    document.querySelector('.content').addEventListener('click',event=>{
      const readingJump=event.target.closest('[data-open-reading]');if(readingJump){openReadingItem(readingJump.dataset.openReading);return;}
      const readingTopic=event.target.closest('[data-reading-chapter]');if(readingTopic){readingChapter=readingTopic.dataset.readingChapter;renderReading();return;}
      const video = event.target.closest('[data-video]');
      if (video) {
        video.closest('.podcast-media').innerHTML = `<iframe class="podcast-video" src="https://www.youtube-nocookie.com/embed/${esc(video.dataset.video)}?autoplay=1" title="${esc(video.dataset.videoTitle)} 影片" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
        return;
      }
      const deep=event.target.closest('[data-deep-filter]');if(deep){deepFilter=deep.dataset.deepFilter;renderDeep();return;}
      const jump=event.target.closest('[data-related]'); if(jump){openKnowledgeItem(jump.dataset.related);return;}
      const chapter=event.target.closest('[data-chapter]');if(chapter){knowledgeChapter=chapter.dataset.chapter;renderKnowledge();return;}
      const button=event.target.closest('[data-action]');
      if(button)updateItem(button.dataset.url,button.dataset.action);
    });
    document.querySelector('.content').addEventListener('input',event=>{if(!event.target.matches('[data-note-url]'))return;const s=feedback.items[event.target.dataset.noteUrl] ||= {};s.note=event.target.value;s.updatedAt=new Date().toISOString();save();renderFeedback()});
    document.getElementById('reading-search').addEventListener('input',event=>{readingQuery=event.target.value;renderReading()});
    document.getElementById('reading-history').addEventListener('change',event=>{readingHistory=event.target.checked;renderReading()});
    document.getElementById('reading-notes').addEventListener('input',event=>{feedback.generalNote=event.target.value;save()});
    document.getElementById('copy-feedback').addEventListener('click',copyFeedback);
    document.getElementById('reading-status').addEventListener('click',event=>{if(event.target.closest('[data-open-knowledge]'))activateTab('knowledge')});
    document.getElementById('knowledge-search').addEventListener('input',event=>{knowledgeQuery=event.target.value;renderKnowledge()});
    document.getElementById('knowledge-outcome').addEventListener('change',event=>{knowledgeOutcome=event.target.value;renderKnowledge()});
    document.getElementById('knowledge-list').addEventListener('input',event=>{if(event.target.matches('[data-chapter-note]')){feedback.chapterNotes[event.target.dataset.chapterNote]=event.target.value;save()}});
    document.getElementById('knowledge-list').addEventListener('change',event=>{if(event.target.matches('[data-reclassify]')){const state=feedback.items[event.target.dataset.reclassify];state.chapter=event.target.value;state.updatedAt=new Date().toISOString();save();renderKnowledge()}});
    document.getElementById('export-notes').addEventListener('click',()=>download('aiworks-knowledge.md',exportMarkdown(content,feedback),'text/markdown;charset=utf-8'));
    document.getElementById('export-backup').addEventListener('click',()=>download('aiworks-reading-backup.json',JSON.stringify({version:2,exportedAt:new Date().toISOString(),...feedback},null,2),'application/json'));
    document.getElementById('import-backup').addEventListener('change',async event=>{try{const file=event.target.files[0];if(!file)return;feedback=mergeBackup(feedback,JSON.parse(await file.text()));save();Object.keys(categories).forEach(render);renderDeep();renderReading();renderKnowledge();renderFeedback();document.getElementById('reading-notes').value=feedback.generalNote||'';document.getElementById('knowledge-status').textContent='備份已合併，較新的紀錄與既有筆記已保留。'}catch(error){document.getElementById('knowledge-status').textContent='無法匯入：'+error.message}event.target.value=''});
    window.addEventListener('storage',event=>{if(event.key!==storageKey||!event.newValue)return;try{feedback=JSON.parse(event.newValue);feedback.items||={};feedback.chapterNotes||={};Object.keys(categories).forEach(render);renderDeep();renderReading();renderKnowledge();renderFeedback()}catch{}});
  } catch(error) {
    console.error('Reading room unavailable',error);
    document.getElementById('featured-list').innerHTML='<p class="empty-state">內容暫時無法載入，請稍後重新整理。</p>';
  }
}
init();

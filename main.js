const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const dataUrl = value => esc(value);
const link = (url, label) => `<a class="source-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`;
const dateLabel = value => new Intl.DateTimeFormat("zh-TW", {year:"numeric",month:"long",day:"numeric",timeZone:"Asia/Taipei"}).format(new Date(`${value}T12:00:00+08:00`));
const storageKey = "aiworks-reading-room-feedback-v1";
let content;
let feedback = {items:{}, generalNote:""};
let activeTab = "x-posts";
const historyView = {"x-posts":false,"podcasts":false,"news":false};
let widgetsReady = false;
try { feedback = {...feedback, ...JSON.parse(localStorage.getItem(storageKey) || "{}")}; } catch { /* The page remains readable without storage. */ }
feedback.items ||= {};

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(feedback)); document.getElementById("save-status").textContent = "已儲存在這台裝置"; }
  catch { document.getElementById("save-status").textContent = "這個瀏覽器目前無法儲存筆記"; }
}
function stateFor(url) { return feedback.items[url] || {}; }
function ageInDays(date) { return Math.floor((Date.now() - new Date(`${date}T00:00:00+08:00`).getTime()) / 86400000); }
function isCurrent(type, item) {
  const state = stateFor(item.url);
  const withinWindow = type === "podcasts" || (ageInDays(item.date) >= 0 && ageInDays(item.date) < 14);
  return (withinWindow || state.saved) && (!state.read && !state.rejected || state.saved);
}
function selectedItems(type, items) { return items.filter(item => historyView[type] ? !isCurrent(type,item) : isCurrent(type,item)); }
function actions(item) {
  const s = stateFor(item.url);
  const url = dataUrl(item.url);
  return `<div class="actions" aria-label="閱讀狀態">
    <button type="button" data-action="read" data-url="${url}" class="action-button ${s.read?'is-active':''}" aria-pressed="${!!s.read}" title="標記已讀"><span aria-hidden="true">✓</span> 已讀</button>
    <button type="button" data-action="reject" data-url="${url}" class="action-button ${s.rejected?'is-active':''}" aria-pressed="${!!s.rejected}" title="這篇沒有幫助"><span aria-hidden="true">✕</span> 沒幫助</button>
    <button type="button" data-action="save" data-url="${url}" class="action-button ${s.saved?'is-saved':''}" aria-pressed="${!!s.saved}" title="收藏"><span aria-hidden="true">${s.saved?'★':'☆'}</span> 收藏</button>
    <details class="item-note"><summary>寫筆記</summary><textarea data-note-url="${url}" aria-label="這篇的筆記" placeholder="想法、問題、文章角度…">${esc(s.note || "")}</textarea></details>
  </div>`;
}
function postCard(post) {
  const quote = `<blockquote class="twitter-tweet" data-dnt="true" data-theme="light" data-conversation="none"><p lang="en">${esc(post.excerpt)}</p>&mdash; ${esc(post.author)} (${esc(post.handle)}) <a href="${esc(post.url)}">${esc(post.date)}</a></blockquote>`;
  return `<article class="post-card"><div class="post-meta"><span>${esc(post.author)} <span class="handle">${esc(post.handle)}</span></span><time datetime="${esc(post.date)}">${dateLabel(post.date)}</time></div><div class="post-embed">${quote}</div><div class="post-tools"><details class="translation"><summary>${post.kind === "translation" ? "看中文翻譯" : "看中文重點"}</summary><p>${esc(post.zh)}</p></details>${link(post.url,"到 X 看原文與留言")}</div>${actions(post)}</article>`;
}
function podcastCard(show) {
  const media = show.youtubeId
    ? `<iframe class="podcast-video" src="https://www.youtube-nocookie.com/embed/${esc(show.youtubeId)}" title="${esc(show.title)} 影片" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
    : `<a class="podcast-art" href="${esc(show.url)}" target="_blank" rel="noopener noreferrer"><img src="${esc(show.cover)}" alt="${esc(show.series)} 節目封面" loading="lazy" /><span>開啟原始節目 ↗</span></a>`;
  return `<article class="podcast-card"><div class="podcast-media">${media}</div><div class="podcast-body"><div class="item-meta">${esc(show.series)} · ${dateLabel(show.date)}</div><h2>${esc(show.title)}</h2><p class="context">${esc(show.context)}</p><h3>這集談什麼</h3><ul>${show.points.map(point=>`<li>${esc(point)}</li>`).join("")}</ul>${show.chapters?.length ? `<h3>可以從這裡聽</h3><div class="chapters">${show.chapters.map(chapter=>`<span>${esc(chapter)}</span>`).join("")}</div>` : ""}<div class="item-links">${link(show.url,"開啟單集")}${show.youtubeId ? link(`https://www.youtube.com/watch?v=${show.youtubeId}`,"到 YouTube 觀看") : ""}</div>${actions(show)}</div></article>`;
}
function newsCard(item) {
  return `<article class="news-card"><div class="item-meta">${esc(item.source)} · ${dateLabel(item.date)}</div><h2>${esc(item.title)}</h2><h3>這篇在談什麼</h3><p>${esc(item.what)}</p><h3>主要內容</h3><ul>${item.points.map(point=>`<li>${esc(point)}</li>`).join("")}</ul>${link(item.url,"閱讀原始來源")}${actions(item)}</article>`;
}
const categories = {"x-posts":["posts","posts-list","x-count",postCard],"podcasts":["podcasts","podcasts-list","podcast-count",podcastCard],"news":["news","news-list","news-count",newsCard]};
function loadWidgets() {
  if (window.twttr?.widgets) { window.twttr.widgets.load(document.getElementById("posts-list")); return; }
  if (widgetsReady) return;
  widgetsReady = true;
  const script = document.createElement("script");
  script.async = true; script.src = "https://platform.x.com/widgets.js"; script.charset = "utf-8";
  script.onload = () => window.twttr?.widgets?.load(document.getElementById("posts-list"));
  document.body.append(script);
}
function render(type) {
  const [key, listId, countId, card] = categories[type];
  const sorted = [...content[key]].sort((a,b) => {
    const byDate = b.date.localeCompare(a.date);
    if (byDate || type !== 'x-posts') return byDate;
    const aId = BigInt(a.url.match(/status\/(\d+)/)?.[1] || 0);
    const bId = BigInt(b.url.match(/status\/(\d+)/)?.[1] || 0);
    return aId === bId ? 0 : aId > bId ? -1 : 1;
  });
  const items = selectedItems(type, sorted);
  const list = document.getElementById(listId);
  list.innerHTML = items.length ? items.map(card).join("") : `<div class="empty-state">${historyView[type] ? "這裡還沒有其他內容。" : "目前沒有待閱讀內容。收藏的內容會保留在這裡。"}</div>`;
  document.getElementById(countId).textContent = selectedItems(type, sorted).length;
  const button = document.querySelector(`[data-view="${type}"]`);
  button.textContent = historyView[type] ? "返回待閱讀" : "查看已讀與其他內容";
  if (type === "x-posts") loadWidgets();
}
function renderFeedback() {
  const all = [...content.posts, ...content.podcasts, ...content.news];
  const changed = Object.entries(feedback.items).filter(([,s]) => s.read || s.rejected || s.saved || s.note?.trim());
  const host = document.getElementById("feedback-list");
  host.innerHTML = changed.length ? `<h3>已記錄的判斷與筆記</h3>${changed.map(([url,s]) => { const item = all.find(x=>x.url===url); return `<div class="feedback-item"><strong>${esc(item?.title || item?.author || url)}</strong><span>${[s.read?'已讀':'',s.rejected?'沒幫助':'',s.saved?'已收藏':''].filter(Boolean).join(' · ')}</span>${s.note ? `<p>${esc(s.note)}</p>`:''}</div>`; }).join('')}` : "";
}
function activateTab(type, focus=false) {
  if (!categories[type]) type = "x-posts";
  activeTab = type;
  document.querySelectorAll('.tabs button').forEach(tab => { const on=tab.dataset.tab===type; tab.setAttribute("aria-pressed",String(on)); if(on&&focus)tab.focus(); });
  document.querySelectorAll('.panel').forEach(panel=>{panel.hidden=panel.id!==type});
  if (location.hash !== `#view-${type}`) history.replaceState(null,"",`#view-${type}`);
}
function updateItem(url, action) {
  const s = feedback.items[url] ||= {};
  if (action === "read") {s.read=!s.read; if(s.read)s.rejected=false;}
  if (action === "reject") {s.rejected=!s.rejected; if(s.rejected)s.read=false;}
  if (action === "save") s.saved=!s.saved;
  s.updatedAt = new Date().toISOString();
  save(); render(activeTab); renderFeedback();
}
async function copyFeedback() {
  const all=[...content.posts,...content.podcasts,...content.news];
  const lines=["Aiworks 資訊情報站回饋",`日期：${new Date().toLocaleDateString('zh-TW')}`,`總筆記：${feedback.generalNote || '（無）'}`];
  for (const [url,s] of Object.entries(feedback.items)) {
    if (!s.read && !s.rejected && !s.saved && !s.note?.trim()) continue;
    const item=all.find(x=>x.url===url);
    lines.push('',`${item?.title || item?.author || '內容'}｜${item?.date || ''}`,`狀態：${[s.read?'已讀':'',s.rejected?'沒幫助':'',s.saved?'收藏':''].filter(Boolean).join('、') || '有筆記'}`,`連結：${url}`,`筆記：${s.note || '（無）'}`);
  }
  try { await navigator.clipboard.writeText(lines.join('\n')); document.getElementById('save-status').textContent='回饋已複製，可貼到對話中'; }
  catch { document.getElementById('save-status').textContent='瀏覽器未允許複製，筆記仍保存在這台裝置'; }
}
async function init() {
  try {
    const response = await fetch('./content.json',{cache:'no-store'});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    content = await response.json();
    document.getElementById('edition-date').textContent = `內容更新 ${dateLabel(content.editionDate)}`;
    document.getElementById('reading-notes').value = feedback.generalNote || '';
    Object.keys(categories).forEach(render);
    renderFeedback();
    activateTab(location.hash.slice(1).replace(/^view-/,''));
    requestAnimationFrame(()=>window.scrollTo(0,0));
    window.addEventListener('hashchange',()=>activateTab(location.hash.slice(1).replace(/^view-/,'')));
    document.querySelectorAll('.tabs button').forEach(tab=>tab.addEventListener('click',()=>{activateTab(tab.dataset.tab);window.scrollTo({top:0,behavior:'auto'})}));
    document.querySelector('.tabs').addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight'].includes(event.key))return;
      event.preventDefault(); const keys=Object.keys(categories); const shift=event.key==='ArrowRight'?1:-1;
      activateTab(keys[(keys.indexOf(activeTab)+shift+keys.length)%keys.length],true);
    });
    document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{historyView[button.dataset.view]=!historyView[button.dataset.view];render(button.dataset.view)}));
    document.querySelector('.content').addEventListener('click',event=>{const button=event.target.closest('[data-action]');if(button)updateItem(button.dataset.url,button.dataset.action)});
    document.querySelector('.content').addEventListener('input',event=>{if(!event.target.matches('[data-note-url]'))return;const s=feedback.items[event.target.dataset.noteUrl] ||= {};s.note=event.target.value;s.updatedAt=new Date().toISOString();save();renderFeedback()});
    document.getElementById('reading-notes').addEventListener('input',event=>{feedback.generalNote=event.target.value;save()});
    document.getElementById('copy-feedback').addEventListener('click',copyFeedback);
  } catch(error) {
    console.error('Reading room unavailable',error);
    document.getElementById('posts-list').innerHTML='<p>內容暫時無法載入，請稍後重新整理。</p>';
  }
}
init();

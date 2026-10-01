const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const dataUrl = value => esc(value);
const link = (url, label) => `<a class="source-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`;
const dateLabel = value => new Intl.DateTimeFormat("zh-TW", {year:"numeric",month:"long",day:"numeric",timeZone:"Asia/Taipei"}).format(new Date(`${value}T12:00:00+08:00`));
const storageKey = "aiworks-reading-room-feedback-v1";
let content;
let feedback = {items:{}, generalNote:""};
let activeTab = "x-posts";
const historyView = {"x-posts":false,"podcasts":false,"news":false};
const topicView = {"x-posts":"all","podcasts":"all","news":"all"};
const topicLabels = {all:"全部",case:"公司案例",product:"新功能",trend:"趨勢與新詞"};
const topicTag = item => `<span class="topic-tag">${esc(topicLabels[item.topic] || topicLabels.trend)}</span>`;
try { feedback = {...feedback, ...JSON.parse(localStorage.getItem(storageKey) || "{}")}; } catch { /* The page remains readable without storage. */ }
feedback.items ||= {};

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
  const replies = post.replyObservation ? `<div class="reply-observation"><div class="column-label">留言觀察 · 公開可見 ${post.replyObservation.count} 則</div><p>${esc(post.replyObservation.summary)}</p><p class="reply-limit">只根據目前可見的回覆整理，完整討論請開啟 X。</p></div>` : "";
  const evidence = post.evidenceUrl ? `<div class="post-evidence">${link(post.evidenceUrl,post.evidenceLabel || "參考原始資料")}</div>` : "";
  return `<article class="post-card"><div class="post-meta"><span>${esc(post.author)} <span class="handle">${esc(post.handle)}</span></span><span class="meta-right">${topicTag(post)}<time datetime="${esc(post.date)}">${dateLabel(post.date)}</time></span></div><div class="post-original"><div class="column-label">英文原文</div><blockquote class="twitter-tweet" data-conversation="none" data-dnt="true" lang="en"><p lang="en">${esc(post.excerpt)}</p><small>${post.originalIsFull ? "" : "節錄，完整原文請開啟 X。"}</small><a href="${esc(post.url)}">在 X 閱讀完整原文</a></blockquote></div><div class="post-reading"><div class="column-label">中文重點</div><p class="post-summary">${esc(post.zh)}</p>${evidence}</div>${replies}<a class="post-open" href="${esc(post.url)}" target="_blank" rel="noopener noreferrer">開啟 X 貼文與留言 <span aria-hidden="true">↗</span></a>${actions(post)}</article>`;
}
function loadXEmbeds() { window.twttr?.widgets?.load?.(document.getElementById("posts-list")); }
function podcastCard(show) {
  const media = show.youtubeId
    ? `<button type="button" class="video-trigger" data-video="${esc(show.youtubeId)}" data-video-title="${esc(show.title)}" aria-label="播放 ${esc(show.title)} 影片"><img src="https://i.ytimg.com/vi/${esc(show.youtubeId)}/hqdefault.jpg" alt="" loading="lazy" /><span><i aria-hidden="true">▶</i> 播放影片</span></button>`
    : `<a class="podcast-art" href="${esc(show.url)}" target="_blank" rel="noopener noreferrer"><img src="${esc(show.cover)}" alt="${esc(show.series)} 節目封面" loading="lazy" /><span>開啟原始節目 ↗</span></a>`;
  const originalLanguage = show.originalLanguage === "zh" ? "zh-Hant" : "en";
  const originalLabel = show.originalLanguage === "zh" ? "原始節目資訊（中文）" : "原始節目資訊（英文）";
  const transcript = show.transcriptUrl ? `<div class="transcript-access"><strong>英文逐字稿</strong><p>${esc(show.transcriptNote || "可在原始節目頁閱讀英文逐字稿。")}</p>${show.altTranscriptUrl ? `<div>${link(show.altTranscriptUrl,"在 YouTube 閱讀英文自動轉錄稿")}</div>` : ""}<div>${link(show.transcriptUrl,"閱讀節目官方英文逐字稿")}</div></div>` : "";
  return `<article class="podcast-card"><div class="podcast-media">${media}</div><div class="podcast-body"><div class="item-meta">${esc(show.series)} · ${dateLabel(show.date)} ${topicTag(show)}</div><h2>${esc(show.title)}</h2><div class="reading-columns"><div class="original-pane"><div class="column-label">${originalLabel}</div>${show.originalTitle && show.originalTitle !== show.title ? `<h3 lang="${originalLanguage}">${esc(show.originalTitle)}</h3>` : ""}${show.originalExcerpt ? `<blockquote lang="${originalLanguage}">${esc(show.originalExcerpt)}</blockquote>` : ""}${link(show.url,"閱讀原始節目頁")}${transcript}</div><div class="summary-pane"><div class="column-label">中文導讀</div><p class="context">${esc(show.context)}</p><h3>內容重點摘要</h3><ul>${show.points.map(point=>`<li>${esc(point)}</li>`).join("")}</ul>${show.chapters?.length ? `<h3>可以從這裡聽</h3><div class="chapters">${show.chapters.map(chapter=>`<span>${esc(chapter)}</span>`).join("")}</div>` : ""}</div></div>${show.youtubeId ? `<div class="item-links">${link(`https://www.youtube.com/watch?v=${show.youtubeId}`,"到 YouTube 觀看")}</div>` : ""}${actions(show)}</div></article>`;
}
function newsCard(item) {
  return `<article class="news-card"><div class="item-meta">${esc(item.source)} · ${dateLabel(item.date)} ${topicTag(item)}</div><h2>${esc(item.title)}</h2><div class="reading-columns"><div class="original-pane"><div class="column-label">原始英文資訊</div><h3 lang="en">${esc(item.originalTitle || item.title)}</h3>${item.originalExcerpt ? `<blockquote lang="en">${esc(item.originalExcerpt)}</blockquote>` : ""}${link(item.url,"閱讀英文原文")}</div><div class="summary-pane"><div class="column-label">中文摘要</div><h3>這篇在談什麼</h3><p>${esc(item.what)}</p><h3>主要內容</h3><ul>${item.points.map(point=>`<li>${esc(point)}</li>`).join("")}</ul></div></div>${actions(item)}</article>`;
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
  list.innerHTML = items.length ? items.map(card).join("") : `<div class="empty-state">${topicView[type] !== "all" ? "這個主題目前沒有待閱讀內容。" : historyView[type] ? "這裡還沒有其他內容。" : "目前沒有待閱讀內容。收藏的內容會保留在這裡。"}</div>`;
  if (type === "x-posts") requestAnimationFrame(loadXEmbeds);
  document.getElementById(countId).textContent = available.length;
  const button = document.querySelector(`[data-view="${type}"]`);
  button.textContent = historyView[type] ? "返回待閱讀" : "查看已讀與其他內容";
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
    const response = await fetch('./content.json?v=20261001-7',{cache:'no-store'});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    content = await response.json();
    document.getElementById('edition-date').textContent = `內容更新 ${dateLabel(content.editionDate)}`;
    document.getElementById('reading-notes').value = feedback.generalNote || '';
    Object.keys(categories).forEach(render);
    const embedScript = document.createElement("script");
    embedScript.src = "https://platform.twitter.com/widgets.js";
    embedScript.async = true;
    embedScript.onload = loadXEmbeds;
    document.head.append(embedScript);
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
    document.querySelector('.content').addEventListener('click',event=>{const topic=event.target.closest('[data-topic]');if(topic){topicView[topic.dataset.topicTab]=topic.dataset.topic;render(topic.dataset.topicTab)}});
    document.querySelector('.content').addEventListener('click',event=>{
      const video = event.target.closest('[data-video]');
      if (video) {
        video.closest('.podcast-media').innerHTML = `<iframe class="podcast-video" src="https://www.youtube-nocookie.com/embed/${esc(video.dataset.video)}?autoplay=1" title="${esc(video.dataset.videoTitle)} 影片" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
        return;
      }
      const button=event.target.closest('[data-action]');
      if(button)updateItem(button.dataset.url,button.dataset.action);
    });
    document.querySelector('.content').addEventListener('input',event=>{if(!event.target.matches('[data-note-url]'))return;const s=feedback.items[event.target.dataset.noteUrl] ||= {};s.note=event.target.value;s.updatedAt=new Date().toISOString();save();renderFeedback()});
    document.getElementById('reading-notes').addEventListener('input',event=>{feedback.generalNote=event.target.value;save()});
    document.getElementById('copy-feedback').addEventListener('click',copyFeedback);
  } catch(error) {
    console.error('Reading room unavailable',error);
    document.getElementById('posts-list').innerHTML='<p>內容暫時無法載入，請稍後重新整理。</p>';
  }
}
init();

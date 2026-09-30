const esc=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const link=(url,label,cls="source-link")=>`<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`;
const dateLabel=value=>new Intl.DateTimeFormat("zh-TW",{year:"numeric",month:"long",day:"numeric",timeZone:"Asia/Taipei"}).format(new Date(`${value}T12:00:00+08:00`));

function postCard(post){
  const embedded=`<blockquote class="twitter-tweet" data-dnt="true" data-theme="light"><p lang="en">${esc(post.excerpt)}</p>&mdash; ${esc(post.author)} (${esc(post.handle)}) <a href="${esc(post.url)}">${esc(post.date)}</a></blockquote>`;
  return `<article class="post-card"><div class="post-head"><div><span class="post-author">${esc(post.author)}</span><span class="post-handle">${esc(post.handle)}</span></div><span class="post-date">${esc(post.date)}</span></div><div class="post-embed">${embedded}</div><div class="post-actions"><details class="translation"><summary>${post.kind==="translation"?"看中文翻譯":"看中文重點"}</summary><div class="translation-body"><p>${esc(post.zh)}</p></div></details>${link(post.url,"前往 X 看原文")}</div></article>`;
}
function podcastCard(show){
  return `<article class="podcast-card"><div class="podcast-side"><span class="podcast-series">${esc(show.series)}</span><span class="podcast-date">${esc(show.date)}</span>${link(show.url,"開啟單集")}</div><div><h3>${esc(show.title)}</h3><p class="podcast-context">${esc(show.context)}</p><h4>這集談什麼</h4><ul class="podcast-points">${show.points.map(point=>`<li>${esc(point)}</li>`).join("")}</ul>${show.chapters?.length?`<h4>可以先從這裡聽</h4><div class="podcast-chapters">${show.chapters.map(chapter=>`<span>${esc(chapter)}</span>`).join("")}</div>`:""}</div></article>`;
}
function newsCard(item){return `<article class="news-card"><p class="news-meta">${esc(item.date)} · ${esc(item.source)}</p><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p>${link(item.url,"閱讀原始來源")}</article>`;}

async function init(){
  try{
    const response=await fetch("./content.json",{cache:"no-store"});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const content=await response.json();
    document.getElementById("edition-date").textContent=`選讀更新 ${dateLabel(content.editionDate)}`;
    document.getElementById("x-count").textContent=`${content.posts.length} 則原文`;
    document.getElementById("podcast-count").textContent=`${content.podcasts.length} 集導讀`;
    document.getElementById("news-count").textContent=`${content.news.length} 則精選`;
    document.getElementById("posts-list").innerHTML=content.posts.map(postCard).join("");
    document.getElementById("podcasts-list").innerHTML=content.podcasts.map(podcastCard).join("");
    document.getElementById("news-list").innerHTML=content.news.map(newsCard).join("");
    const script=document.createElement("script");script.async=true;script.src="https://platform.twitter.com/widgets.js";script.charset="utf-8";script.onload=()=>window.twttr?.widgets?.load(document.getElementById("posts-list"));document.body.append(script);
  }catch(error){
    console.error("Reading room content unavailable",error);
    document.getElementById("posts-list").innerHTML="<p>內容暫時無法載入，請稍後重新整理。</p>";
  }
}
init();

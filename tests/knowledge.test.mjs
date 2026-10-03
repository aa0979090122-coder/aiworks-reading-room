import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const code=await readFile(new URL('../knowledge.js',import.meta.url),'utf8');
const {savedItems,relatedTo,mergeBackup,exportMarkdown}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const content=JSON.parse(await readFile(new URL('../content.json',import.meta.url),'utf8'));
const a=content.deepDives.find(x=>x.url.includes('fine-tuning-agent'));
const b=content.deepDives.find(x=>x.url.includes('continual-learning'));
const oldUrl='https://example.org/preserved';
const feedback={items:{[a.url]:{saved:true,note:'保留我的觀點',updatedAt:'2026-10-02T01:00:00Z'},[b.url]:{saved:true},[oldUrl]:{saved:true,snapshot:{url:oldUrl,title:'歷史收藏',zh:'保留來源'},note:'歷史筆記'}},chapterNotes:{evaluation:'我的綜合判斷'}};
const saved=savedItems(content,feedback);
assert.equal(saved.length,3);
assert.equal(saved.find(x=>x.url===a.url).info.primary,'evaluation');
assert.equal(saved.find(x=>x.url===oldUrl).title,'歷史收藏');
assert(relatedTo(saved.find(x=>x.url===a.url),saved).some(r=>r.item.url===b.url&&r.reason.includes('失敗復盤')));
assert(relatedTo(saved.find(x=>x.url===b.url),saved).some(r=>r.item.url===a.url));
const merged=mergeBackup(feedback,{items:{[a.url]:{note:'舊備份',updatedAt:'2025-01-01'},'https://new.example':{saved:true,note:'新資料'}}});
assert.equal(merged.items[a.url].note,'保留我的觀點');
assert.equal(merged.items[oldUrl].note,'歷史筆記');
assert(merged.items['https://new.example'].saved);
const md=exportMarkdown(content,feedback);
assert(md.includes('我的綜合判斷')&&md.includes(a.url)&&md.includes(b.url)&&md.includes('保留我的觀點'));
feedback.items[a.url].chapter='workflow';
assert.equal(savedItems(content,feedback).find(x=>x.url===a.url).info.primary,'workflow');
feedback.items[a.url].saved=false;
assert(!savedItems(content,feedback).some(x=>x.url===a.url));
assert.equal(feedback.items[a.url].note,'保留我的觀點');
console.log('Passed: existing favorites, preserved sources, two-way links, classification override, additive restore, export, unsave.');
const {readingItems}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const same='https://example.org/shared';
const fixture={posts:[{url:same,title:'短版'},{url:'https://example.org/old',date:'2020-01-01'}],deepDives:[{url:same,title:'完整資料'}]};
const blank={items:{}};
assert.equal(readingItems(fixture,blank,{current:()=>false}).length,1);
assert.equal(readingItems(fixture,blank,{history:true}).find(x=>x.url===same).title,'完整資料');
assert.equal(readingItems(fixture,{items:{[same]:{saved:true}}},{history:true}).length,1);
assert.equal(readingItems(fixture,{items:{[same]:{read:true}}},{current:()=>false}).length,0);
assert.equal(readingItems(fixture,{items:{[same]:{read:true}}},{history:true}).length,2);
assert.equal(fixture.posts.length,2);
console.log('Passed: cross-source deduplication, curated priority, saved/read exclusion, historical access, source preservation.');

const dailyUrls=new Set(['posts','podcasts','news'].flatMap(k=>(content[k]||[]).map(x=>x.url)));
for(const item of content.deepDives||[])assert(dailyUrls.has(item.url),'Every deep source must have a daily reading entry');
for(const set of content.readingSets||[]){
 assert(set.urls.length>=2,'A deep topic must compare multiple sources');
 for(const url of set.urls)assert(dailyUrls.has(url),'Deep source must appear in a daily category: '+url);
}
for(const note of content.knowledgeLibrary||[]){
 const publicMd=await readFile(new URL('../'+note.markdownFile,import.meta.url),'utf8');
 const item=['posts','podcasts','news'].flatMap(k=>content[k]||[]).find(x=>x.url===note.url);
 assert.equal(item.knowledge.noteBody,publicMd.replace(/^# .+\n\s*/,'').trimEnd()+'\n');
 assert(!publicMd.includes('personalNoteHash'));
}
console.log('Passed: deep topics use daily sources; public note body matches its Markdown.');

import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {candidates,relatedArticles,sourceTimestamp,weekOf,inlineReading,sourceLens,sourceQuestions} from '../editorial-map.js';
import {allItems} from '../knowledge.js';
const data=JSON.parse(await readFile(new URL('../editorial-map.json',import.meta.url)));
const content=JSON.parse(await readFile(new URL('../content.json',import.meta.url)));
const ids=new Set();
for(const topic of data.topics)for(const q of topic.questions){assert(!ids.has(q.id));ids.add(q.id);assert(q.stages.every(s=>data.stages.some(x=>x.id===s)));assert(q.keywords.length);assert(relatedArticles(data,q).every(a=>a.url.startsWith('https://aiworks.tw/')));}
const topic=data.topics.find(t=>t.id==='value'),q=topic.questions.find(q=>q.id==='value-roi');
const list=candidates(allItems(content),topic,q);
assert(list.some(x=>x.item.url.includes('dbs.com')));
assert(list.some(x=>x.item.url.includes('bcg.com')));
assert(list.every(x=>x.explicit||x.hitCount>0));
assert(!candidates([{url:'https://example.com',title:'完全無關',knowledge:{themes:['evaluation']}}],topic,q).length);
assert.equal(weekOf(new Date('2026-10-11T16:30:00Z')),'2026-10-12');
assert.equal(weekOf(new Date('2026-10-11T15:30:00Z')),'2026-10-05');
assert(sourceTimestamp({sourceDate:'2026 年 10 月 2 日'})>sourceTimestamp({date:'2026-09-30'}));
const markup=inlineReading({title:'<img src=x onerror=alert(1)>',url:'javascript:alert(1)',what:'<script>unsafe</script>',caveat:'摘要有來源限制'});
assert(!markup.includes('<script>'));assert(!markup.includes('href="javascript:'));assert(markup.includes('摘要有來源限制'));assert(markup.includes('<details'));
assert(!markup.includes('data-source-jump'));
assert.equal(sourceLens({knowledge:{outcome:'report'}}),'research');
console.log(`Passed: ${ids.size} question IDs, cross-media evidence candidates, unrelated-source exclusion, public article mapping, Taipei weekly rollover, source dates, safe inline preview.`);

assert.equal(data.articles.length,138);assert.equal(data.articles.filter(a=>a.contentStatus==='reviewed').length,135);assert.equal(data.articles.filter(a=>a.contentStatus==='unavailable').length,3);assert.equal(new Set(data.articles.map(a=>a.url)).size,138);for(const a of data.articles){if(a.contentStatus==='unavailable')assert.equal(a.answers.length,0);for(const answer of a.answers){assert(ids.has(answer.questionId));assert(answer.evidence);assert(['main','partial'].includes(answer.level));}}

for(const id of ids)assert(data.profiles.some(p=>p.questionIds.includes(id)),`Question ${id} must be reachable in the map`);
const practical=data.topics.flatMap(t=>t.questions).find(q=>q.id==='value-practical-metrics');
assert.equal(practical.scenarioOptions.length,3);
assert(practical.readingPrompts.some(x=>x.status==='open'));
assert(practical.readingPrompts.every(x=>x.question&&x.next&&['supported','partial','open'].includes(x.status)&&x.evidenceUrls.every(u=>/^https:\/\//.test(u))));
for(const x of data.editorialCandidates){assert(ids.has(x.questionId));assert(allItems(content).some(a=>a.url===x.sourceUrl));}

const followups=sourceQuestions({url:'https://example.com',followupQuestions:[{question:'<img src=x onerror=alert(1)>',answer:'<script>unsafe</script>',status:'open',next:'補查原文'}]});assert(!followups.includes('<script>'));assert(!followups.includes('<img'));assert(followups.includes('待查'));assert(followups.includes('補查原文'));

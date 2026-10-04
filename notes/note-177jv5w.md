# Uber Agentic Pods：兩週內把 AI 工程師放進業務現場

## English
Uber describes short collaborative deployments of AI engineers into business teams. The useful question is how teams select problems, work with process owners and decide what can move beyond a prototype.

Uber CTO Praveen Neppalli Naga says roughly 30 AI-proficient engineers were paired with domain experts. Each pod spent two days shadowing, one day selecting a problem, two days building, four days validating with other users, then shipped on day ten. Sixteen pods ran across sixteen functions in two months. The reported time reductions are Uber estimates; the post does not publish quality, maintenance, or full cost measurements.

## 中文筆記
Uber 技術長分享的組織做法：讓熟悉 AI 的工程師與業務專家配對，先觀察實際工作，再挑選、建置、驗證與交付代理工作流程。

- 約 30 位工程師參與；每組用兩週，前兩天觀察工作，第 3 天選題，第 4 至 5 天共同製作，第 6 至 9 天找其他使用者驗證，第 10 天交付。
- Uber 自述兩個月內在 16 個業務職能運行 16 組 Pods；150 個城市的資金配置作業由 15 小時縮至 30 分鐘，財務進度報告由兩天縮至 10 分鐘。
- 值得研究的是如何找到隱藏在交接、例外與系統之間的工作阻塞，以及業務專家在設計與驗證中扮演的角色。

## 資料限制
時間與採用數字由 Uber 技術長自行公布；公開貼文沒有提供成本、品質、長期維護或對照組資料。文章應把它當作具體導入案例，避免把縮時直接換算成投資報酬率。

## 延伸理解
這套安排把現場觀察放在開發之前。第 3 天選題時，Pod 同時看工作重複性、影響與資料可取得程度；第 6 至 9 天找同一職務的其他人驗證，確認做法能否離開最初那位專家。這些步驟比「兩週做出 Agent」更能解釋為何工程師有機會找到文件裡看不到的交接與例外。

[Uber Software Factory 的成本拆解](note-1jrlpan.md)回答另一個問題：使用量擴大後，如何按工作負載選模型、追蹤每次任務的成本。Pods 的縮時數字和 Software Factory 的單位成本數字衡量不同工作，不能合算成同一筆投資報酬。

## 來源
[原始來源](https://www.linkedin.com/posts/pneppalli_agentic-ai-adoption-is-on-fire-at-uber-and-activity-7480367291851833344-6Lhm)

<!-- my-note -->
## 我的想法
Sixteen functions in two months is a fast cadence for something built by pairing an engineer with a domain expert instead of a specialized automation team, which suggests the real bottleneck was domain access, not technical skill. That's usually the actual constraint on internal automation: engineers who can build agents rarely have deep context on finance or legal workflows, and domain experts rarely have the technical fluency to build agents themselves. Pairing them directly, instead of routing through a central platform team, removes a translation layer that normally loses information.

This is the right way to think about agentic AI adoption.
 
The real unlock is not “agents replacing tasks.” It is domain experts and engineers sitting together long enough to see how work actually moves across systems, approvals, exceptions, and hidden handoffs.
 
That is where most automation programs miss the mark. They automate the visible task, while the real value is trapped in the workflow around it.
 
“Workflow as the unit of automation” is the key line here.   

The line that matters most: the best opportunities weren't visible from outside the workflow. You find them by sitting next to the person doing the work — not by reading the process documentation. the shadowing-first discipline is the part every industry should be borrowing

Completely agree Praveen Neppalli Naga. The next challenge won't be building more AI agents — it will be trusting, governing, and continuously verifying them at enterprise scale.  

As organizations move to thousands of agents, decision lineage, context drift, policy compliance, measurable trust, and audit-ready evidence will become just as important as productivity. The winners will be those who can not only automate work, but also prove every AI decision can be trusted. : )

The detail that stands out most in this case isn't the time saved, it's the shift in unit of analysis. Moving from "automate a task" to "redesign the workflow" completely changes the kind of outcome you can extract. Pairing an engineer with a domain expert for ten days is a smart way to solve the biggest bottleneck of AI outside engineering: you can't automate well what you only know from a flowchart. The lesson that stands out for any company is this, the best AI opportunities are hidden inside the real work, not in the documentation of it.
<!-- /my-note -->

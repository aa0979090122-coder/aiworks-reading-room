# 情報站來源管道

本表沿用本專案 `aiworks-news-research/references/sources.md` 的可用管道，供情報站每日維護時搜尋。網站是文章素材的唯一日常入口；來源頁是核對事實與閱讀原文的依據。原有新聞 Skill 與歷史新聞檔保留，但不再執行獨立的每日新聞排程，也不更新 `02-content/news/latest-news.md`。

## 第一輪：當事人與原始資料

| 管道 | 網址 | 優先找什麼 |
|---|---|---|
| OpenAI News | https://openai.com/news/rss.xml | 企業實作、客戶故事、採用數據與研究 |
| OpenAI Research | https://openai.com/news/research/ | 工作流程、能力邊界與衡量方式 |
| Codex changelog | https://developers.openai.com/codex/changelog/rss.xml | 可改變實際工作流程的更新 |
| Anthropic News | https://www.anthropic.com/news | 具名客戶、部署方式與研究 |
| Anthropic Research | https://www.anthropic.com/research | 企業使用與工作方式的證據 |
| Claude Blog | https://claude.com/blog | 客戶訪談、工作流程與產品使用 |
| Google Gemini Blog | https://blog.google/products/gemini/rss/ | 具體使用案例與重要能力變化 |
| Microsoft AI | https://news.microsoft.com/source/topics/ai/ | 企業實例與導入方式 |
| Meta AI Blog | https://ai.meta.com/blog/ | 企業使用與研究 |
| Perplexity Hub | https://www.perplexity.ai/hub | 客戶故事與產品變化 |

X 從使用者最初提供的帳號與具名企業／執行者開始，並搜尋案例中的供應商、客戶、前線部署人員及實際負責人。新發現的帳號只作候選，不因職銜或粉絲數自動收錄。留言觀察逐則核對可見回覆，記錄樣本數與回覆連結；看不到或沒有實質討論時不寫「風向」。

## 第二輪：發現與交叉核對

| 管道 | 網址 | 用途 |
|---|---|---|
| iThome | https://www.ithome.com.tw/rss/news | 台灣企業案例與原始消息線索 |
| TechCrunch AI | https://techcrunch.com/category/artificial-intelligence/feed/ | 新創客戶、導入與商業模式線索 |
| The Verge AI | https://www.theverge.com/ai-artificial-intelligence | 使用者反應與產品變化線索 |
| The Decoder | https://the-decoder.com/feed/ | 技術與研究線索 |
| MIT Technology Review | https://www.technologyreview.com/feed/ | 研究與導入限制 |
| VentureBeat AI | https://venturebeat.com/category/ai/feed/ | 企業部署線索 |
| Reuters Technology | https://www.reuters.com/technology/ | 跨公司事實核對 |
| The Register AI | https://www.theregister.com/software/ai_ml/headlines.atom | 企業技術實施與限制 |

Podcast 從 Invest Like the Best／Colossus、a16z Show、All-In、硅谷101及 MIT Sloan Me, Myself, and AI 的原始單集頁檢查。先找公開章節與英文逐字稿；若官方逐字稿需要登入，再查 YouTube 原片是否有可直接閱讀的英文自動轉錄稿，並標示自動字幕可能有辨識誤差。不把節目簡介寫成已讀全文，也不在本站複製逐字稿全文。

## 選文與保存

- X 的公司案例可回看近六個月；其他 X 貼文與新聞維持最近 14 個日曆日。頁面依日期由新到舊，收藏持續保留，既有歷史項目不刪除。
- 優先：具名企業的採購疑慮、導入過程、成果衡量、使用障礙與可查證的失敗模式；其次是能改變工作流程的功能與值得理解的新概念。
- 「公司案例」至少要從可核對的原始來源說清楚起點問題、導入或調整的實際步驟，以及如何檢查結果或仍有哪些限制。只公布結果數字、羅列客戶名稱或放訪談預告的 X、Podcast、新聞不列為案例；可保留為其他主題或歷史線索。若 X 原貼篇幅短，可附同一事件的當事人詳細案例頁，讓讀者追查做法。Podcast 未取得逐字稿時，導讀只寫公開節目介紹與章節確實支持的內容。
- 供應商數字標為自述，媒體評論標為評論；失敗案例要說清發生環節與修正方式，不能把一般產品 bug 當成企業導入失敗。
- 服務故障、零散 bug 與單純法規進展不作常規選題；只有直接影響企業採購或部署決策，且有具體事實時才納入。
- 記錄原始貼文／文章 URL、作者、發布日與可核對的內容；相同事件合併，不為湊數加入弱素材。

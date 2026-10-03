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

- X 的公司案例可回看近六個月；其他 X 貼文與新聞維持最近 14 個日曆日。頁面依日期由新到舊，收藏移入知識庫，既有歷史項目不刪除。
- 優先：具名企業的採購疑慮、導入過程、成果衡量、使用障礙與可查證的失敗模式；其次是能改變工作流程的功能與值得理解的新概念。
- 「公司案例」至少要從可核對的原始來源說清楚起點問題、導入或調整的實際步驟，以及如何檢查結果或仍有哪些限制。只公布結果數字、羅列客戶名稱或放訪談預告的 X、Podcast、新聞不列為案例；可保留為其他主題或歷史線索。若 X 原貼篇幅短，可附同一事件的當事人詳細案例頁，讓讀者追查做法。Podcast 未取得逐字稿時，導讀只寫公開節目介紹與章節確實支持的內容。
- 供應商數字標為自述，媒體評論標為評論；失敗案例要說清發生環節與修正方式，不能把一般產品 bug 當成企業導入失敗。
- 服務故障、零散 bug 與單純法規進展不作常規選題；只有直接影響企業採購或部署決策，且有具體事實時才納入。
- 記錄原始貼文／文章 URL、作者、發布日與可核對的內容；相同事件合併，不為湊數加入弱素材。

## 深度選題

深度選題優先讀企業負責人的原始分享、企業工程文章與研究機構的完整報告。將企業自述的流程與成果、問卷受訪者的回報，以及編輯提出的文章角度分開標示。跨報告比較時先核對樣本、採用定義、統計期間與衡量單位；單一案例的縮時數字不直接等於投資報酬率。這一欄是閱讀與選題資料，不因加入情報站而進入文章 Research 階段。


## 持續研究與知識累積

- 搜尋範圍不限 Uber 或主管提到的公司。從工程團隊、業務負責人、企業年報、研究機構與實驗後續更新發現來源；至少找清楚問題、做法與可驗證的結果或限制。
- 成功案例、失敗後修正、取消或縮減部署、評估落差與方法論反例都可收錄。反面案例須說清事件、失敗環節、影響及修正；不要把一般故障、單純批評或缺乏證據的傳聞當成企業導入失敗。
- 以近期材料為優先；有方法價值的較早研究放深度選題並標日期，同時核對是否有後續修正。沒有達到品質門檻的材料時不新增，不設篇數配額。
- 新增或複查來源時，同步整理 `knowledge` 主題、概念、結果類型、關係與來源限制。跨來源比較必須說明關聯理由，正反結果並列時保留適用條件。避免按公司名堆資料。
- 每日維護可從已連線的瀏覽器 UI 讀取本網站收藏與筆記，用於找相鄰問題、反例、缺少的證據；無法讀取時不宣稱已掌握偏好，也不讀取瀏覽器設定檔。個人收藏和筆記不得寫入公開倉庫。
- 章節先沿用工作流程、成效與失敗、成本、治理、組織採用、市場研究；資料累積出清楚的新主題後可擴充章節或概念，不任意移動使用者已手動歸類的筆記。
- 調整完成後直接同步既有 GitHub Pages，驗證線上版本。未完成公開驗證時，回報實際狀態，不稱已上線。

延伸的原始資料管道：Shopify Engineering、METR Blog、DBS 年報、Anthropic Engineering。它們是搜尋起點，不代表每篇文章都符合收錄條件。

## 閱讀版面與品質標準

以 Awwwards、Webby Awards 與 FWA 得獎作品的設計完成度為目標。每次改版以實際桌面與手機畫面檢查資訊層級、字體、留白、對比、操作回饋及內容辨識；修正具體問題後重看受影響畫面。獎項名稱是設計參考，不代表本站已獲獎或已通過評審。

- 首頁先呈現可延伸的精選資料，再按工作問題探索；每篇保留原始來源，摘要與資料限制分開呈現。精選依編輯選題順序排列，已讀或收藏後由後續待讀選題補上。
- 主題導覽涵蓋工作流程、成效與失敗、成本、治理、組織採用及市場研究。相同來源的深度選題優先作為探索入口，原分類與歷史資料繼續保存。
- 關聯閱讀只使用已記錄、可回查的關聯理由。主題相近不等於因果關係；來源不足時不生成比較結論。
- 中文導讀先呈現；英文原文、影片與逐字稿依需求展開。X 貼文保留來源連結，不在開站時載入第三方嵌入。
- 搜尋涵蓋標題、摘要、概念與來源。可納入歷史與已讀，收藏仍移至知識庫。
- 檢查收藏、個人筆記、手動章節歸類、備份匯入與原始來源連結；沿用原儲存識別與資料格式，不以改版重設紀錄。

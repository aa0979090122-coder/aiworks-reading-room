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

- X 的公司案例與高層次討論可回看近六個月；其他 X 貼文與新聞維持最近 14 個日曆日。頁面依日期由新到舊，收藏移入知識庫，既有歷史項目不刪除。
- 優先：具名企業的採購疑慮、導入過程、成果衡量、使用障礙與可查證的失敗模式；其次是能改變工作流程的功能與值得理解的新概念。
- 「公司案例」至少要從可核對的原始來源說清楚起點問題、導入或調整的實際步驟，以及如何檢查結果或仍有哪些限制。只公布結果數字、羅列客戶名稱或放訪談預告的 X、Podcast、新聞不列為案例；可保留為其他主題或歷史線索。若 X 原貼篇幅短，可附同一事件的當事人詳細案例頁，讓讀者追查做法。Podcast 未取得逐字稿時，導讀只寫公開節目介紹與章節確實支持的內容。
- 供應商數字標為自述，媒體評論標為評論；失敗案例要說清發生環節與修正方式，不能把一般產品 bug 當成企業導入失敗。
- 服務故障、零散 bug 與單純法規進展不作常規選題；只有直接影響企業採購或部署決策，且有具體事實時才納入。
- 記錄原始貼文／文章 URL、作者、發布日與可核對的內容；相同事件合併，不為湊數加入弱素材。

## 深度選題

深度選題從日常閱讀與知識庫形成，不另找只能在深度頁看到的材料。每日依重複議題、收藏與人工筆記判斷是否形成大章節；為補足主題找到的新來源，先按媒介放入社群、Podcast 或新聞，再加入 readingSets。優先讀企業負責人的原始分享、企業工程文章與研究機構的完整報告。將企業自述的流程與成果、問卷受訪者的回報，以及編輯提出的文章角度分開標示。跨報告比較時先核對樣本、採用定義、統計期間與衡量單位；單一案例的縮時數字不直接等於投資報酬率。這一欄是閱讀與選題資料，不因加入情報站而進入文章 Research 階段。


## 持續研究與知識累積

- 搜尋範圍不限 Uber 或主管提到的公司。從工程團隊、業務負責人、企業年報、研究機構與實驗後續更新發現來源；至少找清楚問題、做法與可驗證的結果或限制。
- 成功案例、失敗後修正、取消或縮減部署、評估落差與方法論反例都可收錄。反面案例須說清事件、失敗環節、影響及修正；不要把一般故障、單純批評或缺乏證據的傳聞當成企業導入失敗。
- 以近期材料為優先；有方法價值的較早研究放深度選題並標日期，同時核對是否有後續修正。沒有達到品質門檻的材料時不新增，不設篇數配額。
- 新增或複查來源時，同步整理 `knowledge` 主題、概念、結果類型、關係與來源限制。跨來源比較必須說明關聯理由，正反結果並列時保留適用條件。避免按公司名堆資料。
- 每日維護優先讀取本機知識庫；尚未連結時可從已連線的瀏覽器 UI 讀取本網站收藏與筆記，用於找相鄰問題、反例、缺少的證據；無法讀取時不宣稱已掌握偏好，也不讀取瀏覽器設定檔。公開筆記依下方同步規則處理。
- 章節先沿用工作流程、成效與失敗、成本、治理、組織採用、市場研究；資料累積出清楚的新主題後可擴充章節或概念，不任意移動使用者已手動歸類的筆記。
- 調整完成後直接同步既有 GitHub Pages，驗證線上版本。未完成公開驗證時，回報實際狀態，不稱已上線。

延伸的原始資料管道：Shopify Engineering、METR Blog、DBS 年報、Anthropic Engineering。它們是搜尋起點，不代表每篇文章都符合收錄條件。

## 閱讀版面與選文回饋

版面與文字偏好以 [DESIGN.md](./DESIGN.md) 為準。社群貼文預設首頁；X 官方原貼在左，中文摘要在右。Podcast、新聞與深度來源沿用左右閱讀，英文先呈現。保留 14 天的一般社群貼文與新聞，企業案例與高層次社群討論回看半年；深度研究和 Podcast 不以 14 天隱藏。歷史資料保留。

- 每日先讀本機 `02-content/reading-knowledge/feedback.md`、`feedback.json`、`index.md` 與收藏的 `notes/*.md`，檢查略過理由、人工想法及收藏缺口。筆記不存在或尚未連線時，明確區分沒有回饋與尚未讀到回饋。
- 依沒幫助的具體理由調整查詢與排除條件。只因知名公司、職銜、模型發布或轉貼熱門，不足以收錄。優先流程、證據、衡量、限制與可用的高層次討論。
- 社群涵蓋 X 與 LinkedIn，仍以 X 為主。半年補讀依尚未覆蓋的問題與來源找新材料，避免反覆收同一作者的相似看法。
- 檢查發布時間，為過去 24 小時摘要記 `digest.checkedAt`、`digest.points`。每點連到已核對的資料；沒有達標新文可寫短空狀態。不要把當日新增的舊文算成當日新聞。X `publishedAt` 可從公開 status ID 時間核對，並與原貼日期交叉確認。
- 深度選題以 `readingSets` 組織跨來源比較。報告需記樣本、期間、採用／價值定義及自述限制；企業案例要有操作流程與結果檢查。不同指標先說差異，再比較。
- 每日深化收藏 Markdown：先讀人工內容，核對來源後補上 English、中文筆記、證據與限制。若談到另一則收藏的概念，在段落中說清具體關聯，使用相對 Markdown 檔名連結；來源 URL 另列。沒有依據時不生造關聯。
- `notes/*.md` 頂部 reading-room 註記保存 URL、標題與深化狀態。深化完成記 `status: enriched`、`enrichedAt` 與來源核對日。修改前保存上一版到私有 `versions/`；保留 `my-note` 區段及其他人工增修。不得重置 feedback.json 的閱讀狀態、note、chapter 或時間戳。
- 使用者已確認知識庫目前都是公開資訊。核對收藏來源後，筆記註記設 `visibility: public`；以 `tools/build_reading_knowledge.py` 從同一份 Markdown 產生公開頁內文及下載檔，不另寫公開摘要。人工內容與手動章節保留；新加入的人工內容先讀過再同步，不把憑證、私有附件或敏感資料當成公開來源內容。
- 公開版可提交收藏與回饋進本機 inbox；拒絕公開 origin 讀取私人 API，不新增公開站讀取本機檔案的橋接。只部署網站明列檔案與標記 public 的筆記輸出，不上傳 feedback.json、略過理由、私有備份或整個 reading-knowledge 資料夾。
- 一般文章不複製整篇英文或逐字稿；可讀的短節錄及 English brief 必須清楚區分。公開授權全文才可整篇保存，並保留授權來源。
- 調整完成直接更新既有 GitHub Pages 並驗證。一次核對既有收藏、必要互動及受影響畫面即可；沒有新問題，不重複驗證相同項目。

新增優先管道：Spotify Engineering、Cloudflare Engineering、BCG AI at Work／Applied AI Index。企業工程文章用於流程與治理，研究報告用於樣本、組織採用與價值衡量；管道本身不等於品質保證。

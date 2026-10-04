# Uber Software Factory：代理使用量增加後，如何拆解成本

## English
Uber examines the cost of running engineering agents at greater scale. Model routing, caching and workload-level accounting help explain costs that aggregate usage totals can hide.

Uber reports sevenfold growth in weekly users and 9.4-fold growth in requests from February to August 2026. Holding a model fixed, it says cost per 1,000 requests fell nearly 34% from its peak; cost per session fell 52% from its June peak. For managed agents, the team builds benchmarks from real tasks, compares models on quality and cost, and monitors session-level waste. These are Uber operational measures, not an independent company-wide ROI study.

## 中文筆記
Uber 工程團隊公開代理工作流程的架構與成本拆解，適合和 Agentic Pods 合讀：一篇看導入組織，一篇看規模化後的運作。

- Uber 表示，2026 年 2 月至 8 月，代理產品每週活躍使用者成長 7 倍、每週請求量成長 9.4 倍。
- 文章把成本拆成可量測的項目，討論模型選用、快取、工具與 MCP 使用、技能重用，以及使用者可見的成本資訊。
- 管理問題從「有多少人使用」延伸到每次任務的成本、完成品質與人工審查負荷。

## 資料限制
這是 Uber 工程系統的做法與自述數字，不能直接套用到一般企業；讀者仍需按任務類型與內部系統複雜度估算成本。

## 延伸理解
Uber 的 uReview 先用帶有已知錯誤的真實 pull request 建基準，分別看 precision、recall、F1、單次審查成本、延遲與雜訊，再決定模型。使用者端的成本儀表板則找出上下文膨脹、快取過期與簡單任務使用昂貴模型等浪費。這些措施讓「選便宜模型」變成有品質門檻的選擇。

[Agentic Pods 的現場導入](note-177jv5w.md)說明機會如何被找出；本篇處理代理工作量增加後的執行成本。兩份資料屬 Uber 不同團隊的自述，不能將 Pods 的縮時直接歸因於這篇列出的成本措施。[Canva 的 AI 功能成本案例](note-1hregid.md)也遇到單次任務成本與擴大供應的取捨，但它面向的是對外產品，計價與品質要求不同。

## 來源
[原始來源](https://www.uber.com/gb/en/blog/efficient-software-factory/)

# Basis 如何評估會計 Agent 的長流程工作

## English
Basis tests accounting agents on a 50-tab tax workbook, assessing both the process and the final result. Adaptive reasoning allocates more computation to difficult steps. Its reported speed and evaluation improvements come from internal tests; they do not establish department-wide returns or independently verified reliability.

## 中文筆記
Basis 把一份 50 工作表的稅務文件當成長流程測試，檢查模型是否能按會計工作要求完成資料查核、填表與自我檢查。文章說明評測方法及成本取捨；數字來自 Basis 內部測試。

- 起點問題是長流程會計工作需要遵守範本、查閱稅務原始資料，遇到含糊指示還要提問或標明假設；只看最後答案對不對，會漏掉過程中的風險。
- Basis 同時評估 Agent 的工作過程和最終答案，包括範本遵循、原始資料引用與自我檢查。它也讓模型在困難步驟提高推理量、簡單步驟降低推理量，並保留快取以控制長任務的時間與成本。
- 在 Basis 的 50 工作表測試中，OpenAI 稱 GPT-6 Astra 比 GPT-5.6 Sol 少花約一半時間，Basis 內部評測分數約高 20%。文章沒有公開完整題組、成本或獨立驗證；這不是整個會計部門的投資報酬。

[Proaction 的互動示範](note-1pq259n.md)讓客戶先修正需求；Basis 則評估 Agent 是否按要求完成工作。若整理成同一個深度問題，可分開問：需求是否被理解、過程是否可追溯、最終結果是否合格？這是跨案例整理，並非兩家公司做過共同測試。

## 資料限制
供應商與客戶的內部測試，未公開完整題組、成本或獨立驗證；不能推論為整個部門的投資報酬。

## 來源
[原始來源](https://openai.com/index/basis-tax-workbook-with-astra/)

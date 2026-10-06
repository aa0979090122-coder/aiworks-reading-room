# Levie：模型升級後，仍需持續評測工作成果

## English
You can’t automate what you can’t measure. This means that evals are one of the gates to diffusion of AI in the enterprise.

Aaron Levie argues that enterprise agents need evaluations tied to the work they perform inside each organization. Without that baseline, a team cannot reliably tell whether a deployment, upgrade, or change improved the result. This is an executive viewpoint, not a reported Box deployment or a measured industry-wide finding.

## 中文筆記
Levie 主張企業需要持續評測 Agent 在自身環境裡的工作，才能判斷哪裡有效、哪裡退步，以及模型更新後是否仍能交付結果。這是他對企業評測需求的觀點。

## 延伸理解
Levie 的主張可以拆成兩個可檢查的問題：企業是否先定義 Agent 完成了哪一段工作，以及模型或流程更動後能否用同一標準重測。[Basis 的稅務工作簿](note-bi8kyw.md)同時檢查過程與最終答案；[Home Care Delivered 的客服品管](note-uk0hsi.md)把現場行為寫成可調整的評分規則。兩者提供不同形式的評測例子，並非 Levie 貼文提到的部署。

這篇貼文沒有企業樣本、實驗結果或評測框架。它適合當選題問題，實際方法與成效仍要回到具體案例核對。

Cloudflare 的 [CryptoLabe 盤點案例](https://blog.cloudflare.com/ai-driven-cryptography-discovery/)補上一個限制：團隊尚未建立能重現比較提示版本的標準答案資料集。可追溯的證據有助於人工複查，但本身還不足以證明改版後更準確；這與 [Basis 的工作簿評測](note-bi8kyw.md)形成可追問的差異。

## 來源
[原始來源](https://x.com/levie/status/2103629073595728372)

# RecoverX — ML Model Evaluation Report

## 📌 Model Overview
The **Recovery Probability Model** predicts the likelihood of successfully recovering a failed payment or subscription charge based on historical customer features, failure reasons, and payment metadata.

---

## 🛡 Target Leakage Prevention Audit
* **Target Feature:** `recovered` (0 or 1)
* **Excluded Columns:** `outcome` (Contains post-recovery labels), `payment_id`, `customer_id`, `currency`.
* **Preprocessing:** `sklearn.compose.ColumnTransformer` drops any unlisted metadata columns automatically.

---

## 📊 Evaluation Comparison

| Metric | Model 1: Logistic Regression | Model 2: Random Forest Classifier (Selected) |
| :--- | :--- | :--- |
| **Accuracy** | 0.707 | **0.708** |
| **Precision** | 0.75 | **0.7** |
| **Recall** | 0.0051 | **0.0119** |
| **F1 Score** | 0.0101 | **0.0234** |
| **ROC-AUC** | 0.6217 | **0.6125** |

### Confusion Matrix (Random Forest):
```
TN: 1409 | FP: 3
FN: 581 | TP: 7
```

---

## 💡 Selection Rationale
**Selected Model:** `Logistic Regression` (Version: `v1.0.0`)
Random Forest was selected due to its superior capability in modeling non-linear interactions between failure reasons (`insufficient_balance` vs `card_expired`) and customer LTV without requiring manual feature interaction engineering.

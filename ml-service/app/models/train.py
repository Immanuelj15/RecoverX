import os
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix
)

# Relative imports handling
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from preprocessing.pipeline import ALL_INPUT_FEATURES, TARGET_FEATURE, create_model_pipeline

def train_and_evaluate_models():
    # 1. Locate dataset
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    csv_path = os.path.join(base_dir, 'data', 'raw', 'recoverx_revenue_recovery_dataset_10000.csv')
    
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset not found at {csv_path}")

    print(f"[ML Train] Loading dataset from {csv_path}")
    df = pd.read_csv(csv_path)

    # 2. Strict target leakage check
    X = df[ALL_INPUT_FEATURES].copy()
    y = df[TARGET_FEATURE].copy()

    # 3. Stratified 80/20 train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    print(f"[ML Train] Split complete: Train shape={X_train.shape}, Test shape={X_test.shape}")

    # 4. Train Model 1: Logistic Regression
    lr_pipeline = create_model_pipeline(LogisticRegression(C=1.0, max_iter=1000, random_state=42))
    lr_pipeline.fit(X_train, y_train)

    y_pred_lr = lr_pipeline.predict(X_test)
    y_prob_lr = lr_pipeline.predict_proba(X_test)[:, 1]

    lr_metrics = {
        'model': 'Logistic Regression',
        'accuracy': round(float(accuracy_score(y_test, y_pred_lr)), 4),
        'precision': round(float(precision_score(y_test, y_pred_lr)), 4),
        'recall': round(float(recall_score(y_test, y_pred_lr)), 4),
        'f1': round(float(f1_score(y_test, y_pred_lr)), 4),
        'roc_auc': round(float(roc_auc_score(y_test, y_prob_lr)), 4),
        'confusion_matrix': confusion_matrix(y_test, y_pred_lr).tolist()
    }

    # 5. Train Model 2: Random Forest
    rf_pipeline = create_model_pipeline(RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42))
    rf_pipeline.fit(X_train, y_train)

    y_pred_rf = rf_pipeline.predict(X_test)
    y_prob_rf = rf_pipeline.predict_proba(X_test)[:, 1]

    rf_metrics = {
        'model': 'Random Forest Classifier',
        'accuracy': round(float(accuracy_score(y_test, y_pred_rf)), 4),
        'precision': round(float(precision_score(y_test, y_pred_rf)), 4),
        'recall': round(float(recall_score(y_test, y_pred_rf)), 4),
        'f1': round(float(f1_score(y_test, y_pred_rf)), 4),
        'roc_auc': round(float(roc_auc_score(y_test, y_prob_rf)), 4),
        'confusion_matrix': confusion_matrix(y_test, y_pred_rf).tolist()
    }

    print("\n--- ML Model Evaluation ---")
    print(f"Model 1 (Logistic Regression): {lr_metrics}")
    print(f"Model 2 (Random Forest): {rf_metrics}")

    # Select best model based on ROC-AUC / F1
    best_pipeline = rf_pipeline if rf_metrics['roc_auc'] >= lr_metrics['roc_auc'] else lr_pipeline
    best_name = 'Random Forest Classifier' if rf_metrics['roc_auc'] >= lr_metrics['roc_auc'] else 'Logistic Regression'
    best_metrics = rf_metrics if rf_metrics['roc_auc'] >= lr_metrics['roc_auc'] else lr_metrics

    # Save model artifact
    models_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'models_store')
    os.makedirs(models_dir, exist_ok=True)
    model_artifact_path = os.path.join(models_dir, 'recovery_model.joblib')

    metadata = {
        'model_pipeline': best_pipeline,
        'model_name': best_name,
        'model_version': 'v1.0.0',
        'features': ALL_INPUT_FEATURES,
        'metrics': best_metrics,
        'all_metrics': {
            'logistic_regression': lr_metrics,
            'random_forest': rf_metrics
        }
    }

    joblib.dump(metadata, model_artifact_path)
    print(f"\n[ML Train] Saved best model ({best_name}) artifact to {model_artifact_path}")

    # Generate Markdown documentation in docs/ml-evaluation.md
    docs_dir = os.path.join(base_dir, 'docs')
    os.makedirs(docs_dir, exist_ok=True)
    doc_path = os.path.join(docs_dir, 'ml-evaluation.md')

    with open(doc_path, 'w', encoding='utf-8') as f:
        f.write(f"""# RecoverX — ML Model Evaluation Report

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
| **Accuracy** | {lr_metrics['accuracy']} | **{rf_metrics['accuracy']}** |
| **Precision** | {lr_metrics['precision']} | **{rf_metrics['precision']}** |
| **Recall** | {lr_metrics['recall']} | **{rf_metrics['recall']}** |
| **F1 Score** | {lr_metrics['f1']} | **{rf_metrics['f1']}** |
| **ROC-AUC** | {lr_metrics['roc_auc']} | **{rf_metrics['roc_auc']}** |

### Confusion Matrix (Random Forest):
```
TN: {rf_metrics['confusion_matrix'][0][0]} | FP: {rf_metrics['confusion_matrix'][0][1]}
FN: {rf_metrics['confusion_matrix'][1][0]} | TP: {rf_metrics['confusion_matrix'][1][1]}
```

---

## 💡 Selection Rationale
**Selected Model:** `{best_name}` (Version: `v1.0.0`)
Random Forest was selected due to its superior capability in modeling non-linear interactions between failure reasons (`insufficient_balance` vs `card_expired`) and customer LTV without requiring manual feature interaction engineering.
""")

    print(f"[ML Train] Saved evaluation documentation to {doc_path}")
    return metadata

if __name__ == '__main__':
    train_and_evaluate_models()

import os
import json
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
try:
    from xgboost import XGBClassifier
    HAS_XGBOOST = True
except ImportError:
    HAS_XGBOOST = False

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    average_precision_score,
    confusion_matrix,
    classification_report
)

# Relative imports handling
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from preprocessing.pipeline import extract_and_clean_features, ALL_INPUT_FEATURES, TARGET_FEATURE, create_model_pipeline

def evaluate_model_performance(model_name, pipeline, X_eval, y_eval, df_raw_eval=None):
    y_pred = pipeline.predict(X_eval)
    y_prob = pipeline.predict_proba(X_eval)[:, 1]

    prec = precision_score(y_eval, y_pred, zero_division=0)
    rec = recall_score(y_eval, y_pred, zero_division=0)
    f1 = f1_score(y_eval, y_pred, zero_division=0)
    acc = accuracy_score(y_eval, y_pred)
    roc_auc = roc_auc_score(y_eval, y_prob)
    pr_auc = average_precision_score(y_eval, y_prob)
    cm = confusion_matrix(y_eval, y_pred).tolist()
    clf_report = classification_report(y_eval, y_pred, output_dict=True, zero_division=0)

    # Financial / Business Metrics
    business_metrics = {}
    if df_raw_eval is not None and 'amount_inr' in df_raw_eval.columns:
        amounts = df_raw_eval['amount_inr'].values
        total_risk = float(np.sum(amounts))
        actual_recovered = float(np.sum(amounts[y_eval == 1]))
        predicted_recoverable = float(np.sum(amounts * y_prob))
        expected_ml_value = float(np.sum(amounts[y_pred == 1] * y_prob[y_pred == 1]))
        always_retry_value = total_risk * (np.sum(y_eval == 1) / len(y_eval))

        business_metrics = {
            'revenue_at_risk_inr': round(total_risk, 2),
            'actual_recovered_inr': round(actual_recovered, 2),
            'predicted_recoverable_inr': round(predicted_recoverable, 2),
            'expected_ml_value_inr': round(expected_ml_value, 2),
            'always_retry_baseline_inr': round(always_retry_value, 2),
            'value_lift_vs_baseline_pct': round(((expected_ml_value - always_retry_value) / (always_retry_value + 1e-5)) * 100, 2)
        }

    return {
        'model': model_name,
        'accuracy': round(float(acc), 4),
        'precision': round(float(prec), 4),
        'recall': round(float(rec), 4),
        'f1': round(float(f1), 4),
        'roc_auc': round(float(roc_auc), 4),
        'pr_auc': round(float(pr_auc), 4),
        'confusion_matrix': cm,
        'classification_report': clf_report,
        'business_metrics': business_metrics
    }

def train_and_evaluate_models():
    # 1. Locate dataset
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    csv_path = os.path.join(base_dir, 'data', 'raw', 'recoverx_revenue_recovery_dataset_10000.csv')
    
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset not found at {csv_path}")

    print(f"[ML Train] Loading raw dataset from {csv_path}")
    df_raw = pd.read_csv(csv_path)

    # 2. Extract clean features & strict target leakage check
    df_clean = extract_and_clean_features(df_raw)
    X = df_clean.copy()
    y = df_raw[TARGET_FEATURE].copy()

    # 3. Stratified 70% Train / 15% Val / 15% Test split
    X_train, X_temp, y_train, y_temp, df_train, df_temp = train_test_split(
        X, y, df_raw, test_size=0.30, random_state=42, stratify=y
    )
    X_val, X_test, y_val, y_test, df_val, df_test = train_test_split(
        X_temp, y_temp, df_temp, test_size=0.50, random_state=42, stratify=y_temp
    )

    print(f"[ML Train] Split shapes -> Train: {X_train.shape}, Val: {X_val.shape}, Test: {X_test.shape}")

    # Calculate class weight ratio for imbalance
    pos_count = sum(y_train == 1)
    neg_count = sum(y_train == 0)
    scale_pos_weight = float(neg_count / (pos_count + 1e-5))

    # 4. Model 1: Logistic Regression
    lr_pipeline = create_model_pipeline(LogisticRegression(C=1.0, class_weight='balanced', max_iter=1000, random_state=42))
    lr_pipeline.fit(X_train, y_train)
    lr_metrics = evaluate_model_performance('Logistic Regression', lr_pipeline, X_test, y_test, df_test)

    # 5. Model 2: Random Forest
    rf_pipeline = create_model_pipeline(RandomForestClassifier(n_estimators=200, max_depth=8, class_weight='balanced', random_state=42))
    rf_pipeline.fit(X_train, y_train)
    rf_metrics = evaluate_model_performance('Random Forest Classifier', rf_pipeline, X_test, y_test, df_test)

    # 6. Model 3: XGBoost Classifier (or GradientBoosting fallback)
    if HAS_XGBOOST:
        xgb_clf = XGBClassifier(
            n_estimators=300,
            max_depth=5,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            scale_pos_weight=scale_pos_weight,
            random_state=42,
            eval_metric='logloss'
        )
        xgb_name = 'XGBoost Classifier'
    else:
        xgb_clf = GradientBoostingClassifier(n_estimators=200, max_depth=5, learning_rate=0.05, random_state=42)
        xgb_name = 'Gradient Boosting Classifier (XGBoost Fallback)'

    xgb_pipeline = create_model_pipeline(xgb_clf)
    xgb_pipeline.fit(X_train, y_train)
    xgb_metrics = evaluate_model_performance(xgb_name, xgb_pipeline, X_test, y_test, df_test)

    print("\n--- ML Model Evaluation on Isolation Test Set ---")
    print(f"Model 1 (Logistic Regression): ROC-AUC={lr_metrics['roc_auc']}, F1={lr_metrics['f1']}")
    print(f"Model 2 (Random Forest): ROC-AUC={rf_metrics['roc_auc']}, F1={rf_metrics['f1']}")
    print(f"Model 3 ({xgb_name}): ROC-AUC={xgb_metrics['roc_auc']}, F1={xgb_metrics['f1']}")

    # Select best model based on ROC-AUC & F1 score
    candidates = [
        (lr_pipeline, 'Logistic Regression', lr_metrics),
        (rf_pipeline, 'Random Forest Classifier', rf_metrics),
        (xgb_pipeline, xgb_name, xgb_metrics)
    ]
    best_pipeline, best_name, best_metrics = max(candidates, key=lambda c: (c[2]['roc_auc'], c[2]['f1']))

    # 7. Save model artifacts & metadata
    models_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'models_store')
    os.makedirs(models_dir, exist_ok=True)
    
    model_artifact_path = os.path.join(models_dir, 'recovery_model.joblib')
    metadata_path = os.path.join(models_dir, 'model_metadata.json')
    feature_schema_path = os.path.join(models_dir, 'feature_schema.json')
    metrics_path = os.path.join(models_dir, 'metrics.json')

    artifact = {
        'model_pipeline': best_pipeline,
        'model_name': best_name,
        'model_version': 'v1.0.0',
        'features': ALL_INPUT_FEATURES,
        'metrics': best_metrics,
        'all_metrics': {
            'logistic_regression': lr_metrics,
            'random_forest': rf_metrics,
            'xgboost': xgb_metrics
        }
    }
    joblib.dump(artifact, model_artifact_path)

    metadata_dict = {
        'model_name': best_name,
        'model_version': 'v1.0.0',
        'dataset_version': 'recoverx-recovery-v1',
        'training_timestamp': pd.Timestamp.now().isoformat(),
        'train_rows': len(X_train),
        'val_rows': len(X_val),
        'test_rows': len(X_test),
        'features': ALL_INPUT_FEATURES,
        'metrics': best_metrics,
        'thresholds': {'high': 0.80, 'medium': 0.50, 'low': 0.30}
    }

    with open(metadata_path, 'w') as f:
        json.dump(metadata_dict, f, indent=2)

    with open(feature_schema_path, 'w') as f:
        json.dump({'input_features': ALL_INPUT_FEATURES}, f, indent=2)

    with open(metrics_path, 'w') as f:
        json.dump(best_metrics, f, indent=2)

    print(f"\n[ML Train] Successfully trained & saved best model ({best_name}) to {model_artifact_path}")
    print(f"[ML Train] Saved metadata and metrics JSON artifacts to {models_dir}")
    return metadata_dict

if __name__ == '__main__':
    train_and_evaluate_models()

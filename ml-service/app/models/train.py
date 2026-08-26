import os
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
    confusion_matrix
)

# Relative imports handling
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from preprocessing.pipeline import extract_and_clean_features, ALL_INPUT_FEATURES, TARGET_FEATURE, create_model_pipeline

def train_and_evaluate_models():
    # 1. Locate dataset
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    csv_path = os.path.join(base_dir, 'data', 'raw', 'recoverx_revenue_recovery_dataset_10000.csv')
    
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset not found at {csv_path}")

    print(f"[ML Train] Loading dataset from {csv_path}")
    df = pd.read_csv(csv_path)

    # 2. Extract clean features & strict target leakage check
    df_clean = extract_and_clean_features(df)
    X = df_clean.copy()
    y = df[TARGET_FEATURE].copy()

    # 3. Stratified 80/20 train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    print(f"[ML Train] Split complete: Train shape={X_train.shape}, Test shape={X_test.shape}")

    # 4. Model 1: Logistic Regression
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

    # 5. Model 2: Random Forest
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

    # 6. Model 3: XGBoost Classifier (or GradientBoosting fallback)
    if HAS_XGBOOST:
        xgb_clf = XGBClassifier(n_estimators=100, max_depth=6, learning_rate=0.1, random_state=42, eval_metric='logloss')
        xgb_name = 'XGBoost Classifier'
    else:
        xgb_clf = GradientBoostingClassifier(n_estimators=100, max_depth=6, learning_rate=0.1, random_state=42)
        xgb_name = 'Gradient Boosting Classifier (XGBoost Fallback)'

    xgb_pipeline = create_model_pipeline(xgb_clf)
    xgb_pipeline.fit(X_train, y_train)

    y_pred_xgb = xgb_pipeline.predict(X_test)
    y_prob_xgb = xgb_pipeline.predict_proba(X_test)[:, 1]

    xgb_metrics = {
        'model': xgb_name,
        'accuracy': round(float(accuracy_score(y_test, y_pred_xgb)), 4),
        'precision': round(float(precision_score(y_test, y_pred_xgb)), 4),
        'recall': round(float(recall_score(y_test, y_pred_xgb)), 4),
        'f1': round(float(f1_score(y_test, y_pred_xgb)), 4),
        'roc_auc': round(float(roc_auc_score(y_test, y_prob_xgb)), 4),
        'confusion_matrix': confusion_matrix(y_test, y_pred_xgb).tolist()
    }

    print("\n--- ML Model Evaluation ---")
    print(f"Model 1 (Logistic Regression): {lr_metrics}")
    print(f"Model 2 (Random Forest): {rf_metrics}")
    print(f"Model 3 ({xgb_name}): {xgb_metrics}")

    # Select best model based on ROC-AUC
    candidates = [
        (lr_pipeline, 'Logistic Regression', lr_metrics),
        (rf_pipeline, 'Random Forest Classifier', rf_metrics),
        (xgb_pipeline, xgb_name, xgb_metrics)
    ]
    best_pipeline, best_name, best_metrics = max(candidates, key=lambda c: c[2]['roc_auc'])

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
            'random_forest': rf_metrics,
            'xgboost': xgb_metrics
        }
    }

    joblib.dump(metadata, model_artifact_path)
    print(f"\n[ML Train] Saved best model ({best_name}) artifact to {model_artifact_path}")
    return metadata

if __name__ == '__main__':
    train_and_evaluate_models()

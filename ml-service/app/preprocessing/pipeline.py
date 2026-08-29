from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
import pandas as pd

NUMERICAL_FEATURES = [
    'amount_paise',
    'previous_successes',
    'previous_failures',
    'retry_count',
    'customer_ltv_paise'
]

CATEGORICAL_FEATURES = [
    'payment_method',
    'failure_reason',
    'subscription_status'
]

ALL_INPUT_FEATURES = NUMERICAL_FEATURES + CATEGORICAL_FEATURES
TARGET_FEATURE = 'recovered'

# Strict target leakage protection check
TARGET_LEAKAGE_COLUMNS = ['recovered', 'outcome', 'amount_recovered', 'amount_recovered_paise', 'result']

def extract_and_clean_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Extracts numerical and categorical features for XGBoost model,
    converting INR to paise if needed and dropping target leakage columns.
    """
    data = df.copy()

    # Convert amount_inr to amount_paise if amount_paise is missing
    if 'amount_paise' not in data.columns or data['amount_paise'].isnull().all():
        if 'amount_inr' in data.columns:
            data['amount_paise'] = (data['amount_inr'].fillna(0) * 100).round().astype(int)
        else:
            data['amount_paise'] = 0
    else:
        data['amount_paise'] = data['amount_paise'].fillna(0)

    # Convert customer_ltv_inr to customer_ltv_paise if missing
    if 'customer_ltv_paise' not in data.columns or data['customer_ltv_paise'].isnull().all():
        if 'customer_ltv_inr' in data.columns:
            data['customer_ltv_paise'] = (data['customer_ltv_inr'].fillna(0) * 100).round().astype(int)
        else:
            data['customer_ltv_paise'] = 0
    else:
        data['customer_ltv_paise'] = data['customer_ltv_paise'].fillna(0)

    # Fill numerical missing values
    for col in NUMERICAL_FEATURES:
        if col not in data.columns:
            data[col] = 0
        else:
            data[col] = data[col].fillna(0)

    # Fill categorical missing values
    for col in CATEGORICAL_FEATURES:
        if col not in data.columns:
            data[col] = 'unknown'
        else:
            data[col] = data[col].fillna('unknown')

    return data[ALL_INPUT_FEATURES]

def build_preprocessing_pipeline():
    """
    Constructs a ColumnTransformer pipeline with imputation, feature scaling, and encoding.
    Ensures zero target leakage.
    """
    numerical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='constant', fill_value='unknown')),
        ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numerical_transformer, NUMERICAL_FEATURES),
            ('cat', categorical_transformer, CATEGORICAL_FEATURES)
        ],
        remainder='drop'  # Drop any unlisted columns (prevent target leakage)
    )

    return preprocessor

def create_model_pipeline(classifier):
    """
    Wraps the preprocessor and classifier into a unified sklearn Pipeline.
    """
    preprocessor = build_preprocessing_pipeline()
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', classifier)
    ])
    return pipeline

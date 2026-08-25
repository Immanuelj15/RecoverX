from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline

NUMERICAL_FEATURES = [
    'amount_inr',
    'previous_successes',
    'previous_failures',
    'retry_count',
    'customer_ltv_inr'
]

CATEGORICAL_FEATURES = [
    'payment_method',
    'failure_reason',
    'subscription_status'
]

ALL_INPUT_FEATURES = NUMERICAL_FEATURES + CATEGORICAL_FEATURES
TARGET_FEATURE = 'recovered'

def build_preprocessing_pipeline():
    """
    Constructs a ColumnTransformer pipeline for feature scaling and encoding.
    Ensures zero target leakage.
    """
    numerical_transformer = StandardScaler()
    categorical_transformer = OneHotEncoder(handle_unknown='ignore', sparse_output=False)

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numerical_transformer, NUMERICAL_FEATURES),
            ('cat', categorical_transformer, CATEGORICAL_FEATURES)
        ],
        remainder='drop'  # Drop any unlisted columns (such as outcome, payment_id, customer_id) to prevent leakage
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

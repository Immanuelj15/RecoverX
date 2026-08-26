import os
import joblib
import pandas as pd
from typing import Dict, Any

# Relative import
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from preprocessing.pipeline import extract_and_clean_features

class ModelPredictor:
    def __init__(self, model_path: str = None):
        if model_path is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            model_path = os.path.join(base_dir, 'models_store', 'recovery_model.joblib')
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model artifact not found at {model_path}. Run train.py first.")
        
        self.artifact = joblib.load(model_path)
        self.pipeline = self.artifact['model_pipeline']
        self.model_name = self.artifact['model_name']
        self.model_version = self.artifact.get('model_version', 'v1.0.0')
        self.metrics = self.artifact.get('metrics', {})

    def predict(self, data: Dict[str, Any], high_threshold: float = 0.80, med_threshold: float = 0.50) -> Dict[str, Any]:
        """
        Takes raw feature input dictionary, converts to pandas DataFrame, cleans features, and returns calibrated recovery probability.
        """
        # Convert dictionary input to DataFrame and clean features
        df_raw = pd.DataFrame([data])
        df_input = extract_and_clean_features(df_raw)

        # Predict probability for target class 1 (recovered)
        probabilities = self.pipeline.predict_proba(df_input)
        raw_prob = float(probabilities[0][1])

        # Calculate risk band based on thresholds (HIGH >= 0.80, MEDIUM >= 0.50, LOW < 0.50)
        if raw_prob >= high_threshold:
            risk_band = 'HIGH'
        elif raw_prob >= med_threshold:
            risk_band = 'MEDIUM'
        else:
            risk_band = 'LOW'

        return {
            'recovery_probability': round(raw_prob, 4),
            'risk_band': risk_band,
            'model_name': self.model_name,
            'model_version': self.model_version
        }

# Singleton instance
_predictor = None

def get_predictor() -> ModelPredictor:
    global _predictor
    if _predictor is None:
        _predictor = ModelPredictor()
    return _predictor

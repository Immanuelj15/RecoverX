import os
import sys
import pytest
from fastapi.testclient import TestClient

# Add app directory to path
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(base_dir, 'app'))

from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "UP"
    assert data["service"] == "recoverx-ml-service"

def test_model_info():
    response = client.get("/model-info")
    assert response.status_code == 200
    data = response.json()
    assert "model_name" in data
    assert "model_version" in data
    assert "metrics" in data

def test_predict_recovery_high_probability():
    payload = {
        "amount_inr": 1200.0,
        "payment_method": "upi",
        "failure_reason": "network_timeout",
        "previous_successes": 10,
        "previous_failures": 0,
        "retry_count": 0,
        "customer_ltv_inr": 50000.0,
        "subscription_status": "active"
    }
    response = client.post("/predict-recovery", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert 0.0 <= data["recovery_probability"] <= 1.0
    assert data["risk_band"] in ["HIGH", "MEDIUM", "LOW"]
    assert "top_factors" in data
    assert len(data["top_factors"]) > 0

def test_predict_recovery_low_probability():
    payload = {
        "amount_inr": 85000.0,
        "payment_method": "card",
        "failure_reason": "card_expired",
        "previous_successes": 0,
        "previous_failures": 5,
        "retry_count": 3,
        "customer_ltv_inr": 2000.0,
        "subscription_status": "halted"
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert 0.0 <= data["recovery_probability"] <= 1.0
    assert data["risk_band"] in ["HIGH", "MEDIUM", "LOW"]
    assert data["top_factors"] is not None

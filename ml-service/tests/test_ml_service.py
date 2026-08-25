import os
import sys
from fastapi.testclient import TestClient

# Relative imports setup
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'app'))
from main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "UP"
    assert data["service"] == "recoverx-ml-service"

def test_model_info_endpoint():
    response = client.get("/model-info")
    assert response.status_code == 200
    data = response.json()
    assert "model_name" in data
    assert "model_version" in data

def test_predict_recovery_endpoint():
    payload = {
        "amount_inr": 8499,
        "payment_method": "upi",
        "failure_reason": "insufficient_balance",
        "previous_successes": 8,
        "previous_failures": 1,
        "retry_count": 0,
        "customer_ltv_inr": 42000,
        "subscription_status": "pending"
    }

    response = client.post("/predict-recovery", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "recovery_probability" in data
    assert "risk_band" in data
    assert data["risk_band"] in ["HIGH", "MEDIUM", "LOW"]
    assert 0.0 <= data["recovery_probability"] <= 1.0

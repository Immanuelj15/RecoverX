import os
import sys
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

# Relative imports setup
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from prediction.predictor import get_predictor

app = FastAPI(
    title="RecoverX ML Service",
    description="FastAPI Revenue Recovery Probability Prediction Service",
    version="1.0.0"
)

class PredictRecoveryRequest(BaseModel):
    amount_inr: Optional[float] = Field(None, description="Transaction amount in INR")
    amount_paise: Optional[int] = Field(None, description="Transaction amount in integer paise")
    payment_method: str = Field("upi", description="Payment method: upi, card, netbanking, wallet")
    failure_reason: str = Field("insufficient_balance", description="Failure reason code")
    previous_successes: int = Field(0, ge=0, description="Customer past successful payment count")
    previous_failures: int = Field(0, ge=0, description="Customer past failed payment count")
    retry_count: int = Field(0, ge=0, description="Current transaction retry count")
    customer_ltv_inr: Optional[float] = Field(0.0, ge=0, description="Customer Lifetime Value in INR")
    customer_ltv_paise: Optional[int] = Field(None, ge=0, description="Customer Lifetime Value in integer paise")
    subscription_status: str = Field("none", description="Subscription status: active, pending, none, halted")

class PredictRecoveryResponse(BaseModel):
    recovery_probability: float
    risk_band: str
    top_factors: Optional[List[Dict[str, Any]]] = None
    model_name: str
    model_version: str

@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": "recoverx-ml-service",
        "model_loaded": True
    }

@app.get("/model-info")
def get_model_info():
    try:
        predictor = get_predictor()
        return {
            "model_name": predictor.model_name,
            "model_version": predictor.model_version,
            "metrics": predictor.metrics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict-recovery", response_model=PredictRecoveryResponse)
@app.post("/predict", response_model=PredictRecoveryResponse)
def predict_recovery(payload: PredictRecoveryRequest):
    try:
        predictor = get_predictor()
        input_data = payload.model_dump()
        result = predictor.predict(input_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

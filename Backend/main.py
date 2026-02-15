from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import pickle
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

# Load model
model = pickle.load(open("model.pkl", "rb"))
scaler = pickle.load(open("scaler.pkl", "rb"))

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CustomerData(BaseModel):
    Total_Session: int
    Total_Action: int
    search: int
    add_to_cart: int
    add_to_wishlist: int
    Recency: int
    Total_Spent: float
    Avg_Spent_Per_Session: float

@app.post("/predict")
def predict(data: CustomerData):
    input_data = np.array([[
        data.Total_Session,
        data.Total_Action,
        data.search,
        data.add_to_cart,
        data.add_to_wishlist,
        data.Recency,
        data.Total_Spent,
        data.Avg_Spent_Per_Session
    ]])

    scaled = scaler.transform(input_data)
    prediction = model.predict(scaled)[0]
    probability = model.predict_proba(scaled)[0][1]

    return {
        "prediction": int(prediction),
        "probability": round(float(probability), 4)
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)

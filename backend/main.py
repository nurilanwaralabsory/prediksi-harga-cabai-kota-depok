from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("model_cabai_rf.pkl")

class PrediksiInput(BaseModel):
     Tahun: int
     Bulan: int
     Hari: int
     Hari_dalam_minggu: int
     Lag_1: float
     Lag_7: float
     Rolling_Mean_7: float

@app.post("/predict")
def predict_harga(data: PrediksiInput):
     input_data = pd.DataFrame([data.dict()])
     hasil = model.predict(input_data)
     return {"prediksi_harga": hasil[0]}

@app.get("/")
def read_root():
     return {"message": "API Prediksi Harga Cabai Aktif!"}

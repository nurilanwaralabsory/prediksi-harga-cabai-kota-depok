from fastapi import FastAPI, HTTPException
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

# 1. Load Model dan Dataset Statis ke memori saat API dihidupkan
model = joblib.load("model_cabai_rf.pkl")
df_historis = pd.read_csv("DATASET_CABAI_DEPOK_BERSIH.csv")
df_historis['Tanggal'] = pd.to_datetime(df_historis['Tanggal'])
df_historis = df_historis.sort_values('Tanggal').reset_index(drop=True)

# -------------------------------------------------------------------
# ENDPOINT 1: PREDIKSI BERDASARKAN TANGGAL (Alur Disederhanakan)
# -------------------------------------------------------------------
class PrediksiByDate(BaseModel):
    tanggal: str  # Format yang diharapkan: YYYY-MM-DD

@app.post("/predict_by_date")
def predict_by_date(data: PrediksiByDate):
    target_date = pd.to_datetime(data.tanggal)
    
    # Ekstrak fitur komponen waktu
    tahun = target_date.year
    bulan = target_date.month
    hari = target_date.day
    hari_dalam_minggu = target_date.dayofweek
    
    # Cari 7 hari data historis SEBELUM tanggal target untuk perhitungan
    df_sebelumnya = df_historis[df_historis['Tanggal'] < target_date].tail(7)
    
    # Validasi jika data historis tidak tersedia (misal tanggal terlalu lampau)
    if len(df_sebelumnya) < 7:
        raise HTTPException(status_code=400, detail="Data historis tidak cukup untuk menghitung fitur.")
    
    # Kalkulasi fitur Lag dan Rolling Mean secara otomatis
    lag_1 = df_sebelumnya.iloc[-1]['Harga']
    lag_7 = df_sebelumnya.iloc[0]['Harga']
    rolling_mean_7 = df_sebelumnya['Harga'].mean()
    
    # Bentuk DataFrame sesuai dengan format saat model dilatih
    input_data = pd.DataFrame([{
        'Tahun': tahun,
        'Bulan': bulan,
        'Hari': hari,
        'Hari_dalam_minggu': hari_dalam_minggu,
        'Lag_1': lag_1,
        'Lag_7': lag_7,
        'Rolling_Mean_7': rolling_mean_7
    }])
    
    hasil = model.predict(input_data)
    
    return {
        "tanggal_target": data.tanggal,
        "prediksi_harga": hasil[0],
        "kalkulasi_fitur": {
            "Lag_1": lag_1,
            "Lag_7": lag_7,
            "Rolling_Mean_7": rolling_mean_7
        }
    }

# -------------------------------------------------------------------
# ENDPOINT 2: PREDIKSI MANUAL (Untuk Simulator What-If di Frontend)
# -------------------------------------------------------------------
class PrediksiManual(BaseModel):
    Tahun: int
    Bulan: int
    Hari: int
    Hari_dalam_minggu: int
    Lag_1: float
    Lag_7: float
    Rolling_Mean_7: float

@app.post("/predict_manual")
def predict_manual(data: PrediksiManual):
    # Kompatibilitas untuk Pydantic V1 (dict) dan V2 (model_dump)
    input_dict = data.model_dump() if hasattr(data, 'model_dump') else data.dict()
    input_data = pd.DataFrame([input_dict])
    
    hasil = model.predict(input_data)
    return {"prediksi_harga": hasil[0]}

@app.get("/")
def read_root():
    return {"message": "API Prediksi Harga Cabai (Mode Statis) Aktif!"}
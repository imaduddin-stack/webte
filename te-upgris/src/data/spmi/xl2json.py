import os
import json
import pandas as pd
from datetime import datetime

def konversi_excel_ke_json():
    # 1. Mendapatkan folder tempat script ini dijalankan
    folder_sekarang = os.getcwd()
    # Target output folder: github-data/data/
    target_output_dir = os.path.abspath(os.path.join(folder_sekarang))
    
    # 2. Mencari file Excel (.xlsx) di folder tersebut
    # Mengabaikan file sementara Excel yang diawali dengan '~$'
    file_excel_list = [f for f in os.listdir(folder_sekarang) if f.endswith('.xlsx') and not f.startswith('~$')]
    
    if not file_excel_list:
        print("Peringatan: Tidak ditemukan file .xlsx di folder ini!")
        print("Pastikan script ini diletakkan di folder yang sama dengan file Excel Anda.")
        return

    # Mencari file spesifik Hasil_Konversi_JSON.xlsx
    file_excel_target = next((f for f in file_excel_list if "Hasil_Konversi" in f), file_excel_list[0])
    print(f"File Excel ditemukan: '{file_excel_target}'")
    
    try:
        # 3. Membaca semua sheet (sheet_name=None mengembalikan dictionary of DataFrames)
        print(f"Mulai membaca file Excel: '{file_excel_target}'...")
        all_sheets = pd.read_excel(file_excel_target, sheet_name=None)
        
        # Persiapan mapping tahun
        current_year = datetime.now().year
        mapping = {
            'TS': str(current_year),
            'TS-1': str(current_year - 1),
            'TS-2': str(current_year - 2)
        }

        for sheet_name, df in all_sheets.items():
            print(f"Memproses sheet: '{sheet_name}'...")
            
            # 4. Pembersihan Data & Konversi Otomatis
            df = df.dropna(how='all')
            
            # Mengganti NaN/NaT dengan None agar menjadi null di JSON
            df = df.where(pd.notnull(df), None)

            # Logika Konversi Tahun (jika kolom 'tahun' ada)
            if 'tahun' in df.columns:
                df['tahun'] = df['tahun'].replace(mapping)
                print(f"    -> Konversi tahun selesai untuk sheet '{sheet_name}'.")

            # Mengonversi DataFrame ke JSON
            data_json = df.to_dict(orient='records')
            
            # Menentukan path output ke folder github-data
            nama_file_json = f"{sheet_name}.json"
            path_output_lengkap = os.path.join(target_output_dir, nama_file_json)
            
            # 5. Menyimpan data
            with open(path_output_lengkap, 'w', encoding='utf-8') as f:
                json.dump(data_json, f, indent=4, ensure_ascii=False)
                
            print(f"    -> Berhasil disimpan: {path_output_lengkap}")
            
        print(f"\nBERHASIL! Semua sheet telah dikonversi ke JSON.")
        
    except Exception as e:
        print(f"\nTerjadi kesalahan saat memproses file Excel: {str(e)}")

# --- MAIN FUNCTION AGAR BISA LANGSUNG DIEKSEKUSI ---
if __name__ == "__main__":
    konversi_excel_ke_json()
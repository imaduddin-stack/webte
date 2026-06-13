import os
import json
import pandas as pd

def konversi_excel_ke_json():
    # 1. Mendapatkan folder tempat script ini dijalankan
    folder_sekarang = os.getcwd()
    print(f"Membaca folder saat ini: {folder_sekarang}\n")
    
    # 2. Mencari file Excel (.xlsx) di folder tersebut
    # Mengabaikan file sementara Excel yang diawali dengan '~$'
    file_excel_list = [f for f in os.listdir(folder_sekarang) if f.endswith('.xlsx') and not f.startswith('~$')]
    
    if not file_excel_list:
        print("Peringatan: Tidak ditemukan file .xlsx di folder ini!")
        print("Pastikan script ini diletakkan di folder yang sama dengan file Excel Anda.")
        return

    # Jika ada lebih dari satu file Excel, script ini akan memproses file pertama yang ditemukan
    # Anda juga bisa memodifikasinya dengan perulangan (looping) jika ingin memproses banyak file Excel sekaligus
    file_excel_target = file_excel_list[0]
    print(f"File Excel ditemukan: '{file_excel_target}'")
    print("Mulai membaca seluruh sheet...\n")
    
    try:
        # 3. Membaca file Excel
        # sheet_name=None digunakan untuk membaca SEMUA sheet sekaligus.
        # Hasilnya berupa dictionary dengan format: { 'Nama_Sheet': DataFrame }
        semua_sheet = pd.read_excel(file_excel_target, sheet_name=None)
        
        indeks = 1
        total_sheet = len(semua_sheet)
        
        for sheet_name, df in semua_sheet.items():
            print(f"[{indeks}/{total_sheet}] Memproses Sheet: '{sheet_name}' ...")
            
            # Menghapus baris yang sepenuhnya kosong (opsional, agar JSON lebih bersih)
            df = df.dropna(how='all')
            
            # Mengonversi DataFrame ke bentuk List of Dictionaries (JSON)
            # orient='records' otomatis menjadikan baris pertama (header) sebagai Key JSON
            data_json = df.to_dict(orient='records')
            
            # Menentukan nama file JSON output berdasarkan nama sheet-nya
            # Karakter spasi pada nama sheet diganti dengan underscore (_) agar nama file lebih aman
            nama_file_json = f"{sheet_name.replace(' ', '_')}.json"
            
            # 4. Menyimpan data ke dalam file JSON
            with open(nama_file_json, 'w', encoding='utf-8') as f:
                # indent=4 membuat format JSON menjadi rapi (pretty-print) dan mudah dibaca manusia
                # ensure_ascii=False menjaga agar karakter unik/aksen tidak berubah format
                json.dump(data_json, f, indent=4, ensure_ascii=False)
                
            print(f"    -> BERHASIL disimpan sebagai: '{nama_file_json}'")
            indeks += 1
            
        print(f"\nSelesai! {total_sheet} sheet berhasil diekstrak menjadi file JSON terpisah.")
        
    except Exception as e:
        print(f"\nTerjadi kesalahan saat memproses file Excel: {str(e)}")

# --- MAIN FUNCTION AGAR BISA LANGSUNG DIEKSEKUSI ---
if __name__ == "__main__":
    konversi_excel_ke_json()
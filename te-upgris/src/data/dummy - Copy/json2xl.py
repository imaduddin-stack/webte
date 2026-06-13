import os
import json
import pandas as pd

def konversi_json_ke_excel(output_filename="Hasil_Konversi_JSON.xlsx"):
    # 1. Mendapatkan path folder tempat script ini dijalankan
    folder_sekarang = os.getcwd()
    print(f"Membaca folder saat ini: {folder_sekarang}\n")
    
    # 2. Otomatis membaca semua file yang berakhiran .json di folder tersebut
    file_json_list = [f for f in os.listdir(folder_sekarang) if f.endswith('.json')]
    
    # Validasi jika tidak ditemukan file JSON
    if not file_json_list:
        print("Peringatan: Tidak ditemukan file .json sama sekali di folder ini!")
        print("Pastikan script ini diletakkan di folder yang sama dengan file JSON Anda.")
        return

    # Urutkan nama file secara alfabetis/numerik agar rapi di Excel
    file_json_list.sort()
    
    total_file = len(file_json_list)
    print(f"Ditemukan {total_file} file JSON. Memulai proses konversi...\n")
    
    # 3. Menulis ke Excel menggunakan ExcelWriter
    with pd.ExcelWriter(output_filename, engine='openpyxl') as writer:
        for indeks, nama_file in enumerate(file_json_list, start=1):
            # Memotong nama file untuk dijadikan nama sheet (Maksimal 31 karakter aturan Excel)
            sheet_name = os.path.splitext(nama_file)[0][:31]
            
            try:
                # Membaca data JSON dengan encoding utf-8 aman untuk karakter unik
                with open(nama_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                # Membaca struktur kolom secara otomatis ke DataFrame
                if isinstance(data, list):
                    df = pd.DataFrame(data)
                elif isinstance(data, dict):
                    df = pd.DataFrame([data])
                else:
                    print(f"[{indeks}/{total_file}] Lewati {nama_file}: Struktur JSON tidak didukung (Bukan List/Dict).")
                    continue
                
                # Menyimpan DataFrame ke sheet yang sesuai
                df.to_excel(writer, sheet_name=sheet_name, index=False)
                print(f"[{indeks}/{total_file}] BERHASIL: '{nama_file}' -> Sheet: '{sheet_name}'")
                
            except json.JSONDecodeError:
                print(f"[{indeks}/{total_file}] GAGAL: '{nama_file}' rusak atau format JSON salah.")
            except Exception as e:
                print(f"[{indeks}/{total_file}] GAGAL memproses '{nama_file}': {str(e)}")

    print(f"\n Selesai! File Excel berhasil dibuat: {output_filename}")

# --- MAIN FUNCTION AGAR BISA LANGSUNG DIEKSEKUSI ---
if __name__ == "__main__":
    # Menjalankan fungsi utama
    konversi_json_ke_excel()
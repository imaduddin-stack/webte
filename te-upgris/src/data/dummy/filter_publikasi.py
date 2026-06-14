import json
import os
import re

def clean_lecturer_name(name):
    """
    Membersihkan gelar akademik agar menyisakan nama asli saja.
    Contoh: 'Dr. Ir. Adhi Kusmantoro, ST, MT' -> 'Adhi Kusmantoro'
    """
    # 1. Hapus gelar di depan (Dr., Ir., Drs., Dra.)
    name = re.sub(r'^(Dr\.|Ir\.|Drs\.|Dra\.|Prof\.)\s*', '', name, flags=re.IGNORECASE)
    # 2. Hapus gelar di belakang koma (ST, MT, Ph.D, M.Eng, dll)
    name = name.split(',')[0].strip()
    # 3. Hapus titik-titik gelar yang mungkin tersisa di tengah atau belakang
    name = re.sub(r'\s+[A-Z]\.[A-Z]\.?$', '', name)
    return name.strip()

def filter_publikasi():
    # Path file
    path_dosen = 'dosen.json'
    path_publikasi = 'publikasi_otomatis.json'
    path_output = 'publikasi_upgris.json'

    if not os.path.exists(path_dosen) or not os.path.exists(path_publikasi):
        print("Error: File dosen.json atau publikasi_otomatis.json tidak ditemukan.")
        return

    # Load data
    with open(path_dosen, 'r', encoding='utf-8') as f:
        dosen_list = json.load(f)
    
    with open(path_publikasi, 'r', encoding='utf-8') as f:
        publikasi_list = json.load(f)

    # Ambil daftar nama dosen yang sudah bersih
    # Kita asumsikan semua dosen di dosen.json berafiliasi dengan Universitas PGRI Semarang
    upgris_lecturers = [clean_lecturer_name(d['nama']) for d in dosen_list]
    
    print(f"Daftar dosen UPGRIS terdeteksi: {', '.join(upgris_lecturers)}\n")

    filtered_results = []
    
    for pub in publikasi_list:
        authors_str = pub.get('dosen', '').lower()
        is_upgris_paper = False
        matched_names = []

        for name in upgris_lecturers:
            # Pencocokan sederhana: apakah nama dosen ada di dalam string author publikasi
            if name.lower() in authors_str:
                is_upgris_paper = True
                matched_names.append(name)
        
        if is_upgris_paper:
            # Menambahkan informasi dosen mana yang cocok (opsional)
            # Memastikan keys sesuai dengan permintaan user
            pub = {
                "id": 0, # Akan diupdate di bawah
                "judul": pub.get("judul"),
                "jenis": pub.get("jenis"),
                "tahun": pub.get("tahun"),
                "penerbit": pub.get("penerbit"),
                "sinta_score": pub.get("sinta_score"),
                "scopus_index": pub.get("scopus_index")
            }
            filtered_results.append(pub)

    # Update ID agar berurutan kembali
    for i, pub in enumerate(filtered_results, 1):
        pub['id'] = i

    # Simpan hasil
    with open(path_output, 'w', encoding='utf-8') as f:
        json.dump(filtered_results, f, indent=4, ensure_ascii=False)

    print(f"PROSES SELESAI:")
    print(f"- Total publikasi awal: {len(publikasi_list)}")
    print(f"- Publikasi berafiliasi UPGRIS: {len(filtered_results)}")
    print(f"- Data disimpan di: {path_output}")

if __name__ == "__main__":
    # Pastikan direktori kerja benar
    current_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(current_dir)
    filter_publikasi()
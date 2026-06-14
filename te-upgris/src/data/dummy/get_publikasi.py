import os
import json
import requests

def fetch_metadata_from_crossref(title):
    """
    Mengambil metadata publikasi dari API Crossref berdasarkan judul.
    """
    api_url = "https://api.crossref.org/works"
    params = {
        "query.title": title,
        "rows": 1  # Ambil hasil yang paling relevan saja
    }
    
    try:
        response = requests.get(api_url, params=params, timeout=15)
        response.raise_for_status()
        data = response.json()
        
        items = data.get("message", {}).get("items", [])
        if not items:
            return None
            
        item = items[0]
        
        # 1. Judul (diambil dari API agar lebih akurat)
        judul_resmi = item.get("title", [title])[0]
        
        # 2. Dosen (mengambil semua penulis)
        authors = item.get("author", [])
        names = [f"{a.get('given', '')} {a.get('family', '')}".strip() for a in authors]
        dosen = ", ".join(n for n in names if n) or "Unknown"
            
        # 3. Tahun
        published = item.get("published-print") or item.get("published-online") or item.get("issued")
        tahun = None
        if published and "date-parts" in published:
            tahun = published["date-parts"][0][0]
            
        # 4. URL (Menggunakan DOI sebagai link permanen)
        doi = item.get("DOI")
        url_paper = f"https://doi.org/{doi}" if doi else item.get("URL")
        
        # 5. Mapping Jenis Publikasi
        type_raw = item.get("type", "")
        jenis = "Publikasi"
        if "journal" in type_raw:
            jenis = "Jurnal Internasional"
        elif "proceedings" in type_raw:
            jenis = "Prosiding Internasional"
            
        # 6. Keterangan (Nama Jurnal atau Konferensi)
        container = item.get("container-title", [""])[0]
        
        # 7. Publisher
        penerbit = item.get("publisher", "Unknown")
        
        return {
            "judul": judul_resmi,
            "dosen": dosen,
            "jenis": jenis,
            "tahun": tahun,
            "url": url_paper,
            "penerbit": penerbit,
            "sinta_score": None,
            "scopus_index": None
        }
        
    except Exception as e:
        print(f"   [!] Gagal memproses '{title[:50]}...': {e}")
        return None

def main():
    # File input (buat file titles.txt di folder yang sama)
    input_file = "jurnal.txt"
    output_file = "publikasi_otomatis.json"
    
    if not os.path.exists(input_file):
        print(f"Error: File '{input_file}' tidak ditemukan.")
        print("Silakan buat file tersebut dan isi dengan daftar judul paper (satu judul per baris).")
        return

    with open(input_file, "r", encoding="utf-8") as f:
        titles = [line.strip() for line in f if line.strip()]
        
    final_results = []
    print(f"Memulai pencarian metadata untuk {len(titles)} judul...\n")
    
    for idx, title in enumerate(titles, 1):
        print(f"[{idx}/{len(titles)}] Mencari: {title[:70]}...")
        meta = fetch_metadata_from_crossref(title)
        
        if meta:
            meta["id"] = idx
            final_results.append(meta)
        else:
            print(f"   [-] Data tidak ditemukan untuk judul tersebut.")
            
    # Simpan ke file JSON
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(final_results, f, indent=4, ensure_ascii=False)
        
    print(f"\nBERHASIL! Data disimpan di: {os.path.abspath(output_file)}")

if __name__ == "__main__":
    main()
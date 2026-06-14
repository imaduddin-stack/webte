import json
import os
import re
import time
import random
from scholarly import scholarly

def extract_scholar_id(url):
    """Mengekstrak ID profil dari URL Google Scholar."""
    if not url: return None
    if "user=" in url:
        match = re.search(r"user=([^&]+)", url)
        return match.group(1) if match else None
    # Mengantisipasi jika field scholar di dosen.json hanya berisi ID saja (misal: "dummy1")
    return url.strip()

def determine_jenis(venue):
    """Menentukan jenis publikasi berdasarkan nama jurnal/prosiding."""
    v = venue.lower()
    if any(k in v for k in ['proceedings', 'conference', 'prosiding', 'ieee', 'aip', 'iop', 'icseiet']):
        return "Prosiding Internasional" if any(k in v for k in ['international', 'ieee', 'aip', 'iop']) else "Prosiding Nasional"
    return "Jurnal Internasional" if any(k in v for k in ['international', 'journal', 'transactions']) else "Jurnal Nasional"

def sync_scholar_data():
    # Lokasi file referensi
    # Disesuaikan dengan struktur folder github-data
    path_dosen = '../../../github-data/data/static/dosen.json'
    path_output = '../../../github-data/data/publikasi.json'

    if not os.path.exists(path_dosen):
        print(f"Error: File '{path_dosen}' tidak ditemukan.")
        return

    with open(path_dosen, 'r', encoding='utf-8') as f:
        dosen_list = json.load(f)

    raw_results = []

    print("⚡ Sinkronisasi Data Publikasi dari Google Scholar Profiles...\n")

    for d in dosen_list:
        sid = extract_scholar_id(d.get('scholar'))
        print(f"[*] Memproses {d['nama']} (Scholar ID: {sid or 'Tidak Ada'})")
        
        if not sid:
            continue
        
        try:
            author_search = scholarly.search_author_id(sid)
            # Ambil data publikasi (fill basic info)
            print(f"    -> Menghubungi Google Scholar untuk {d['nama']}...")
            author = scholarly.fill(author_search, sections=['publications'])
            
            # Delay setelah mengambil profil penulis
            time.sleep(random.uniform(3, 7))
            
            print(f"    -> Ditemukan {len(author['publications'])} publikasi.")

            # Ambil maksimal 10 publikasi terbaru untuk menjaga performa
            for pub in author['publications'][:10]:
                # Delay antar pengambilan detail publikasi untuk menghindari blokir
                time.sleep(random.uniform(2, 5))
                
                pub_detail = scholarly.fill(pub)
                bib = pub_detail.get('bib', {})
                title = bib.get('title', 'Untitled')
                year = bib.get('pub_year')
                venue = bib.get('journal') or bib.get('conference') or bib.get('publisher') or ""
                
                # Membersihkan daftar penulis agar dipisahkan koma
                authors = bib.get('author', d['nama']).replace(' and ', ', ')
                
                item = {
                    "authors": authors,
                    "judul": title,
                    "jenis": determine_jenis(venue),
                    "tahun": int(year) if year and year.isdigit() else None,
                    "penerbit": bib.get('publisher', venue if venue else None),
                    "sinta_score": None,
                    "link_total_kutipan": pub_detail.get('citedby_url'),
                    "scopus_index": None,
                }
                raw_results.append(item)
                print(f"       + {title[:55]}...")

        except Exception as e:
            print(f"    [!] Gagal sinkronisasi {d['nama']}: {e}")

    # --- Tahap Post-Processing: De-duplikasi ---
    # Karena beberapa dosen bisa ada di satu paper yang sama
    unique_results = []
    seen_titles = set()
    
    print("\n[*] Menghapus duplikasi paper...")
    for pub in raw_results:
        title_clean = pub['judul'].lower().strip()
        if title_clean not in seen_titles:
            unique_results.append(pub)
            seen_titles.add(title_clean)

    # Update ID agar berurutan
    final_output = []
    for i, pub in enumerate(unique_results, 1):
        # Menyusun ulang kunci agar sesuai dengan format yang diminta
        ordered_item = {
            "id": i,
            "authors": pub["authors"],
            "judul": pub["judul"],
            "jenis": pub["jenis"],
            "tahun": pub["tahun"],
            "penerbit": pub["penerbit"],
            "sinta_score": pub["sinta_score"],
            "link_total_kutipan": pub["link_total_kutipan"],
            "scopus_index": pub["scopus_index"]
        }
        final_output.append(ordered_item)

    # Simpan hasil akhir
    with open(path_output, 'w', encoding='utf-8') as f:
        json.dump(final_output, f, indent=4, ensure_ascii=False)

    print(f"\n✅ BERHASIL! {len(unique_results)} publikasi unik disimpan di '{path_output}'.")

if __name__ == "__main__":
    # Set working directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    try:
        sync_scholar_data()
    except ImportError:
        print("\n[PERINGATAN] Library 'scholarly' tidak ditemukan.")
        print("Silakan jalankan perintah berikut:")
        print("pip install scholarly")
import csv
import json

# Read current JSON to preserve tipe for existing entries
with open('te-upgris/src/data/spmi/kurikulum.json', 'r', encoding='utf-8') as f:
    current_data = json.load(f)

# Only read old backup if exists (not our newly generated file)
# Build lookup by kode
old_lookup = {}
for item in current_data:
    old_lookup[item['kode']] = item

# Read CSV
new_data = []
with open('te-upgris/src/data/MASTER_DATA_ALL - KURIKULUM.csv', 'r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    for row in reader:
        sks_str = row['SKS'].strip()
        if not sks_str or float(sks_str) == 0:
            continue
        kode = int(row['KODE MK'].strip())
        nama = row['NAMA MK'].strip()
        sks = int(float(sks_str))
        semester = int(row['SMT'].strip())
        
        # Use tipe from CSV, fallback to original JSON
        tipe = row['JENIS MK'].strip()
        if not tipe and kode in old_lookup:
            tipe = old_lookup[kode]['tipe']
        
        # Use rpsUrl from original JSON if exists, otherwise use semester
        rpsUrl = semester
        if kode in old_lookup and 'rpsUrl' in old_lookup[kode]:
            rpsUrl = old_lookup[kode]['rpsUrl']
        
        entry = {
            'id': 0,
            'kode': kode,
            'nama': nama,
            'sks': sks,
            'semester': semester,
            'tipe': tipe,
            'rpsUrl': rpsUrl
        }
        new_data.append(entry)

# Sort by semester then kode
new_data.sort(key=lambda x: (x['semester'], x['kode']))

# Assign sequential ids
for i, item in enumerate(new_data):
    item['id'] = i + 1

# Write output
with open('te-upgris/src/data/spmi/kurikulum.json', 'w', encoding='utf-8') as f:
    json.dump(new_data, f, indent=4, ensure_ascii=False)

print(f'Done. Generated {len(new_data)} entries.')
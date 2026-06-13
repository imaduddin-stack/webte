# Sistem Monitoring Energi Listrik Rumah Tangga Berbasis IoT dan Mobile App

## Latar Belakang

Konsumsi energi listrik rumah tangga di Indonesia terus meningkat setiap tahun seiring pertumbuhan ekonomi dan populasi. Namun, mayoritas pengguna tidak memiliki akses terhadap informasi konsumsi energi secara real-time, sehingga sulit melakukan penghematan yang terencana.

Proyek Capstone Design ini hadir sebagai solusi terjangkau berbasis IoT yang memungkinkan pengguna memantau, menganalisis, dan mengendalikan konsumsi listrik langsung dari smartphone.

## Tujuan

- Merancang perangkat monitoring energi listrik yang akurat dan terjangkau
- Mengembangkan aplikasi Android untuk visualisasi data real-time
- Mengimplementasikan sistem notifikasi peringatan pemborosan energi
- Menyediakan laporan historis konsumsi per hari/minggu/bulan

## Komponen Sistem

### Hardware
- **ESP32** — mikrokontroler utama dengan WiFi built-in
- **PZEM-004T** — sensor tegangan, arus, daya, dan energi (akurasi ±1%)
- **PCB custom** — desain kompak 9×6 cm, housing ABS 3D-printed

### Software
- **Firmware ESP32** — C++ dengan Arduino framework, MQTT protocol
- **Backend** — Node.js + MQTT broker Mosquitto
- **Database** — InfluxDB untuk time-series data
- **Mobile App** — Flutter (Android & iOS), dashboard chart MPAndroidChart

## Metodologi

```
Sensor → ESP32 → MQTT Broker → Backend → InfluxDB
                                    ↓
                             Mobile App (Flutter)
```

Pengambilan data dilakukan setiap 1 detik dan dikirimkan ke broker MQTT. Backend memproses dan menyimpan data ke InfluxDB, sementara aplikasi mobile subscribe ke topik MQTT untuk tampilan real-time.

## Hasil & Pengujian

| Parameter | Nilai Referensi | Nilai Terukur | Error |
|-----------|----------------|---------------|-------|
| Tegangan | 220 V | 221.3 V | 0.59% |
| Arus | 2.00 A | 2.02 A | 1.00% |
| Daya | 440 W | 443.4 W | 0.77% |
| Energi (1 jam) | 0.440 kWh | 0.443 kWh | 0.68% |

Akurasi pengukuran memenuhi standar SPLN D5.004 dengan error < 2%.

## Kesimpulan

Sistem berhasil diimplementasikan dengan akurasi pengukuran di bawah 1.5% dan latensi data real-time kurang dari 500ms. Biaya produksi per unit ±Rp 250.000, jauh lebih terjangkau dibanding smart meter komersial yang berkisar Rp 1.500.000–3.000.000.

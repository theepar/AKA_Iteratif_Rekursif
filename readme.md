# Analisis Kompleksitas Algoritma - Konversi Desimal ke Biner

Proyek ini dibuat untuk memenuhi Tugas Besar (Tubes) mata kuliah **Analisis Kompleksitas Algoritma (AKA)**. Proyek ini membandingkan performa (waktu eksekusi) antara dua pendekatan algoritma konversi bilangan Desimal ke Biner: **Iteratif** dan **Rekursif**.

Saat ini tersedia dalam dua implementasi:
1.  **Aplikasi Web (Visualisasi & Benchmark)**

## Fitur Utama

### Web Application
- **Visualisasi Modern**: Antarmuka pengguna (UI) bertema gelap dengan interaksi yang mulus dan **Responsif** (Mobile Support).
- **Demo Interaktif**: Masukkan angka berapapun untuk melihat hasil konversi. Waktu eksekusi dinormalisasi (Total 1000x run) untuk akurasi lebih baik.
- **Grafik Benchmark**: Memvisualisasikan perbandingan kompleksitas waktu (Iteratif vs Rekursif) menggunakan *Chart.js*.


## Struktur Project

```text
/
├── index.html      # Halaman utama Web App
├── script.js       # Logika Web App & Charting
└── readme.md       # Dokumentasi Project
```

## Analisis Algoritma

### 1. Cara Iteratif
Menggunakan loop `while` untuk membagi bilangan secara berulang hingga mencapai 0.

- **Best Case**: $O(1)$ — Jika input $N = 0$, loop tidak dijalankan.
- **Worst Case**: $O(\log n)$ — Harus membagi $N$ sampai habis. Jumlah operasi sebanding dengan jumlah bit ($\approx \log_2 N$).
- **Average Case**: $O(\log n)$ — Secara rata-rata, setiap bilangan bulat positif $N$ memiliki panjang bit $\log_2 N$.

### 2. Cara Rekursif
Menggunakan fungsi yang memanggil dirinya sendiri (Divide and Conquer).

- **Best Case**: $O(1)$ — Jika input $N = 0$, langsung return (Base Case).
- **Worst Case**: $O(\log n)$ — Kedalaman stack (recursion depth) mencapai $\log_2 N$.
- **Average Case**: $O(\log n)$ — Sama seperti iteratif, jumlah pemanggilan fungsi sebanding dengan jumlah bit.

> **Kesimpulan**: Kedua algoritma memiliki efisiensi waktu yang setara secara asimtotik, namun Iteratif lebih hemat memori ($O(1)$ Space) dibandingkan Rekursif ($O(\log n)$ Stack Space).

## Cara Menjalankan

### Opsi 1: Aplikasi Web (Rekomendasi)
Cukup buka file `index.html` menggunakan browser modern (Chrome, Edge, Firefox).
1.  Double-klik `index.html`.
2.  Tampilan interaktif akan langsung muncul.

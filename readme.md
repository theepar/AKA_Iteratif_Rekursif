# Analisis Kompleksitas Algoritma - Konversi Desimal ke Biner

Proyek ini dibuat untuk memenuhi Tugas Besar (Tubes) mata kuliah **Analisis Kompleksitas Algoritma (AKA)**. Proyek ini membandingkan performa (waktu eksekusi) antara dua pendekatan algoritma konversi bilangan Desimal ke Biner: **Iteratif** dan **Rekursif**.

Dibuat menggunakan **HTML, Tailwind CSS, dan Vanilla JavaScript**, dengan fokus pada akurasi pengukuran waktu hingga satuan **Nanoseconds (ns)**.

## Fitur Utama

- **Floating Point Support**: Mendukung konversi bilangan pecahan (misal: `10.625`) dengan presisi tinggi (hingga 64-bit precision).
- **Nanosecond Precision**: Pengukuran waktu eksekusi menggunakan `performance.now()` dengan akurasi tinggi dan ditampilkan dalam satuan **Nanoseconds (ns)**.
- **Stable Benchmarking**: Menggunakan strategi **"Batch & Minimum"** (5x runs, ambil nilai minimum) untuk mengeliminasi gangguan *system noise* dan *garbage collector*, menghasilkan grafik yang stabil dan akurat.
- **Visualisasi Algoritma**: Tampilan langkah-demi-langkah (Step-by-Step) untuk memahami cara kerja Divide (Integer) dan Multiply (Fraction).
- **Responsif UI**: Antarmuka modern yang mendukung tampilan Desktop dan Mobile.

## Struktur Project

```text
/
├── index.html      # Tampilan Web App (UI)
├── script.js       # Core Algoritma (Iteratif/Rekursif) & Logic Benchmark
└── readme.md       # Dokumentasi Project
```

## Analisis Algoritma

### 1. Cara Iteratif
Menggunakan loop `while` untuk membagi bilangan bulat dan mengalikan bilangan pecahan secara berulang.

- **Best Case**: $O(1)$ — Jika input $N = 0$, loop tidak dijalankan.
- **Worst Case**: $O(\log n)$ — Jumlah operasi sebanding dengan jumlah bit representasi biner ($\approx \log_2 N$).
- **Space Complexity**: $O(1)$ — Hanya menggunakan variabel sementara, sangat hemat memori.

### 2. Cara Rekursif
Menggunakan fungsi yang memanggil dirinya sendiri (*self-calling function*) untuk memecah masalah menjadi sub-masalah.

- **Best Case**: $O(1)$ — Jika input $N = 0$, langsung return (Base Case).
- **Worst Case**: $O(\log n)$ — Kedalaman pemanggilan fungsi (*recursion depth*) mencapai $\log_2 N$.
- **Space Complexity**: $O(\log n)$ — Membutuhkan memori tambahan di *Call Stack* untuk setiap panggilan rekursif.

> **Kesimpulan**: Kedua algoritma memiliki kompleksitas waktu yang setara ($O(\log n)$), namun **Iteratif lebih unggul** dalam penggunaan memori dan stabilitas karena tidak membebani *Call Stack*.

## Cara Menjalankan

Cukup buka file `index.html` menggunakan browser modern (Chrome, Edge, Firefox).
1.  Double-klik `index.html`.
2.  **Interactive Demo**: Masukkan angka desimal (bisa koma) untuk melihat hasil dan perbandingan waktu instan.
3.  **Benchmark**: Scroll ke bawah dan klik "Mulai Benchmark" untuk melihat grafik perbandingan performa pada berbagai ukuran input ($N=0$ s.d. $10.000$).

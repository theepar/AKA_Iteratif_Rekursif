# Analisis Kompleksitas Algoritma - Benchmark Desimal ke Biner

Proyek ini dibuat untuk memenuhi Tugas Besar (Tubes) mata kuliah **Analisis Kompleksitas Algoritma (AKA)**. Program ini bertujuan untuk membandingkan performa (waktu eksekusi) antara dua algoritma konversi bilangan Desimal ke Biner: **Iteratif** dan **Rekursif**.

## Deskripsi

Program ditulis dalam bahasa Java dan melakukan benchmark dengan mengukur waktu eksekusi dalam satuan nanodetik (ns). Pengujian dilakukan terhadap berbagai ukuran input untuk melihat perilaku kompleksitas waktu dari kedua algoritma.

### Fitur Utama
1.  **Warmup Process**: Melakukan pemanasan (15.000 iterasi) untuk menstabilkan *Java Virtual Machine (JVM)* dan *JIT Compiler* sebelum benchmark sebenarnya dimulai.
2.  **Variasi Input**: Menguji rentang input (N) dari kecil ke besar: `{ 10, 50, 100, 500, 1000, 5000, 10000, 20000 }`.
3.  **Pelaporan Data**: Menampilkan hasil perbandingan waktu rata-rata (dari 10 kali pengujian per input) dalam bentuk tabel yang rapi.

## Algoritma

### 1. Cara Iteratif
Menggunakan pendekatan *looping* (`while`).
- Algoritma membagi bilangan dengan 2 secara berulang.
- Sisa bagi (modulus) digabungkan ke string hasil.
- Kompleksitas waktu: **O(log N)** (karena N dibagi 2 setiap langkah).

### 2. Cara Rekursif
Menggunakan pendekatan *fungsi yang memanggil dirinya sendiri*.
- Memecah masalah menjadi sub-masalah yang lebih kecil (N/2) hingga mencapai basis (N=0).
- Hasil panggilan rekursif digabungkan dengan sisa bagi.
- Kompleksitas waktu: **O(log N)**.
- *Catatan: Rekursi memiliki overhead tambahan untuk pemanggilan stack frame.*

## Cara Menjalankan

Pastikan Anda telah menginstal **Java Development Kit (JDK)**.

1.  **Compile** source code:
    ```bash
    javac tubes_aka.java
    ```
    *(Perintah ini akan menghasilkan file `Main.class`)*

2.  **Jalankan** program:
    ```bash
    java Main
    ```

## Contoh Output

```text
Status: Menjalankan Warmup (15.000 iterasi)...
Status: Siap. Memulai Benchmark...

=== HASIL PERBANDINGAN PERFORMA ===
Input (N)    | Iteratif (ns)   | Rekursif (ns)  
------------------------------------------------
10           | 1200            | 1500           
50           | 1450            | 1800           
100          | 1600            | 2100           
...          | ...             | ...            
20000        | 5600            | 8900           
------------------------------------------------
```
*Hasil waktu akan bervariasi bergantung pada spesifikasi mesin yang menjalankannya.*

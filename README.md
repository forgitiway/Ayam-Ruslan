# RideRent — Sistem Peminjaman & Rental Kendaraan

Platform peminjaman dan rental kendaraan berbasis web yang memudahkan pengguna dalam mencari kendaraan, mengajukan peminjaman, memantau status, hingga proses approval oleh admin.

[Deskripsi](#-deskripsi-project) • [Fitur](#-fitur-utama) • [Tech Stack](#-tech-stack) • [Struktur Peran](#-struktur-peran-role) • [Anggota Kelompok](#-anggota-kelompok)


## Deskripsi Project

### **Tema: Peminjaman / Rental Kendaraan**

**RideRent** adalah platform peminjaman dan rental kendaraan berbasis web yang memungkinkan pengguna untuk mencari, memilih, dan mengajukan peminjaman kendaraan secara online. Platform ini menyediakan berbagai pilihan kendaraan seperti **motor dan mobil**, lengkap dengan informasi harga sewa, jenis kendaraan, kapasitas, transmisi, serta status ketersediaannya.
RideRent dirancang untuk memudahkan proses peminjaman mulai dari pemilihan kendaraan, pengecekan ketersediaan berdasarkan tanggal, pengajuan peminjaman, hingga proses **approval atau rejection** oleh admin. Pengguna juga dapat memantau status peminjaman dan melihat riwayat peminjaman yang telah dilakukan.


## Fitur Utama

### **1. Autentikasi & Otorisasi**
1. Registrasi akun pengguna.
2. Login dan logout.
3. Authentication untuk menjaga keamanan akun.
4. Authorization berdasarkan role pengguna.
5. Role yang tersedia:
  - **User**
  - **Admin**
6. Proteksi halaman berdasarkan role.

### **2. Katalog & Manajemen Kendaraan**
Pengguna dapat melihat daftar kendaraan yang tersedia untuk dipinjam.

Informasi kendaraan meliputi:
1. Nama kendaraan.
2. Foto kendaraan.
3. Jenis kendaraan (**Motor / Mobil**).
4. Harga rental per hari.
5. Kapasitas penumpang.
6. Transmisi.
7. Tahun kendaraan.
8. Status ketersediaan.

Admin dapat melakukan:
1. Menambah data kendaraan.
2. Melihat data kendaraan.
3. Mengubah data kendaraan.
4. Menghapus data kendaraan.
5. Mengubah status kendaraan.

Status kendaraan:
1. 🟢 **Tersedia**
2. 🔴 **Sedang Disewa**
3. 🟡 **Maintenance**

### **3. Pengajuan Peminjaman**
User dapat:
1. Memilih kendaraan.
2. Menentukan tanggal mulai peminjaman.
3. Menentukan tanggal selesai peminjaman.
4. Mengisi tujuan penggunaan kendaraan.
5. Mengirim pengajuan peminjaman.
Sistem melakukan pengecekan ketersediaan kendaraan berdasarkan periode peminjaman untuk mencegah terjadinya **double booking**.

### **4. Status & Riwayat Peminjaman**
User dapat melihat status pengajuan peminjaman:
1. 🟡 **Pending** — Pengajuan sedang menunggu approval admin.
2. 🟢 **Approved** — Pengajuan telah disetujui.
3. 🔴 **Rejected** — Pengajuan ditolak oleh admin.
4. 🔵 **Ongoing** — Kendaraan sedang digunakan.
5. ⚫ **Returned** — Kendaraan telah dikembalikan.
6. ⚪ **Cancelled** — Pengajuan dibatalkan.
User juga dapat melihat **riwayat peminjaman** yang pernah dilakukan.

### **5. Panel Approval Admin**
Admin dapat:
1. Melihat seluruh pengajuan peminjaman.
2. Melihat detail pengajuan.
3. Memeriksa ketersediaan kendaraan.
4. Menyetujui pengajuan (**Approval**).
5. Menolak pengajuan (**Rejection**).
6. Memberikan alasan penolakan.
7. Mengubah status peminjaman.

### **6. Kalkulator Estimasi Biaya**
Sistem menghitung estimasi biaya peminjaman berdasarkan:
**Harga kendaraan × Durasi peminjaman**

Kendaraan : Honda Vario 160
Harga     : Rp100.000 / hari
Durasi    : 3 hari
-----------------------------
Total     : Rp300.000

### **7. Pengembalian Kendaraan**
Setelah masa peminjaman selesai, pengguna dapat melakukan proses pengembalian kendaraan.
Fitur pengembalian meliputi:
1. User dapat mengajukan pengembalian kendaraan.
2. Admin dapat mengonfirmasi pengembalian kendaraan.
3. Status peminjaman berubah menjadi **Returned** setelah dikonfirmasi.
4. Status kendaraan kembali menjadi **Tersedia** setelah kendaraan dikembalikan.
5. Admin dapat memperbarui kondisi kendaraan setelah proses pengembalian.

### **8. Search & Filter Kendaraan**
Pengguna dapat mencari dan memfilter kendaraan berdasarkan beberapa kriteria.
Fitur meliputi:
1. Pencarian berdasarkan nama kendaraan.
2. Filter berdasarkan jenis kendaraan:
  - **Motor**
  - **Mobil**
3. Filter berdasarkan harga rental.
4. Filter berdasarkan kapasitas kendaraan.
5. Filter berdasarkan transmisi.
6. Filter berdasarkan status ketersediaan kendaraan.

### **9. Dashboard Admin**
Admin memiliki dashboard untuk memantau dan mengelola aktivitas peminjaman kendaraan.
Dashboard menampilkan:
1. Total kendaraan.
2. Jumlah kendaraan yang tersedia.
3. Jumlah kendaraan yang sedang disewa.
4. Jumlah kendaraan dalam maintenance.
5. Jumlah pengajuan yang menunggu approval.
6. Jumlah peminjaman yang sedang berlangsung.
7. Jumlah peminjaman yang telah selesai.

## Struktur Peran (Role)
| **Role** | **Akses & Hak Akses** |
|----------|-----------------------|
| **User (Peminjam)** | Registrasi dan login, melihat katalog kendaraan, mencari dan memfilter kendaraan, melihat detail kendaraan, mengecek ketersediaan, mengajukan peminjaman, melihat estimasi biaya, memantau status peminjaman, melihat riwayat, dan mengajukan pengembalian kendaraan. |
| **Admin / Manajemen** | Mengelola data kendaraan (CRUD), mengatur status kendaraan, melihat seluruh pengajuan peminjaman, melakukan approval/rejection, mengelola data peminjaman, dan mengonfirmasi pengembalian kendaraan. |
# CamSpace — Sistem Penyewaan Kamera dan Peralatan Content Creation

Platform penyewaan kamera dan peralatan content creation berbasis web yang memudahkan pengguna dalam mencari alat, melihat detail dan ketersediaan, mengajukan peminjaman, serta memantau status peminjaman. Sistem juga menyediakan fitur approval bagi admin untuk mengelola pengajuan peminjaman.

[Deskripsi](#-deskripsi-project) • [Fitur](#-fitur-utama) • [Tech Stack](#-tech-stack) • [Struktur Peran](#-struktur-peran-role) • [Anggota Kelompok](#-anggota-kelompok)


## Deskripsi Project

### **Tema: Penyewaan Kamera dan Peralatan Content Creation**

**CamSpace** adalah platform penyewaan kamera dan peralatan pendukung pembuatan konten berbasis web yang memungkinkan pengguna untuk mencari, memilih, dan mengajukan peminjaman alat secara online.

CamSpace menyediakan berbagai pilihan peralatan seperti **kamera DSLR, mirrorless, digicam, tripod, lighting, microphone**, dan peralatan pendukung lainnya. Setiap alat dilengkapi dengan informasi berupa foto, nama, kategori, deskripsi, harga sewa, serta ketersediaan alat.

Sistem dirancang untuk memudahkan proses penyewaan mulai dari melihat katalog, melihat detail alat, mengajukan peminjaman berdasarkan tanggal dan kebutuhan, hingga proses **approval atau rejection** oleh admin. Pengguna juga dapat memantau status pengajuan, melihat dashboard, dan melihat riwayat peminjaman.


## Fitur Utama

### **1. Autentikasi & Otorisasi**

Pengguna dapat melakukan:

1. Registrasi akun.
2. Login.
3. Logout.
4. Authentication untuk menjaga akses akun.
5. Authorization berdasarkan role pengguna.

Role yang tersedia:

- **User**
- **Admin**

Halaman dan fitur dapat dibedakan berdasarkan role pengguna dan admin.


### **2. Katalog Alat**

Pengguna dapat melihat berbagai kamera dan peralatan content creation yang tersedia.

Kategori alat yang tersedia meliputi:

1. **DSLR**
2. **Mirrorless**
3. **Digicam**
4. **Tripod**
5. **Lighting**
6. **Microphone**
7. Peralatan pendukung lainnya.

Informasi alat meliputi:

1. Nama alat.
2. Foto alat.
3. Kategori.
4. Deskripsi.
5. Harga sewa per hari.
6. Jumlah stok.
7. Status ketersediaan.


### **3. Detail Alat**

Pengguna dapat melihat informasi lengkap dari alat yang dipilih.

Detail alat meliputi:

1. Foto alat.
2. Nama alat.
3. Kategori.
4. Deskripsi alat.
5. Harga sewa per hari.
6. Jumlah alat yang tersedia.
7. Tombol untuk mengajukan peminjaman.

Contoh alat:

**Canon EOS 600D**

- Kategori: DSLR
- Harga: Rp100.000 / hari
- Ketersediaan: 2 unit
- Status: Siap Sewa


### **4. Pengajuan Peminjaman**

Pengguna dapat mengajukan peminjaman alat melalui form pengajuan.

User dapat:

1. Memilih alat.
2. Menentukan tanggal mulai peminjaman.
3. Menentukan tanggal selesai peminjaman.
4. Mengisi keperluan peminjaman.
5. Mengirim pengajuan peminjaman.

Form pengajuan tersedia pada halaman **Ajukan Peminjaman**.


### **5. Status Peminjaman**

Pengguna dapat memantau status pengajuan peminjaman.

Status peminjaman meliputi:

1. 🟡 **Menunggu Approval** — Pengajuan sedang menunggu persetujuan admin.
2. 🟢 **Disetujui** — Pengajuan telah disetujui oleh admin.
3. 🔴 **Ditolak** — Pengajuan ditolak oleh admin.
4. 🔵 **Sedang Dipinjam** — Alat sedang digunakan oleh pengguna.
5. ⚪ **Selesai** — Proses peminjaman telah selesai.

Halaman status menampilkan informasi alat, nomor pengajuan, tanggal peminjaman, dan status pengajuan.


### **6. Panel Approval Admin**

Admin memiliki halaman khusus untuk memeriksa pengajuan peminjaman.

Admin dapat:

1. Melihat daftar pengajuan.
2. Melihat informasi peminjaman.
3. Memeriksa alat yang diajukan.
4. Menyetujui pengajuan (**Approval**).
5. Menolak pengajuan (**Rejection**).
6. Memantau status pengajuan.

Panel approval digunakan untuk membantu admin dalam mengelola proses peminjaman.


### **7. Dashboard**

Dashboard digunakan untuk memberikan ringkasan aktivitas peminjaman pengguna.

Dashboard menampilkan:

1. Jumlah peminjaman aktif.
2. Jumlah pengajuan yang menunggu approval.
3. Jumlah peminjaman yang telah selesai.
4. Daftar peminjaman terbaru.
5. Status peminjaman terbaru.
6. Akses cepat menuju katalog alat.

Dashboard membantu pengguna melihat ringkasan aktivitas peminjaman tanpa harus membuka setiap halaman secara terpisah.


### **8. Riwayat Peminjaman**

Pengguna dapat melihat daftar peminjaman yang telah dilakukan.

Informasi riwayat meliputi:

1. Nomor pengajuan.
2. Nama alat.
3. Tanggal peminjaman.
4. Keperluan peminjaman.
5. Status peminjaman.

Riwayat digunakan untuk melihat kembali aktivitas peminjaman yang pernah dilakukan oleh pengguna.


### **9. Search & Navigasi Alat**

Pengguna dapat mencari dan menemukan alat yang dibutuhkan melalui katalog.

Fitur meliputi:

1. Pencarian berdasarkan nama alat.
2. Melihat alat berdasarkan kategori.
3. Melihat detail alat.
4. Melihat harga sewa.
5. Melihat ketersediaan alat.
6. Melanjutkan ke proses pengajuan peminjaman.


## Tech Stack

Teknologi yang digunakan dalam pengembangan CamSpace:

- **Next.js**
- **React**
- **JavaScript**
- **Tailwind CSS**
- **Next.js App Router**

Pada tahap pengembangan frontend, data alat dan data peminjaman masih menggunakan **data dummy** untuk menampilkan dan menguji antarmuka sistem.


## Struktur Peran (Role)

| **Role** | **Akses & Hak Akses** |
|----------|-----------------------|
| **User (Peminjam)** | Registrasi dan login, melihat katalog alat, mencari alat, melihat detail alat, melihat ketersediaan, mengajukan peminjaman, melihat status peminjaman, melihat dashboard, dan melihat riwayat peminjaman. |
| **Admin** | Login sebagai admin, melihat daftar pengajuan peminjaman, memeriksa pengajuan, melakukan approval atau rejection, dan memantau proses peminjaman. |


## Struktur Halaman

Struktur halaman utama CamSpace:

```text
/                       → Beranda
/login                  → Login
/register               → Registrasi
/dashboard              → Dashboard pengguna
/kamera                 → Katalog alat
/kamera/[id]            → Detail alat
/peminjaman             → Peminjaman saya
/peminjaman/ajukan      → Form pengajuan peminjaman
/status                 → Status peminjaman
/admin/approval         → Approval pengajuan oleh admin
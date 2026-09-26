import { apiFetch } from "@/lib/api";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    const body = await request.json();

    const status = body.status;

    if (!status) {
      return Response.json(
        {
          success: false,
          message: "Status wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (
      status !== "approved" &&
      status !== "rejected"
    ) {
      return Response.json(
        {
          success: false,
          message:
            "Status hanya boleh approved atau rejected.",
        },
        { status: 400 }
      );
    }

    const token =
      process.env.NEXT_PUBLIC_DEV_TOKEN;

    // ========================================
    // JIKA DITOLAK
    // ========================================
    // Tidak perlu mengubah stok.
    // Langsung ubah status rental.
    
    if (status === "rejected") {
      const response = await apiFetch(
        `/rentals/${id}`,
        {
          method: "PUT",
          token,
          body: {
            status: "rejected",
            admin_note:
              body.admin_note ||
              "Pengajuan ditolak oleh admin.",
          },
        }
      );

      return Response.json(response);
    }

    // ========================================
    // JIKA DISETUJUI
    // ========================================
    // Ambil data rental terlebih dahulu.

    const rentals = await apiFetch(
      "/rentals",
      {
        method: "GET",
        token,
      }
    );

    if (!Array.isArray(rentals)) {
      throw new Error(
        "Data peminjaman tidak valid."
      );
    }

    const rental = rentals.find(
      (item) =>
        Number(item.id) === Number(id)
    );

    if (!rental) {
      return Response.json(
        {
          success: false,
          message:
            "Data peminjaman tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    // ========================================
    // CEK STATUS
    // ========================================

    if (rental.status === "approved") {
      return Response.json(
        {
          success: false,
          message:
            "Peminjaman ini sudah disetujui.",
        },
        { status: 400 }
      );
    }

    if (rental.status === "rejected") {
      return Response.json(
        {
          success: false,
          message:
            "Peminjaman ini sudah ditolak.",
        },
        { status: 400 }
      );
    }

    // ========================================
    // AMBIL DATA ALAT
    // ========================================

    const equipment = await apiFetch(
      `/equipment/${rental.equipment_id}`,
      {
        method: "GET",
        token,
      }
    );

    const stokSekarang = Number(
      equipment.stock || 0
    );

    const jumlahPinjam = Number(
      rental.quantity || 0
    );

    // ========================================
    // CEK STOK
    // ========================================

    if (stokSekarang < jumlahPinjam) {
      return Response.json(
        {
          success: false,
          message:
            `Stok tidak cukup. Stok tersedia hanya ${stokSekarang} unit.`,
        },
        { status: 400 }
      );
    }

    // ========================================
    // HITUNG STOK BARU
    // ========================================

    const stokBaru =
      stokSekarang - jumlahPinjam;

    // ========================================
    // UPDATE STOK ALAT
    // ========================================

    await apiFetch(
      `/equipment/${rental.equipment_id}`,
      {
        method: "PUT",
        token,
        body: {
          name: equipment.name,
          category: equipment.category,
          brand: equipment.brand,
          description: equipment.description,
          price_per_day: Number(
            equipment.price_per_day
          ),
          stock: stokBaru,
          image_url: equipment.image_url,
          status: equipment.status,
          specifications:
            equipment.specifications,
        },
      }
    );

    // ========================================
    // UPDATE STATUS RENTAL
    // ========================================

    const response = await apiFetch(
      `/rentals/${id}`,
      {
        method: "PUT",
        token,
        body: {
          status: "approved",
          admin_note:
            body.admin_note ||
            "Pengajuan disetujui oleh admin.",
        },
      }
    );

    return Response.json(response);
  } catch (error) {
    console.error(
      "ERROR UPDATE RENTAL:",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          error.message ||
          "Gagal mengubah status peminjaman.",
      },
      { status: 500 }
    );
  }
}
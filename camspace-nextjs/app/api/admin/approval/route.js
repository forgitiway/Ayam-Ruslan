import { apiFetch } from "@/lib/api";

function getToken(request) {
  const authorization = request.headers.get("authorization");

  if (!authorization) {
    return null;
  }

  return authorization.replace(/^Bearer\s+/i, "");
}

// ========================================
// GET DATA APPROVAL
// ========================================

export async function GET(request) {
  try {
    const token = getToken(request);

    if (!token) {
      return Response.json(
        {
          success: false,
          message: "Anda harus login terlebih dahulu.",
        },
        { status: 401 }
      );
    }

    const response = await apiFetch("/rentals", {
      method: "GET",
      token: token,
    });

    const data = response.data || response;

    // Hanya ambil pengajuan yang masih pending
    const pendingData = Array.isArray(data)
      ? data.filter((rental) => rental.status === "pending")
      : [];

    return Response.json({
      success: true,
      data: pendingData,
    });
  } catch (error) {
    console.error("ERROR GET APPROVAL:", error);

    return Response.json(
      {
        success: false,
        message:
          error.message ||
          "Gagal mengambil data approval.",
      },
      { status: 500 }
    );
  }
}

// ========================================
// APPROVE / REJECT PEMINJAMAN
// ========================================

export async function PUT(request) {
  try {
    const token = getToken(request);

    if (!token) {
      return Response.json(
        {
          success: false,
          message: "Anda harus login terlebih dahulu.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { rental_id, status } = body;

    if (!rental_id) {
      return Response.json(
        {
          success: false,
          message: "ID peminjaman wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (!["approved", "rejected"].includes(status)) {
      return Response.json(
        {
          success: false,
          message:
            "Status hanya boleh approved atau rejected.",
        },
        { status: 400 }
      );
    }

    // Update status peminjaman
    const response = await apiFetch(
      `/rentals/${rental_id}`,
      {
        method: "PUT",
        token: token,
        body: {
          status: status,
        },
      }
    );

    return Response.json({
      success: true,
      message:
        status === "approved"
          ? "Peminjaman berhasil disetujui."
          : "Peminjaman berhasil ditolak.",
      data: response,
    });
  } catch (error) {
    console.error("ERROR UPDATE APPROVAL:", error);

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
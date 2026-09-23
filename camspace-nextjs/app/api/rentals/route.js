import { apiFetch } from "@/lib/api";

function getToken(request) {
  const authorization = request.headers.get("authorization");

  if (!authorization) {
    return null;
  }

  return authorization.replace(/^Bearer\s+/i, "");
}

// ========================================
// GET PEMINJAMAN
// ========================================

export async function GET() {
  try {
    const response = await apiFetch("/rentals", {
      method: "GET",
      token: process.env.NEXT_PUBLIC_DEV_TOKEN,
    });

    console.log("HASIL GET RENTALS:", response);

    return Response.json(response);
  } catch (error) {
    console.error("ERROR GET RENTALS:", error);

    return Response.json(
      {
        success: false,
        message:
          error.message ||
          "Gagal mengambil data peminjaman.",
      },
      { status: 500 }
    );
  }
}

// ========================================
// POST PEMINJAMAN
// ========================================

export async function POST(request) {
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

    console.log("BODY PEMINJAMAN:", body);

    const response = await apiFetch("/rentals", {
      method: "POST",
      body: body,
      token: token,
    });

    console.log("HASIL POST RENTALS:", response);

    return Response.json(response);
  } catch (error) {
    console.error("ERROR POST RENTALS:", error);

    return Response.json(
      {
        success: false,
        message:
          error.message ||
          "Gagal membuat pengajuan.",
      },
      { status: 500 }
    );
  }
}
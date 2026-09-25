import { apiFetch } from "@/lib/api";

export async function GET() {
  try {
    const response = await apiFetch("/equipment", {
      token: process.env.NEXT_PUBLIC_DEV_TOKEN,
    });

    return Response.json(response);
  } catch (error) {
    return Response.json(
      {
        message: error.message || "Gagal mengambil data alat.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const response = await apiFetch("/equipment", {
      method: "POST",
      token: process.env.NEXT_PUBLIC_DEV_TOKEN,
      body,
    });

    return Response.json(response);
  } catch (error) {
    return Response.json(
      {
        message: error.message || "Gagal menambahkan alat.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();

    const response = await apiFetch("/equipment", {
      method: "PUT",
      token: process.env.NEXT_PUBLIC_DEV_TOKEN,
      body,
    });

    return Response.json(response);
  } catch (error) {
    return Response.json(
      {
        message: error.message || "Gagal mengubah alat.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();

    const response = await apiFetch("/equipment", {
      method: "DELETE",
      token: process.env.NEXT_PUBLIC_DEV_TOKEN,
      body,
    });

    return Response.json(response);
  } catch (error) {
    return Response.json(
      {
        message: error.message || "Gagal menghapus alat.",
      },
      {
        status: 500,
      }
    );
  }
}
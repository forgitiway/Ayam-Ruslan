import { apiFetch } from "@/lib/api";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const response = await apiFetch(`/equipment/${id}`, {
      token: process.env.NEXT_PUBLIC_DEV_TOKEN,
    });

    return Response.json(response);
  } catch (error) {
    return Response.json(
      {
        message:
          error.message || "Gagal mengambil data alat.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    const body = await request.json();

    const response = await apiFetch(`/equipment/${id}`, {
      method: "PUT",
      token: process.env.NEXT_PUBLIC_DEV_TOKEN,
      body,
    });

    return Response.json(response);
  } catch (error) {
    return Response.json(
      {
        message:
          error.message || "Gagal mengubah data alat.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const response = await apiFetch(`/equipment/${id}`, {
      method: "DELETE",
      token: process.env.NEXT_PUBLIC_DEV_TOKEN,
    });

    return Response.json(response);
  } catch (error) {
    return Response.json(
      {
        message:
          error.message ||
          "Gagal menghapus data alat.",
      },
      {
        status: 500,
      }
    );
  }
}
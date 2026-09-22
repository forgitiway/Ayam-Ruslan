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
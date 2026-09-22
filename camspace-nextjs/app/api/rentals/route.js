import { apiFetch } from "@/lib/api";

export async function POST(request) {
  try {
    const body = await request.json();

    console.log("BODY YANG DIKIRIM:", body);

    const response = await apiFetch("/rentals", {
      method: "POST",
      body,
      token: process.env.NEXT_PUBLIC_DEV_TOKEN,
    });

    console.log("HASIL API:", response);

    return Response.json(response);
  } catch (error) {
    console.error("ERROR API RENTALS:", error);

    return Response.json(
      {
        success: false,
        message: error.message || "Gagal membuat pengajuan.",
      },
      {
        status: 500,
      }
    );
  }
}
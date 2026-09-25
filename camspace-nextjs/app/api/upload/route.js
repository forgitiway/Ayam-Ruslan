import fs from "fs/promises";
import path from "path";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    if (!file) {
      return Response.json(
        {
          message: "Tidak ada file yang dipilih.",
        },
        {
          status: 400,
        }
      );
    }

    if (!file.type.startsWith("image/")) {
      return Response.json(
        {
          message: "File harus berupa gambar.",
        },
        {
          status: 400,
        }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads"
    );

    await fs.mkdir(uploadDir, {
      recursive: true,
    });

    const extension = path.extname(file.name);

    const fileName =
      `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}${extension}`;

    const filePath = path.join(
      uploadDir,
      fileName
    );

    await fs.writeFile(filePath, buffer);

    return Response.json({
      message: "Gambar berhasil diupload.",
      image_url: `/uploads/${fileName}`,
    });
  } catch (error) {
    console.error("Upload error:", error);

    return Response.json(
      {
        message:
          error.message || "Gagal mengupload gambar.",
      },
      {
        status: 500,
      }
    );
  }
}
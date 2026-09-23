"use client";

import { useEffect, useState } from "react";

export default function ApprovalPage() {
  const [pengajuan, setPengajuan] = useState([]);

  useEffect(() => {
    const data = JSON.parse(
      localStorage.getItem("camspace_rentals") || "[]"
    );

    setPengajuan(data);
  }, []);

  const updateStatus = (id, status) => {
    const data = JSON.parse(
      localStorage.getItem("camspace_rentals") || "[]"
    );

    const dataBaru = data.map((item) =>
      item.id === id
        ? { ...item, status: status }
        : item
    );

    localStorage.setItem(
      "camspace_rentals",
      JSON.stringify(dataBaru)
    );

    setPengajuan(dataBaru);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-2xl font-bold">
          Approval Peminjaman
        </h1>

        <p className="mb-6 text-gray-600">
          Kelola pengajuan peminjaman kamera dari pengguna.
        </p>

        {pengajuan.length === 0 ? (
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-gray-500">
              Belum ada pengajuan peminjaman.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pengajuan.map((item) => (
              <div
                key={item.id}
                className="rounded-lg bg-white p-5 shadow"
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500">
                      Peminjam
                    </p>
                    <p className="font-semibold">
                      {item.user_name}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      ID Alat
                    </p>
                    <p className="font-semibold">
                      {item.equipment_id}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Tanggal Mulai
                    </p>
                    <p>{item.start_date}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Tanggal Selesai
                    </p>
                    <p>{item.end_date}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Jumlah
                    </p>
                    <p>{item.quantity}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Keperluan
                    </p>
                    <p>{item.keperluan || "-"}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <div>
                    <span className="text-sm font-medium">
                      Status:
                    </span>{" "}
                    <span
                      className={
                        item.status === "approved"
                          ? "font-semibold text-green-600"
                          : item.status === "rejected"
                          ? "font-semibold text-red-600"
                          : "font-semibold text-yellow-600"
                      }
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </div>

                  {item.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          updateStatus(
                            item.id,
                            "approved"
                          )
                        }
                        className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                      >
                        Setujui
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(
                            item.id,
                            "rejected"
                          )
                        }
                        className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                      >
                        Tolak
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
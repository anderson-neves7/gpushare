// frontend/app/gpus/[id]/GpuDetailClient.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function GpuDetailClient({ id }: { id: string }) {
  const [gpu, setGpu] = useState<any>(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/gpu/${id}`)
      .then((res) => res.json())
      .then((data) => setGpu(data));
  }, [id]);

  if (!gpu) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-4 bg-white rounded shadow">
      <h1 className="text-3xl font-bold">{gpu.name}</h1>

      <p className="text-gray-700">Specs: {gpu.specs}</p>
      <p className="text-gray-700">Rate: ${gpu.rate}/hr</p>
      <p className="text-gray-700">Status: {gpu.status}</p>

      <Link
        href={`/gpus/${id}/edit`}
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Edit GPU
      </Link>
    </div>
  );
}

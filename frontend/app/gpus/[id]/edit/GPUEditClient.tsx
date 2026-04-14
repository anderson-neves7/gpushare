// frontend/app/gpus/[id]/edit/GPUEditClient.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GPUEditClient({ id }: { id: string }) {
  const router = useRouter();

  const [gpu, setGpu] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/gpu/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setGpu({
          id: data.id,
          name: data.name ?? "",
          specs: data.specs ?? "",
          rate: data.rate?.toString() ?? "0",
          status: data.status ?? "available",
        });
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      id: gpu.id,
      name: gpu.name,
      specs: gpu.specs,
      rate: parseFloat(gpu.rate),
      status: gpu.status,
    };

    const res = await fetch(`http://127.0.0.1:8000/gpu/${gpu.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("PUT failed", await res.text());
      return;
    }

    router.push(`/gpus/${gpu.id}`);
    router.refresh();
  };

  if (loading || !gpu) return <p className="p-6">Loading...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow space-y-4"
    >
      <h1 className="text-3xl font-bold mb-4">Edit GPU</h1>

      <div>
        <label className="block font-semibold">Name</label>
        <input
          className="border p-2 w-full"
          value={gpu.name}
          onChange={(e) => setGpu({ ...gpu, name: e.target.value })}
        />
      </div>

      <div>
        <label className="block font-semibold">Specs</label>
        <input
          className="border p-2 w-full"
          value={gpu.specs}
          onChange={(e) => setGpu({ ...gpu, specs: e.target.value })}
        />
      </div>

      <div>
        <label className="block font-semibold">Rate ($/hr)</label>
        <input
          className="border p-2 w-full"
          type="number"
          value={gpu.rate}
          onChange={(e) => setGpu({ ...gpu, rate: e.target.value })}
        />
      </div>

      <div>
        <label className="block font-semibold">Status</label>
        <select
          className="border p-2 w-full"
          value={gpu.status}
          onChange={(e) => setGpu({ ...gpu, status: e.target.value })}
        >
          <option value="available">available</option>
          <option value="busy">busy</option>
          <option value="offline">offline</option>
        </select>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Save Changes
      </button>
    </form>
  );
}

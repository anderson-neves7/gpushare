// frontend/app/gpus/page.tsx

async function fetchGpus() {
  const res = await fetch("http://127.0.0.1:8000/gpus", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch GPUs");
  }

  return res.json();
}

export default async function GPUsPage() {
  const gpus = await fetchGpus();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold mb-4">GPUs</h1>

      <div className="space-y-2">
        {gpus.map((gpu: any) => (
          <a
            key={gpu.id}
            href={`/gpus/${gpu.id}`}
            className="block border rounded p-3 hover:bg-gray-50"
          >
            <div className="font-semibold">{gpu.name}</div>
            <div className="text-sm text-gray-600">
              {gpu.specs} — ${gpu.rate}/hr — {gpu.status}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

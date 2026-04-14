// frontend/app/jobs/[id]/JobDetailClient.tsx

"use client";

import { useEffect, useState } from "react";

export default function JobDetailClient({ id }: { id: string }) {
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/job/${id}`)
      .then((res) => res.json())
      .then((data) => setJob(data));
  }, [id]);

  if (!job) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-4 bg-white rounded shadow">
      <h1 className="text-3xl font-bold">Job #{job.id}</h1>
      <p className="text-gray-700">GPU ID: {job.gpu_id}</p>
      <p className="text-gray-700">Status: {job.status}</p>
      <p className="text-gray-700">Submitted at: {job.submitted_at}</p>
      <p className="text-gray-700">Estimated cost: ${job.estimated_cost}</p>
    </div>
  );
}

// frontend/app/jobs/page.tsx

async function fetchJobs() {
  const res = await fetch("http://127.0.0.1:8000/jobs", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return res.json();
}

export default async function JobsPage() {
  const jobs = await fetchJobs();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold mb-4">Jobs</h1>

      <div className="space-y-2">
        {jobs.map((job: any) => (
          <a
            key={job.id}
            href={`/jobs/${job.id}`}
            className="block border rounded p-3 hover:bg-gray-50"
          >
            <div className="font-semibold">Job #{job.id}</div>
            <div className="text-sm text-gray-600">
              GPU: {job.gpu_id} — Status: {job.status}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

export default function HomeClient() {
  const [gpus, setGpus] = useState<any[]>([]);
  const [runningJobs, setRunningJobs] = useState<any[]>([]);
  const [queuedJobs, setQueuedJobs] = useState<any[]>([]);

  // Form state
  const [gpuName, setGpuName] = useState("");
  const [gpuSpecs, setGpuSpecs] = useState("");
  const [gpuRate, setGpuRate] = useState("");

  const [jobName, setJobName] = useState("");
  const [jobInput, setJobInput] = useState("");

  // Fetch GPUs (correct endpoint!)
  const loadGpus = () => {
    fetch("http://127.0.0.1:8000/gpus")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched GPUs:", data);
        setGpus(Array.isArray(data) ? data : []);
      });
  };

  // Fetch Jobs
  const loadJobs = () => {
    fetch("http://127.0.0.1:8000/jobs")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Jobs:", data);
        setRunningJobs(data.filter((j: any) => j.status !== "queued"));
        setQueuedJobs(data.filter((j: any) => j.status === "queued"));
      });
  };

  // Initial load + auto-refresh every 2 seconds
  useEffect(() => {
    loadGpus();
    loadJobs();

    const interval = setInterval(() => {
      loadGpus();
      loadJobs();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Create GPU
  const createGpu = async (e: any) => {
    e.preventDefault();

    await fetch("http://127.0.0.1:8000/gpu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: gpuName,
        specs: gpuSpecs,
        rate: parseFloat(gpuRate),
      }),
    });

    setGpuName("");
    setGpuSpecs("");
    setGpuRate("");

    loadGpus();
  };

  // Create Job
  const createJob = async (e: any) => {
    e.preventDefault();

    await fetch("http://127.0.0.1:8000/job", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: jobName,
        input_data: jobInput,
      }),
    });

    setJobName("");
    setJobInput("");

    loadJobs();
  };

  // Job actions
  const completeJob = async (id: number) => {
    await fetch(`http://127.0.0.1:8000/job/${id}/complete`, { method: "POST" });
    loadJobs();
  };

  const failJob = async (id: number) => {
    await fetch(`http://127.0.0.1:8000/job/${id}/fail`, { method: "POST" });
    loadJobs();
  };

  const cancelJob = async (id: number) => {
    await fetch(`http://127.0.0.1:8000/job/${id}/cancel`, { method: "POST" });
    loadJobs();
  };

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">GPUShare Dashboard</h1>

      {/* Create GPU */}
      <section className="mb-10 border p-4 rounded">
        <h2 className="text-xl font-semibold mb-3">Register a GPU</h2>
        <form onSubmit={createGpu} className="space-y-3">
          <input
            className="border p-2 w-full"
            placeholder="GPU Name"
            value={gpuName}
            onChange={(e) => setGpuName(e.target.value)}
          />
          <input
            className="border p-2 w-full"
            placeholder="Specs (e.g., 24GB VRAM)"
            value={gpuSpecs}
            onChange={(e) => setGpuSpecs(e.target.value)}
          />
          <input
            className="border p-2 w-full"
            placeholder="Rate ($/hr)"
            value={gpuRate}
            onChange={(e) => setGpuRate(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Add GPU
          </button>
        </form>
      </section>

      {/* Create Job */}
      <section className="mb-10 border p-4 rounded">
        <h2 className="text-xl font-semibold mb-3">Submit a Job</h2>
        <form onSubmit={createJob} className="space-y-3">
          <input
            className="border p-2 w-full"
            placeholder="Job Name"
            value={jobName}
            onChange={(e) => setJobName(e.target.value)}
          />
          <input
            className="border p-2 w-full"
            placeholder="Input Data"
            value={jobInput}
            onChange={(e) => setJobInput(e.target.value)}
          />
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Submit Job
          </button>
        </form>
      </section>

      {/* GPUs */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">GPUs</h2>

        {gpus.length === 0 ? (
          <p className="text-gray-600">No GPUs found.</p>
        ) : (
          <ul className="space-y-2">
            {gpus.map((gpu: any) => (
              <li key={gpu.id} className="border p-3 rounded">
                <strong>{gpu.name}</strong> — {gpu.specs}
                <span className="ml-2 text-sm text-gray-500">
                  (${gpu.rate}/hr)
                </span>
                <div>Status: {gpu.status}</div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Running / Completed Jobs */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Running / Completed Jobs</h2>

        {runningJobs.length === 0 ? (
          <p className="text-gray-600">No jobs running or completed.</p>
        ) : (
          <ul className="space-y-2">
            {runningJobs.map((job: any) => (
              <li key={job.id} className="border p-3 rounded">
                <strong>{job.name}</strong> — {job.status}
                <div>GPU: {job.gpu_id ?? "None"}</div>
                <div>Start: {job.start_time ?? "—"}</div>
                <div>End: {job.end_time ?? "—"}</div>
                <div>Cost: {job.cost ? `$${job.cost.toFixed(2)}` : "—"}</div>

                {job.status === "running" && (
                  <div className="mt-3 space-x-2">
                    <button
                      onClick={() => completeJob(job.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Complete
                    </button>

                    <button
                      onClick={() => failJob(job.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Fail
                    </button>

                    <button
                      onClick={() => cancelJob(job.id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Queued Jobs */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Queued Jobs</h2>

        {queuedJobs.length === 0 ? (
          <p className="text-gray-600">Queue is empty.</p>
        ) : (
          <ul className="space-y-2">
            {queuedJobs.map((job: any) => (
              <li key={job.id} className="border p-3 rounded">
                <strong>{job.name}</strong>
                <div>Position: {job.queue_position}</div>

                <div className="mt-3">
                  <button
                    onClick={() => cancelJob(job.id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

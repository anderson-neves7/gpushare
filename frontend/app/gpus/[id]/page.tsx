// frontend/app/gpus/[id]/page.tsx

import GpuDetailClient from "./GpuDetailClient";

export default function GpuDetailPage({ params }: { params: { id: string } }) {
  return <GpuDetailClient id={params.id} />;
}

import GPUEditClient from "./GPUEditClient";

export default function GPUEditPage({ params }: { params: { id: string } }) {
  return <GPUEditClient id={params.id} />;
}

import React from 'react';
import { useParams } from 'react-router-dom';
import GPUForm from '@/components/provider/GPUForm';
import { providerGpus } from '@/lib/mockData';
import PageWrapper from '@/components/PageWrapper';


export default function ProviderEdit() {
  const { id } = useParams();
  const gpu = providerGpus.find((g) => g.id === id);

  return (
    <PageWrapper>
      <GPUForm
        initialData={gpu}
        title="Edit GPU Listing"
        subtitle="Update your GPU details and pricing"
      />
    </PageWrapper>
  );
}
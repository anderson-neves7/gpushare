import React from 'react';
import GPUForm from '@/components/provider/GPUForm';
import PageWrapper from '@/components/PageWrapper';

export default function ProviderAdd() {
  return (
    <PageWrapper>
      <GPUForm
        title="Add a New GPU"
        subtitle="Create a new listing for your hardware"
      />
    </PageWrapper>
  );
}
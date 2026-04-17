import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import PageWrapper from '@/components/PageWrapper';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Cpu, DollarSign, MapPin } from 'lucide-react';
import { api } from '@/lib/api';
import { gpus as mockGpus } from '@/lib/mockData';

export default function GPUDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [backendGpu, setBackendGpu] = useState(null);
  const [loading, setLoading] = useState(true);

  // If we navigated from Marketplace with state, use that as a hint
  const stateGpu = location.state?.gpu || null;

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      try {
        const res = await api.get('/gpus/');
        if (!isMounted) return;

        const found = res.data.find((g) => String(g.id) === String(id));
        if (found) {
          setBackendGpu(found);
        } else {
          setBackendGpu(null);
        }
      } catch (err) {
        console.error('Error loading backend GPU:', err);
        if (isMounted) setBackendGpu(null);
      }
      if (isMounted) setLoading(false);
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const gpu = useMemo(() => {
    // Priority: backend GPU → state GPU → mock GPU
    if (backendGpu) {
      return {
        id: backendGpu.id,
        name: backendGpu.name,
        vram: backendGpu.vram_gb,
        price: backendGpu.price_per_hour,
        provider: `Provider ${backendGpu.provider_id}`,
        location: 'Local region',
        status: backendGpu.status,
        source: 'backend',
      };
    }

    if (stateGpu) {
      return stateGpu;
    }

    const mock = mockGpus.find((g) => String(g.id) === String(id));
    if (mock) {
      return {
        ...mock,
        status: mock.availability || 'available',
        source: 'mock',
      };
    }

    return null;
  }, [backendGpu, stateGpu, id]);

  if (loading && !gpu) {
    return (
      <PageWrapper>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-muted-foreground">
          Loading GPU…
        </div>
      </PageWrapper>
    );
  }

  if (!gpu) {
    return (
      <PageWrapper>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground mb-3">GPU not found.</p>
          <Link to="/marketplace" className="text-primary hover:underline text-sm">
            Back to marketplace
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const price = gpu.price ?? gpu.price_per_hour ?? 0;

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title={gpu.name}
          description={
            gpu.source === 'backend'
              ? 'This is a real GPU from the backend marketplace.'
              : 'Example GPU listing from mock data.'
          }
        >
          <Button variant="outline" size="sm" onClick={() => navigate('/marketplace')}>
            Back to marketplace
          </Button>
        </PageHeader>

        <div className="grid md:grid-cols-3 gap-8 mt-4">
          <div className="md:col-span-2 space-y-4">
            <Card className="border-border/50">
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    <span>{gpu.vram} GB VRAM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>${price.toFixed(2)}/hr</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    <span>{gpu.provider}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{gpu.location || 'Local region'}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  {gpu.source === 'backend'
                    ? 'This GPU is coming from your real FastAPI backend. You can rent it and submit jobs against it.'
                    : 'This is a mock GPU used to showcase how listings could look in a larger marketplace.'}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card className="border-border/50">
              <CardContent className="p-6 space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Hourly rate</div>
                  <div className="text-2xl font-bold">${price.toFixed(2)}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Status</div>
                  <div className="font-medium capitalize">
                    {gpu.status || 'available'}
                  </div>
                </div>

                {gpu.source === 'backend' && (
                  <Button
                    className="w-full mt-2"
                    onClick={() => navigate(`/rent/${gpu.id}`, { state: { gpu } })}
                  >
                    Rent this GPU
                  </Button>
                )}

                {gpu.source === 'mock' && (
                  <p className="text-xs text-muted-foreground">
                    This is a mock listing for demo purposes.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

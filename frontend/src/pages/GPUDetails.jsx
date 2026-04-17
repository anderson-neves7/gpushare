import React from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { gpus as mockGpus } from '@/lib/mockData';
import { fakeGpus } from '@/lib/fakeGpus';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  MapPin,
  Zap,
  HardDrive,
  Cpu,
  Gauge,
  CircuitBoard,
} from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';

export default function GPUDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const gpuFromState = location.state?.gpu;
  const gpuFromFake = fakeGpus.find((g) => String(g.id) === String(id));
  const gpuFromMock = mockGpus.find((g) => String(g.id) === String(id));

  const gpu = gpuFromState || gpuFromFake || gpuFromMock;

  if (!gpu) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-muted-foreground">GPU not found.</p>
        <Link to="/marketplace" className="text-primary hover:underline text-sm mt-2 inline-block">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const price = gpu.price ?? gpu.price_per_hour ?? 0;
  const vram = gpu.vram ?? gpu.vram_gb ?? 0;
  const availabilityRaw = gpu.availability || gpu.status || 'available';
  const availability = availabilityRaw === 'available' ? 'Available' : 'Limited';

  const provider = gpu.provider || 'Provider';
  const locationLabel = gpu.location || 'Unknown region';

  const coreTitle = gpu.coreLabel || 'Compute cores';

  const specs = [
    vram && { label: 'VRAM', value: `${vram} GB`, icon: HardDrive },
    gpu.cores && { label: coreTitle, value: gpu.cores, icon: Cpu },
    gpu.memory_bandwidth && { label: 'Memory bandwidth', value: gpu.memory_bandwidth, icon: Gauge },
    gpu.tdp && { label: 'TDP', value: gpu.tdp, icon: CircuitBoard },
    locationLabel && { label: 'Location', value: locationLabel, icon: MapPin },
    { label: 'Availability', value: availability, icon: Zap },
  ].filter(Boolean);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          type="button"
          onClick={() => navigate('/marketplace')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-start gap-3 mb-2">
                <h1 className="text-3xl font-bold">{gpu.name}</h1>
                <Badge
                  className={`mt-1 ${availability === 'Available'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                >
                  {availability}
                </Badge>
              </div>
              <p className="text-muted-foreground">Provided by {provider}</p>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
              Read the listing carefully: power limits, driver stack, and framework support vary by host.
            </p>

            {gpu.description && (
              <p className="text-foreground/75 leading-relaxed">{gpu.description}</p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {specs.map((spec) => (
                <Card key={spec.label} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <spec.icon className="w-4 h-4 text-primary/70" />
                      <span className="text-xs text-muted-foreground">{spec.label}</span>
                    </div>
                    <p className="text-sm font-semibold">{spec.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <Card className="border-border/50 sticky top-24 shadow-md">
              <CardContent className="p-6 space-y-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Price</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">${price.toFixed(2)}</span>
                    <span className="text-muted-foreground">/hr</span>
                  </div>
                </div>

                <Link to={`/rent/${gpu.id}`} state={{ gpu }}>
                  <Button className="w-full h-12 text-base">Rent this GPU</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

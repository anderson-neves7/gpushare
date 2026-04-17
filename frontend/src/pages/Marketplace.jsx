import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageWrapper from '@/components/PageWrapper';
import PageHeader from '@/components/shared/PageHeader';
import GPUCard from '@/components/shared/GPUCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, HardDrive, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';
import { fakeGpus } from '@/lib/fakeGpus';

export default function Marketplace() {
  const [gpus, setGpus] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState('');
  const [minVram, setMinVram] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10);
  const [priceCeiling, setPriceCeiling] = useState(10);
  const [loading, setLoading] = useState(true);

  function mapBackendGpu(g) {
    return {
      id: g.id,
      name: g.name,
      vram: g.vram_gb,
      price: g.price_per_hour,
      location: g.location || 'Local region',
      provider: g.provider || 'Backend provider',
      availability: g.status === 'available' ? 'available' : 'limited',
      cores: g.cores,
      source: 'backend',
    };
  }

  function mapFakeGpu(g) {
    return {
      id: g.id,
      name: g.name,
      vram: g.vram_gb || g.vram,
      price: g.price_per_hour || g.price,
      location: g.location || 'Demo region',
      provider: g.provider || 'Demo provider',
      availability: g.status || 'unavailable',
      cores: g.cores,
      image: g.image,
      source: 'fake',
    };
  }

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const res = await api.get('/gpus/');
        const backend = res.data.map(mapBackendGpu);
        const fake = fakeGpus.map(mapFakeGpu);

        const combined = [...backend, ...fake];

        setGpus(combined);
        setFiltered(combined);

        const maxPriceFound = Math.max(...combined.map((g) => g.price || 0));
        const ceiling = Math.max(5, Math.ceil(maxPriceFound * 4) / 4);

        setPriceCeiling(ceiling);
        setMaxPrice(ceiling);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    }

    load();
  }, []);

  useEffect(() => {
    let results = gpus;

    if (search.trim() !== '') {
      const q = search.toLowerCase();
      results = results.filter((gpu) => gpu.name.toLowerCase().includes(q));
    }

    results = results.filter((gpu) => gpu.vram >= minVram);
    results = results.filter((gpu) => gpu.price <= maxPrice);

    setFiltered(results);
  }, [search, minVram, maxPrice, gpus]);

  const vramCeiling = useMemo(() => {
    if (gpus.length === 0) return 48;
    const maxVram = Math.max(...gpus.map((g) => g.vram || 0));
    return Math.max(16, Math.ceil(maxVram / 4) * 4);
  }, [gpus]);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PageHeader
          title="GPU marketplace"
          description="Browse backend and demo GPUs."
        >
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </PageHeader>

        <Card className="border-border/50 mb-8">
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Search</Label>
                <Input
                  placeholder="Search GPUs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div>
                <Label>Minimum VRAM (GB)</Label>
                <Slider
                  value={[minVram]}
                  min={0}
                  max={vramCeiling}
                  step={2}
                  onValueChange={([v]) => setMinVram(v)}
                />
              </div>

              <div>
                <Label>Max price ($/hr)</Label>
                <Slider
                  value={[maxPrice]}
                  min={0}
                  max={priceCeiling}
                  step={0.25}
                  onValueChange={([v]) => setMaxPrice(v)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {loading && (
          <div className="text-center text-muted-foreground py-10">
            Loading GPUs…
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((gpu) => (
              <Link
                key={gpu.id}
                to={`/gpu/${gpu.id}`}
                state={{ gpu }}
              >
                <GPUCard gpu={gpu} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

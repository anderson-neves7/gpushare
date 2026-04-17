import React, { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { gpus as mockGpus } from '@/lib/mockData';
import { fakeGpus } from '@/lib/fakeGpus';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';

export default function RentGPU() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // 1) Prefer GPU passed via router state (from GPUDetails / Marketplace)
  const gpuFromState = location.state?.gpu;

  // 2) Fallback: fake GPUs
  const gpuFromFake = fakeGpus.find((g) => String(g.id) === String(id));

  // 3) Fallback: mock GPUs
  const gpuFromMock = mockGpus.find((g) => String(g.id) === String(id));

  const gpu = gpuFromState || gpuFromFake || gpuFromMock;

  const [hours, setHours] = useState(1);
  const [startTime, setStartTime] = useState('now');

  if (!gpu) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-muted-foreground">GPU not found.</p>
        <Link
          to="/marketplace"
          className="text-primary hover:underline text-sm mt-2 inline-block"
        >
          Back to marketplace
        </Link>
      </div>
    );
  }

  const price = gpu.price ?? gpu.price_per_hour ?? 0;
  const total = (price * hours).toFixed(2);

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          type="button"
          onClick={() => navigate(`/gpu/${gpu.id}`)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to GPU details
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Rent {gpu.name}</h1>
        <p className="text-muted-foreground mb-4">
          Configure your rental and confirm the window.
        </p>

        <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-2xl">
          Billing in this demo is illustrative. In production you would see taxes, platform fees, and any minimum
          commitment from the provider.
        </p>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3 space-y-6">
            <Card className="border-border/50">
              <CardContent className="p-6 space-y-5">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary/70" />
                    Duration (hours)
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    max={720}
                    value={hours}
                    onChange={(e) =>
                      setHours(Math.max(1, parseInt(e.target.value, 10) || 1))
                    }
                    className="bg-muted/50 border-border/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum 1 hour, maximum 720 hours (30 days)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary/70" />
                    Start time
                  </Label>
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger className="bg-muted/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="now">Start immediately</SelectItem>
                      <SelectItem value="1h">In 1 hour</SelectItem>
                      <SelectItem value="3h">In 3 hours</SelectItem>
                      <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="border-border/50 sticky top-24 shadow-md">
              <CardContent className="p-6 space-y-5">
                <h3 className="font-semibold">Order summary</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-border/30">
                    <span className="text-muted-foreground">GPU</span>
                    <span className="font-medium text-right">{gpu.name}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-border/30">
                    <span className="text-muted-foreground">Rate</span>
                    <span>${price.toFixed(2)}/hr</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-border/30">
                    <span className="text-muted-foreground">Duration</span>
                    <span>
                      {hours} hour{hours > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-border/30">
                    <span className="text-muted-foreground">Start</span>
                    <span className="capitalize">
                      {startTime === 'now' ? 'Immediately' : startTime}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-muted-foreground">Total</span>
                  <div>
                    <span className="text-2xl font-bold">${total}</span>
                  </div>
                </div>

                <Button
                  onClick={() => navigate('/dashboard')}
                  className="w-full h-12 text-base"
                >
                  Confirm rental
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  You can cancel anytime. Billed hourly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

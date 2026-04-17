import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HardDrive, Zap } from 'lucide-react';

export default function GPUCard({ gpu }) {
  const availability =
    gpu.availability === 'available' ? 'Available' : 'Unavailable';

  return (
    <Card className="border-border/50 hover:border-primary/40 transition-colors cursor-pointer">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg leading-tight">{gpu.name}</h3>

          <Badge
            className={
              availability === 'Available'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }
          >
            {availability}
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-primary/70" />
            <span>{gpu.vram} GB VRAM</span>
          </div>

          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary/70" />
            <span>${gpu.price.toFixed(2)}/hr</span>
          </div>

          {gpu.location && (
            <p className="text-xs text-muted-foreground">{gpu.location}</p>
          )}
        </div>

        {/* IMPORTANT: REMOVE ALL INTERNAL BUTTONS */}
        {/* GPUCard should NEVER navigate by itself */}
        {/* Navigation is handled ONLY by the <Link> wrapper in Marketplace */}
      </CardContent>
    </Card>
  );
}

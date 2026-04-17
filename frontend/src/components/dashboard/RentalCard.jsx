import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import StatusBadge from '@/components/shared/StatusBadge';
import { Clock, DollarSign } from 'lucide-react';

export default function RentalCard({ rental, showTimeRemaining = false }) {
  const total = rental.total ?? rental.hours * rental.pricePerHour;
  return (
    <Card className="border-border/50 hover:border-primary/20 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold">{rental.gpuName}</h3>
            <p className="text-sm text-muted-foreground">{new Date(rental.startTime).toLocaleString()}</p>
          </div>
          <StatusBadge status={rental.status} />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /><span>{rental.hours}h rental</span></div>
          <div className="flex items-center gap-2"><DollarSign className="w-3.5 h-3.5" /><span>${total.toFixed(2)}</span></div>
        </div>
        {showTimeRemaining && rental.timeRemaining ? <p className="mt-4 text-sm text-emerald-400">Time remaining: {rental.timeRemaining}</p> : null}
      </CardContent>
    </Card>
  );
}

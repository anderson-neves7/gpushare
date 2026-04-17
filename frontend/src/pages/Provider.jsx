import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { providerGpus as initialGpus } from '@/lib/mockData';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Pencil, Trash2, DollarSign, Users, HardDrive } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function Provider() {
  const [gpuList, setGpuList] = useState(initialGpus);
  const handleDelete = (id) => setGpuList((prev) => prev.filter((g) => g.id !== id));
  const totalRevenue = gpuList.reduce((sum, g) => sum + g.revenue, 0);
  const totalRentals = gpuList.reduce((sum, g) => sum + g.totalRentals, 0);

  const stats = [
    { label: 'Total revenue', value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-emerald-400' },
    { label: 'Total rentals', value: totalRentals, icon: Users, color: 'text-primary' },
    { label: 'Listed GPUs', value: gpuList.length, icon: HardDrive, color: 'text-accent' },
  ];

  return (
    <PageWrapper>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader title="Provider dashboard" description="List hardware, set hourly rates, and track utilization.">
        <Link to="/provider/add">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add GPU
          </Button>
        </Link>
      </PageHeader>

      <div className="mb-8 rounded-lg surface-paper px-5 py-6 sm:px-7">
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          Good listings include interconnect details, driver versions, power limits, and whether the machine is shared
          or bare metal. Renters often filter by VRAM first, then by region, so accurate metadata reduces support churn.
        </p>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-3xl">
          When you add AMD, Intel, or other accelerators, mention the supported software stack in the description so
          teams know which container bases will boot cleanly.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {gpuList.map((gpu) => (
          <Card key={gpu.id} className="border-border/50 hover:border-border transition-colors">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{gpu.name}</h3>
                    <StatusBadge status={gpu.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span>${gpu.price.toFixed(2)}/hr</span>
                    <span>{gpu.vram} GB VRAM</span>
                    <span>{gpu.location}</span>
                    <span>{gpu.totalRentals} rentals</span>
                    <span className="text-emerald-400">${gpu.revenue.toFixed(2)} earned</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/provider/edit/${gpu.id}`}>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border" data-card="">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete {gpu.name}?</AlertDialogTitle>
                        <AlertDialogDescription>This will remove the GPU listing permanently.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(gpu.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {gpuList.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No GPUs listed yet.</p>
            <Link to="/provider/add">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add your first GPU
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
    </PageWrapper>
  );
}

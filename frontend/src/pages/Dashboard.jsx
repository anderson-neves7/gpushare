import React, { useMemo } from 'react';
import { activeRentals, pastRentals, jobs } from '@/lib/mockData';
import PageHeader from '@/components/shared/PageHeader';
import RentalCard from '@/components/dashboard/RentalCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, History, Briefcase, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageWrapper from '@/components/PageWrapper';

export default function Dashboard() {
  const totalSpent = useMemo(
    () => pastRentals.reduce((sum, r) => sum + r.total, 0).toFixed(2),
    [],
  );
  const computeHours = useMemo(() => {
    const pastH = pastRentals.reduce((s, r) => s + r.hours, 0);
    const activeH = activeRentals.reduce((s, r) => s + r.hours, 0);
    return pastH + activeH;
  }, []);

  const stats = [
    { label: 'Active rentals', value: activeRentals.length, color: 'text-emerald-400' },
    { label: 'Total spent (completed)', value: `$${totalSpent}`, color: 'text-primary' },
    { label: 'Compute hours (booked)', value: `${computeHours}h`, color: 'text-accent' },
    { label: 'Jobs in history', value: jobs.length, color: 'text-amber-400' },
  ];

  return (
   <PageWrapper>
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       <PageHeader title="Dashboard" description="Rentals, spend, and job history for this workspace." />

       <div className="mb-8 rounded-lg surface-paper px-5 py-6 sm:px-7">
         <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
           Track your active rentals, usage, and job history. Use the tabs to navigate between current activity and past records.
         </p>
         <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-3xl">
           Need more capacity?{' '}
           <Link to="/marketplace" className="text-primary font-medium hover:underline">
             Open the marketplace
           </Link>{' '}
           or{' '}
           <Link to="/compute/submit" className="text-primary font-medium hover:underline">
             submit a compute job
           </Link>
           .
         </p>
       </div>
      

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="bg-muted/50 border border-border/50">
          <TabsTrigger value="active" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Monitor className="w-4 h-4" />
            Active rentals
          </TabsTrigger>
          <TabsTrigger value="past" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <History className="w-4 h-4" />
            Past rentals
          </TabsTrigger>
          <TabsTrigger value="jobs" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Briefcase className="w-4 h-4" />
            Jobs
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <div className="grid sm:grid-cols-2 gap-4">
            {activeRentals.map((rental) => (
              <RentalCard key={rental.id} rental={rental} showTimeRemaining />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="past">
          <div className="grid sm:grid-cols-2 gap-4">
            {pastRentals.map((rental) => (
              <RentalCard key={rental.id} rental={rental} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="jobs">
          <div className="grid sm:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <Link key={job.id} to={`/compute/${job.id}`}>
                <Card className="border-border/50 hover:border-primary/20 transition-colors cursor-pointer h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold">{job.name}</h3>
                      <StatusBadge status={job.status} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-3.5 h-3.5" />
                        <span>{job.gpu}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{job.runtime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
    </PageWrapper>
  );
}

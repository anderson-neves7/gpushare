import React from 'react';
import { Link } from 'react-router-dom';
import { jobs } from '@/lib/mockData';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Monitor, Clock, FileText, ArrowRight } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';


export default function Compute() {
  return (
    <PageWrapper>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader title="Compute jobs" description="Submit batch work and track status in one place.">
        <Link to="/compute/submit">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Submit job
          </Button>
        </Link>
      </PageHeader>

      <div className="mb-8 rounded-lg surface-paper px-5 py-6 sm:px-7">
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
         A job ties together a script, a target GPU profile, and runtime limits. 
         Queued jobs wait for capacity, while running jobs stream logs to the detail view. 
         You can navigate through jobs and monitor their status directly from the interface.
        </p>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-3xl">
          Before you submit, make sure your container or script matches the host OS and driver line advertised on the GPU
          listing. Mixed-vendor clusters may need different base images for AMD, Intel, and other stacks.
        </p>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <Link key={job.id} to={`/compute/${job.id}`}>
            <Card className="border-border/50 hover:border-primary/20 transition-all duration-200 cursor-pointer mb-4">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{job.name}</h3>
                      <StatusBadge status={job.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Monitor className="w-3.5 h-3.5" />
                        {job.gpu}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {job.runtime}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        {job.script}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground hidden sm:block shrink-0" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
    </PageWrapper>
  );
}

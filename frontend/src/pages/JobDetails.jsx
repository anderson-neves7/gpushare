import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobs, jobLogs } from '@/lib/mockData';
import StatusBadge from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Monitor, Clock, FileText, Terminal } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';


export default function JobDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const job = jobs.find((j) => j.id === id);

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-muted-foreground">Job not found.</p>
        <button type="button" onClick={() => navigate('/compute')} className="text-primary hover:underline text-sm mt-2">
          Back to jobs
        </button>
      </div>
    );
  }

  const meta = [
    { label: 'GPU', value: job.gpu, icon: Monitor },
    { label: 'Runtime', value: job.runtime, icon: Clock },
    { label: 'Script', value: job.script, icon: FileText },
    { label: 'Status', value: job.status, icon: Terminal },
  ];

  return (
    <PageWrapper>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        type="button"
        onClick={() => navigate('/compute')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to jobs
      </button>

      <div className="mb-8 rounded-lg surface-paper px-5 py-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Job <span className="font-mono text-foreground/90">{job.id}</span> is an active record. 
          Logs below reflect the current job activity and are available in the detail view. 
          Each job includes its own log stream, retention settings, and access controls.
        </p>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold">{job.name}</h1>
            <StatusBadge status={job.status} />
          </div>
          <p className="text-sm text-muted-foreground">Job ID: {job.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {meta.map((item) => (
          <Card key={item.label} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <item.icon className="w-4 h-4 text-primary/70" />
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
              <p className="text-sm font-medium capitalize">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="flex items-center gap-2 p-4 border-b border-border/30">
            <Terminal className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Logs</h3>
            {job.status === 'running' && (
              <span className="text-xs text-emerald-400 animate-pulse ml-auto">Live</span>
            )}
          </div>
          <pre className="p-4 text-xs text-muted-foreground leading-relaxed overflow-x-auto font-mono max-h-96 overflow-y-auto">
            {jobLogs}
          </pre>
        </CardContent>
      </Card>
    </div>
    </PageWrapper>
  );
}

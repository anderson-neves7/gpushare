import React from 'react';
import { Badge } from '@/components/ui/badge';

const styles = {
  running: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  queued: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  maintenance: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

export default function StatusBadge({ status }) {
  return <Badge variant="secondary" className={styles[status] || 'bg-muted text-muted-foreground border-border'}>{status}</Badge>;
}

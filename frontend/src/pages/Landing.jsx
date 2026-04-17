import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageWrapper from '@/components/PageWrapper';
import {
  Cpu,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Server,
  Clock,
  CreditCard,
  LineChart,
  CheckCircle2,
} from 'lucide-react';

const stats = [
  { value: '10,000+', label: 'GPUs in inventory' },
  { value: '99.9%', label: 'Target platform uptime' },
  { value: 'From $0.50', label: 'Per GPU-hour (varies)' },
  { value: '~50ms', label: 'Typical regional latency' },
];

const features = [
  {
    icon: Zap,
    title: 'Fast provisioning',
    description:
      'Spin up instances in about a minute for iterative training, fine-tuning, and batch jobs, without waiting on capacity you do not control.',
  },
  {
    icon: Shield,
    title: 'Isolated environments',
    description:
      'Run workloads in separated environments with encrypted transport. You keep ownership of models, datasets, and outputs.',
  },
  {
    icon: Globe,
    title: 'Regional placement',
    description:
      'Choose regions that match your data residency and latency needs across North America, Europe, and Asia Pacific.',
  },
];

const steps = [
  {
    n: '01',
    title: 'Pick hardware',
    body: 'Filter by GPU family, VRAM, interconnect, and price. Compare listings side by side before you commit.',
  },
  {
    n: '02',
    title: 'Reserve time',
    body: 'Select the window you need: hourly blocks for experiments or longer runs for training at steadier rates.',
  },
  {
    n: '03',
    title: 'Connect and run',
    body: 'SSH or use your preferred orchestration. Bring your containers, checkpoints, and tooling as-is.',
  },
  {
    n: '04',
    title: 'Scale or stop',
    body: 'Add capacity when a job grows, or release it when you are done so spend tracks actual usage.',
  },
];

const useCases = [
  {
    title: 'Model training',
    body: 'Multi-GPU training, long-running fine-tunes, and checkpoint-heavy workflows with predictable hourly economics.',
  },
  {
    title: 'Inference and serving',
    body: 'Low-latency batch inference, shadow deployments, and bursty traffic without buying fixed hardware.',
  },
  {
    title: 'Research and prototyping',
    body: 'Quick A/B runs, architecture search, and notebook-style exploration with GPUs you can start and stop.',
  },
];

export default function Landing() {
  return (
    <PageWrapper>
    <div className="relative">
      <div className="pointer-events-none fixed inset-0 bg-grid-fine opacity-70" aria-hidden />
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-8%,hsl(var(--primary)/0.14),transparent_58%)]"
        aria-hidden
      />

      <section className="relative border-b border-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              On-demand GPU compute
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold tracking-tight text-balance leading-[1.1]">
              Rent GPUs for training, inference, and research, without running a datacenter.
            </h1>
            <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              GPUShare connects you to listed accelerator capacity through a straightforward marketplace. You choose the
              hardware profile, pay for the time you use, and keep your workflow familiar with containers, SSH, and
              standard ML tooling.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link to="/marketplace">
                <Button size="lg" className="w-full sm:w-auto h-11 px-6 gap-2">
                  Browse marketplace
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-11 px-6 border-border/80 bg-secondary/35 text-foreground hover:bg-secondary/50">
                  Create an account
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Consumer cards, workstation GPUs, and data center accelerators from multiple vendors appear as providers
              list them. Availability and pricing are set per listing.
            </p>
          </div>

          <dl className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 border-t border-border/60 pt-10">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{s.label}</dt>
                <dd className="mt-2 text-2xl sm:text-3xl font-semibold tabular-nums tracking-tight">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="relative py-16 sm:py-20 border-b border-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">What you are buying</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                This is compute time on discrete GPUs, sold transparently by the hour (or longer windows where offered),
                with the expectation that you already know how to package and run your jobs.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                GPUShare is not a managed MLOps platform. It is infrastructure access: pick a machine profile, connect,
                and execute. That keeps the surface area small and the pricing easier to reason about.
              </p>
            </div>
            <div className="lg:col-span-7 space-y-5">
              {[
                'Hourly economics that map directly to wall-clock usage.',
                'Inventory that changes as providers add or retire hardware.',
                'A marketplace model: compare offers before you reserve.',
                'Operational defaults aimed at teams that already run Linux workloads.',
              ].map((line) => (
                <div key={line} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-primary mt-0.5" aria-hidden />
                  <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">{line}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 sm:py-20 border-b border-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">How it works</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              A simple flow from selection to execution. If you have rented a cloud GPU before, most of this will feel
              familiar, with more direct control over the hardware tier.
            </p>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 gap-6 lg:gap-8">
            {steps.map((step) => (
              <article
                key={step.n}
                className="rounded-lg surface-paper p-6 sm:p-7 shadow-sm shadow-black/10"
              >
                <p className="text-xs font-mono text-primary/90 tabular-nums">{step.n}</p>
                <h3 className="mt-3 text-lg font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 sm:py-20 border-b border-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Platform notes</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
            These are the practical constraints teams ask about first. They are spelled out here so you can evaluate fit
            before you spend time integrating.
          </p>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <article
                key={f.title}
                className="rounded-lg surface-paper p-6 hover:border-border transition-colors shadow-sm shadow-black/5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border/80 bg-secondary">
                  <f.icon className="h-5 w-5 text-card-foreground" strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 sm:py-20 border-b border-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Common workloads</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Teams use GPUShare when they want hardware flexibility without a long-term lease, or when they need a
                second region for redundancy and data locality.
              </p>
            </div>
            <div className="lg:col-span-8 space-y-6">
              {useCases.map((u) => (
                <div key={u.title} className="border-l-2 border-primary/35 pl-5 sm:pl-6">
                  <h3 className="text-base font-semibold">{u.title}</h3>
                  <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">{u.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 sm:py-20 border-b border-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg surface-paper px-6 py-10 sm:px-10 sm:py-12 shadow-sm shadow-black/10">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Ready to reserve capacity?</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Start in the marketplace, shortlist two or three listings that match your budget and SLA, then open an
                  account when you are ready to book. If you are a provider, you can list hardware from the provider
                  console.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 lg:justify-end">
                <Link to="/register" className="sm:flex-1 lg:flex-initial xl:flex-1">
                  <Button size="lg" className="w-full h-11">
                    Get started
                  </Button>
                </Link>
                <Link to="/marketplace" className="sm:flex-1 lg:flex-initial xl:flex-1">
                  <Button
                   size="lg"
                   variant="outline"
                   className="w-full h-11 border-border/80 bg-secondary/35 text-foreground hover:bg-secondary/50"
                  >
                    View listings
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-10 pt-8 border-t border-border/50 grid sm:grid-cols-3 gap-6 text-sm text-muted-foreground">
              <div className="flex gap-3">
                <Server className="w-5 h-5 shrink-0 text-card-foreground/65" strokeWidth={1.75} />
                <p>
                  <span className="font-medium text-card-foreground">Providers:</span> onboarding, pricing, and
                  availability are managed per listing.
                </p>
              </div>
              <div className="flex gap-3">
                <Clock className="w-5 h-5 shrink-0 text-card-foreground/65" strokeWidth={1.75} />
                <p>
                  <span className="font-medium text-card-foreground">Renters:</span> book windows that align with job
                  runtime; release early when possible.
                </p>
              </div>
              <div className="flex gap-3">
                <CreditCard className="w-5 h-5 shrink-0 text-card-foreground/65" strokeWidth={1.75} />
                <p>
                  <span className="font-medium text-card-foreground">Billing:</span> pay for reserved GPU time; see
                  listing details for specifics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-14 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 rounded-lg surface-paper px-6 py-6 sm:px-8 shadow-sm shadow-black/5">
            <div className="flex gap-3">
              <LineChart className="w-5 h-5 shrink-0 text-primary mt-0.5" strokeWidth={1.75} />
              <div>
                <p className="font-medium">Operational transparency</p>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed max-w-xl">
                  Uptime and latency figures on this page are directional. Always confirm the SLA, region, and
                  interconnect details on the listing you choose.
                </p>
              </div>
            </div>
            <Link to="/compute" className="shrink-0">
              <Button variant="outline" className="border-border/80">
                Explore compute
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 bg-card/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="inline-flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-sm font-semibold tracking-tight">
                  GPU<span className="text-primary">Share</span>
                </span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
                Marketplace access to GPU capacity for teams that want control, clear pricing, and a standard Linux
                workflow.
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Product</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link to="/marketplace" className="text-foreground/85 hover:text-foreground">
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-foreground/85 hover:text-foreground">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/provider" className="text-foreground/85 hover:text-foreground">
                    Provider
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Account</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link to="/signin" className="text-foreground/85 hover:text-foreground">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-foreground/85 hover:text-foreground">
                    Register
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Company</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground leading-relaxed">
                <li>Product status is shown in the dashboard after sign-in.</li>
                <li>Policies and notices are provided in-product.</li>
              </ul>
            </div>
          </div>
          <p className="mt-12 pt-8 border-t border-border/60 text-xs text-muted-foreground">
            © {new Date().getFullYear()} GPUShare. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
    </PageWrapper>
  );
}

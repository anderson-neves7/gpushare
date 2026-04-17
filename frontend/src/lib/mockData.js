export const gpus = [
  {
    id: '1',
    name: 'GeForce RTX 4090',
    price: 1.2,
    vram: 24,
    location: 'US East',
    provider: 'CloudGPU Inc.',
    description:
      'High-end consumer card with strong FP32 throughput. Common choice for local-style training stacks, fine-tuning, and inference when you want lots of VRAM per dollar.',
    availability: 'available',
    cores: 16384,
    coreLabel: 'CUDA cores',
    memory_bandwidth: '1008 GB/s',
    tdp: '450W',
  },
  {
    id: '2',
    name: 'AMD Instinct MI300X',
    price: 5.25,
    vram: 192,
    location: 'US West',
    provider: 'HyperScale AI',
    description:
      'Large-memory accelerator for multi-node training and very wide models. Best when your bottleneck is capacity and you can use ROCm-compatible frameworks.',
    availability: 'available',
    cores: 304,
    coreLabel: 'Compute units',
    memory_bandwidth: '5300 GB/s',
    tdp: '750W',
  },
  {
    id: '3',
    name: 'AMD Radeon RX 7900 XTX',
    price: 0.55,
    vram: 24,
    location: 'EU West',
    provider: 'EuroCompute',
    description:
      'Consumer RDNA 3 card suitable for experimentation, smaller training runs, and workloads that run well under ROCm. Strong value where raw VRAM per hour matters.',
    availability: 'available',
    cores: 6144,
    coreLabel: 'Stream processors',
    memory_bandwidth: '960 GB/s',
    tdp: '355W',
  },
  {
    id: '4',
    name: 'Intel Data Center GPU Max 1550',
    price: 3.8,
    vram: 128,
    location: 'EU Central',
    provider: 'BerlinAI Labs',
    description:
      'Data center GPU with very high HBM bandwidth. A fit for HPC-style kernels and AI stacks that target Intel oneAPI and compatible runtimes.',
    availability: 'available',
    cores: 128,
    coreLabel: 'Xe cores',
    memory_bandwidth: '3277 GB/s',
    tdp: '600W',
  },
  {
    id: '5',
    name: 'Intel Arc A770 16GB',
    price: 0.35,
    vram: 16,
    location: 'US Central',
    provider: 'MidwestCloud',
    description:
      'Entry-level discrete GPU for light training, preprocessing, and inference smoke tests. Useful when you need a cheap always-on sandbox.',
    availability: 'limited',
    cores: 512,
    coreLabel: 'Xe cores',
    memory_bandwidth: '560 GB/s',
    tdp: '225W',
  },
  {
    id: '6',
    name: 'AMD Instinct MI250X',
    price: 2.9,
    vram: 128,
    location: 'US West',
    provider: 'PacificNodes',
    description:
      'Dual-die CDNA2 accelerator with high memory bandwidth. Often used for distributed training slices and large-batch jobs that do not need the newest generation.',
    availability: 'available',
    cores: 220,
    coreLabel: 'Compute units',
    memory_bandwidth: '3200 GB/s',
    tdp: '560W',
  },
  {
    id: '7',
    name: 'GeForce RTX 3090',
    price: 0.65,
    vram: 24,
    location: 'Asia Pacific',
    provider: 'PacificNodes',
    description:
      'Previous-generation flagship with 24GB VRAM. Still a workhorse for inference, smaller models, and teams that want proven software stacks.',
    availability: 'available',
    cores: 10496,
    coreLabel: 'CUDA cores',
    memory_bandwidth: '936 GB/s',
    tdp: '350W',
  },
  {
    id: '8',
    name: 'AMD Radeon PRO W7900',
    price: 1.55,
    vram: 48,
    location: 'US East',
    provider: 'CloudGPU Inc.',
    description:
      'Workstation-class RDNA 3 GPU with ECC-capable VRAM options on some SKUs. Balanced for content pipelines plus ML sidecars.',
    availability: 'available',
    cores: 6144,
    coreLabel: 'Stream processors',
    memory_bandwidth: '864 GB/s',
    tdp: '253W',
  },
  {
    id: '9',
    name: 'GeForce RTX 4080',
    price: 0.85,
    vram: 16,
    location: 'US Central',
    provider: 'MidwestCloud',
    description:
      'Mid-range Ada card for shorter training jobs, LoRA-style fine-tunes, and interactive development before you scale to larger silicon.',
    availability: 'available',
    cores: 9728,
    coreLabel: 'CUDA cores',
    memory_bandwidth: '717 GB/s',
    tdp: '320W',
  },
  {
    id: '10',
    name: 'AMD Radeon RX 6800 XT',
    price: 0.45,
    vram: 16,
    location: 'EU West',
    provider: 'EuroCompute',
    description:
      'RDNA 2 card for budget-conscious batches and CI-style GPU tests. Check framework support for your exact model and precision needs.',
    availability: 'available',
    cores: 4608,
    coreLabel: 'Stream processors',
    memory_bandwidth: '512 GB/s',
    tdp: '300W',
  },
];

/** Highest hourly rate in `gpus`, rounded up for filter UI */
export const marketplacePriceMax =
  Math.ceil(Math.max(6, ...gpus.map((g) => g.price)) * 4) / 4;

export const activeRentals = [
  {
    id: 'r1',
    gpuName: 'GeForce RTX 4090',
    status: 'running',
    startTime: '2026-04-15T08:00:00',
    hours: 8,
    pricePerHour: 1.2,
    timeRemaining: '5h 23m',
  },
  {
    id: 'r2',
    gpuName: 'AMD Instinct MI250X',
    status: 'running',
    startTime: '2026-04-15T10:00:00',
    hours: 4,
    pricePerHour: 2.9,
    timeRemaining: '2h 10m',
  },
];

export const pastRentals = [
  {
    id: 'r3',
    gpuName: 'GeForce RTX 3090',
    status: 'completed',
    startTime: '2026-04-14T14:00:00',
    hours: 6,
    pricePerHour: 0.65,
    total: 3.9,
  },
  {
    id: 'r4',
    gpuName: 'Intel Data Center GPU Max 1550',
    status: 'completed',
    startTime: '2026-04-13T09:00:00',
    hours: 2,
    pricePerHour: 3.8,
    total: 7.6,
  },
  {
    id: 'r5',
    gpuName: 'Intel Arc A770 16GB',
    status: 'completed',
    startTime: '2026-04-12T16:00:00',
    hours: 12,
    pricePerHour: 0.35,
    total: 4.2,
  },
];

export const providerGpus = [
  {
    id: 'pg1',
    name: 'GeForce RTX 4090',
    price: 1.2,
    vram: 24,
    location: 'US East',
    description: 'High-performance consumer GPU',
    status: 'active',
    totalRentals: 47,
    revenue: 892.5,
  },
  {
    id: 'pg2',
    name: 'AMD Instinct MI300X',
    price: 5.25,
    vram: 192,
    location: 'US East',
    description: 'Large-memory AI accelerator',
    status: 'active',
    totalRentals: 23,
    revenue: 1540,
  },
  {
    id: 'pg3',
    name: 'GeForce RTX 3090',
    price: 0.65,
    vram: 24,
    location: 'US East',
    description: 'Solid value for inference',
    status: 'maintenance',
    totalRentals: 89,
    revenue: 445.25,
  },
];

export const jobs = [
  {
    id: 'j1',
    name: 'Fine-tune LLaMA 3',
    gpu: 'AMD Instinct MI250X',
    status: 'running',
    submitted: '2026-04-15T09:30:00',
    runtime: '2h 15m',
    script: 'finetune_llama.py',
  },
  {
    id: 'j2',
    name: 'Image Classification Training',
    gpu: 'GeForce RTX 4090',
    status: 'completed',
    submitted: '2026-04-14T14:00:00',
    runtime: '4h 30m',
    script: 'train_classifier.py',
  },
  {
    id: 'j3',
    name: 'Stable Diffusion Batch',
    gpu: 'GeForce RTX 4090',
    status: 'completed',
    submitted: '2026-04-13T08:00:00',
    runtime: '1h 45m',
    script: 'generate_images.py',
  },
  {
    id: 'j4',
    name: 'BERT Embeddings',
    gpu: 'Intel Arc A770 16GB',
    status: 'queued',
    submitted: '2026-04-15T11:00:00',
    runtime: 'Pending',
    script: 'compute_embeddings.py',
  },
];

export const jobLogs = `[2026-04-15 09:30:12] Initializing training environment...
[2026-04-15 09:30:15] Loading model: meta-llama/Llama-3-8B
[2026-04-15 09:30:45] Model loaded successfully. Parameters: 8.03B
[2026-04-15 09:31:02] Loading dataset: custom_instructions_v2 (12,450 samples)
[2026-04-15 09:31:18] Dataset preprocessed. Tokenization complete.
[2026-04-15 09:31:20] Starting LoRA fine-tuning with rank=16, alpha=32
[2026-04-15 09:31:22] Epoch 1/3 | Batch 1/389 | Loss: 2.4531
[2026-04-15 09:32:45] Epoch 1/3 | Batch 50/389 | Loss: 1.8923
[2026-04-15 09:35:10] Epoch 1/3 | Batch 150/389 | Loss: 1.2104
[2026-04-15 09:38:22] Epoch 1/3 | Batch 300/389 | Loss: 0.8456
[2026-04-15 09:40:01] Epoch 1/3 completed. Avg Loss: 1.0234
[2026-04-15 09:40:03] Saving checkpoint: epoch_1_checkpoint.pt
[2026-04-15 09:40:15] Epoch 2/3 | Batch 1/389 | Loss: 0.7821
[2026-04-15 09:45:30] Epoch 2/3 | Batch 200/389 | Loss: 0.4512
[2026-04-15 09:50:00] Training in progress...`;

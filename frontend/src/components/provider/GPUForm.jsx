import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const locations = ['US East', 'US West', 'US Central', 'EU West', 'EU Central', 'Asia Pacific'];

export default function GPUForm({ initialData, title, subtitle }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialData || { name: '', price: '', vram: '', location: '', description: '' });
  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const handleSubmit = (e) => { e.preventDefault(); navigate('/provider'); };
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate('/provider')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"><ArrowLeft className="w-4 h-4" />Back to Provider Dashboard</button>
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">{title}</h1>
      <p className="text-muted-foreground text-sm mb-4">{subtitle}</p>
      <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-xl">
        Name the SKU clearly (for example GeForce RTX 4090, AMD Instinct MI300X, Intel Arc A770). Add driver generation,
        power cap, and whether the host is bare metal or virtualized so renters know which images will boot.
      </p>
      <Card className="border-border/50"><CardContent className="p-6"><form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2"><Label>GPU name</Label><Input placeholder="e.g., AMD Radeon RX 7900 XTX" value={form.name} onChange={(e) => updateField('name', e.target.value)} className="bg-muted/50 border-border/50" /></div>
        <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Price per Hour ($)</Label><Input type="number" step="0.01" placeholder="1.20" value={form.price} onChange={(e) => updateField('price', e.target.value)} className="bg-muted/50 border-border/50" /></div><div className="space-y-2"><Label>VRAM (GB)</Label><Input type="number" placeholder="24" value={form.vram} onChange={(e) => updateField('vram', e.target.value)} className="bg-muted/50 border-border/50" /></div></div>
        <div className="space-y-2"><Label>Location</Label><Select value={form.location} onValueChange={(v) => updateField('location', v)}><SelectTrigger className="bg-muted/50 border-border/50"><SelectValue placeholder="Select location" /></SelectTrigger><SelectContent>{locations.map((loc) => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}</SelectContent></Select></div>
        <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Describe your GPU, its condition, and ideal use cases..." value={form.description} onChange={(e) => updateField('description', e.target.value)} className="bg-muted/50 border-border/50 min-h-[100px]" /></div>
        <div className="flex gap-3 pt-2"><Button type="button" variant="outline" onClick={() => navigate('/provider')} className="flex-1">Cancel</Button><Button type="submit" className="flex-1">{initialData ? 'Save changes' : 'Add GPU'}</Button></div>
      </form></CardContent></Card>
    </div>
  );
}

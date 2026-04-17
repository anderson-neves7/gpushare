import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { gpus } from '../lib/mockData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent } from '../components/ui/card';
import { ArrowLeft, Upload } from 'lucide-react';

export default function SubmitJob() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    gpu: '',
    maxRuntime: '4',
    priority: 'normal',
  });

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please upload a Python script.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("job_name", form.name);
      formData.append("priority", form.priority);
      formData.append("max_runtime", Number(form.maxRuntime));
      formData.append("script", file);
      formData.append("gpu_id", 1); // RTX 2060

      await api.post("/jobs/submit_job", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Job submitted successfully!");
      setTimeout(() => navigate("/compute"), 1000);

    } catch (err) {
      console.error(err);
      setMessage("Failed to submit job.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        type="button"
        onClick={() => navigate('/compute')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to jobs
      </button>

      <h1 className="text-2xl sm:text-3xl font-bold mb-1">Submit compute job</h1>

      <p className="text-sm text-muted-foreground leading-relaxed mb-8">
        Pick a GPU tier that matches your framework. ROCm, oneAPI, and CUDA-backed images are not interchangeable.
      </p>

      <Card className="border-border/50">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="space-y-2">
              <Label>Job name</Label>
              <Input
                placeholder="e.g., Fine-tune LLaMA 3"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="bg-muted/50 border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label>Select GPU</Label>
              <Select value={form.gpu} onValueChange={(v) => updateField('gpu', v)}>
                <SelectTrigger className="bg-muted/50 border-border/50">
                  <SelectValue placeholder="Choose a GPU" />
                </SelectTrigger>
                <SelectContent>
                  {gpus.map((gpu) => (
                    <SelectItem key={gpu.id} value={gpu.id}>
                      {gpu.name} (${gpu.price.toFixed(2)}/hr)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Upload script</Label>

              <div className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center hover:border-primary/30 transition-colors">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-1">Upload your script</p>
                <p className="text-xs text-muted-foreground mb-3">Supports .py files</p>

                <input
                  type="file"
                  accept=".py"
                  onChange={handleFileChange}
                  className="block mx-auto"
                />

                {file && (
                  <p className="text-xs text-green-600 mt-2">
                    Selected: {file.name}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Max runtime (hours)</Label>
                <Input
                  type="number"
                  min={1}
                  max={168}
                  value={form.maxRuntime}
                  onChange={(e) => updateField('maxRuntime', e.target.value)}
                  className="bg-muted/50 border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={(v) => updateField('priority', v)}>
                  <SelectTrigger className="bg-muted/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => navigate('/compute')} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Submit job
              </Button>
            </div>

            {message && (
              <p className="text-sm text-green-600 mt-3">{message}</p>
            )}

          </form>
        </CardContent>
      </Card>
    </div>
  );
}

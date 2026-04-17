import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function SubmitJob() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    gpu: "",
  });

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code.trim()) {
      setMessage("Please enter Python code.");
      return;
    }

    if (!form.gpu) {
      setMessage("Please select a GPU.");
      return;
    }

    try {
      const payload = {
        type: "gpu",
        code,
        gpu_id: Number(form.gpu),
      };

      await api.post("/jobs/submit_job", payload);

      setMessage("Job submitted successfully!");
      setTimeout(() => navigate("/compute"), 1000);
    } catch (err) {
      console.error("Submit job error:", err);
      setMessage("Failed to submit job.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        type="button"
        onClick={() => navigate("/compute")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to jobs
      </button>

      <h1 className="text-2xl sm:text-3xl font-bold mb-1">Submit compute job</h1>

      <Card className="border-border/50">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Job name</Label>
              <Input
                placeholder="e.g., Hello GPU"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="bg-muted/50 border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label>Select GPU</Label>
              <Select
                value={form.gpu}
                onValueChange={(v) => updateField("gpu", v)}
              >
                <SelectTrigger className="bg-muted/50 border-border/50">
                  <SelectValue placeholder="Choose a GPU" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">NVIDIA RTX 2060</SelectItem>
                  <SelectItem value="3">RTX 2060</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Python code</Label>
              <Textarea
                placeholder="print('hello world')"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="bg-muted/50 border-border/50 h-40"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/compute")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Submit job
              </Button>
            </div>

            {message && <p className="text-sm mt-3">{message}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

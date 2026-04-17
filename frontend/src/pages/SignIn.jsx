// src/pages/SignIn.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';
import { useAuth } from '@/lib/AuthContext';

export default function SignIn() {
  const navigate = useNavigate();
  const { login, authError } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await login(form.email, form.password);

    setSubmitting(false);

    if (result.success) {
      if (result.user.role === 'provider') {
        navigate('/provider');
      } else {
        navigate('/marketplace');
      }
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen flex items-center justify-center px-4 py-24">
        <Card className="w-full max-w-md border-border/50 shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>

              {authError && <p className="text-red-400 text-sm">{authError}</p>}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <p className="text-center text-sm mt-4">
              Don’t have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
